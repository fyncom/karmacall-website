/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

import ReactGA from "react-ga4"
import React from "react"
import CookieConsentEEA from "./src/components/CookieConsentEEA"

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
    // Initialize GA but tracking will be controlled by consent settings
    ReactGA.initialize(process.env.GATSBY_GOOGLE_TAG_ID)
  }
}

export const onRouteUpdate = ({ location }) => {
  // Only track pageviews if consent has been given or user is not in EEA
  if (typeof window !== "undefined" && 
      (process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true")) {
    
    const consentStatus = localStorage.getItem("cookie_consent_eea")
    
    // Only send analytics if user has accepted cookies or is not in EEA
    if (consentStatus === "accepted" || consentStatus === "non_eea_user") {
      ReactGA.send({ hitType: "pageview", page: location.pathname })
    }
  }
}
