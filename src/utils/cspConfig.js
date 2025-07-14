/**
 * Content Security Policy Configuration
 * Helps prevent XSS attacks and other code injection vulnerabilities
 */

/**
 * Generate CSP header value based on environment
 * @param {string} environment - Environment ('development' or 'production')
 * @returns {string} - CSP header value
 */
export const generateCSPHeader = (environment = "production") => {
  const isDevelopment = environment === "development"

  // Base CSP directives
  const cspDirectives = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'", // Required for Gatsby
      "'unsafe-eval'", // Required for development
      "https://cdn.auth0.com",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://connect.facebook.net",
      "https://static.hotjar.com",
      "https://script.hotjar.com",
      "https://cdn.jsdelivr.net",
      "https://unpkg.com",
      "https://cusdis.com",
    ],
    "style-src": [
      "'self'",
      "'unsafe-inline'", // Required for CSS-in-JS
      "https://fonts.googleapis.com",
      "https://cdn.auth0.com",
      "https://static.hotjar.com",
    ],
    "img-src": [
      "'self'",
      "data:", // For inline images
      "https:",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com",
      "https://static.hotjar.com",
      "https://script.hotjar.com",
      "https://fyncom-static-files.s3.us-west-1.amazonaws.com",
      "https://nanexplorer.com",
      "https://i.ytimg.com", // YouTube thumbnails
    ],
    "font-src": [
      "'self'",
      "https://fonts.gstatic.com",
      "data:", // For inline fonts
    ],
    "connect-src": [
      "'self'",
      "https://api.karmacall.com",
      "https://dev-api.karmacall.com",
      "https://server.fyncom.com",
      "https://ipapi.co",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com",
      "https://static.hotjar.com",
      "https://script.hotjar.com",
      "https://vc.hotjar.io",
      "wss://ws.hotjar.com",
      "https://nanexplorer.com",
      "https://buy.stripe.com",
      "https://fyncom.chargebee.com",
      "https://cusdis.com",
    ],
    "frame-src": ["'self'", "https://www.youtube.com", "https://buy.stripe.com", "https://fyncom.chargebee.com", "https://js.stripe.com"],
    "media-src": ["'self'", "https:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": [
      "'self'",
      "https://api.karmacall.com",
      "https://dev-api.karmacall.com",
      "https://server.fyncom.com",
      "https://buy.stripe.com",
      "https://fyncom.chargebee.com",
    ],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": [], // No value needed
  }

  // Add development-specific directives
  if (isDevelopment) {
    cspDirectives["script-src"].push("http://localhost:*", "ws://localhost:*", "http://127.0.0.1:*", "ws://127.0.0.1:*")
    cspDirectives["connect-src"].push("http://localhost:*", "ws://localhost:*", "http://127.0.0.1:*", "ws://127.0.0.1:*")
    cspDirectives["img-src"].push("http://localhost:*", "http://127.0.0.1:*")
  }

  // Convert to CSP header format
  const cspHeader = Object.entries(cspDirectives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive
      }
      return `${directive} ${sources.join(" ")}`
    })
    .join("; ")

  return cspHeader
}

/**
 * Generate CSP meta tag content
 * @param {string} environment - Environment
 * @returns {string} - CSP meta tag content
 */
export const generateCSPMetaContent = (environment = "production") => {
  return generateCSPHeader(environment)
}

/**
 * Validate CSP configuration
 * @param {string} cspHeader - CSP header to validate
 * @returns {object} - Validation result
 */
export const validateCSP = cspHeader => {
  const result = { isValid: true, warnings: [], errors: [] }

  // Check for common security issues
  if (cspHeader.includes("'unsafe-eval'")) {
    result.warnings.push("CSP contains 'unsafe-eval' which may allow code injection")
  }

  if (cspHeader.includes("'unsafe-inline'")) {
    result.warnings.push("CSP contains 'unsafe-inline' which may allow inline scripts")
  }

  if (cspHeader.includes("*")) {
    result.warnings.push("CSP contains wildcard (*) which may be too permissive")
  }

  if (!cspHeader.includes("object-src")) {
    result.warnings.push("CSP should include object-src directive")
  }

  if (!cspHeader.includes("base-uri")) {
    result.warnings.push("CSP should include base-uri directive")
  }

  if (!cspHeader.includes("frame-ancestors")) {
    result.warnings.push("CSP should include frame-ancestors directive")
  }

  // Check for required directives
  const requiredDirectives = ["default-src", "script-src", "style-src"]
  requiredDirectives.forEach(directive => {
    if (!cspHeader.includes(directive)) {
      result.errors.push(`CSP missing required directive: ${directive}`)
      result.isValid = false
    }
  })

  return result
}

