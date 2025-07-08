import React from "react"

const ArticleHeader = ({ articleData, className, style }) => {
  return (
    <div className={className} style={style}>
      {/* Header section with same width as main content */}
      <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        {/* Header content - same width as main content column */}
        <div style={{ flex: "1", minWidth: "0" }}>
          {/* Title */}
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              lineHeight: "1.2",
              marginBottom: "1rem",
              color: "var(--color-text, #333)",
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
            }}
          >
            <span className="blog-author">{articleData.author}</span>
            <span className="blog-date">
              {new Date(articleData.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
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
              }}
            >
              {articleData.description}
            </p>
          </div>
        </div>

        {/* Empty space to match sidebar width */}
        <div
          style={{
            width: "280px",
            flexShrink: 0,
          }}
        >
          {/* This empty div ensures the header content aligns with main content */}
        </div>
      </div>
    </div>
  )
}

export default ArticleHeader
