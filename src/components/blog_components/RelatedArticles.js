import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { findRelatedArticles, articlesDatabase } from "../../utils/articleSimilarity"

const RelatedArticles = ({ currentArticleSlug, maxArticles = 3, className, style }) => {
  // Query all blog images
  const data = useStaticQuery(graphql`
    query RelatedArticlesImages {
      allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { in: ["blog", "illustrations"] } }) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED, formats: [AUTO, WEBP])
          }
        }
      }
    }
  `)

  // Extract filename from the src path and get Gatsby image
  const getImageFromSrc = srcPath => {
    if (!srcPath) return null

    // Extract the relative path from various possible formats
    let relativePath = srcPath
    if (srcPath.includes("../../images/")) {
      relativePath = srcPath.replace("../../images/", "")
    } else if (srcPath.includes("../images/")) {
      relativePath = srcPath.replace("../images/", "")
    } else if (srcPath.includes("images/")) {
      relativePath = srcPath.replace(/.*images\//, "")
    }

    // Find the matching image in our query results
    const imageNode = data.allFile.nodes.find(node => node.relativePath === relativePath)

    if (imageNode?.childImageSharp) {
      return getImage(imageNode.childImageSharp.gatsbyImageData)
    }

    return null
  }

  // Get similar articles and most recent article
  const similarArticles = findRelatedArticles(currentArticleSlug, maxArticles + 1, 10) // Get extra in case recent is in similar
  const mostRecentArticle = articlesDatabase.filter(article => article.slug !== currentArticleSlug).sort((a, b) => new Date(b.date) - new Date(a.date))[0]

  // Build the final related articles array with specific strategy
  const buildRelatedArticles = () => {
    const result = []

    // First 2 spots: most similar articles
    const topSimilar = similarArticles.slice(0, 2)
    result.push(...topSimilar)

    console.log(`📊 Added ${topSimilar.length} most similar articles to slots 1-2`)

    // 3rd spot: most recent article (unless already in first 2 spots)
    if (result.length < maxArticles && mostRecentArticle) {
      const alreadyIncluded = result.some(article => article.slug === mostRecentArticle.slug)

      if (!alreadyIncluded) {
        result.push({
          ...mostRecentArticle,
          isRecent: true, // Mark as recent for different styling/badge
        })
        console.log(`📅 Added most recent article "${mostRecentArticle.title}" to slot 3`)
      } else {
        // Most recent was already in similar articles, find next similar article
        const nextSimilar = similarArticles.find(article => !result.some(resultArticle => resultArticle.slug === article.slug))
        if (nextSimilar) {
          result.push(nextSimilar)
          console.log(`🔄 Most recent already included, added next similar article "${nextSimilar.title}" to slot 3`)
        }
      }
    }

    // Fill remaining slots with next most similar articles
    while (result.length < maxArticles) {
      const nextSimilar = similarArticles.find(article => !result.some(resultArticle => resultArticle.slug === article.slug))

      if (nextSimilar) {
        result.push(nextSimilar)
        console.log(`🔍 Added additional similar article "${nextSimilar.title}" to slot ${result.length}`)
      } else {
        // No more similar articles available
        break
      }
    }

    console.log(`✅ Final related articles (${result.length}/${maxArticles}):`)
    result.forEach((article, index) => {
      const badge = article.isRecent ? "RECENT" : "RELATED"
      console.log(`  ${index + 1}. ${article.title} (${badge})`)
    })

    return result
  }

  const relatedArticles = buildRelatedArticles()

  return (
    <div
      className={className}
      style={{
        marginTop: "4rem",
        paddingTop: "2rem",
        borderTop: "2px solid var(--border-color, #eee)",
        ...style,
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "600",
          marginBottom: "2rem",
          color: "var(--color-text, #333)",
          textAlign: "center",
        }}
      >
        Related Articles
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Render related articles */}
        {relatedArticles.map((article, index) => {
          const gatsbyImage = getImageFromSrc(article.image)

          // Function to calculate dynamic truncation based on title length
          const calculateDescriptionTruncation = (title, description) => {
            // Base character limit
            let baseLimit = 120

            // Reduce limit for longer titles to ensure proper spacing
            if (title.length > 80) {
              baseLimit = 80
            } else if (title.length > 60) {
              baseLimit = 100
            } else if (title.length > 40) {
              baseLimit = 110
            }

            // If description is already short enough, return as is
            if (description.length <= baseLimit) return description

            // Truncate and ensure we don't cut in the middle of a word
            const truncated = description.substring(0, baseLimit).trim()
            const lastSpace = truncated.lastIndexOf(" ")

            if (lastSpace > baseLimit * 0.8) {
              // If we can find a good word boundary
              return truncated.substring(0, lastSpace) + "..."
            }

            return truncated + "..."
          }

          // Calculate description truncation based on title length
          const truncatedDescription = calculateDescriptionTruncation(article.title, article.description)

          return (
            <a
              key={index}
              href={`${article.slug}?utm_source=blog_article&utm_medium=related_articles&utm_campaign=internal_linking`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                border: "1px solid var(--border-color, #eee)",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "all 0.2s ease",
                backgroundColor: "var(--color-background, white)",
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-4px)"
                e.target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)"
                e.target.style.borderColor = "var(--color-primary, #007acc)"
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)"
                e.target.style.borderColor = "var(--border-color, #eee)"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "4 / 3", // Force 4:3 aspect ratio to match main featured images
                  backgroundColor: "var(--color-background-alt, #f9f9f9)",
                  borderRadius: "8px 8px 0 0", // Only round top corners
                  overflow: "hidden",
                }}
              >
                {gatsbyImage ? (
                  <GatsbyImage
                    image={gatsbyImage}
                    alt={article.title}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    imgStyle={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url('${article.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}
              </div>
              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", height: "200px" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "var(--color-text, #333)",
                    lineHeight: "1.3",
                    wordBreak: "break-word",
                  }}
                >
                  {article.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-text-secondary, #666)",
                    lineHeight: "1.4",
                    margin: "0",
                    wordBreak: "break-word",
                    flex: "1",
                  }}
                >
                  {truncatedDescription}
                </p>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-secondary, #666)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.75rem",
                  }}
                >
                  <span style={{ textAlign: "left" }}>{article.author}</span>
                  <span style={{ textAlign: "right" }}>
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {article.isRecent && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        backgroundColor: "var(--color-primary, #007acc)",
                        color: "white",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        fontWeight: "500",
                      }}
                    >
                      Latest
                    </span>
                  </div>
                )}
              </div>
            </a>
          )
        })}

        {/* Show placeholders for remaining slots */}
        {Array.from({ length: maxArticles - relatedArticles.length }, (_, index) => (
          <div
            key={`placeholder-${index}`}
            style={{
              border: "2px dashed var(--border-color, #eee)",
              borderRadius: "8px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: "var(--color-background-alt, #f9f9f9)",
              height: "calc(200px + 4:3 aspect ratio height)", // Match the total height of real cards
              minHeight: "280px", // Ensure consistent height with image + content
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = "var(--color-primary, #007acc)"
              e.target.style.backgroundColor = "var(--color-background, white)"
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = "var(--border-color, #eee)"
              e.target.style.backgroundColor = "var(--color-background-alt, #f9f9f9)"
            }}
          >
            <div
              style={{
                fontSize: "1.8rem",
                marginBottom: "0.75rem",
                opacity: "0.5",
              }}
            >
              📝
            </div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "var(--color-text-secondary, #666)",
              }}
            >
              Coming Soon
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-secondary, #666)",
                margin: "0",
                lineHeight: "1.4",
              }}
            >
              More insightful articles about communication technology and digital privacy coming soon.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedArticles
