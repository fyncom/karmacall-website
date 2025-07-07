import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import { createShortUrl, preloadUrls } from "../../utils/urlShortener"
import { getShareCount, incrementShareCount, formatShareCount, setMockShareCount } from "../../utils/shareCounter"

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
  const [showShareDialog, setShowShareDialog] = React.useState(false)
  const [linkCopied, setLinkCopied] = React.useState(false)
  const [shareCount, setShareCount] = React.useState(0)
  const [tocCollapsed, setTocCollapsed] = React.useState(false)
  const [showScrollToTop, setShowScrollToTop] = React.useState(false)
  const [headings, setHeadings] = React.useState([])

  const handleShare = () => {
    setShowShareDialog(!showShareDialog)
  }

  const handleCloseShare = () => {
    setShowShareDialog(false)
    setLinkCopied(false) // Reset copied state when dialog closes
  }

  const toggleToc = () => {
    setTocCollapsed(!tocCollapsed)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleShareAction = platform => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : articleMetadata.slug
    incrementShareCount(currentPath)
    const newCount = getShareCount(currentPath)
    setShareCount(newCount)
  }

  // Generate table of contents from headings
  React.useEffect(() => {
    const generateTOC = () => {
      if (typeof window !== "undefined") {
        // Find all H2 and H3 elements with IDs in document order
        const allHeadings = Array.from(document.querySelectorAll("h2[id], h3[id]"))

        const headingsList = []
        let currentH2 = null

        allHeadings.forEach(heading => {
          if (heading.tagName === "H2") {
            // Start a new H2 section
            currentH2 = {
              id: heading.id,
              text: heading.textContent,
              level: 2,
              children: [],
            }
            headingsList.push(currentH2)
          } else if (heading.tagName === "H3" && currentH2) {
            // Add H3 as child of current H2
            currentH2.children.push({
              id: heading.id,
              text: heading.textContent,
              level: 3,
            })
          } else if (heading.tagName === "H3") {
            // H3 without parent H2 (standalone)
            headingsList.push({
              id: heading.id,
              text: heading.textContent,
              level: 3,
              children: [],
            })
          }
        })

        setHeadings(headingsList)
      }
    }

    // Generate TOC after component mounts and when content changes
    const timer = setTimeout(generateTOC, 100)
    return () => clearTimeout(timer)
  }, [])

  // Share count and scroll handling
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

  const copyToClipboard = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const currentUrl = window.location.href.split("?")[0] // Remove existing params
      const shortUrl = createShortUrl(currentUrl, "copy_link")
      navigator.clipboard.writeText(shortUrl)
      setLinkCopied(true)

      // Increment share count
      handleShareAction("copy_link")

      // Get stored UTM data for enhanced tracking
      const storedUTM = sessionStorage.getItem("utm_data")
      const utmData = storedUTM ? JSON.parse(storedUTM) : {}

      // Track with Google Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "share", {
          method: "copy_link",
          content_type: "blog_post",
          item_id: window.location.pathname,
          // Include original UTM data to track full journey
          original_utm_source: utmData.source || null,
          original_utm_medium: utmData.medium || null,
          original_utm_campaign: utmData.campaign || null,
        })
      }
    }
  }

  const shareOptions = [
    {
      name: linkCopied ? "Link Copied" : "Copy Link",
      icon: "🔗",
      action: copyToClipboard,
      isSuccess: linkCopied,
    },
    {
      name: "Email",
      icon: "📧",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          const shortUrl = createShortUrl(currentUrl, "email")
          window.open(`mailto:?subject=Check out this article&body=${shortUrl}`)

          handleShareAction("email")

          // Get stored UTM data for enhanced tracking
          const storedUTM = sessionStorage.getItem("utm_data")
          const utmData = storedUTM ? JSON.parse(storedUTM) : {}

          // Track with Google Analytics
          if (window.gtag) {
            window.gtag("event", "share", {
              method: "email",
              content_type: "blog_post",
              item_id: window.location.pathname,
              // Include original UTM data to track full journey
              original_utm_source: utmData.source || null,
              original_utm_medium: utmData.medium || null,
              original_utm_campaign: utmData.campaign || null,
            })
          }
        }
      },
    },
    {
      name: "Facebook",
      icon: "📘",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          const shortUrl = createShortUrl(currentUrl, "facebook")
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`)

          // Increment share count
          handleShareAction("facebook")

          // Track with Google Analytics
          if (window.gtag) {
            window.gtag("event", "share", {
              method: "facebook",
              content_type: "blog_post",
              item_id: window.location.pathname,
            })
          }
        }
      },
    },
    {
      name: "X / Twitter",
      icon: "🐦",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          const shortUrl = createShortUrl(currentUrl, "twitter")
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shortUrl)}&text=Check out this article`)

          // Increment share count
          handleShareAction("twitter")

          // Track with Google Analytics
          if (window.gtag) {
            window.gtag("event", "share", {
              method: "twitter",
              content_type: "blog_post",
              item_id: window.location.pathname,
            })
          }
        }
      },
    },
    {
      name: "LinkedIn",
      icon: "💼",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          const shortUrl = createShortUrl(currentUrl, "linkedin")
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shortUrl)}`)

          // Increment share count
          handleShareAction("linkedin")

          // Track with Google Analytics
          if (window.gtag) {
            window.gtag("event", "share", {
              method: "linkedin",
              content_type: "blog_post",
              item_id: window.location.pathname,
            })
          }
        }
      },
    },
    {
      name: "Reddit",
      icon: "🤖",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          const shortUrl = createShortUrl(currentUrl, "reddit")
          window.open(`https://reddit.com/submit?url=${encodeURIComponent(shortUrl)}&title=Check out this article`)

          // Increment share count
          handleShareAction("reddit")

          // Track with Google Analytics
          if (window.gtag) {
            window.gtag("event", "share", {
              method: "reddit",
              content_type: "blog_post",
              item_id: window.location.pathname,
            })
          }
        }
      },
    },
    {
      name: "Bluesky",
      icon: "🦋",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          const shortUrl = createShortUrl(currentUrl, "bluesky")
          window.open(`https://bsky.app/intent/compose?text=Check out this article: ${encodeURIComponent(shortUrl)}`)

          // Increment share count
          handleShareAction("bluesky")

          // Track with Google Analytics
          if (window.gtag) {
            window.gtag("event", "share", {
              method: "bluesky",
              content_type: "blog_post",
              item_id: window.location.pathname,
            })
          }
        }
      },
    },
  ]

  // SEO metadata using articleMetadata
  const seo = {
    title: articleMetadata.title,
    description: articleMetadata.description,
    keywords: articleMetadata.keywords,
  }

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
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
              {articleMetadata.title}
            </h1>

            {/* Meta information */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
                fontSize: "0.9rem",
                color: "var(--color-text-secondary, #666)",
              }}
            >
              <span className="blog-author">{articleMetadata.author}</span>
              <span>•</span>
              <span className="blog-date">
                {new Date(articleMetadata.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: "1.2rem",
                lineHeight: "1.6",
                color: "var(--color-text-secondary, #666)",
                marginBottom: "1.5rem",
              }}
            >
              {articleMetadata.description}
            </p>

            {/* Share section */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <button
                onClick={handleShare}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                }}
                onMouseEnter={e => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)"
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)"
                }}
              >
                Share Article
              </button>

              {shareCount > 0 && <span style={{ color: "var(--color-text-secondary, #666)", fontSize: "0.9rem" }}>{formatShareCount(shareCount)} shares</span>}
            </div>
          </div>

          {/* Sidebar placeholder for desktop alignment */}
          <div style={{ width: "280px", flexShrink: 0 }} />
        </div>

        {/* Main content area with sidebar */}
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start" }}>
          {/* Main content */}
          <div style={{ flex: "1", minWidth: "0" }}>
            {/* Featured image */}
            {articleMetadata.featuredImage && (
              <div style={{ marginBottom: "2rem" }}>
                <img
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
              </div>
            )}

            {/* Article content */}
            <div
              style={{
                lineHeight: "1.7",
                fontSize: "1.1rem",
                color: "var(--color-text, #333)",
              }}
            >
              <p style={{ marginBottom: "1.5rem", fontWeight: "600", fontSize: "1.2rem" }}>
                The numbers are staggering. According to the Federal Trade Commission and LinkedIn reporting, Americans lost <strong>$470 million</strong> to
                text scams in 2024 alone. Job scam texts ranked as the <strong>second most common type of hoax</strong>, trailing only fake package delivery
                notifications.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                But here's what's even more concerning: <strong>it's about to get worse</strong>.
              </p>

              <h2
                id="perfect-storm"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                The Perfect Storm: AI + Economic Desperation = Infinite Scams
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>The convergence of several trends has created the ideal environment for job scam texts to explode:</p>

              <h3
                id="rocky-labor-market"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                1. Rocky Labor Market
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                With layoffs increasing and hiring slowing down, job seekers are more desperate and vulnerable to too-good-to-be-true offers.
              </p>

              <h3
                id="ai-personalization"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                2. AI-Powered Personalization
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                Scammers now use sophisticated AI to create highly personalized messages that appear legitimate, making it harder for victims to spot red flags.
              </p>

              <h3
                id="gen-z-targeting"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                3. Gen Z Targeting
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                Young job seekers, who grew up with digital communications, are ironically more susceptible to these sophisticated digital scams.
              </p>

              <h3
                id="zero-cost-scale"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                4. Zero Cost to Scale
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                Here's the core problem: <strong>sending texts costs virtually nothing</strong>. Scammers can blast millions of messages for pennies, making
                even a 0.01% success rate profitable.
              </p>

              <h2
                id="economic-solution"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                The Economic Solution: Refundable Deposits
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                KarmaCall's approach is fundamentally different. Instead of trying to identify scam content (which AI makes increasingly difficult), we address
                the economic root cause.
              </p>

              <h3
                id="how-it-works"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                How It Works:
              </h3>

              <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Legitimate Communication:</strong> Real recruiters and employers can afford a tiny refundable nanoDeposit per message
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Refund on Engagement:</strong> When the recipient responds three or more times, we consider this legitimate communication, so the
                  deposit is refunded
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Penalty for Low Engagement:</strong> If there are only 1-2 responses, the sender loses the deposit (indicating likely unwanted
                  communication)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>No Penalty for No Response:</strong> Zero responses result in no penalty - people are busy and non-response doesn't indicate spam
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Network Effect:</strong> As adoption grows, this system naturally filters out mass unwanted messaging
                </li>
              </ol>

              <p style={{ marginBottom: "1.5rem", fontStyle: "italic" }}>
                <strong>User Control:</strong> The response threshold (default: 3 responses) is adjustable by each user based on their communication
                preferences.
              </p>

              <h2
                id="network-effect"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                The Network Effect: Why This Works at Scale
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>As more people adopt deposit-based communication:</p>

              <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Legitimate businesses adapt</strong> (they already pay for advertising and outreach)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Scammers are priced out</strong> (their business model breaks)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Communication value increases</strong> (recipients know senders are invested)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Trust is restored</strong> (economic skin in the game creates accountability)
                </li>
              </ol>

              <h2
                id="call-to-action"
                style={{ fontSize: "1.8rem", fontWeight: "600", marginTop: "2.5rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Taking Action
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                If you're tired of job scam texts, romance scams, and endless digital fraud, there's something you can do:
              </p>

              <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Support deposit-based communication</strong> systems
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Advocate for economic solutions</strong> to digital fraud
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Share this post</strong> to raise awareness about root-cause solutions
                </li>
              </ol>

              <p style={{ marginBottom: "1.5rem" }}>
                The scammers who stole $470 million in 2024 are counting on us to keep treating symptoms instead of causes.
              </p>

              <p style={{ marginBottom: "1.5rem", fontWeight: "600", fontSize: "1.2rem" }}>
                <strong>Let's prove them wrong.</strong>
              </p>

              <div style={{ textAlign: "center", marginTop: "2rem", marginBottom: "2rem" }}>
                <a
                  href="/make-a-deposit"
                  className="learn-more-btn cash centered"
                  style={{
                    display: "inline-block",
                    textDecoration: "none",
                  }}
                >
                  Learn More About FynCom's Solution
                </a>
              </div>

              <div
                style={{
                  backgroundColor: "var(--color-background-alt, #f9f9f9)",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginTop: "2rem",
                  borderLeft: "4px solid #007acc",
                  fontStyle: "italic",
                }}
              >
                <p style={{ margin: "0", color: "var(--color-text, #333)" }}>
                  <em>
                    The job scam text surge of 2024 isn't just a security problem—it's an economic problem that requires an economic solution. When we change
                    the math, we change the game.
                  </em>
                </p>
              </div>
            </div>

            {/* Related Articles Section */}
            <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--border-color, #eee)" }}>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginBottom: "1.5rem",
                  color: "var(--color-text, #333)",
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
                {/* Article 1 - Future of Spam Blocking */}
                <a
                  href="/blog/future-of-spam-blocking?utm_source=blog_article&utm_medium=related_articles&utm_campaign=internal_linking"
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
                      backgroundImage: "url('../../images/blog/interactive-rewards-blog-social-graphic.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: "1rem" }}>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                        lineHeight: "1.3",
                        color: "var(--color-text, #333)",
                      }}
                    >
                      Get Cash Back for Blocking Spam, with KarmaCall Version 4.0
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-text-secondary, #666)",
                        lineHeight: "1.4",
                        marginBottom: "0.75rem",
                      }}
                    >
                      KarmaCall 4.0 is a revolutionary new app that pays you to block spam calls. With its fresh new UI and infinitely long call blocking
                      capability.
                    </p>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary, #666)",
                      }}
                    >
                      March 11, 2024 • KarmaCall Team
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar - Table of Contents */}
          <div
            style={{
              width: "280px",
              flexShrink: 0,
              position: "sticky",
              top: "2rem",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "1rem",
                color: "white",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: tocCollapsed ? "0" : "1rem",
                  cursor: "pointer",
                }}
                onClick={toggleToc}
              >
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    margin: "0",
                    color: "white",
                    pointerEvents: "none",
                    lineHeight: "1.3",
                  }}
                >
                  {articleMetadata.title}
                </h3>
                <span
                  style={{
                    fontSize: "1.2rem",
                    transform: tocCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    pointerEvents: "none",
                  }}
                >
                  ▼
                </span>
              </div>

              {!tocCollapsed && (
                <nav>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {headings.length > 0 ? (
                      headings.map((heading, index) => (
                        <li key={heading.id} style={{ marginBottom: "0.5rem" }}>
                          <a
                            href={`#${heading.id}`}
                            onClick={e => handleSmoothScroll(e, heading.id)}
                            style={{
                              color: "white",
                              textDecoration: "none",
                              fontSize: "0.95rem",
                              fontWeight: "600",
                              display: "block",
                              padding: "0.25rem 0",
                              borderRadius: "4px",
                              transition: "all 0.2s ease",
                              lineHeight: "1.3",
                            }}
                            onMouseEnter={e => {
                              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                              e.target.style.paddingLeft = "0.5rem"
                            }}
                            onMouseLeave={e => {
                              e.target.style.backgroundColor = "transparent"
                              e.target.style.paddingLeft = "0"
                            }}
                          >
                            {heading.text}
                          </a>
                          {heading.children && heading.children.length > 0 && (
                            <ul style={{ listStyle: "none", padding: "0", marginLeft: "1rem", marginTop: "0.25rem" }}>
                              {heading.children.map((child, childIndex) => (
                                <li key={child.id} style={{ marginBottom: "0.25rem" }}>
                                  <a
                                    href={`#${child.id}`}
                                    onClick={e => handleSmoothScroll(e, child.id)}
                                    style={{
                                      color: "rgba(255, 255, 255, 0.8)",
                                      textDecoration: "none",
                                      fontSize: "0.85rem",
                                      fontWeight: "500",
                                      display: "block",
                                      padding: "0.15rem 0",
                                      borderRadius: "4px",
                                      transition: "all 0.2s ease",
                                      lineHeight: "1.3",
                                    }}
                                    onMouseEnter={e => {
                                      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                                      e.target.style.paddingLeft = "0.5rem"
                                      e.target.style.color = "white"
                                    }}
                                    onMouseLeave={e => {
                                      e.target.style.backgroundColor = "transparent"
                                      e.target.style.paddingLeft = "0"
                                      e.target.style.color = "rgba(255, 255, 255, 0.8)"
                                    }}
                                  >
                                    {child.text}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))
                    ) : (
                      <li style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem", fontStyle: "italic" }}>
                        Table of contents will appear here when headings are detected.
                      </li>
                    )}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>

        {/* Share Dialog */}
        {showShareDialog && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={handleCloseShare}
          >
            <div
              style={{
                backgroundColor: "var(--color-background, white)",
                borderRadius: "12px",
                padding: "2rem",
                maxWidth: "400px",
                width: "90%",
                maxHeight: "80vh",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, color: "var(--color-text, #333)" }}>Share Article</h3>
                <button
                  onClick={handleCloseShare}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "var(--color-text-secondary, #666)",
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                {shareOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={option.action}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      border: "1px solid var(--border-color, #eee)",
                      borderRadius: "8px",
                      backgroundColor: option.isSuccess ? "#d4edda" : "var(--color-background, white)",
                      color: option.isSuccess ? "#155724" : "var(--color-text, #333)",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                      if (!option.isSuccess) {
                        e.target.style.backgroundColor = "var(--color-background-alt, #f9f9f9)"
                      }
                    }}
                    onMouseLeave={e => {
                      if (!option.isSuccess) {
                        e.target.style.backgroundColor = "var(--color-background, white)"
                      }
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{option.icon}</span>
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scroll to Top Button */}
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "2rem",
              backgroundColor: "var(--color-primary, #007acc)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              fontSize: "1.2rem",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 122, 204, 0.3)",
              transition: "all 0.2s ease",
              zIndex: 100,
            }}
            onMouseEnter={e => {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 6px 20px rgba(0, 122, 204, 0.4)"
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 4px 12px rgba(0, 122, 204, 0.3)"
            }}
          >
            ↑
          </button>
        )}
      </div>
    </Wrapper>
  )
}
