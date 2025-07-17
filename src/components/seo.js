/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import "../utils/accessibility.css"

function Seo({ description, title, lang = "en", keywords = [], children, pathname = "", image = "" }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const defaultKeywords = [
    "spam call blocker",
    "block spam calls",
    "get paid to block calls",
    "stop spam calls",
    "spam blocker",
    "KarmaCall",
    "scam call blocker",
    "robocall blocker",
  ]
  const metaKeywords = keywords.length > 0 ? keywords : defaultKeywords
  const canonical = pathname ? `${site.siteMetadata.siteUrl}${pathname}` : site.siteMetadata.siteUrl

  // Enhanced image handling for GraphQL frontmatter
  const socialImage = (() => {
    if (image) {
      // Handle GraphQL image objects with publicURL
      if (typeof image === "object" && image.publicURL) {
        return `${site.siteMetadata.siteUrl}${image.publicURL}`
      }
      // Handle direct image paths
      if (typeof image === "string") {
        return image.startsWith("http")
          ? image
          : `${site.siteMetadata.siteUrl}${image}`
      }
    }
    // Default fallback
    return `${site.siteMetadata.siteUrl}/static/karmacall-logo.png`
  })()

  return (
    <Helmet htmlAttributes={{ lang }} title={title} titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}>
      <meta name="description" content={metaDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={metaKeywords.join(", ")} />
      <meta name="author" content={site.siteMetadata?.author || ``} />
      <meta name="color-scheme" content="light dark" />
      <meta name="theme-color" content="#008080" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#003554" media="(prefers-color-scheme: dark)" />

      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="KarmaCall" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@GetKarmaCall" />
      <meta name="twitter:site" content="@GetKarmaCall" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Robots and canonical */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />

      {/* Additional SEO tags */}
      <meta name="application-name" content="KarmaCall" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="KarmaCall" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />

      {children}
    </Helmet>
  )
}

export default Seo
