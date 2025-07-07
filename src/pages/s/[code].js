import React, { useEffect } from "react"
import { resolveShortUrl } from "../../utils/urlShortener"

// This page handles redirects for short URLs like /s/abc123
// Uses Gatsby's file system routing: [code]
const ShortUrlRedirect = ({ params }) => {
  useEffect(() => {
    if (typeof window === "undefined") return

    const { code } = params || {}
    console.log("Debug: Redirect page params:", params)
    console.log("Debug: Code extracted:", code)

    if (!code) {
      // No code provided, redirect to home
      console.log("Debug: No code provided, redirecting to home")
      window.location.href = "/"
      return
    }

    // Try to resolve the short URL
    const originalUrl = resolveShortUrl(code)
    console.log("Debug: Resolved URL:", originalUrl)

    if (originalUrl) {
      // Found the mapping, redirect to original URL with tracking
      console.log("Debug: Redirecting to:", originalUrl)
      window.location.href = originalUrl
    } else {
      // Short code not found, redirect to home or 404
      console.warn(`Short URL code not found: ${code}`)
      console.log("Debug: Code not found, redirecting to home")
      window.location.href = "/"
    }
  }, [params])

  // Show loading state while redirecting
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>Redirecting...</h2>
        <p>You will be redirected shortly.</p>
      </div>
    </div>
  )
}

export default ShortUrlRedirect

// SEO head for the redirect page
export const Head = () => (
  <>
    <title>Redirecting - KarmaCall</title>
    <meta name="robots" content="noindex" />
  </>
)
