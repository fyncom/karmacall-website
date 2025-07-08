import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import { getShareCount, setMockShareCount } from "../../utils/shareCounter"
import { preloadUrls } from "../../utils/urlShortener"
import { generateTextSizeStyles, getFontSize } from "../../components/blog_components/FontSizeSystem"
import ArticleHeader from "../../components/blog_components/ArticleHeader"
import ActionBar from "../../components/blog_components/ActionBar"
import TableOfContents from "../../components/blog_components/TableOfContents"
import RelatedArticles from "../../components/blog_components/RelatedArticles"
import FeaturedImage from "../../components/blog_components/FeaturedImage"
import ScrollToTop from "../../components/blog_components/ScrollToTop"
import TextSizeControl from "../../components/blog_components/TextSizeControl"

// ============================================================
// ARTICLE METADATA - EDIT THIS SECTION FOR EACH NEW ARTICLE
// ============================================================
const articleMetadata = {
  title: "Comment Rate Limiting - Protecting Our Community",
  description: "Learn about our comment rate limiting system and how it helps maintain a healthy discussion environment.",
  author: "KarmaCall Team",
  date: "2024-12-20",
  featuredImage: null, // No featured image for this help page
  keywords: ["rate limiting", "comment moderation", "spam prevention", "community guidelines"],
  slug: "/blog/comment-rate-limiting-info", // Used for share tracking
}

