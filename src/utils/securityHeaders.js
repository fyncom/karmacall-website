/**
 * Security Headers Configuration
 * Provides comprehensive security headers for enhanced protection
 */

/**
 * Generate security headers for different environments
 * @param {string} environment - Environment ('development' or 'production')
 * @returns {object} - Security headers object
 */
export const generateSecurityHeaders = (environment = "production") => {
  const isDevelopment = environment === "development"

  const headers = {
    // Content Security Policy
    "Content-Security-Policy": generateCSPHeader(environment),

    // Strict Transport Security
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

    // X-Frame-Options
    "X-Frame-Options": "DENY",

    // X-Content-Type-Options
    "X-Content-Type-Options": "nosniff",

    // X-XSS-Protection
    "X-XSS-Protection": "1; mode=block",

    // Referrer Policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions Policy
    "Permissions-Policy": [
      "geolocation=(self)",
      "microphone=()",
      "camera=()",
      "payment=(self)",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
      "ambient-light-sensor=()",
      "autoplay=()",
      "encrypted-media=()",
      "fullscreen=(self)",
      "midi=()",
      "notifications=(self)",
      "push=(self)",
      "speaker=(self)",
      "sync-xhr=()",
      "vibrate=()",
    ].join(", "),

    // Cross-Origin Policies
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",

    // Cache Control
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",

    // Server Information
    Server: "KarmaCall-Web",
    "X-Powered-By": "", // Remove server fingerprinting

    // CSRF Protection
    "X-CSRF-Token": "required",
  }

  // Development-specific headers
  if (isDevelopment) {
    // Relax some policies for development
    headers["Strict-Transport-Security"] = "max-age=0"
    headers["Cross-Origin-Embedder-Policy"] = "unsafe-none"
  }

  return headers
}

/**
 * Generate CSP header for security headers
 * @param {string} environment - Environment
 * @returns {string} - CSP header value
 */
const generateCSPHeader = environment => {
  const isDevelopment = environment === "development"

  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.auth0.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://static.hotjar.com https://script.hotjar.com https://cusdis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.auth0.com https://static.hotjar.com",
    "img-src 'self' data: https: https://www.google-analytics.com https://www.googletagmanager.com https://static.hotjar.com https://script.hotjar.com https://fyncom-static-files.s3.us-west-1.amazonaws.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://api.karmacall.com https://dev-api.karmacall.com https://server.fyncom.com https://ipapi.co https://www.google-analytics.com https://www.googletagmanager.com https://static.hotjar.com https://script.hotjar.com https://vc.hotjar.io wss://ws.hotjar.com https://cusdis.com",
    "frame-src 'self' https://www.youtube.com https://buy.stripe.com https://fyncom.chargebee.com https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://api.karmacall.com https://dev-api.karmacall.com https://server.fyncom.com https://buy.stripe.com https://fyncom.chargebee.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ]

  if (isDevelopment) {
    // Add localhost for development
    directives[1] += " http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:*"
    directives[5] += " http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:*"
  }

  return directives.join("; ")
}

/**
 * Validate security headers
 * @param {object} headers - Headers to validate
 * @returns {object} - Validation result
 */
