import React, { useEffect } from "react"
import { resolveShortUrl } from "../../utils/urlShortener"

/* global gtag */

// This page handles redirects for short URLs like /s/abc123
// Uses Gatsby's file system routing: [code]
const ShortUrlRedirect = ({ params, location }) => {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Get code from params or extract from pathname
    let code = params?.code

    // If no code in params, try to extract from pathname
    if (!code && location?.pathname) {
      const pathParts = location.pathname.split("/")
      const sIndex = pathParts.indexOf("s")
      if (sIndex !== -1 && pathParts[sIndex + 1]) {
        code = pathParts[sIndex + 1]
      }
    }

    // If still no code, try to extract from current URL
    if (!code) {
      const currentPath = window.location.pathname
      const match = currentPath.match(/\/s\/([^\/]+)\/?$/)
      if (match) {
        code = match[1]
      }
    }

    console.log("Debug: Redirect page loaded")
    console.log("Debug: Extracted code:", code)

    if (!code) {
      // No code provided, redirect to home immediately
      console.log("Debug: No code provided, redirecting to home")
      window.location.replace("/")
      return
    }

    // Immediately try to resolve and redirect (no delay)
    import("../../utils/urlShortener")
      .then(({ resolveShortUrl }) => {
        console.log("Debug: URL shortener module loaded")

        // Try to resolve the short URL
        const originalUrl = resolveShortUrl(code)
        console.log("Debug: Resolved URL:", originalUrl)

        if (originalUrl) {
          // Found the mapping, redirect immediately
          console.log("Debug: SUCCESS - Redirecting to:", originalUrl)

          // Track the click event in Google Analytics (if available)
          if (typeof gtag !== "undefined") {
            gtag("event", "short_url_click", {
              event_category: "engagement",
              event_label: code,
              transport_type: "beacon",
            })
          }

          // Use replace() instead of href to avoid back button issues
          window.location.replace(originalUrl)
        } else {
          // Short code not found, redirect to home
          console.warn(`Short URL code not found: ${code}`)
          console.log("Debug: FAILED - Code not found, redirecting to home")
          window.location.replace("/")
        }
      })
      .catch(error => {
        console.error("Debug: Error loading URL shortener module:", error)
        window.location.replace("/")
      })
  }, [params, location])

  // Return null to render nothing (redirect happens immediately)
  return null
}

export default ShortUrlRedirect

// SEO head for the redirect page
export const Head = () => (
  <>
    <title>Redirecting - KarmaCall</title>
    <meta name="robots" content="noindex" />
  </>
)
