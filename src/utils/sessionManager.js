/**
 * Session Management Utility
 * Provides secure session handling with timeout, validation, and cleanup
 */

import { secureSetItem, secureGetItem, secureRemoveItem } from "./secureStorage"

/**
 * Session configuration
 */
const SESSION_CONFIG = {
  timeout: 30 * 60 * 1000, // 30 minutes
  warningTime: 5 * 60 * 1000, // 5 minutes before expiry
  maxSessions: 1, // Maximum concurrent sessions
  renewThreshold: 10 * 60 * 1000, // Renew if less than 10 minutes left
}

/**
 * Session Manager class
 */
class SessionManager {
  constructor() {
    this.sessionKey = "user_session"
    this.timeoutId = null
    this.warningTimeoutId = null
    this.listeners = new Set()
    this.isInitialized = false
  }

  /**
   * Initialize session manager
   */
  async init() {
    if (this.isInitialized) return

    // Check for existing session
    const existingSession = await this.getSession()
    if (existingSession) {
      this.startSessionTimeout(existingSession)
    }

    // Listen for storage changes (multiple tabs)
    if (typeof window !== "undefined") {
      window.addEventListener("storage", this.handleStorageChange.bind(this))
      window.addEventListener("beforeunload", this.cleanup.bind(this))

      // Listen for user activity
      this.setupActivityListeners()
    }

    this.isInitialized = true
  }

  /**
   * Create a new session
   * @param {object} userData - User data to store in session
   * @returns {object} - Session object
   */
  async createSession(userData) {
    const session = {
      id: this.generateSessionId(),
      userId: userData.userId,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      countryCode: userData.countryCode,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      expiresAt: Date.now() + SESSION_CONFIG.timeout,
      isActive: true,
      fingerprint: await this.generateFingerprint(),
    }

    await secureSetItem(this.sessionKey, JSON.stringify(session))
    this.startSessionTimeout(session)
    this.notifyListeners("sessionCreated", session)

    return session
  }

