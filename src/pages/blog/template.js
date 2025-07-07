import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import { createShortUrl, preloadUrls } from "../../utils/urlShortener"
import { getShareCount, incrementShareCount, formatShareCount, setMockShareCount } from "../../utils/shareCounter"

export default function Template() {
  const [showShareDialog, setShowShareDialog] = React.useState(false)
  const [linkCopied, setLinkCopied] = React.useState(false)
  const [shareCount, setShareCount] = React.useState(0)
  const [tocCollapsed, setTocCollapsed] = React.useState(false)
  const [showScrollToTop, setShowScrollToTop] = React.useState(false)

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

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleShareAction = platform => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname
      const newCount = incrementShareCount(currentPath)
      setShareCount(newCount)
      console.log(`📈 Share count incremented to ${newCount} for ${platform}`)
    }
  }

  // Preload URLs and load share count when component mounts
  React.useEffect(() => {
    preloadUrls()

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname

      // Set mock data for testing (remove in production)
      setMockShareCount("/blog/template", 150) // Mock 150 shares for testing

      // Load current share count
      const currentCount = getShareCount(currentPath)
      setShareCount(currentCount)

      console.log(`📊 Share count for ${currentPath}: ${currentCount}`)

      // Add testing functions to window for easy testing
      window.setShareCount = count => {
        setMockShareCount(currentPath, count)
        setShareCount(count)
        console.log(`🧪 Test: Set share count to ${count}`)
        console.log(`📊 Formatted: ${formatShareCount(count) || "Hidden (< 100)"}`)
      }

      window.testShareCounts = () => {
        console.log("🧪 Testing different share count formats:")
        console.log("50:", formatShareCount(50) || "Hidden")
        console.log("99:", formatShareCount(99) || "Hidden")
        console.log("100:", formatShareCount(100))
        console.log("999:", formatShareCount(999))
        console.log("1000:", formatShareCount(1000))
        console.log("1100:", formatShareCount(1100))
        console.log("9999:", formatShareCount(9999))
        console.log("10000:", formatShareCount(10000))
        console.log("15500:", formatShareCount(15500))
        console.log("100000:", formatShareCount(100000))
        console.log("999999:", formatShareCount(999999))
        console.log("1000000:", formatShareCount(1000000))
        console.log("1100000:", formatShareCount(1100000))
        console.log("9900000:", formatShareCount(9900000))
        console.log("10000000:", formatShareCount(10000000))
        console.log("150000000:", formatShareCount(150000000))
        console.log("999000000:", formatShareCount(999000000))
        console.log("1000000000:", formatShareCount(1000000000))
        console.log("1100000000:", formatShareCount(1100000000))
        console.log("9900000000:", formatShareCount(9900000000))
        console.log("10000000000:", formatShareCount(10000000000))
        console.log("150000000000:", formatShareCount(150000000000))
      }

      console.log("🧪 Test functions available:")
      console.log("- setShareCount(150) - Set share count to 150")
      console.log("- testShareCounts() - View all formatting examples")

      // Add scroll listener for scroll-to-top button
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        setShowScrollToTop(scrollTop > 300) // Show button after scrolling 300px
      }

      window.addEventListener("scroll", handleScroll)

      // Cleanup scroll listener
      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
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

      // Track with Google Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "share", {
          method: "copy_link",
          content_type: "blog_post",
          item_id: window.location.pathname,
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

          // Increment share count
          handleShareAction("email")

          // Track with Google Analytics
          if (window.gtag) {
            window.gtag("event", "share", {
              method: "email",
              content_type: "blog_post",
              item_id: window.location.pathname,
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
      name: "X (Twitter)",
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

  // This page is completely removed in production builds via gatsby-node.js
  // This is just an extra safety check
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return <div>Page not found</div>
  }

  const seo = {
    title: "Blog Template - Developer Only",
    description: "Template for creating new blog articles",
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
              Your Article Title Goes Here
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
              <span className="blog-author">Author Name</span>
              <span className="blog-date">March 15, 2024</span>
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
                This is a short article summary or blurb that gives readers a quick overview of what they'll learn. It should be engaging and informative,
                setting expectations for the content below.
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

        {/* Main content container with sidebar layout - starts at featured image level */}
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start", marginTop: "0.5rem", position: "relative" }}>
          {/* Main article content */}
          <div style={{ flex: "1", minWidth: "0" }}>
            {/* Action bar above featured image */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "0.1rem",
                marginBottom: "0.75rem",
                position: "relative",
              }}
            >
              <button
                onClick={handleShare}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: formatShareCount(shareCount) ? "0.3rem" : "0",
                  width: formatShareCount(shareCount) ? "auto" : "32px",
                  height: "32px",
                  padding: formatShareCount(shareCount) ? "0 0.6rem" : "0",
                  backgroundColor: showShareDialog ? "lightblue" : "transparent",
                  border: "2px solid var(--border-color, #ddd)",
                  borderRadius: formatShareCount(shareCount) ? "16px" : "50%",
                  color: "var(--color-text, #333)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <span>📤</span>
                {formatShareCount(shareCount) && <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>{formatShareCount(shareCount)}</span>}
              </button>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  backgroundColor: "transparent",
                  border: "2px solid var(--border-color, #ddd)",
                  borderRadius: "50%",
                  color: "var(--color-text, #333)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                💬
              </button>
            </div>

            {/* Featured image */}
            <div
              className="blog-image-container"
              style={{
                marginBottom: "1rem",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* This will show the same loading animation and placeholder as blog cards */}
            </div>

            {/* Image credits and description */}
            <div
              style={{
                marginBottom: "2rem",
                padding: "0.75rem",
                backgroundColor: "var(--color-background-alt, #f9f9f9)",
                borderRadius: "4px",
                border: "1px solid var(--border-color, #eee)",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "0.9rem",
                  lineHeight: "1.4",
                  color: "var(--color-text, #333)",
                }}
              >
                <strong>Image description:</strong> Brief description of what the image shows and its relevance to the article content.
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "var(--color-text-secondary, #666)",
                  fontStyle: "italic",
                }}
              >
                <strong>Credits:</strong> Image source, photographer, or attribution information goes here.
              </p>
            </div>

            {/* Placeholder content */}
            <div
              style={{
                lineHeight: "1.7",
                fontSize: "1.1rem",
                color: "var(--color-text, #333)",
              }}
            >
              <p style={{ marginBottom: "1.5rem" }}>
                <strong>This is where your lead paragraph would go.</strong> It should hook the reader and summarize what they'll learn from your article. Keep
                it engaging and concise.
              </p>

              <h2
                id="introduction"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Introduction
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                This is regular paragraph text. You can write about your topic here, explaining key concepts and providing valuable insights to your readers.
                Make sure to break up long content into digestible paragraphs.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                Continue with more introductory content that sets the stage for the main sections of your article. This helps readers understand the context and
                importance of the topic.
              </p>

              <h2
                id="main-concepts"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Main Concepts and Ideas
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                Use headings to organize your content and make it scannable. This helps readers find the information they're looking for quickly. Each section
                should focus on a specific aspect of your topic.
              </p>

              <h3
                id="concept-one"
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                First Key Concept
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                Explain your first key concept here. Provide detailed information, examples, and context that helps readers understand this particular aspect of
                your topic.
              </p>

              <h3
                id="concept-two"
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "600",
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Second Key Concept
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>
                Continue with your second key concept. Use clear, conversational language that's easy to read and understand. Consider including examples or
                case studies to illustrate your points.
              </p>

              <h2
                id="practical-applications"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Practical Applications
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                Show readers how to apply what they've learned. This section should provide actionable advice and practical steps they can take based on the
                information in your article.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                Include specific examples, tips, or step-by-step instructions that make your content immediately useful to your audience.
              </p>

              <h2
                id="conclusion"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Conclusion
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                Wrap up your article with key takeaways and next steps for readers. Summarize the most important points and provide guidance on what they should
                do with this information.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>End with a call-to-action or invitation for readers to engage further with your content or brand.</p>
            </div>
          </div>

          {/* Table of Contents Sidebar */}
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
                backgroundColor: "var(--color-background-alt, #f9f9f9)",
                border: "1px solid var(--border-color, #eee)",
                borderRadius: "8px",
                padding: "1.5rem",
              }}
            >
              <div
                onClick={toggleToc}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: tocCollapsed ? "0" : "1rem",
                  position: "relative",
                  cursor: "pointer",
                  marginLeft: "-1.5rem",
                  marginRight: "-1.5rem",
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    margin: "0",
                    color: "var(--color-text, #333)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  Table of Contents
                </h3>
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--color-text, #333)",
                    transition: "transform 0.2s ease",
                    transform: tocCollapsed ? "rotate(90deg)" : "rotate(0deg)",
                    pointerEvents: "none",
                    lineHeight: "1",
                  }}
                >
                  ▼
                </div>
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
                    <li style={{ marginBottom: "0.5rem" }}>
                      <a
                        href="#introduction"
                        onClick={e => handleSmoothScroll(e, "introduction")}
                        style={{
                          color: "var(--karmacall-green, #2d5a27)",
                          textDecoration: "none",
                          fontSize: "0.95rem",
                          lineHeight: "1.4",
                          display: "block",
                          padding: "0.25rem 0",
                          borderLeft: "3px solid transparent",
                          paddingLeft: "0.75rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Introduction
                      </a>
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <a
                        href="#main-concepts"
                        onClick={e => handleSmoothScroll(e, "main-concepts")}
                        style={{
                          color: "var(--karmacall-green, #2d5a27)",
                          textDecoration: "none",
                          fontSize: "0.95rem",
                          lineHeight: "1.4",
                          display: "block",
                          padding: "0.25rem 0",
                          borderLeft: "3px solid transparent",
                          paddingLeft: "0.75rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Main Concepts and Ideas
                      </a>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: "0.5rem 0 0 1rem",
                        }}
                      >
                        <li style={{ marginBottom: "0.25rem" }}>
                          <a
                            href="#concept-one"
                            onClick={e => handleSmoothScroll(e, "concept-one")}
                            style={{
                              color: "var(--color-text-secondary, #666)",
                              textDecoration: "none",
                              fontSize: "0.85rem",
                              lineHeight: "1.4",
                              display: "block",
                              padding: "0.25rem 0",
                              paddingLeft: "0.75rem",
                              transition: "all 0.2s ease",
                            }}
                          >
                            First Key Concept
                          </a>
                        </li>
                        <li style={{ marginBottom: "0.25rem" }}>
                          <a
                            href="#concept-two"
                            onClick={e => handleSmoothScroll(e, "concept-two")}
                            style={{
                              color: "var(--color-text-secondary, #666)",
                              textDecoration: "none",
                              fontSize: "0.85rem",
                              lineHeight: "1.4",
                              display: "block",
                              padding: "0.25rem 0",
                              paddingLeft: "0.75rem",
                              transition: "all 0.2s ease",
                            }}
                          >
                            Second Key Concept
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <a
                        href="#practical-applications"
                        onClick={e => handleSmoothScroll(e, "practical-applications")}
                        style={{
                          color: "var(--karmacall-green, #2d5a27)",
                          textDecoration: "none",
                          fontSize: "0.95rem",
                          lineHeight: "1.4",
                          display: "block",
                          padding: "0.25rem 0",
                          borderLeft: "3px solid transparent",
                          paddingLeft: "0.75rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Practical Applications
                      </a>
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <a
                        href="#conclusion"
                        onClick={e => handleSmoothScroll(e, "conclusion")}
                        style={{
                          color: "var(--karmacall-green, #2d5a27)",
                          textDecoration: "none",
                          fontSize: "0.95rem",
                          lineHeight: "1.4",
                          display: "block",
                          padding: "0.25rem 0",
                          borderLeft: "3px solid transparent",
                          paddingLeft: "0.75rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Conclusion
                      </a>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>

        {/* Share Dialog - positioned to the left of share button, overlaying content */}
        {showShareDialog && (
          <>
            {/* Invisible overlay to catch clicks outside the dialog */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onClick={handleCloseShare}
            />
            {/* The actual dialog */}
            <div
              style={{
                position: "fixed",
                top: "350px", // Moved even further down
                right: "calc(50% - 130px)", // Moved slightly to the left of the share button
                backgroundColor: "var(--color-background, white)",
                borderRadius: "8px",
                padding: "0.75rem",
                border: "1px solid var(--border-color, #eee)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                zIndex: 1000,
                whiteSpace: "nowrap",
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Share options in single row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0",
                }}
              >
                {shareOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={option.action}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.15rem",
                      padding: "0",
                      margin: "0",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      minWidth: "50px",
                      width: "50px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "var(--color-background-alt, #f9f9f9)",
                        border: "1px solid var(--border-color, #eee)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {option.icon}
                    </div>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        color: option.isSuccess ? "#28a745" : "var(--color-text, #333)",
                        textAlign: "center",
                        lineHeight: "1",
                      }}
                    >
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

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
