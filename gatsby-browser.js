/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

// You can delete this file if you're not using it
import posthog from "posthog-js"

export const onRouteUpdate = ({ location }) => {
  // Track page views on route change
  if (typeof posthog !== "undefined") {
    posthog.capture("$pageview")
  }
}
