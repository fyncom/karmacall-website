/**
 * Input Validation Utility
 * Provides comprehensive validation for different types of user input
 */

/**
 * Email validation with comprehensive checks
 * @param {string} email - Email to validate
 * @returns {object} - Validation result
 */
export const validateEmail = email => {
  const result = { isValid: false, errors: [] }

  if (!email || typeof email !== "string") {
    result.errors.push("Email is required")
    return result
  }

  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    result.errors.push("Invalid email format")
  }

  // Length check
  if (email.length > 254) {
    result.errors.push("Email is too long (maximum 254 characters)")
  }

  // Local part length check
  const localPart = email.split("@")[0]
  if (localPart && localPart.length > 64) {
    result.errors.push("Email local part is too long (maximum 64 characters)")
  }

  // Check for dangerous characters
  const dangerousChars = /[<>'"&\\]/
  if (dangerousChars.test(email)) {
    result.errors.push("Email contains invalid characters")
  }

  // Check for consecutive dots
  if (email.includes("..")) {
    result.errors.push("Email cannot contain consecutive dots")
  }

  // Check for valid TLD
  const tldRegex = /\.[a-zA-Z]{2,}$/
  if (!tldRegex.test(email)) {
    result.errors.push("Email must have a valid top-level domain")
  }

  result.isValid = result.errors.length === 0
  return result
}

/**
 * Phone number validation
 * @param {string} phoneNumber - Phone number to validate
 * @param {string} countryCode - Country code (optional)
 * @returns {object} - Validation result
 */
export const validatePhoneNumber = (phoneNumber, countryCode = "") => {
  const result = { isValid: false, errors: [] }

  if (!phoneNumber || typeof phoneNumber !== "string") {
    result.errors.push("Phone number is required")
    return result
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phoneNumber.replace(/\D/g, "")

  // Basic length check
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    result.errors.push("Phone number must be between 7 and 15 digits")
  }

  // Check for valid characters (digits, spaces, hyphens, parentheses, plus)
  const validChars = /^[0-9\s\-\(\)\+]+$/
  if (!validChars.test(phoneNumber)) {
    result.errors.push("Phone number contains invalid characters")
  }

  // Country-specific validation
  if (countryCode) {
    switch (countryCode.toUpperCase()) {
      case "US":
      case "CA":
        if (digitsOnly.length !== 10 && digitsOnly.length !== 11) {
          result.errors.push("US/Canada phone numbers must be 10 or 11 digits")
        }
        break
      case "UK":
        if (digitsOnly.length < 10 || digitsOnly.length > 11) {
          result.errors.push("UK phone numbers must be 10 or 11 digits")
        }
        break
    }
  }

  result.isValid = result.errors.length === 0
  return result
}