//
// MAIN COMPONENT
//
export default function CommentRateLimitingInfo() {
  const [shareCount, setShareCount] = React.useState(0)
  const [textSize, setTextSize] = React.useState("medium")

  // Generate text size styles from centralized system
  const textSizeStyles = generateTextSizeStyles()

  const handleTextSizeChange = newSize => {
    setTextSize(newSize)
  }

  // Share count handling and text size initialization
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Scroll to top when component mounts (for navigation from other articles)
      window.scrollTo({ top: 0, behavior: "instant" })

      // Load saved text size preference
      const savedTextSize = localStorage.getItem("textSize")
      if (savedTextSize && ["small", "medium", "large"].includes(savedTextSize)) {
        setTextSize(savedTextSize)
      }

      const currentPath = window.location.pathname

      // Set mock data for testing (remove in production)
      setMockShareCount(articleMetadata.slug, 12) // Mock 12 shares for testing

      // Load current share count
      const currentCount = getShareCount(currentPath)
      setShareCount(currentCount)

      // Preload share URLs for better performance
      preloadUrls(currentPath)
    }
  }, [])

  const seo = {
    title: articleMetadata.title,
    description: articleMetadata.description,
    keywords: articleMetadata.keywords,
  }

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Article Header */}
        <ArticleHeader articleData={articleMetadata} />

        {/* Main content container with sidebar layout */}
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start", marginTop: "0.5rem", position: "relative" }}>
          {/* Main article content */}
          <div style={{ flex: "1", minWidth: "0" }}>
            {/* Action bar with share and comment buttons */}
            <ActionBar articleData={articleMetadata} shareCount={shareCount} onShareCountUpdate={setShareCount} />

            {/* Featured image - skip for this help page */}
            {articleMetadata.featuredImage && (
              <FeaturedImage
                src={articleMetadata.featuredImage}
                alt={articleMetadata.title}
                imageDescription="Comment rate limiting system interface."
                imageCredit="KarmaCall team interface design."
              />
            )}

            {/* Text Size Control */}
            <TextSizeControl currentSize={textSize} onSizeChange={handleTextSizeChange} />

            {/* Article content */}
            <div
              style={{
                ...textSizeStyles[textSize],
                color: "var(--color-text, #333)",
              }}
            >
              <style>
                {`
                  .article-content-${textSize} p,
                  .article-content-${textSize} li,
                  .article-content-${textSize} span,
                  .article-content-${textSize} div {
                    font-size: ${textSizeStyles[textSize].fontSize} !important;
                    line-height: ${textSizeStyles[textSize].lineHeight} !important;
                  }
                  .article-content-${textSize} h2 {
                    font-size: calc(${textSizeStyles[textSize].fontSize} * 1.45) !important;
                  }
                  .article-content-${textSize} h3 {
                    font-size: calc(${textSizeStyles[textSize].fontSize} * 1.18) !important;
                  }
                `}
              </style>
              <div className={`article-content-${textSize}`}>
                <p style={{ marginBottom: "1.5rem", fontWeight: "600" }}>
                  <strong>
                    Our comment rate limiting system is designed to create a healthy, respectful discussion environment while preventing spam and abuse.
                  </strong>{" "}
                  This guide explains how it works and how to make the most of our comment system.
                </p>

                <h2
                  id="why-rate-limiting"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Why Do We Limit Comments?
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  Rate limiting helps us maintain a quality discussion environment for everyone. Here's why we've implemented these measures:
                </p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Spam Prevention:</strong> Automated systems and bad actors often try to flood comment sections with repetitive or promotional
                    content.
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Quality Discussion:</strong> By encouraging thoughtful, spaced-out responses, we promote more meaningful conversations.
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Server Protection:</strong> Rate limiting helps prevent our servers from being overwhelmed by excessive requests.
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>User Experience:</strong> A cleaner comment section benefits everyone by reducing noise and improving readability.
                  </li>
                </ul>

                <h2
                  id="how-it-works"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  How It Works
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>Our rate limiting system is designed to be fair and transparent:</p>

                <div
                  style={{
                    backgroundColor: "var(--color-background-alt, #f9f9f9)",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    border: "1px solid var(--border-color, #eee)",
                  }}
                >
                  <h3
                    id="current-limits"
                    style={{
                      fontSize: getFontSize("h3", textSize),
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "var(--color-text, #333)",
                    }}
                  >
                    Current Limits
                  </h3>
                  <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <strong>3 comments</strong> per 1-minute window
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <strong>5-minute cooldown</strong> if limit is exceeded
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>Limits reset automatically after the time window</li>
                  </ul>
                </div>

                <h2
                  id="what-happens"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  What Happens When You Hit the Limit?
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>If you exceed the comment limit, here's what you can expect:</p>

                <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>The "Post Comment" button will be disabled and show "Rate Limited"</li>
                  <li style={{ marginBottom: "0.5rem" }}>A small info button (?) will appear next to the disabled button</li>
                  <li style={{ marginBottom: "0.5rem" }}>You'll need to wait for the cooldown period to expire</li>
                  <li style={{ marginBottom: "0.5rem" }}>The system will automatically re-enable commenting when you're ready</li>
                </ol>

                <h2
                  id="best-practices"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Best Practices for Commenting
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>To make the most of our comment system and avoid hitting limits:</p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Take your time:</strong> Craft thoughtful responses rather than rapid-fire comments
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Edit before posting:</strong> Review your comment before submitting to avoid needing corrections
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Combine thoughts:</strong> If you have multiple points, consider putting them in a single comment
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Be respectful:</strong> Quality over quantity leads to better discussions
                  </li>
                </ul>

                <h2
                  id="technical-details"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Technical Details
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>For those interested in the technical implementation:</p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Rate limiting is tracked per user account</li>
                  <li style={{ marginBottom: "0.5rem" }}>Limits are stored locally and reset automatically</li>
                  <li style={{ marginBottom: "0.5rem" }}>The system uses a sliding window approach for fairness</li>
                  <li style={{ marginBottom: "0.5rem" }}>No permanent penalties - limits always reset</li>
                </ul>

                <div
                  style={{
                    backgroundColor: "var(--color-background-alt, #f9f9f9)",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    marginTop: "2rem",
                    border: "1px solid var(--border-color, #eee)",
                  }}
                >
                  <h3
                    id="need-help"
                    style={{
                      fontSize: getFontSize("h3", textSize),
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "var(--color-text, #333)",
                    }}
                  >
                    Need Help?
                  </h3>
                  <p style={{ margin: 0, color: "var(--color-text, #333)" }}>
                    If you're experiencing issues with the comment system or have questions about our rate limiting policy, please reach out to us at{" "}
                    <a href="mailto:support@karmacall.com" style={{ color: "var(--color-link, #007bff)", fontWeight: "600" }}>
                      support@karmacall.com
                    </a>
                    . We're here to help ensure everyone has a positive experience in our community.
                  </p>
                </div>

                <div style={{ marginTop: "3rem", textAlign: "center" }}>
                  <button
                    onClick={() => window.close()}
                    style={{
                      padding: "0.75rem 2rem",
                      backgroundColor: "var(--color-primary, #007acc)",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "1rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseOver={e => {
                      e.target.style.backgroundColor = "var(--color-primary-dark, #005a9e)"
                    }}
                    onMouseOut={e => {
                      e.target.style.backgroundColor = "var(--color-primary, #007acc)"
                    }}
                    onFocus={e => {
                      e.target.style.backgroundColor = "var(--color-primary-dark, #005a9e)"
                    }}
                    onBlur={e => {
                      e.target.style.backgroundColor = "var(--color-primary, #007acc)"
                    }}
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Table of Contents */}
          <TableOfContents title="Contents" />
        </div>

        {/* Related Articles - skip for this help page */}
        {/* <RelatedArticles currentArticle={articleMetadata} /> */}

        {/* Scroll to top button */}
        <ScrollToTop />
      </div>
    </Wrapper>
  )
}
