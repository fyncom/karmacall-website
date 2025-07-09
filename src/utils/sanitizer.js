import DOMPurify from "dompurify"

/**
 * Sanitizes user input to prevent XSS attacks and ensure safe content
 * @param {string} input - The user input to sanitize
 * @param {object} options - Configuration options for sanitization
 * @returns {string} - Sanitized and safe content
 */
export const sanitizeInput = (input, options = {}) => {
  if (!input || typeof input !== "string") {
    return ""
  }

  const defaultOptions = {
    // Allow basic formatting but strip dangerous elements
    ALLOWED_TAGS: ["b", "i", "em", "strong", "br", "p"],
    ALLOWED_ATTR: [],
    // Remove all attributes to prevent event handlers
    FORBID_ATTR: ["style", "class", "id", "onclick", "onload", "onerror"],
    // Strip all scripts and dangerous elements
    FORBID_TAGS: ["script", "object", "embed", "link", "style", "img", "svg"],
    // Keep content but remove tags if they're not allowed
    KEEP_CONTENT: true,
    // Allow line breaks to be preserved
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  }

  const config = { ...defaultOptions, ...options }

  // First pass: Clean with DOMPurify
  let sanitized = DOMPurify.sanitize(input, config)

  // Second pass: Additional custom sanitization
  sanitized = sanitized
    // Remove any remaining script content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove javascript: URLs
    .replace(/javascript:/gi, "")
    // Remove data: URLs (can contain scripts)
    .replace(/data:/gi, "")
    // Remove vbscript: URLs
    .replace(/vbscript:/gi, "")
    // Remove on* event handlers that might have been missed
    .replace(/\s*on\w+\s*=\s*[^>]*/gi, "")
    // Normalize whitespace
    .replace(/\s+/g, " ")
    .trim()

  return sanitized
}

/**
 * Sanitizes comment content specifically
 * @param {string} content - The comment content to sanitize
 * @returns {string} - Sanitized comment content
 */
export const sanitizeComment = content => {
  return sanitizeInput(content, {
    // For comments, we want to be more restrictive
    ALLOWED_TAGS: ["br", "p"],
    ALLOWED_ATTR: [],
    // Convert line breaks to <br> tags for proper display
    RETURN_DOM: false,
  })
}

/**
 * Sanitizes user name input
 * @param {string} name - The user name to sanitize
 * @returns {string} - Sanitized user name
 */
export const sanitizeName = name => {
  return sanitizeInput(name, {
    // Names should have no HTML tags at all
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}

/**
 * Sanitizes email input
 * @param {string} email - The email to sanitize
 * @returns {string} - Sanitized email
 */
export const sanitizeEmail = email => {
  if (!email || typeof email !== "string") {
    return ""
  }

  // Basic email sanitization - remove all HTML and scripts
  let sanitized = sanitizeInput(email, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })

  // Additional email-specific cleaning
  sanitized = sanitized
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/g, "")
    .trim()

  return sanitized
}

/**
 * Validates and sanitizes form input
 * @param {object} formData - The form data object to sanitize
 * @returns {object} - Sanitized form data
 */
export const sanitizeFormData = formData => {
  const sanitized = {}

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === "string") {
      switch (key) {
        case "name":
          sanitized[key] = sanitizeName(value)
          break
        case "email":
          sanitized[key] = sanitizeEmail(value)
          break
        case "message":
        case "comment":
          sanitized[key] = sanitizeComment(value)
          break
        default:
          sanitized[key] = sanitizeInput(value)
      }
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}
