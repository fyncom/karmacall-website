/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

import ReactGA from "react-ga4"
import React from "react"
import CookieConsentEEA from "./src/components/CookieConsentEEA"

// Import proper font definitions with font-display: swap
import "./src/components/fonts.css"

// Wrap the root element with our cookie consent component
export const wrapRootElement = ({ element }) => {
  return (
    <>
      {element}
      <CookieConsentEEA />
    </>
  )
}

// Initialize ReactGA with your Google Analytics measurement ID
export const onClientEntry = () => {
  // Delay non-critical initialization to reduce main thread work during initial load
  if (typeof window !== 'undefined') {
    // Use requestIdleCallback to defer non-critical work
    const initNonCritical = () => {
      // Only initialize GA in production or debug mode
      if (process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true") {
        // Initialize GA with consent mode support - deferred to idle time
        ReactGA.initialize(process.env.GATSBY_GOOGLE_TAG_ID, {
          // Use consistent gaOptions to ensure consent mode works properly
          gaOptions: {
            cookieFlags: 'samesite=none;secure'
          }
        })
      }
    }
    
    // Use requestIdleCallback when available, or setTimeout as fallback
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(initNonCritical, { timeout: 2000 })
    } else {
      setTimeout(initNonCritical, 1000) // Defer by 1 second on older browsers
    }
  }
  
  // Add preload links for critical fonts to improve loading performance
  if (typeof document !== 'undefined') {
    // Preload only WOFF2 format which is more efficient than TTF
    const preloadFonts = [
      '/Barlow-AllFonts_Includes_SemiCondensed/BarlowSemiCondensed-Regular.woff2',
      '/Barlow-AllFonts_Includes_SemiCondensed/Barlow-Regular.woff2'
    ]
    
    // Create a document fragment to batch DOM operations
    const fragment = document.createDocumentFragment()
    
    preloadFonts.forEach(fontUrl => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = fontUrl
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      fragment.appendChild(link)
    })
    
    // Single DOM update instead of multiple
    document.head.appendChild(fragment)
  }
}

export const onRouteUpdate = ({ location }) => {
  // Only track pageviews if user is in production or debug mode
  if (typeof window !== "undefined" && 
      (process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true")) {
      
    // Get consent status
    const consentStatus = localStorage.getItem("cookie_consent_eea")
    
    // Defer analytics to idle time to avoid blocking main thread
    const sendAnalytics = () => {
      // Send the pageview - Google Analytics will respect consent settings
      ReactGA.send({ 
        hitType: "pageview", 
        page: location.pathname,
        // Add GDPR context parameters
        consent: consentStatus === "accepted" || consentStatus === "non_eea_user" ? "granted" : "denied"
      })
    }
    
    // Use requestIdleCallback when available, or setTimeout as fallback
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(sendAnalytics, { timeout: 1000 })
    } else {
      setTimeout(sendAnalytics, 100) // Small timeout to defer execution
    }
  }
}
