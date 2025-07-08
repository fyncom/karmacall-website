/**
 * CSRF Protection Utility
 * Provides CSRF token generation and validation for form submissions
 */

/**
 * Generate a random CSRF token
 * @returns {string} - Random CSRF token
 */
export const generateCSRFToken = () => {
  if (typeof window === "undefined") return ""

  // Generate a random token using Web Crypto API
  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * Store CSRF token in sessionStorage
 * @param {string} token - CSRF token to store
 */
export const storeCSRFToken = token => {
  if (typeof window === "undefined") return

  try {
    sessionStorage.setItem("csrf_token", token)
    // Also store timestamp for expiration
    sessionStorage.setItem("csrf_token_timestamp", Date.now().toString())
  } catch (error) {
    console.error("Failed to store CSRF token:", error)
  }
}

/**
 * Retrieve CSRF token from sessionStorage
 * @returns {string|null} - CSRF token or null if not found/expired
 */
export const getCSRFToken = () => {
  if (typeof window === "undefined") return null

  try {
    const token = sessionStorage.getItem("csrf_token")
    const timestamp = sessionStorage.getItem("csrf_token_timestamp")

    if (!token || !timestamp) return null

    // Check if token has expired (30 minutes)
    const tokenAge = Date.now() - parseInt(timestamp)
    const maxAge = 30 * 60 * 1000 // 30 minutes

    if (tokenAge > maxAge) {
      clearCSRFToken()
      return null
    }

    return token
  } catch (error) {
    console.error("Failed to retrieve CSRF token:", error)
    return null
  }
}

/**
 * Clear CSRF token from sessionStorage
 */
export const clearCSRFToken = () => {
  if (typeof window === "undefined") return

  try {
    sessionStorage.removeItem("csrf_token")
    sessionStorage.removeItem("csrf_token_timestamp")
  } catch (error) {
    console.error("Failed to clear CSRF token:", error)
  }
}

/**
 * Get or generate CSRF token
 * @returns {string} - CSRF token
 */
export const getOrGenerateCSRFToken = () => {
  let token = getCSRFToken()

  if (!token) {
    token = generateCSRFToken()
    storeCSRFToken(token)
  }

  return token
}

/**
 * Validate CSRF token
 * @param {string} submittedToken - Token submitted with form
 * @returns {boolean} - Whether token is valid
 */
export const validateCSRFToken = submittedToken => {
  if (!submittedToken) return false

  const storedToken = getCSRFToken()
  if (!storedToken) return false

  // Use constant-time comparison to prevent timing attacks
  return constantTimeCompare(submittedToken, storedToken)
}

/**
 * Constant-time string comparison to prevent timing attacks
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} - Whether strings are equal
 */
const constantTimeCompare = (a, b) => {
  if (a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Add CSRF token to form data
 * @param {FormData|Object} formData - Form data to add token to
 * @returns {FormData|Object} - Form data with CSRF token
 */
export const addCSRFTokenToFormData = formData => {
  const token = getOrGenerateCSRFToken()

  if (formData instanceof FormData) {
    formData.append("csrf_token", token)
  } else if (typeof formData === "object") {
    formData.csrf_token = token
  }

  return formData
}

/**
 * Add CSRF token to request headers
 * @param {Object} headers - Request headers
 * @returns {Object} - Headers with CSRF token
 */
export const addCSRFTokenToHeaders = (headers = {}) => {
  const token = getOrGenerateCSRFToken()

  return {
    ...headers,
    "X-CSRF-Token": token,
  }
}

/**
 * React hook for CSRF protection
 * @returns {Object} - CSRF token and validation functions
 */
export const useCSRFProtection = () => {
  const [csrfToken, setCsrfToken] = React.useState("")

  React.useEffect(() => {
    const token = getOrGenerateCSRFToken()
    setCsrfToken(token)
  }, [])

  const refreshToken = () => {
    clearCSRFToken()
    const newToken = getOrGenerateCSRFToken()
    setCsrfToken(newToken)
  }

  const validateToken = submittedToken => {
    return validateCSRFToken(submittedToken)
  }

  return {
    csrfToken,
    refreshToken,
    validateToken,
    addToFormData: addCSRFTokenToFormData,
    addToHeaders: addCSRFTokenToHeaders,
  }
}

/**
 * Higher-order function to wrap form submissions with CSRF protection
 * @param {Function} submitFunction - Original submit function
 * @returns {Function} - CSRF-protected submit function
 */
export const withCSRFProtection = submitFunction => {
  return async (formData, ...args) => {
    // Add CSRF token to form data
    const protectedFormData = addCSRFTokenToFormData(formData)

    // Call original submit function
    return await submitFunction(protectedFormData, ...args)
  }
}

/**
 * Middleware for validating CSRF tokens in API requests
 * @param {Request} request - Request object
 * @returns {boolean} - Whether request has valid CSRF token
 */
export const validateCSRFMiddleware = request => {
  // Check header first
  let token = request.headers.get("X-CSRF-Token")

  // If not in header, check form data
  if (!token && request.body) {
    const formData = new FormData(request.body)
    token = formData.get("csrf_token")
  }

  return validateCSRFToken(token)
}

/**
 * Generate CSRF token for server-side rendering
 * @returns {string} - CSRF token for SSR
 */
export const generateSSRCSRFToken = () => {
  // For SSR, generate a token that will be validated on the client
  return generateCSRFToken()
}

export default {
  generateCSRFToken,
  storeCSRFToken,
  getCSRFToken,
  clearCSRFToken,
  getOrGenerateCSRFToken,
  validateCSRFToken,
  addCSRFTokenToFormData,
  addCSRFTokenToHeaders,
  withCSRFProtection,
  validateCSRFMiddleware,
  generateSSRCSRFToken,
}
