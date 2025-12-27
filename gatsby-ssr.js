/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

const React = require("react")

/**
 * Wrap the root element for SSR.
 */
exports.wrapRootElement = ({ element }) => {
  return element
}

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: `en` })
  setHeadComponents([
    <link key="favicon-ico" rel="icon" href="/favicon.ico" sizes="any" />,
    <link
      key="favicon-48"
      rel="icon"
      type="image/png"
      sizes="48x48"
      href="/icons/icon-48x48.png"
    />,
    <link
      key="favicon-32"
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/favicon-32x32.png"
    />,
  ])
}