  /**
   * Get current session
   * @returns {object|null} - Session object or null
   */
  async getSession() {
    try {
      const sessionData = await secureGetItem(this.sessionKey)
      if (!sessionData) return null

      const session = JSON.parse(sessionData)

      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        await this.destroySession()
        return null
      }

      // Validate session fingerprint
      const currentFingerprint = await this.generateFingerprint()
      if (session.fingerprint !== currentFingerprint) {
        await this.destroySession()
        return null
      }

      return session
    } catch (error) {
      console.error("Error getting session:", error)
      return null
    }
  }

  /**
   * Update session activity
   */
  async updateActivity() {
    const session = await this.getSession()
    if (!session) return

    session.lastActivity = Date.now()

    // Renew session if close to expiry
    if (session.expiresAt - Date.now() < SESSION_CONFIG.renewThreshold) {
      session.expiresAt = Date.now() + SESSION_CONFIG.timeout
      this.startSessionTimeout(session)
    }

    await secureSetItem(this.sessionKey, JSON.stringify(session))
    this.notifyListeners("sessionUpdated", session)
  }

  /**
   * Destroy current session
   */
  async destroySession() {
    const session = await this.getSession()

    secureRemoveItem(this.sessionKey)
    this.clearTimeouts()

    if (session) {
      this.notifyListeners("sessionDestroyed", session)
    }
  }

  /**
   * Check if session is valid
   * @returns {boolean} - Whether session is valid
   */
  async isSessionValid() {
    const session = await this.getSession()
    return session !== null
  }

  /**
   * Get session time remaining
   * @returns {number} - Time remaining in milliseconds
   */
  async getTimeRemaining() {
    const session = await this.getSession()
    if (!session) return 0

    return Math.max(0, session.expiresAt - Date.now())
  }

  /**
   * Add session event listener
   * @param {function} listener - Event listener function
   */
  addListener(listener) {
    this.listeners.add(listener)
  }

  /**
   * Remove session event listener
   * @param {function} listener - Event listener function
   */
  removeListener(listener) {
    this.listeners.delete(listener)
  }

  /**
   * Generate session ID
   * @returns {string} - Random session ID
   */
  generateSessionId() {
    if (typeof window !== "undefined" && window.crypto) {
      const array = new Uint8Array(32)
      window.crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("")
    }

    // Fallback
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
  }

  /**
   * Generate browser fingerprint
   * @returns {string} - Browser fingerprint
   */
  async generateFingerprint() {
    if (typeof window === "undefined") return "server"

    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      !!window.indexedDB,
      typeof window.openDatabase,
      navigator.cpuClass,
      navigator.platform,
      navigator.doNotTrack,
    ]

    const fingerprint = components.join("|")

    // Hash the fingerprint
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(fingerprint)
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
    }

    // Simple hash fallback
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    return hash.toString(16)
  }

  /**
   * Start session timeout
   * @param {object} session - Session object
   */
  startSessionTimeout(session) {
    this.clearTimeouts()

    const timeRemaining = session.expiresAt - Date.now()
    const warningTime = timeRemaining - SESSION_CONFIG.warningTime

    // Set warning timeout
    if (warningTime > 0) {
      this.warningTimeoutId = setTimeout(() => {
        this.notifyListeners("sessionWarning", session)
      }, warningTime)
    }

    // Set expiry timeout
    if (timeRemaining > 0) {
      this.timeoutId = setTimeout(async () => {
        await this.destroySession()
      }, timeRemaining)
    }
  }

  /**
   * Clear all timeouts
   */
  clearTimeouts() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId)
      this.warningTimeoutId = null
    }
  }

  /**
   * Setup activity listeners
   */
  setupActivityListeners() {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    const throttledUpdate = this.throttle(this.updateActivity.bind(this), 60000) // Update max once per minute

    events.forEach(event => {
      document.addEventListener(event, throttledUpdate, { passive: true })
    })
  }

  /**
   * Handle storage changes (multiple tabs)
   * @param {Event} event - Storage event
   */
  async handleStorageChange(event) {
    if (event.key === `secure_${this.sessionKey}`) {
      if (event.newValue === null) {
        // Session was destroyed in another tab
        this.clearTimeouts()
        this.notifyListeners("sessionDestroyed", null)
      } else {
        // Session was updated in another tab
        const session = JSON.parse(event.newValue)
        this.startSessionTimeout(session)
        this.notifyListeners("sessionUpdated", session)
      }
    }
  }

  /**
   * Notify all listeners
   * @param {string} event - Event type
   * @param {object} data - Event data
   */
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data)
      } catch (error) {
        console.error("Error in session listener:", error)
      }
    })
  }

  /**
   * Throttle function calls
   * @param {function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {function} - Throttled function
   */
  throttle(func, limit) {
    let inThrottle
    return function () {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  /**
   * Cleanup on page unload
   */
  cleanup() {
    this.clearTimeouts()
    this.listeners.clear()
  }

  /**
   * Extend session
   * @param {number} additionalTime - Additional time in milliseconds
   */
  async extendSession(additionalTime = SESSION_CONFIG.timeout) {
    const session = await this.getSession()
    if (!session) return false

    session.expiresAt = Date.now() + additionalTime
    await secureSetItem(this.sessionKey, JSON.stringify(session))
    this.startSessionTimeout(session)
    this.notifyListeners("sessionExtended", session)

    return true
  }

  /**
   * Get session info for display
   * @returns {object} - Session info
   */
  async getSessionInfo() {
    const session = await this.getSession()
    if (!session) return null

    return {
      id: session.id,
      userId: session.userId,
      email: session.email,
      createdAt: new Date(session.createdAt).toLocaleString(),
      lastActivity: new Date(session.lastActivity).toLocaleString(),
      expiresAt: new Date(session.expiresAt).toLocaleString(),
      timeRemaining: this.formatTime(session.expiresAt - Date.now()),
    }
  }

  /**
   * Format time for display
   * @param {number} milliseconds - Time in milliseconds
   * @returns {string} - Formatted time string
   */
  formatTime(milliseconds) {
    if (milliseconds <= 0) return "0 seconds"

    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes % 60} minute${minutes % 60 > 1 ? "s" : ""}`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ${seconds % 60} second${seconds % 60 > 1 ? "s" : ""}`
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""}`
    }
  }
}

// Create singleton instance
const sessionManager = new SessionManager()

/**
 * Initialize session manager
 */
export const initSessionManager = async () => {
  await sessionManager.init()
}

/**
 * Create new session
 * @param {object} userData - User data
 * @returns {object} - Session object
 */
export const createSession = async userData => {
  return await sessionManager.createSession(userData)
}

/**
 * Get current session
 * @returns {object|null} - Session object or null
 */
export const getCurrentSession = async () => {
  return await sessionManager.getSession()
}

/**
 * Check if session is valid
 * @returns {boolean} - Whether session is valid
 */
export const isSessionValid = async () => {
  return await sessionManager.isSessionValid()
}

/**
 * Destroy current session
 */
export const destroySession = async () => {
  await sessionManager.destroySession()
}

/**
 * Extend current session
 * @param {number} additionalTime - Additional time in milliseconds
 * @returns {boolean} - Whether extension was successful
 */
export const extendSession = async additionalTime => {
  return await sessionManager.extendSession(additionalTime)
}

/**
 * Get session info
 * @returns {object|null} - Session info or null
 */
export const getSessionInfo = async () => {
  return await sessionManager.getSessionInfo()
}

/**
 * Add session event listener
 * @param {function} listener - Event listener
 */
export const addSessionListener = listener => {
  sessionManager.addListener(listener)
}

/**
 * Remove session event listener
 * @param {function} listener - Event listener
 */
export const removeSessionListener = listener => {
  sessionManager.removeListener(listener)
}

/**
 * React hook for session management
 * @returns {object} - Session state and actions
 */
export const useSession = () => {
  const [session, setSession] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [timeRemaining, setTimeRemaining] = React.useState(0)

  React.useEffect(() => {
    const handleSessionEvent = (event, data) => {
      switch (event) {
        case "sessionCreated":
        case "sessionUpdated":
          setSession(data)
          break
        case "sessionDestroyed":
          setSession(null)
          break
        case "sessionWarning":
          // Handle session warning
          break
      }
    }

    const initSession = async () => {
      await initSessionManager()
      const currentSession = await getCurrentSession()
      setSession(currentSession)
      setIsLoading(false)
    }

    initSession()
    addSessionListener(handleSessionEvent)

    // Update time remaining every second
    const interval = setInterval(async () => {
      const remaining = await sessionManager.getTimeRemaining()
      setTimeRemaining(remaining)
    }, 1000)

    return () => {
      removeSessionListener(handleSessionEvent)
      clearInterval(interval)
    }
  }, [])

  return {
    session,
    isLoading,
    timeRemaining,
    isValid: session !== null,
    createSession,
    destroySession,
    extendSession,
  }
}

export default sessionManager