/**
 * Name validation
 * @param {string} name - Name to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export const validateName = (name, options = {}) => {
  const result = { isValid: false, errors: [] }
  const { minLength = 1, maxLength = 50, required = true } = options

  if (!name || typeof name !== "string") {
    if (required) {
      result.errors.push("Name is required")
    }
    return result
  }

  const trimmedName = name.trim()

  // Length checks
  if (trimmedName.length < minLength) {
    result.errors.push(`Name must be at least ${minLength} characters`)
  }

  if (trimmedName.length > maxLength) {
    result.errors.push(`Name must be no more than ${maxLength} characters`)
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const validChars = /^[a-zA-Z\s\-'\.]+$/
  if (!validChars.test(trimmedName)) {
    result.errors.push("Name can only contain letters, spaces, hyphens, and apostrophes")
  }

  // Check for suspicious patterns
  if (/^\s+$/.test(name)) {
    result.errors.push("Name cannot be only whitespace")
  }

  if (/\s{2,}/.test(trimmedName)) {
    result.errors.push("Name cannot contain multiple consecutive spaces")
  }

  // Check for script injection attempts
  const scriptPattern = /<script|javascript:|data:|vbscript:/i
  if (scriptPattern.test(name)) {
    result.errors.push("Name contains invalid content")
  }

  result.isValid = result.errors.length === 0
  return result
}

/**
 * Message/comment validation
 * @param {string} message - Message to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export const validateMessage = (message, options = {}) => {
  const result = { isValid: false, errors: [] }
  const { minLength = 1, maxLength = 1000, required = true } = options

  if (!message || typeof message !== "string") {
    if (required) {
      result.errors.push("Message is required")
    }
    return result
  }

  const trimmedMessage = message.trim()

  // Length checks
  if (trimmedMessage.length < minLength) {
    result.errors.push(`Message must be at least ${minLength} characters`)
  }

  if (trimmedMessage.length > maxLength) {
    result.errors.push(`Message must be no more than ${maxLength} characters`)
  }

  // Check for only whitespace
  if (/^\s+$/.test(message)) {
    result.errors.push("Message cannot be only whitespace")
  }

  // Check for excessive repetition
  const repetitionPattern = /(.)\1{10,}/
  if (repetitionPattern.test(message)) {
    result.errors.push("Message contains excessive character repetition")
  }

  // Check for spam patterns
  const spamPatterns = [
    /(.{1,10})\1{5,}/i, // Repeated patterns
    /^.{0,3}$/, // Too short
    /^\d+$/, // Only numbers
    /^[!@#$%^&*(),.?":{}|<>]+$/, // Only special characters
  ]

  spamPatterns.forEach(pattern => {
    if (pattern.test(trimmedMessage)) {
      result.errors.push("Message appears to be spam")
    }
  })

  result.isValid = result.errors.length === 0
  return result
}

/**
 * URL validation
 * @param {string} url - URL to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export const validateURL = (url, options = {}) => {
  const result = { isValid: false, errors: [] }
  const { allowedProtocols = ["http:", "https:"], required = true } = options

  if (!url || typeof url !== "string") {
    if (required) {
      result.errors.push("URL is required")
    }
    return result
  }

  try {
    const urlObj = new URL(url)

    // Check protocol
    if (!allowedProtocols.includes(urlObj.protocol)) {
      result.errors.push(`URL protocol must be one of: ${allowedProtocols.join(", ")}`)
    }

    // Check for localhost/private IPs in production
    if (process.env.NODE_ENV === "production") {
      const hostname = urlObj.hostname
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        hostname.startsWith("172.")
      ) {
        result.errors.push("Private/local URLs are not allowed")
      }
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [/javascript:/i, /data:/i, /vbscript:/i, /file:/i]

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(url)) {
        result.errors.push("URL contains suspicious content")
      }
    })
  } catch (error) {
    result.errors.push("Invalid URL format")
  }

  result.isValid = result.errors.length === 0
  return result
}

/**
 * OTP validation
 * @param {string} otp - OTP to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export const validateOTP = (otp, options = {}) => {
  const result = { isValid: false, errors: [] }
  const { length = 6, allowLetters = false } = options

  if (!otp || typeof otp !== "string") {
    result.errors.push("OTP is required")
    return result
  }

  // Length check
  if (otp.length !== length) {
    result.errors.push(`OTP must be exactly ${length} characters`)
  }

  // Character check
  const pattern = allowLetters ? /^[a-zA-Z0-9]+$/ : /^[0-9]+$/
  if (!pattern.test(otp)) {
    result.errors.push(allowLetters ? "OTP can only contain letters and numbers" : "OTP can only contain numbers")
  }

  result.isValid = result.errors.length === 0
  return result
}

/**
 * Amount validation (for financial inputs)
 * @param {string|number} amount - Amount to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export const validateAmount = (amount, options = {}) => {
  const result = { isValid: false, errors: [] }
  const { min = 0, max = Infinity, decimals = 2, required = true } = options

  if (amount === null || amount === undefined || amount === "") {
    if (required) {
      result.errors.push("Amount is required")
    }
    return result
  }

  const numAmount = parseFloat(amount)

  // Check if it's a valid number
  if (isNaN(numAmount)) {
    result.errors.push("Amount must be a valid number")
    return result
  }

  // Range checks
  if (numAmount < min) {
    result.errors.push(`Amount must be at least ${min}`)
  }

  if (numAmount > max) {
    result.errors.push(`Amount must be no more than ${max}`)
  }

  // Decimal places check
  const decimalPlaces = (amount.toString().split(".")[1] || "").length
  if (decimalPlaces > decimals) {
    result.errors.push(`Amount can have at most ${decimals} decimal places`)
  }

  // Check for negative zero
  if (Object.is(numAmount, -0)) {
    result.errors.push("Amount cannot be negative zero")
  }

  result.isValid = result.errors.length === 0
  return result
}

/**
 * Validate form data object
 * @param {object} formData - Form data to validate
 * @param {object} schema - Validation schema
 * @returns {object} - Validation result
 */
export const validateFormData = (formData, schema) => {
  const result = { isValid: true, errors: {}, fieldErrors: {} }

  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const fieldValue = formData[fieldName]
    let fieldResult

    switch (fieldSchema.type) {
      case "email":
        fieldResult = validateEmail(fieldValue)
        break
      case "phone":
        fieldResult = validatePhoneNumber(fieldValue, fieldSchema.countryCode)
        break
      case "name":
        fieldResult = validateName(fieldValue, fieldSchema.options)
        break
      case "message":
        fieldResult = validateMessage(fieldValue, fieldSchema.options)
        break
      case "url":
        fieldResult = validateURL(fieldValue, fieldSchema.options)
        break
      case "otp":
        fieldResult = validateOTP(fieldValue, fieldSchema.options)
        break
      case "amount":
        fieldResult = validateAmount(fieldValue, fieldSchema.options)
        break
      default:
        fieldResult = { isValid: true, errors: [] }
    }

    if (!fieldResult.isValid) {
      result.isValid = false
      result.fieldErrors[fieldName] = fieldResult.errors
      result.errors[fieldName] = fieldResult.errors[0] // First error for display
    }
  }

  return result
}

/**
 * Sanitize and validate input
 * @param {string} input - Input to sanitize and validate
 * @param {string} type - Type of input
 * @param {object} options - Validation options
 * @returns {object} - Sanitized and validated result
 */
export const sanitizeAndValidate = (input, type, options = {}) => {
  // First sanitize the input
  let sanitized = input

  if (typeof input === "string") {
    sanitized = input.trim()

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, "")

    // Normalize Unicode
    sanitized = sanitized.normalize("NFC")
  }

  // Then validate
  let validation
  switch (type) {
    case "email":
      validation = validateEmail(sanitized)
      break
    case "phone":
      validation = validatePhoneNumber(sanitized, options.countryCode)
      break
    case "name":
      validation = validateName(sanitized, options)
      break
    case "message":
      validation = validateMessage(sanitized, options)
      break
    case "url":
      validation = validateURL(sanitized, options)
      break
    case "otp":
      validation = validateOTP(sanitized, options)
      break
    case "amount":
      validation = validateAmount(sanitized, options)
      break
    default:
      validation = { isValid: true, errors: [] }
  }

  return {
    sanitized,
    validation,
    isValid: validation.isValid,
    errors: validation.errors,
  }
}

export default {
  validateEmail,
  validatePhoneNumber,
  validateName,
  validateMessage,
  validateURL,
  validateOTP,
  validateAmount,
  validateFormData,
  sanitizeAndValidate,
}
