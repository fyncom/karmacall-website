/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

import ReactGA from "react-ga4"

// Initialize ReactGA with your Google Analytics measurement ID
export const onClientEntry = () => {
  // Only initialize in production or if debug mode is enabled
  if (process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true") {
    ReactGA.initialize(process.env.GATSBY_GOOGLE_TAG_ID)
  }
}

export const onRouteUpdate = ({ location }) => {
  // Track pageviews on route changes
  if (process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true") {
    ReactGA.send({ hitType: "pageview", page: location.pathname })
  }
}

// You can delete this file if you're not using it
