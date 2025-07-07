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

// ============================================================
// ARTICLE METADATA - EDIT THIS SECTION FOR EACH NEW ARTICLE
// ============================================================
const articleMetadata = {
  title: "Get Cash Back for Blocking Spam, with KarmaCall Version 4.0",
  description:
    "KarmaCall 4.0 is a revolutionary new app that pays you to block spam calls. With its fresh new UI and infinitely long call blocking capability, KarmaCall 4.0 is the ultimate solution for protecting your privacy and earning cash back.",
  author: "KarmaCall Team",
  date: "2024-03-11", // Format: YYYY-MM-DD
  featuredImage: "../../images/blog/interactive-rewards-blog-social-graphic.jpg",

  // Core Topics, Audience Tags, Article Type, Technical/Concept Tags, Trends Tag, Product Tag
  keywords: [
    "karmacall",
    "spam blocking",
    "app",
    "version 4.0",
    "cash back",
    "rewards",
    "call protection",
    "android",
    "ios",
    "beta",
    "flow state",
    "micro-distractions",
  ],
  slug: "/blog/future-of-spam-blocking", // Used for share tracking - update this to match your article's URL
}

//
// MAIN COMPONENT
//
export default function FutureOfSpamBlocking() {
  const [shareCount, setShareCount] = React.useState(0)
  const [showScrollToTop, setShowScrollToTop] = React.useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Share count and scroll handling
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname

      // Set mock data for testing (remove in production)
      setMockShareCount(articleMetadata.slug, 85) // Mock 85 shares for testing

      // Load current share count
      const currentCount = getShareCount(currentPath)
      setShareCount(currentCount)

      // Preload share URLs for better performance
      preloadUrls(currentPath)

      // Handle scroll events for scroll-to-top button
      const timer = setTimeout(() => {
        const handleScroll = () => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          setShowScrollToTop(scrollTop > 300) // Show button after scrolling 300px
        }

        window.addEventListener("scroll", handleScroll)

        // Cleanup scroll listener
        return () => {
          window.removeEventListener("scroll", handleScroll)
        }
      }, 250) // Delay to ensure page is fully loaded

      return () => clearTimeout(timer)
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
                <strong>It's here! KarmaCall 4.0 is out, with a fresh new UI and infinitely long call blocking capability.</strong> You'll need to sign up to
                our Beta in the Google Play Store.
              </p>

              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <a
                  href="https://play.google.com/store/apps/details?id=com.fyncom.robocash"
                  className="learn-more-btn cash centered"
                  style={{
                    display: "inline-block",
                    textDecoration: "none",
                  }}
                >
                  Sign up for the beta today!
                </a>
              </div>

              <h2
                id="biggest-additions"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                The Two Biggest Additions
              </h2>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Persistent reliability of spam/scam call protection</strong>
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>No visual foreground notification is necessary anymore</strong>
                </li>
              </ul>

              <p style={{ marginBottom: "1.5rem" }}>
                The thing that excites me most, is being able to focus on adding new features that are applied to both iOS and Android at the same time. We're
                not there yet, but our team has gotten so much stronger in our front-end skills.
              </p>

              <h2
                id="version-roadmap"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Version Roadmap
              </h2>

              <h3 id="v400" style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}>
                v4.0.0 - Android Test Track
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                <strong>v4.0.0 is released on a test track for Android. Testers will enjoy its main features:</strong> (persistent call blocking and rewards
                payouts per call) while we work on completing the secondary features (referrals, call history management, reward redemptions, etc.).
              </p>

              <h3 id="v410" style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}>
                v4.1.0 - Complete Android Version
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                <strong>v4.1.0 will be reserved for the fully complete version on Android.</strong>
              </p>

              <h3 id="v420" style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}>
                v4.2.0 - iOS Production Ready
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                <strong>v4.2.0 will bring our iOS app up to production.</strong> At that point, we'll be fully on Kotlin Multiplatform and can focus on bringing
                the long awaited features, such as...
              </p>

              <h2
                id="upcoming-features"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Upcoming Features
              </h2>

              <h3
                id="custom-rates"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Custom Rates for Different Senders
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                <strong>Set your own rates for different types of callers.</strong> Want to charge telemarketers $50 but only charge your dentist $1? You'll be
                able to do that.
              </p>

              <h3
                id="flow-state-protection"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Flow State Protection
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                One of the most important aspects of KarmaCall is protecting your flow state.{" "}
                <strong>
                  Flow state is that magical zone where you're completely absorbed in your work, creativity flows effortlessly, and you lose track of time.
                </strong>{" "}
                It's when you do your best work, solve complex problems, and feel most fulfilled.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                But flow state is fragile. <strong>A single interruption can shatter hours of deep work.</strong> Research shows it takes an average of 23
                minutes to fully refocus after an interruption. For knowledge workers, this means spam calls aren't just annoying – they're productivity
                killers.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                KarmaCall's upcoming Flow State Protection feature will learn your work patterns and automatically adjust protection levels. During your most
                productive hours, even legitimate calls will require higher deposits to reach you. <strong>Because your flow state is worth protecting.</strong>
              </p>

              <h2
                id="philosophy"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Our Philosophy: Eliminating Micro-Distractions
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                We believe that <strong>micro-distractions are the silent productivity killer of our time.</strong> It's not just the big interruptions that
                matter – it's the constant low-level anxiety of knowing your phone might ring at any moment with a spam call.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                Even when you don't answer spam calls, they create what we call "cognitive overhead" – a background mental load that reduces your ability to
                focus deeply. <strong>KarmaCall eliminates this overhead entirely.</strong>
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                When you know that every call reaching your phone has paid to be there, you can answer with confidence. No more screening calls, no more anxiety
                about interruptions, no more broken flow states. <strong>Just pure, uninterrupted focus when you need it most.</strong>
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
                  Download KarmaCall 4.0 Beta
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
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            style={{
              position: "fixed",
              top: "2rem",
              left: "calc(50% - 600px - 6rem)",
              backgroundColor: "transparent",
              border: "1.5px solid var(--border-color, #eee)",
              borderRadius: "6px",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              zIndex: 100,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "0.9rem",
              color: "var(--color-text, #333)",
            }}
            title="Scroll to top"
          >
            ⬆
          </button>
        )}
      </div>
    </Wrapper>
  )
}
