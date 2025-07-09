import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import "../../components/blog-mobile.css"
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
  title: "Job Scam Texts Cost Americans $470M in 2024 - Here's the Economic Solution",
  description:
    "Job scam texts were the #2 most common hoax in 2024, costing Americans nearly half a billion dollars. Discover how FynCom's refundable deposit technology makes mass scamming economically impossible while protecting legitimate job seekers.",
  author: "KarmaCall Team",
  date: "2024-06-07", // Format: YYYY-MM-DD
  featuredImage: "../../images/illustrations/inbox-money.png",

  // Core Topics, Audience Tags, Article Type, Technical/Concept Tags, Trends Tag, Product Tag
  keywords: [
    "job scams",
    "text scams",
    "ai",
    "fraud prevention",
    "refundable deposits",
    "nanodeposits",
    "economic solution",
    "spam",
    "phishing",
    "karmacall",
    "fyncom",
    "security",
  ],
  slug: "/blog/job-scam-texts-surge-2024", // Used for share tracking - update this to match your article's URL
}

//
// MAIN COMPONENT
//
export default function JobScamTextsSurge2024() {
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
      setMockShareCount(articleMetadata.slug, 120) // Mock 120 shares for testing

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

            {/* Featured image */}
            <FeaturedImage
              src={articleMetadata.featuredImage}
              alt={articleMetadata.title}
              imageDescription="Illustration showing the rising threat of AI-powered job scam texts and how economic solutions like refundable deposits can protect consumers."
              imageCredit="Security awareness illustration highlighting modern fraud prevention techniques."
            />

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
                  <strong>Job scam texts have exploded in 2024, becoming the second most common type of fraud after online shopping scams.</strong> Americans
                  lost over $470 million to job scams in 2023, and the numbers are climbing as AI makes these attacks more sophisticated and convincing.
                </p>

                <h2
                  id="the-scale-of-the-problem"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  The Scale of the Problem
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  Job scam texts have reached epidemic proportions in 2024. According to the Federal Trade Commission, Americans lost over{" "}
                  <strong>$470 million to job scams in 2023</strong>, and early data suggests 2024 will be even worse.
                </p>

                <h3
                  id="why-job-scams-work"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Why Job Scams Work So Well
                </h3>

                <p style={{ marginBottom: "1.5rem" }}>
                  Job scams exploit our most basic human needs: financial security and purpose. When someone is unemployed or underemployed, they're in a
                  vulnerable state. Scammers know this and craft messages that seem like lifelines.
                </p>

                <h2
                  id="ai-powered-scams"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  The AI Revolution in Fraud
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  What makes 2024 different is the integration of AI into scam operations. Modern job scam texts are no longer obviously fake. They're
                  personalized, professionally written, and often reference real companies and job markets.
                </p>

                <h3
                  id="personalization-at-scale"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Personalization at Scale
                </h3>

                <p style={{ marginBottom: "1.5rem" }}>
                  AI allows scammers to create thousands of unique, personalized messages per hour. They can reference your location, recent job applications,
                  and even your career history scraped from social media.
                </p>

                <h2
                  id="economic-solution"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  An Economic Solution to a Digital Problem
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  Traditional spam filters and blocking apps are losing the arms race against AI-powered scams. We need a fundamentally different approach—one
                  that makes scamming economically unsustainable.
                </p>

                <h3
                  id="refundable-deposits"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  The Power of Refundable Deposits
                </h3>

                <p style={{ marginBottom: "1.5rem" }}>
                  Imagine if every text message cost the sender a small, refundable deposit—say $0.01. For legitimate businesses, this cost is negligible and
                  gets refunded when you engage positively. For scammers sending millions of messages, it becomes prohibitively expensive.
                </p>

                <h2
                  id="karmacall-solution"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  How KarmaCall Protects You
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  KarmaCall implements this economic approach for phone calls and is expanding to text messages. When someone wants to contact you, they put up
                  a small deposit. If it's spam, you keep the money. If it's legitimate, they get it back.
                </p>

                <div
                  style={{
                    backgroundColor: "var(--color-background-alt, #f9f9f9)",
                    border: "1px solid var(--border-color, #eee)",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "var(--color-text, #333)" }}>
                    Example: Mass Scam Economics
                  </h4>
                  <p style={{ marginBottom: "0.5rem" }}>
                    <strong>Current cost:</strong> Send 1 million scam texts for ~$50
                  </p>
                  <p style={{ marginBottom: "0.5rem" }}>
                    <strong>With $0.25 deposits:</strong> Send 1 million texts for $250,000
                  </p>
                  <p style={{ marginBottom: "0" }}>
                    <strong>Result:</strong> Scamming becomes economically unviable
                  </p>
                </div>

                <h2
                  id="preserving-legitimate-communication"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Preserving Legitimate Communication
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  The beauty of refundable deposits is that they don't penalize legitimate senders.{" "}
                  <strong>Real job recruiters, businesses, and individuals get their money back when recipients engage positively.</strong> Only bad actors lose
                  their deposits.
                </p>

                <h3
                  id="legitimate-use-cases"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Legitimate Use Cases That Benefit
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Job recruiters</strong> reaching out to potential candidates
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Sales professionals</strong> making initial contact with prospects
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Emergency services</strong> contacting individuals in crisis situations
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Healthcare providers</strong> sending appointment reminders
                  </li>
                </ul>

                <h2
                  id="karmacall-implementation"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  KarmaCall's Implementation
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  KarmaCall is pioneering this approach for phone calls, and FynCom is developing the broader infrastructure for all types of digital
                  communication.{" "}
                  <strong>Our system makes it economically impossible to profit from mass scamming while rewarding users for protecting themselves.</strong>
                </p>

                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.fyncom.robocash"
                    className="learn-more-btn cash centered"
                    style={{
                      display: "inline-block",
                      textDecoration: "none",
                    }}
                  >
                    Try KarmaCall Today
                  </a>
                </div>
              </div>
            </div>
            {/* Related Articles Section */}
            <RelatedArticles currentArticleSlug={articleMetadata.slug} />
          </div>

          {/* Table of Contents Sidebar */}
          <TableOfContents title={articleMetadata.title} />
        </div>

        {/* Scroll-to-top button */}
        <ScrollToTop />
      </div>
    </Wrapper>
  )
}
