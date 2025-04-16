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
  // Only initialize in production or if debug mode is enabled
  if (process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true") {
    // Initialize GA with consent mode support
    ReactGA.initialize(process.env.GATSBY_GOOGLE_TAG_ID, {
      // Use consistent gaOptions to ensure consent mode works properly
      gaOptions: {
        cookieFlags: 'samesite=none;secure'
      }
    })
  }
  
  // Add preload links for critical fonts to improve loading performance
  if (typeof document !== 'undefined') {
    const preloadFonts = [
      '/Barlow-AllFonts_Includes_SemiCondensed/BarlowSemiCondensed-Regular.ttf',
      '/Barlow-AllFonts_Includes_SemiCondensed/Barlow-Regular.ttf'
    ]
    
    preloadFonts.forEach(fontUrl => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = fontUrl
      link.as = 'font'
      link.type = 'font/ttf'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }
}

export const onRouteUpdate = ({ location }) => {
  // Only track pageviews if consent has been given or user is not in EEA
  if (typeof window !== "undefined" && 
      (process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true")) {
    
    const consentStatus = localStorage.getItem("cookie_consent_eea")
    
    // Always send the pageview - Google Analytics will automatically respect
    // the consent settings that were previously set
    // This ensures measurement gaps are filled in for users who have granted consent
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname,
      // Add GDPR context parameters
      consent: consentStatus === "accepted" || consentStatus === "non_eea_user" ? "granted" : "denied"
    })
  }
}
