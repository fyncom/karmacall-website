import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const FeaturedImage = ({ src, alt, title, imageDescription, imageCredit, className, style, seo }) => {
  const data = useStaticQuery(graphql`
    query FeaturedImagePublicUrls {
      allFile(filter: { sourceInstanceName: { eq: "images" } }) {
        nodes {
          relativePath
          publicURL
        }
      }
    }
  `)
  const resolvePublicUrl = input => {
    if (!input) return null
    const pick = v => (v && v.publicURL) || (typeof v === "string" ? v : null)
    const candidate = pick(input)
    if (!candidate) return null
    if (/^https?:\/\//i.test(candidate)) return candidate
    if (candidate.includes("/images/")) {
      const relativePath = candidate.replace(/^.*images[\\\/]*/, "")
      const node = data?.allFile?.nodes?.find(n => n.relativePath === relativePath)
      return node?.publicURL || null
    }
    return candidate
  }
  const url = resolvePublicUrl(src) || resolvePublicUrl(seo && (seo.featuredImage || seo.image))
  if (!url) return null
  return (
    <div className={className} style={style}>
      <img
        src={url}
        alt={alt || title || "Featured image"}
        style={{ width: "100%", height: "auto", borderRadius: "6px", border: "1px solid var(--border-color, #eee)" }}
        loading="lazy"
      />
      {(imageDescription || imageCredit) && (
        <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary, #666)", marginTop: "0.5rem" }}>
          {imageDescription && (
            <p style={{ margin: 0 }}>
              <strong>Image description:</strong> {imageDescription}
            </p>
          )}
          {imageCredit && (
            <p style={{ margin: 0 }}>
              <strong>Credits:</strong> {imageCredit}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default FeaturedImage
