/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function Seo({ description, title, lang = "en", keywords = [], children }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const defaultKeywords = ["spam call blocker", "block spam calls", "get paid to block calls", "stop spam calls", "spam blocker", "KarmaCall"]
  const metaKeywords = keywords.length > 0 ? keywords : defaultKeywords

  return (
    <Helmet htmlAttributes={{ lang }} title={title} titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}>
      <meta name="description" content={metaDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={metaKeywords.join(", ")} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.karmacall.com" />
      <meta property="og:image" content="https://www.karmacall.com/TwitterBanner-KarmaCall.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content="https://www.karmacall.com/TwitterBanner-KarmaCall.jpg" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://www.karmacall.com" />
      {children}
    </Helmet>
  )
}

export default Seo
