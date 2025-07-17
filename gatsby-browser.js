/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

import ReactGA from "react-ga4"
import React from "react"
import CookieConsentEEA from "./src/components/CookieConsentEEA"
import posthog from "posthog-js"
import { setTrackingConsent } from "./src/utils/analytics"

// Import proper font definitions with font-display: swap
import "./src/components/fonts.css"

// Wrap the root element with our cookie consent component
export const wrapRootElement = ({ element }) => {
  return (
    <>
      {element}
      <CookieConsentEEA 
        onConsentChange={(hasConsent) => {
          // Update consent for both platforms when user changes preference
          if (typeof window !== "undefined") {
            setTimeout(() => setTrackingConsent(hasConsent), 100)
          }
        }}
      />
    </>
  )
}

// Initialize ReactGA and PostHog
export const onClientEntry = () => {
  // Only initialize in production or if debug mode is enabled
  if (process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true") {
    // Initialize GA with consent mode support
    ReactGA.initialize(process.env.GATSBY_GOOGLE_TAG_ID, {
      // Use consistent gaOptions to ensure consent mode works properly
      gaOptions: {
        cookieFlags: "samesite=none;secure",
      },
    })

    // Initialize PostHog
    if (process.env.GATSBY_POSTHOG_API_KEY && process.env.GATSBY_POSTHOG_HOST) {
      posthog.init(process.env.GATSBY_POSTHOG_API_KEY, {
        api_host: process.env.GATSBY_POSTHOG_HOST,
        autocapture: true,
        capture_pageview: false, // We'll manually capture pageviews
        loaded: (posthog) => {
          window.posthog = posthog
          
          // Set up consent handling for both platforms
          const consentStatus = localStorage.getItem("cookie_consent_eea")
          const hasConsent = consentStatus === "accepted" || consentStatus === "non_eea_user"
          setTrackingConsent(hasConsent)
        }
      })
    }
  }

  // Add preload links for critical fonts to improve loading performance
  if (typeof document !== "undefined") {
    const preloadFonts = [
      "/Barlow-AllFonts_Includes_SemiCondensed/BarlowSemiCondensed-Regular.ttf",
      "/Barlow-AllFonts_Includes_SemiCondensed/Barlow-Regular.ttf",
    ]

    preloadFonts.forEach(fontUrl => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = fontUrl
      link.as = "font"
      link.type = "font/ttf"
      link.crossOrigin = "anonymous"
      document.head.appendChild(link)
    })
  }
}

export const onRouteUpdate = ({ location }) => {
  // Only track pageviews if consent has been given or user is not in EEA
  if (typeof window !== "undefined" && (process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true")) {
    const consentStatus = localStorage.getItem("cookie_consent_eea")

    // Always send the pageview - Google Analytics will automatically respect
    // the consent settings that were previously set
    // This ensures measurement gaps are filled in for users who have granted consent
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
      // Add GDPR context parameters
      consent: consentStatus === "accepted" || consentStatus === "non_eea_user" ? "granted" : "denied",
    })

    // Capture pageview with PostHog (respects consent automatically)
    if (window.posthog) {
      window.posthog.capture('$pageview', {
        $current_url: window.location.href,
        path: location.pathname,
        referrer: document.referrer
      })
    }

    // Enhanced GA tracking for blog posts
    if (location.pathname.startsWith('/blog/') && window.gtag) {
      window.gtag('event', 'blog_page_view', {
        event_category: 'blog',
        page_path: location.pathname,
        page_title: document.title
      })
    }
  }
}
