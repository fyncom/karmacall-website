import React from "react"

const ArticleHeader = ({ articleData, className, style, reserveSidebarSpace = true }) => {
  const formatDate = dateValue => {
    if (!dateValue) return null
    if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const [y, m, d] = dateValue.split("-").map(Number)
      try {
        return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
      } catch (e) {
        return dateValue
      }
    }
    try {
      return new Date(dateValue).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    } catch (e) {
      return String(dateValue)
    }
  }

  const displayDate = (articleData && (articleData.dateDisplay || formatDate(articleData.date))) || null

  return (
    <div className={className} style={style}>
      {/* Responsive header layout */}
      <div
        className="article-header-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Add responsive styles */}
        <style>
          {`
            @media (min-width: 768px) {
              .article-header-container {
                flex-direction: row !important;
                gap: 3rem !important;
                align-items: flex-start !important;
              }
              .article-header-content {
                flex: 1 !important;
                min-width: 0 !important;
              }
              .article-header-spacer {
                display: block !important;
              }
            }
          `}
        </style>

        {/* Header content */}
        <div
          className="article-header-content"
          style={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              lineHeight: "1.2",
              marginBottom: "1rem",
              color: "var(--color-text, #333)",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              hyphens: "auto",
            }}
          >
            {articleData.title}
          </h1>

          {/* Meta information */}
          <div
            className="blog-meta"
            style={{
              marginBottom: "2rem",
              fontSize: "1rem",
              borderBottom: "1px solid var(--border-color, #eee)",
              paddingBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span className="blog-author" style={{ textAlign: "left" }}>
              {articleData.author}
            </span>
            <span className="blog-date" style={{ textAlign: "right" }}>
              {displayDate}
            </span>
          </div>

          {/* Article summary/blurb */}
          <div
            style={{
              marginBottom: "0",
            }}
          >
            <p
              style={{
                fontSize: "1.2rem",
                lineHeight: "1.6",
                color: "var(--color-text-secondary, #666)",
                fontStyle: "italic",
                marginBottom: "0",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {articleData.description}
            </p>
          </div>
        </div>

        {/* Desktop spacer - hidden on mobile */}
        {reserveSidebarSpace && (
          <div
            className="article-header-spacer"
            style={{
              width: "280px",
              flexShrink: 0,
              display: "none",
            }}
          ></div>
        )}
      </div>
    </div>
  )
}

export default ArticleHeader