/**
 * CSP nonce generator for inline scripts
 * @returns {string} - Random nonce value
 */
export const generateCSPNonce = () => {
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  }

  // Fallback for server-side
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

/**
 * CSP violation reporter
 * @param {Event} event - CSP violation event
 */
export const handleCSPViolation = event => {
  const violation = event.originalEvent || event

  console.error("CSP Violation:", {
    blockedURI: violation.blockedURI,
    violatedDirective: violation.violatedDirective,
    originalPolicy: violation.originalPolicy,
    documentURI: violation.documentURI,
    referrer: violation.referrer,
    lineNumber: violation.lineNumber,
    columnNumber: violation.columnNumber,
    sourceFile: violation.sourceFile,
    sample: violation.sample,
  })

  // Send violation report to server (optional)
  if (process.env.NODE_ENV === "production") {
    fetch("/api/csp-violation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blockedURI: violation.blockedURI,
        violatedDirective: violation.violatedDirective,
        documentURI: violation.documentURI,
        timestamp: new Date().toISOString(),
      }),
    }).catch(error => {
      console.error("Failed to send CSP violation report:", error)
    })
  }
}

/**
 * Initialize CSP violation reporting
 */
export const initCSPReporting = () => {
  if (typeof window !== "undefined") {
    document.addEventListener("securitypolicyviolation", handleCSPViolation)
  }
}

/**
 * CSP-safe script loader
 * @param {string} src - Script source URL
 * @param {object} options - Loading options
 * @returns {Promise} - Promise that resolves when script loads
 */
export const loadScriptSafely = (src, options = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Script loading only available in browser"))
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.async = options.async !== false
    script.defer = options.defer || false

    // Add nonce if provided
    if (options.nonce) {
      script.nonce = options.nonce
    }

    script.onload = () => resolve(script)
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))

    document.head.appendChild(script)
  })
}

/**
 * CSP-safe style injection
 * @param {string} css - CSS content
 * @param {object} options - Injection options
 */
export const injectStyleSafely = (css, options = {}) => {
  if (typeof window === "undefined") return

  const style = document.createElement("style")
  style.textContent = css

  // Add nonce if provided
  if (options.nonce) {
    style.nonce = options.nonce
  }

  document.head.appendChild(style)
}

/**
 * Get CSP configuration for Gatsby
 * @returns {object} - Gatsby CSP plugin configuration
 */
export const getGatsbyCSPConfig = () => {
  const environment = process.env.NODE_ENV || "production"

  return {
    resolve: "gatsby-plugin-csp",
    options: {
      disableOnDev: false,
      reportOnly: false,
      mergeScriptHashes: true,
      mergeStyleHashes: true,
      mergeDefaultDirectives: true,
      directives: {
        "default-src": "'self'",
        "script-src": `'self' 'unsafe-inline' 'unsafe-eval' https://cdn.auth0.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://static.hotjar.com https://script.hotjar.com https://cusdis.com`,
        "style-src": `'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.auth0.com https://static.hotjar.com`,
        "img-src": `'self' data: https: https://www.google-analytics.com https://www.googletagmanager.com https://static.hotjar.com https://script.hotjar.com https://fyncom-static-files.s3.us-west-1.amazonaws.com`,
        "font-src": `'self' https://fonts.gstatic.com data:`,
        "connect-src": `'self' https://api.karmacall.com https://dev-api.karmacall.com https://server.fyncom.com https://ipapi.co https://www.google-analytics.com https://www.googletagmanager.com https://static.hotjar.com https://script.hotjar.com https://vc.hotjar.io wss://ws.hotjar.com https://cusdis.com`,
        "frame-src": `'self' https://www.youtube.com https://buy.stripe.com https://fyncom.chargebee.com https://js.stripe.com`,
        "object-src": "'none'",
        "base-uri": "'self'",
        "form-action": `'self' https://api.karmacall.com https://dev-api.karmacall.com https://server.fyncom.com https://buy.stripe.com https://fyncom.chargebee.com`,
        "frame-ancestors": "'none'",
      },
    },
  }
}

export default {
  generateCSPHeader,
  generateCSPMetaContent,
  validateCSP,
  generateCSPNonce,
  handleCSPViolation,
  initCSPReporting,
  loadScriptSafely,
  injectStyleSafely,
  getGatsbyCSPConfig,
}
