/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

const React = require("react")
const { PostHogProvider } = require("posthog-js/react")

/**
 * Wrap the root element with PostHogProvider for SSR
 */
exports.wrapRootElement = ({ element }) => {
  return (
    <PostHogProvider
      apiKey={process.env.GATSBY_POSTHOG_API_KEY}
      options={{
        api_host: process.env.GATSBY_POSTHOG_API_HOST,
        defaults: "2025-05-24",
        capture_exceptions: true, // This enables capturing exceptions using Error Tracking
        debug: process.env.NODE_ENV === "development",
      }}
    >
      {element}
    </PostHogProvider>
  )
}

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: `en` })
}