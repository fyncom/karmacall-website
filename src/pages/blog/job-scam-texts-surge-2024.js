import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import { getShareCount, setMockShareCount } from "../../utils/shareCounter"
import { preloadUrls } from "../../utils/urlShortener"
import ArticleHeader from "../../components/ArticleHeader"
import ActionBar from "../../components/ActionBar"
import TableOfContents from "../../components/TableOfContents"
import RelatedArticles from "../../components/RelatedArticles"
import FeaturedImage from "../../components/FeaturedImage"
import ScrollToTop from "../../components/ScrollToTop"

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

  // Share count handling
  React.useEffect(() => {
    if (typeof window !== "undefined") {
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
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            />

            {/* Article content */}
            <div
              style={{
                lineHeight: "1.7",
                fontSize: "1.1rem",
                color: "var(--color-text, #333)",
              }}
            >
              <p style={{ marginBottom: "1.5rem", fontWeight: "600", fontSize: "1.2rem" }}>
                <strong>Job scam texts have exploded in 2024, becoming the second most common type of fraud after online shopping scams.</strong> Americans lost
                nearly $470 million to employment scams this year, with text-based schemes leading the charge.
              </p>

              <h2
                id="the-scale-of-the-problem"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                The Scale of the Problem
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                According to the Federal Trade Commission's latest data, job scam losses have increased by 250% since 2020.{" "}
                <strong>Text messages have become the preferred delivery method for scammers</strong> because they're cheap to send, hard to trace, and appear
                more personal than email.
              </p>

              <h3
                id="common-tactics"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Common Scam Tactics
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Work-from-home opportunities</strong> that require upfront payments for "training materials"
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Fake job postings</strong> on legitimate job boards that redirect to scam websites
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Identity theft schemes</strong> disguised as employment verification processes
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Cryptocurrency "opportunities"</strong> that promise unrealistic returns
                </li>
              </ul>

              <h2
                id="why-traditional-solutions-fail"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Why Traditional Solutions Fail
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                Current anti-spam measures are playing catch-up in an arms race they can't win.{" "}
                <strong>Scammers adapt faster than filters can be updated.</strong> They use AI to create more convincing messages, rotate through phone numbers
                rapidly, and exploit the fact that legitimate job opportunities also come from unknown numbers.
              </p>

              <h3
                id="the-ai-advantage"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                The AI Advantage for Scammers
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                Artificial intelligence has given scammers unprecedented capabilities. They can now generate personalized messages at scale, create convincing
                fake company profiles, and even conduct voice conversations that sound human.{" "}
                <strong>Traditional keyword-based filtering simply can't keep up.</strong>
              </p>

              <h2
                id="the-economic-solution"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                The Economic Solution: Refundable Deposits
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                <strong>What if every unsolicited message required a small, refundable deposit?</strong> This simple economic mechanism could eliminate mass
                scamming while preserving legitimate communication.
              </p>

              <h3
                id="how-it-works"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                How Refundable Deposits Work
              </h3>

              <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Sender deposits money</strong> before sending a message to an unknown recipient
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Recipient decides</strong> whether the message is legitimate or spam
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Legitimate senders get refunded</strong> automatically when the recipient engages positively
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Spam senders lose their deposit</strong>, which goes to the recipient as compensation
                </li>
              </ol>

              <h3
                id="economic-impact"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                The Economic Impact on Scammers
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                Scammers rely on volume. They send millions of messages because even a tiny response rate is profitable when the cost per message is essentially
                zero. <strong>Requiring even a $0.25 deposit makes mass scamming economically impossible.</strong>
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
                <h4 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "var(--color-text, #333)" }}>Example: Mass Scam Economics</h4>
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
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
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
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
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
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
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
