import React from "react"

const RelatedArticles = ({ currentArticleSlug, className, style }) => {
  // Hardcoded articles for now - could be made dynamic later
  const articles = [
    {
      slug: "/blog/future-of-spam-blocking",
      title: "Get Cash Back for Blocking Spam, with KarmaCall Version 4.0",
      description:
        "KarmaCall 4.0 is a revolutionary new app that pays you to block spam calls. With its fresh new UI and infinitely long call blocking capability...",
      date: "March 11, 2024",
      author: "KarmaCall Team",
      image: "../../images/blog/interactive-rewards-blog-social-graphic.jpg",
    },
    {
      slug: "/blog/job-scam-texts-surge-2024",
      title: "Job Scam Texts Cost Americans $470M in 2024 - Here's the Economic Solution",
      description:
        "Job scam texts were the #2 most common hoax in 2024, costing Americans nearly half a billion dollars. Discover how FynCom's refundable deposit technology...",
      date: "June 7, 2024",
      author: "KarmaCall Team",
      image: "../../images/illustrations/inbox-money.png",
    },
  ]

  // Filter out the current article
  const relatedArticles = articles.filter(article => article.slug !== currentArticleSlug)

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
                height: "140px",
                backgroundColor: "var(--color-background-alt, #f9f9f9)",
                backgroundImage: `url('${article.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div style={{ padding: "1rem" }}>
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
                  margin: "0 0 0.75rem 0",
                }}
              >
                {article.description}
              </p>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-secondary, #666)",
                }}
              >
                {article.date} • {article.author}
              </div>
            </div>
          </a>
        ))}

        {/* Show placeholder if we need more articles to fill the grid */}
        {relatedArticles.length < 3 && (
          <div
            style={{
              border: "2px dashed var(--border-color, #eee)",
              borderRadius: "8px",
              padding: "1.5rem",
              textAlign: "center",
              backgroundColor: "var(--color-background-alt, #f9f9f9)",
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
              }}
            >
              More insightful articles about communication technology and digital privacy coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RelatedArticles