export const validateSecurityHeaders = headers => {
  const result = { isValid: true, warnings: [], errors: [] }

  const requiredHeaders = ["Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "X-XSS-Protection", "Referrer-Policy"]

  // Check for required headers
  requiredHeaders.forEach(header => {
    if (!headers[header]) {
      result.errors.push(`Missing required security header: ${header}`)
      result.isValid = false
    }
  })

  // Check for insecure configurations
  if (headers["X-Frame-Options"] && headers["X-Frame-Options"] !== "DENY" && headers["X-Frame-Options"] !== "SAMEORIGIN") {
    result.warnings.push("X-Frame-Options should be DENY or SAMEORIGIN")
  }

  if (headers["X-Content-Type-Options"] && headers["X-Content-Type-Options"] !== "nosniff") {
    result.warnings.push("X-Content-Type-Options should be nosniff")
  }

  if (headers["Strict-Transport-Security"] && !headers["Strict-Transport-Security"].includes("max-age=")) {
    result.warnings.push("Strict-Transport-Security should include max-age")
  }

  return result
}

/**
 * Apply security headers to response
 * @param {object} response - Response object
 * @param {string} environment - Environment
 */
export const applySecurityHeaders = (response, environment = "production") => {
  const headers = generateSecurityHeaders(environment)

  Object.entries(headers).forEach(([name, value]) => {
    if (value) {
      response.setHeader(name, value)
    } else {
      response.removeHeader(name)
    }
  })
}

/**
 * Middleware for applying security headers
 * @param {string} environment - Environment
 * @returns {function} - Express middleware function
 */
export const securityHeadersMiddleware = (environment = "production") => {
  return (req, res, next) => {
    applySecurityHeaders(res, environment)
    next()
  }
}

/**
 * Generate Netlify _headers file content
 * @param {string} environment - Environment
 * @returns {string} - Headers file content
 */
export const generateNetlifyHeaders = (environment = "production") => {
  const headers = generateSecurityHeaders(environment)

  let headersContent = "/*\n"

  Object.entries(headers).forEach(([name, value]) => {
    if (value) {
      headersContent += `  ${name}: ${value}\n`
    }
  })

  // Add specific headers for different file types
  headersContent += "\n"
  headersContent += "/*.js\n"
  headersContent += "  Cache-Control: public, max-age=31536000, immutable\n"
  headersContent += "\n"
  headersContent += "/*.css\n"
  headersContent += "  Cache-Control: public, max-age=31536000, immutable\n"
  headersContent += "\n"
  headersContent += "/*.png\n"
  headersContent += "/*.jpg\n"
  headersContent += "/*.jpeg\n"
  headersContent += "/*.gif\n"
  headersContent += "/*.svg\n"
  headersContent += "/*.webp\n"
  headersContent += "  Cache-Control: public, max-age=31536000, immutable\n"
  headersContent += "\n"
  headersContent += "/api/*\n"
  headersContent += "  Cache-Control: no-cache, no-store, must-revalidate\n"
  headersContent += "  X-Robots-Tag: noindex\n"

  return headersContent
}

/**
 * Security headers for Gatsby
 * @returns {object} - Gatsby security headers configuration
 */
export const getGatsbySecurityHeaders = () => {
  const environment = process.env.NODE_ENV || "production"
  const headers = generateSecurityHeaders(environment)

  return {
    resolve: "gatsby-plugin-netlify",
    options: {
      headers: {
        "/*": Object.entries(headers).reduce((acc, [name, value]) => {
          if (value) {
            acc[name] = value
          }
          return acc
        }, {}),
        "/api/*": {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Robots-Tag": "noindex",
        },
      },
    },
  }
}

/**
 * Check if request is secure (HTTPS)
 * @param {object} req - Request object
 * @returns {boolean} - Whether request is secure
 */
export const isSecureRequest = req => {
  return req.secure || req.headers["x-forwarded-proto"] === "https" || req.headers["x-forwarded-ssl"] === "on" || req.connection.encrypted
}

/**
 * Enforce HTTPS redirect
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
export const enforceHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV === "production" && !isSecureRequest(req)) {
    const redirectURL = `https://${req.headers.host}${req.url}`
    return res.redirect(301, redirectURL)
  }
  next()
}

/**
 * Security audit for headers
 * @param {object} headers - Headers to audit
 * @returns {object} - Audit result
 */
export const auditSecurityHeaders = headers => {
  const audit = {
    score: 0,
    maxScore: 100,
    issues: [],
    recommendations: [],
  }

  // Check for each security header
  const headerChecks = [
    { name: "Content-Security-Policy", weight: 25, required: true },
    { name: "Strict-Transport-Security", weight: 20, required: true },
    { name: "X-Frame-Options", weight: 15, required: true },
    { name: "X-Content-Type-Options", weight: 10, required: true },
    { name: "X-XSS-Protection", weight: 10, required: true },
    { name: "Referrer-Policy", weight: 10, required: false },
    { name: "Permissions-Policy", weight: 10, required: false },
  ]

  headerChecks.forEach(check => {
    if (headers[check.name]) {
      audit.score += check.weight
    } else {
      const message = `Missing ${check.name} header`
      if (check.required) {
        audit.issues.push(message)
      } else {
        audit.recommendations.push(message)
      }
    }
  })

  // Grade based on score
  let grade = "F"
  if (audit.score >= 90) grade = "A"
  else if (audit.score >= 80) grade = "B"
  else if (audit.score >= 70) grade = "C"
  else if (audit.score >= 60) grade = "D"

  audit.grade = grade

  return audit
}

export default {
  generateSecurityHeaders,
  validateSecurityHeaders,
  applySecurityHeaders,
  securityHeadersMiddleware,
  generateNetlifyHeaders,
  getGatsbySecurityHeaders,
  isSecureRequest,
  enforceHTTPS,
  auditSecurityHeaders,
}
