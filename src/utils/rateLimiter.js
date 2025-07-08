/**
 * Rate Limiter Utility
 * Prevents spam by limiting the frequency of actions (like comment submissions)
 */

/**
 * Rate limiter configuration
 */
const RATE_LIMIT_CONFIG = {
  comments: {
    maxAttempts: 3, // Maximum comments allowed
    windowMs: 60 * 1000, // Time window in milliseconds (1 minute)
    blockDurationMs: 5 * 60 * 1000, // Block duration after limit exceeded (5 minutes)
  },
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
}

/**
 * Gets the rate limit key for localStorage
 * @param {string} action - The action being rate limited
 * @param {string} identifier - User identifier (userId, IP, etc.)
 * @returns {string} - Storage key
 */
const getRateLimitKey = (action, identifier) => {
  return `rateLimit_${action}_${identifier}`
}

/**
 * Gets current timestamp
 * @returns {number} - Current timestamp in milliseconds
 */
const getCurrentTime = () => {
  return Date.now()
}

/**
 * Cleans up old rate limit entries
 * @param {string} action - The action being rate limited
 * @param {string} identifier - User identifier
 */
const cleanupOldEntries = (action, identifier) => {
  if (typeof window === "undefined") return

  const key = getRateLimitKey(action, identifier)
  const config = RATE_LIMIT_CONFIG[action]

  if (!config) return

  const stored = localStorage.getItem(key)
  if (!stored) return

  try {
    const data = JSON.parse(stored)
    const currentTime = getCurrentTime()

    // Remove attempts older than the window
    const validAttempts = data.attempts.filter(timestamp => currentTime - timestamp < config.windowMs)

    // If no valid attempts, remove the entry
    if (validAttempts.length === 0) {
      localStorage.removeItem(key)
      return
    }

    // Update with cleaned attempts
    data.attempts = validAttempts
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error cleaning up rate limit entries:", error)
    localStorage.removeItem(key)
  }
}

/**
 * Checks if an action is rate limited
 * @param {string} action - The action to check (e.g., 'comments', 'login')
 * @param {string} identifier - User identifier (userId, sessionId, etc.)
 * @returns {object} - Rate limit status
 */
export const checkRateLimit = (action, identifier) => {
  if (typeof window === "undefined") {
    return { allowed: true, remainingAttempts: 999, resetTime: null }
  }

  const config = RATE_LIMIT_CONFIG[action]
  if (!config) {
    console.warn(`No rate limit config found for action: ${action}`)
    return { allowed: true, remainingAttempts: 999, resetTime: null }
  }

  // Clean up old entries first
  cleanupOldEntries(action, identifier)

  const key = getRateLimitKey(action, identifier)
  const currentTime = getCurrentTime()

  try {
    const stored = localStorage.getItem(key)

    if (!stored) {
      // No previous attempts
      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - 1,
        resetTime: null,
        isBlocked: false,
      }
    }

    const data = JSON.parse(stored)

    // Check if user is currently blocked
    if (data.blockedUntil && currentTime < data.blockedUntil) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: data.blockedUntil,
        isBlocked: true,
        message: `Too many attempts. Please wait ${Math.ceil((data.blockedUntil - currentTime) / 1000)} seconds.`,
      }
    }

    // Filter recent attempts within the time window
    const recentAttempts = data.attempts.filter(timestamp => currentTime - timestamp < config.windowMs)

    const remainingAttempts = config.maxAttempts - recentAttempts.length

    if (remainingAttempts <= 0) {
      // Rate limit exceeded - block user
      const blockedUntil = currentTime + config.blockDurationMs
      const updatedData = {
        ...data,
        blockedUntil,
        attempts: recentAttempts,
      }

      localStorage.setItem(key, JSON.stringify(updatedData))

      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: blockedUntil,
        isBlocked: true,
        message: `Rate limit exceeded. Please wait ${Math.ceil(config.blockDurationMs / 1000)} seconds.`,
      }
    }

    // Calculate reset time (when oldest attempt expires)
    const oldestAttempt = Math.min(...recentAttempts)
    const resetTime = oldestAttempt + config.windowMs

    return {
      allowed: true,
      remainingAttempts,
      resetTime,
      isBlocked: false,
    }
  } catch (error) {
    console.error("Error checking rate limit:", error)
    // On error, allow the action but log it
    return { allowed: true, remainingAttempts: 999, resetTime: null }
  }
}

/**
 * Records an attempt for rate limiting
 * @param {string} action - The action being recorded
 * @param {string} identifier - User identifier
 * @returns {boolean} - Whether the attempt was recorded successfully
 */
export const recordAttempt = (action, identifier) => {
  if (typeof window === "undefined") return false

  const key = getRateLimitKey(action, identifier)
  const currentTime = getCurrentTime()

  try {
    const stored = localStorage.getItem(key)
    let data = { attempts: [], blockedUntil: null }

    if (stored) {
      data = JSON.parse(stored)
    }

    // Add current attempt
    data.attempts.push(currentTime)

    // Clean up old attempts
    const config = RATE_LIMIT_CONFIG[action]
    if (config) {
      data.attempts = data.attempts.filter(timestamp => currentTime - timestamp < config.windowMs)
    }

    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Error recording attempt:", error)
    return false
  }
}

/**
 * Resets rate limit for a user (admin function)
 * @param {string} action - The action to reset
 * @param {string} identifier - User identifier
 */
export const resetRateLimit = (action, identifier) => {
  if (typeof window === "undefined") return

  const key = getRateLimitKey(action, identifier)
  localStorage.removeItem(key)
}

/**
 * Gets rate limit status for display
 * @param {string} action - The action to check
 * @param {string} identifier - User identifier
 * @returns {object} - Status information for UI display
 */
export const getRateLimitStatus = (action, identifier) => {
  const status = checkRateLimit(action, identifier)

  if (status.isBlocked) {
    const waitTime = Math.ceil((status.resetTime - getCurrentTime()) / 1000)
    return {
      ...status,
      displayMessage: `Please wait ${waitTime} seconds before trying again.`,
      waitTimeSeconds: waitTime,
    }
  }

  return {
    ...status,
    displayMessage: `${status.remainingAttempts} attempts remaining.`,
    waitTimeSeconds: 0,
  }
}

/**
 * Higher-order function to wrap actions with rate limiting
 * @param {string} action - The action type
 * @param {function} actionFunction - The function to rate limit
 * @returns {function} - Rate limited function
 */
export const withRateLimit = (action, actionFunction) => {
  return async (identifier, ...args) => {
    const status = checkRateLimit(action, identifier)

    if (!status.allowed) {
      throw new Error(status.message || "Rate limit exceeded")
    }

    // Record the attempt
    recordAttempt(action, identifier)

    // Execute the original function
    return await actionFunction(...args)
  }
}
