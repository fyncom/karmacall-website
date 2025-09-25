/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

const React = require("react")

/**
 * Wrap the root element with PostHogProvider for SSR
 * This should match the browser version but without client-side specific features
 */
exports.wrapRootElement = ({ element }) => {
  // On SSR, we just return the element without PostHog or CookieConsent
  // since these are client-side only components
  return element
}

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: `en` })
}