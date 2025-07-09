import React from "react"
import { findRelatedArticles, articlesDatabase } from "../../utils/articleSimilarity"

const RelatedArticles = ({ currentArticleSlug, maxArticles = 3, className, style }) => {
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

    // Fill remaining spots with similar articles if needed
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
      const badge = article.isRecent ? "RECENT" : `${article.similarityScore}% SIMILAR`
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
        {relatedArticles.map((article, index) => (
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
              e.target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12)"
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)"
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3", // Force 4:3 aspect ratio to match main featured images
                backgroundColor: "var(--color-background-alt, #f9f9f9)",
                backgroundImage: `url('${article.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "8px 8px 0 0", // Only round top corners
              }}
            />
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", height: "200px" }}>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "var(--color-text, #333)",
                  lineHeight: "1.3",
                }}
              >
                {article.title}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-text-secondary, #666)",
                  lineHeight: "1.4",
                  margin: "0 0 auto 0", // Push the date/author to bottom
                  flex: "1", // Take available space
                  overflow: "hidden",
                }}
              >
                {article.description.length > 140 ? `${article.description.substring(0, 140)}...` : article.description}
              </p>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-secondary, #666)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "0.75rem", // Fixed spacing from description
                }}
              >
                <span>
                  {new Date(article.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  • {article.author}
                </span>
                {(article.similarityScore || article.isRecent) && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      backgroundColor: article.isRecent ? "var(--color-primary, #007acc)" : "var(--color-background-alt, #f9f9f9)",
                      color: article.isRecent ? "white" : "var(--color-text-secondary, #666)",
                      padding: "2px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    {article.isRecent ? "Latest" : `${article.similarityScore}% match`}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}

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
