/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
 */

import React from "react"
import CookieConsentEEA from "./src/components/CookieConsentEEA"
import { trackPageView } from "./src/utils/analyticsLoader"
// Implement replaceHydrateFunction to use React 18's createRoot API
// This helps resolve hydration issues by using React's concurrent rendering
import ReactDOM from "react-dom/client"

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

export const onClientEntry = () => {
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
  if (typeof window === "undefined") return
  trackPageView(location.pathname)
}

export const replaceHydrateFunction = () => {
  return (element, container) => {
    const root = ReactDOM.createRoot(container)
    root.render(element)
  }
}
