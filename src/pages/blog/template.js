import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import { createShortUrl, preloadUrls } from "../../utils/urlShortener"
import { getShareCount, incrementShareCount, formatShareCount, setMockShareCount } from "../../utils/shareCounter"

// ============================================================
// ARTICLE METADATA - EDIT THIS SECTION FOR EACH NEW ARTICLE
// ============================================================
const articleMetadata = {
  title: "JavaScript Blog Template Guide - How to Create Articles",
  description: "Complete guide for developers on how to use the JavaScript template system for creating KarmaCall blog articles. Includes metadata setup, content structure, and advanced features.",
  author: "Draven Grondona",
  date: "2025-06-07", // Format: YYYY-MM-DD
  featuredImage: "../../images/blog/your-image-filename.jpg", // Place image in src/images/blog/

  // 2 Core Topics (2-3), Audiance Tags (1-2), Article Type (1-2), Technical / Concept Tags (1-2), Trends Tag (1), Product Tag (1-2)  |  (any of these are optional)
  keywords: ["javascript", "blog", "template", "employee", "how to", "guide", "metadata", "comand line interface", "cli", "karmacall", "fyncom"], // Optional: for additional SEO targeting
  slug: "/blog/template", // Used for share tracking - update this to match your article's URL
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Template() {
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
          }
        })

        setHeadings(headingsList)
        console.log("📋 Generated table of contents:", headingsList)
      }
    }

    // Generate TOC after component mounts and content is rendered
    const timer = setTimeout(generateTOC, 100)

    return () => clearTimeout(timer)
  }, [])

  // Preload URLs and load share count when component mounts
  React.useEffect(() => {
    preloadUrls()

    if (typeof window !== "undefined") {
      // Add a small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        const currentPath = window.location.pathname

        // Capture and clean UTM parameters
        const urlParams = new URLSearchParams(window.location.search)
        const utmData = {
          source: urlParams.get("utm_source"),
          medium: urlParams.get("utm_medium"),
          campaign: urlParams.get("utm_campaign"),
          content: urlParams.get("utm_content"),
          term: urlParams.get("utm_term"),
        }

        console.log("Debug: Current URL:", window.location.href)
        console.log("Debug: URL search params:", window.location.search)
        console.log("Debug: Extracted UTM data:", utmData)

        // Store UTM data for analytics if any UTM parameters exist
        if (Object.values(utmData).some(value => value !== null)) {
          // Store in sessionStorage for this session
          sessionStorage.setItem("utm_data", JSON.stringify(utmData))

          console.log("Debug: Stored UTM data in sessionStorage")

          // Track with Google Analytics immediately
          if (window.gtag) {
            window.gtag("event", "page_view_with_utm", {
              utm_source: utmData.source,
              utm_medium: utmData.medium,
              utm_campaign: utmData.campaign,
              utm_content: utmData.content,
              utm_term: utmData.term,
              page_path: currentPath,
            })
            console.log("Debug: Sent UTM data to Google Analytics")
          }

          // Clean the URL by removing UTM parameters
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl)

          console.log(`📊 UTM data captured and URL cleaned:`, utmData)
          console.log(`📊 Clean URL: ${cleanUrl}`)
        } else {
          console.log("Debug: No UTM parameters found")
        }

        // Set mock data for testing (remove in production)
        setMockShareCount(articleMetadata.slug, 150) // Mock 150 shares for testing

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

        // Add UTM testing function
        window.testUTM = () => {
          const storedUTM = sessionStorage.getItem("utm_data")
          if (storedUTM) {
            console.log("🔍 Stored UTM data:", JSON.parse(storedUTM))
          } else {
            console.log("🔍 No UTM data found in session")
          }
        }

        // Add URL shortener testing function
        window.testShortener = () => {
          console.log("🔗 Testing URL shortener...")
          const currentUrl = window.location.href.split("?")[0]
          const testUrl = createShortUrl(currentUrl, "copy_link")
          console.log("Created short URL:", testUrl)

          // Test the slug extraction and resolution
          const slug = testUrl.split("/s/")[1]
          console.log("Extracted slug:", slug)

          // Import and test resolution
          import("../../utils/urlShortener").then(({ resolveShortUrl }) => {
            const resolved = resolveShortUrl(slug)
            console.log("Resolved URL:", resolved)

            if (resolved) {
              console.log("✅ URL shortener working correctly")
            } else {
              console.log("❌ URL shortener resolution failed")
            }
          })
        }

        console.log("🧪 Test functions available:")
        console.log("- setShareCount(150) - Set share count to 150")
        console.log("- testShareCounts() - View all formatting examples")
        console.log("- testUTM() - View captured UTM data")
        console.log("- testShortener() - Test URL shortener functionality")

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

          // Increment share count
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
              className="blog-meta"
              style={{
                marginBottom: "2rem",
                fontSize: "1rem",
                borderBottom: "1px solid var(--border-color, #eee)",
                paddingBottom: "1rem",
              }}
            >
              <span className="blog-author">{articleMetadata.author}</span>
              <span className="blog-date">
                {new Date(articleMetadata.date).toLocaleDateString("en-US", {
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
                {articleMetadata.description}
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

              {/* Share Dialog - positioned directly under share button with right sides aligned */}
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
                      position: "absolute",
                      top: "calc(100% + 0.5rem)",
                      right: "32px",
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

            {/* Guide content */}
            <div
              style={{
                lineHeight: "1.7",
                fontSize: "1.1rem",
                color: "var(--color-text, #333)",
              }}
            >
              <p style={{ marginBottom: "1.5rem" }}>
                <strong>Welcome to the JavaScript Blog Template System!</strong> This template provides a complete solution for creating KarmaCall blog articles
                using JavaScript instead of MDX. All metadata, SEO, and advanced features are centralized in the JavaScript file for easy management.
              </p>

              <div
                style={{
                  backgroundColor: "var(--color-background-alt, #f9f9f9)",
                  border: "1px solid var(--border-color, #eee)",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                  borderLeft: "4px solid #007acc",
                }}
              >
                <p style={{ margin: "0", fontWeight: "600", color: "#007acc" }}>
                  📝 <strong>Quick Start:</strong> Copy this `template.js` file, rename it to your article name (e.g., `my-article.js`), update the metadata at
                  the top, and replace this content with your article.
                </p>
              </div>

              <h2
                id="getting-started"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Getting Started
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                The JavaScript template system centralizes all article configuration in the `articleMetadata` object at the top of the file. This approach
                provides better maintainability and ensures consistent SEO handling across all articles.
              </p>

              <h3 id="copy-rename" style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}>
                Step 1: Copy and Rename
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>Copy `template.js` to your new article filename:</p>

              <div
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  overflow: "auto",
                }}
              >
                cp template.js my-awesome-article.js
              </div>

              <h3
                id="update-metadata"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Step 2: Update Article Metadata
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>Edit the `articleMetadata` object at the top of your file:</p>

              <div
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  overflow: "auto",
                }}
              >
                {`const articleMetadata = {
  title: "Your Compelling Article Title",
  description: "SEO description 150-160 chars for search results",
  author: "Your Name",
  date: "2024-01-15", // YYYY-MM-DD format
  featuredImage: "../../images/blog/your-image.jpg",
  keywords: ["keyword1", "keyword2", "keyword3"],
  slug: "/blog/your-article-url", // Must match filename
}`}
              </div>

              <h2
                id="metadata-configuration"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Metadata Configuration
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>Each field in the metadata object serves a specific purpose:</p>

              <h3
                id="required-fields"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Required Fields
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>title:</strong> Appears in browser tab, search results, and social shares
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>description:</strong> SEO meta description (150-160 characters optimal)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>author:</strong> Displayed in article byline
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>date:</strong> Publication date in YYYY-MM-DD format
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>slug:</strong> URL path for share tracking (must match your filename)
                </li>
              </ul>

              <h3
                id="optional-fields"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Optional Fields
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>featuredImage:</strong> Path to hero image (place in `src/images/blog/`)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>keywords:</strong> Array of SEO keywords for additional targeting
                </li>
              </ul>

              <h2
                id="content-structure"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Content Structure
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>Replace this guide content with your article. Use the following structure for consistency:</p>

              <h3
                id="heading-hierarchy"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Heading Hierarchy
              </h3>

              <div
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  overflow: "auto",
                }}
              >
                {`<h2 id="section-id" style={{...}}>Main Section</h2>
<h3 id="subsection-id" style={{...}}>Subsection</h3>
<p style={{...}}>Paragraph content...</p>`}
              </div>

              <p style={{ marginBottom: "1.5rem" }}>
                Always include `id` attributes on H2 and H3 headings for table of contents navigation. The template automatically handles smooth scrolling.
              </p>

              <h3
                id="styling-guidelines"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Styling Guidelines
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Use CSS variables for colors: `var(--color-text, #333)`</li>
                <li style={{ marginBottom: "0.5rem" }}>Maintain consistent spacing: `marginBottom: "1.5rem"`</li>
                <li style={{ marginBottom: "0.5rem" }}>Keep line height readable: `lineHeight: "1.7"`</li>
                <li style={{ marginBottom: "0.5rem" }}>Use responsive font sizes: `fontSize: "1.1rem"`</li>
              </ul>

              <h2
                id="advanced-features"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Advanced Features
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>This template includes several advanced features that work automatically:</p>

              <h3
                id="share-system"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Share System
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Automatic URL shortening for all share platforms</li>
                <li style={{ marginBottom: "0.5rem" }}>Share count tracking and display</li>
                <li style={{ marginBottom: "0.5rem" }}>UTM parameter handling and Google Analytics integration</li>
                <li style={{ marginBottom: "0.5rem" }}>Support for 7 platforms: Copy Link, Email, Facebook, X, LinkedIn, Reddit, Bluesky</li>
              </ul>

              <h3
                id="table-of-contents"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Table of Contents
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Automatically generated from H2 and H3 headings</li>
                <li style={{ marginBottom: "0.5rem" }}>Smooth scrolling navigation</li>
                <li style={{ marginBottom: "0.5rem" }}>Collapsible sidebar design</li>
                <li style={{ marginBottom: "0.5rem" }}>Responsive mobile behavior</li>
              </ul>

              <h3
                id="seo-optimization"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                SEO Optimization
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Automatic meta tag generation from metadata</li>
                <li style={{ marginBottom: "0.5rem" }}>Open Graph and Twitter Card support</li>
                <li style={{ marginBottom: "0.5rem" }}>Structured data markup</li>
                <li style={{ marginBottom: "0.5rem" }}>Optimized for search engine indexing</li>
              </ul>

              <h2
                id="best-practices"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Best Practices
              </h2>

              <h3
                id="content-guidelines"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Content Guidelines
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Write engaging headlines that include target keywords</li>
                <li style={{ marginBottom: "0.5rem" }}>Keep descriptions between 150-160 characters for optimal SEO</li>
                <li style={{ marginBottom: "0.5rem" }}>Use descriptive H2/H3 headings for better navigation</li>
                <li style={{ marginBottom: "0.5rem" }}>Include relevant internal and external links</li>
                <li style={{ marginBottom: "0.5rem" }}>Optimize images for web (1200x630px for social sharing)</li>
              </ul>

              <h3
                id="development-workflow"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Development Workflow
              </h3>

              <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Copy template.js to your article filename</li>
                <li style={{ marginBottom: "0.5rem" }}>Update articleMetadata with your content</li>
                <li style={{ marginBottom: "0.5rem" }}>Replace this guide content with your article</li>
                <li style={{ marginBottom: "0.5rem" }}>Add featured image to `src/images/blog/`</li>
                <li style={{ marginBottom: "0.5rem" }}>Test locally with `gatsby develop`</li>
                <li style={{ marginBottom: "0.5rem" }}>No need to manually update table of contents - it's automatic!</li>
                <li style={{ marginBottom: "0.5rem" }}>Commit and deploy</li>
              </ol>

              <div
                style={{
                  backgroundColor: "#f0f8ff",
                  border: "1px solid #b0d4f1",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                  borderLeft: "4px solid #007acc",
                }}
              >
                <p style={{ margin: "0", fontWeight: "600", color: "#007acc" }}>
                  💡 <strong>Pro Tip:</strong> This template is only visible in development mode. It's automatically excluded from production builds, so you can
                  safely keep it as a reference while developing new articles.
                </p>
              </div>

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
                Ready to Create Your Article?
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                You now have everything you need to create professional blog articles using the JavaScript template system. The centralized metadata approach
                ensures consistent SEO, while the advanced features provide a rich reading experience for your audience.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                Start by copying this file, updating the metadata, and replacing this content with your article. The template handles all the technical details,
                so you can focus on creating great content.
              </p>

              <div
                style={{
                  backgroundColor: "var(--color-background-alt, #f9f9f9)",
                  border: "2px solid #28a745",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0", fontWeight: "600", color: "#28a745", fontSize: "1.1rem" }}>
                  🚀 <strong>Happy Writing!</strong> Create engaging content that helps KarmaCall users and grows our community.
                </p>
              </div>
            </div>

            {/* Related Articles Section */}
            <div
              style={{
                marginTop: "4rem",
                paddingTop: "2rem",
                borderTop: "2px solid var(--border-color, #eee)",
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
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                        color: "var(--color-text, #333)",
                        lineHeight: "1.3",
                      }}
                    >
                      Get Cash Back for Blocking Spam, with KarmaCall Version 4.0
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--color-text-secondary, #666)",
                        lineHeight: "1.4",
                        margin: "0 0 0.75rem 0",
                      }}
                    >
                      KarmaCall 4.0 is a revolutionary new app that pays you to block spam calls. With its fresh new UI and infinitely long call blocking
                      capability...
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

                {/* Article 2 - Job Scam Texts */}
                <a
                  href="/blog/job-scam-texts-surge-2024?utm_source=blog_article&utm_medium=related_articles&utm_campaign=internal_linking"
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
                      backgroundImage: "url('../../images/illustrations/inbox-money.png')",
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
                      Job Scam Texts Cost Americans $470M in 2024 - Here's the Economic Solution
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--color-text-secondary, #666)",
                        lineHeight: "1.4",
                        margin: "0 0 0.75rem 0",
                      }}
                    >
                      Job scam texts were the #2 most common hoax in 2024, costing Americans nearly half a billion dollars. Discover how FynCom's refundable
                      deposit technology...
                    </p>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-secondary, #666)",
                      }}
                    >
                      June 7, 2024 • KarmaCall Team
                    </div>
                  </div>
                </a>

                {/* Article 3 - Placeholder */}
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
              </div>
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
                    fontWeight: "700",
                    margin: "0",
                    color: "white",
                    pointerEvents: "none",
                    lineHeight: "1.3",
                  }}
                >
                  {articleMetadata.title}
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
                    {headings.map((heading, index) => (
                      <li key={heading.id} style={{ marginBottom: "0.5rem" }}>
                        <a
                          href={`#${heading.id}`}
                          onClick={e => handleSmoothScroll(e, heading.id)}
                          style={{
                            color: "white",
                            textDecoration: "none",
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            lineHeight: "1.4",
                            display: "block",
                            padding: "0.25rem 0",
                            borderLeft: "3px solid transparent",
                            paddingLeft: "0.75rem",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {heading.text}
                        </a>
                        {heading.children.length > 0 && (
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              margin: "0.5rem 0 0 1rem",
                            }}
                          >
                            {heading.children.map((child, childIndex) => (
                              <li key={child.id} style={{ marginBottom: "0.25rem" }}>
                                <a
                                  href={`#${child.id}`}
                                  onClick={e => handleSmoothScroll(e, child.id)}
                                  style={{
                                    color: "#e0e0e0",
                                    textDecoration: "none",
                                    fontSize: "0.85rem",
                                    fontWeight: "500",
                                    lineHeight: "1.4",
                                    display: "block",
                                    padding: "0.25rem 0",
                                    paddingLeft: "0.75rem",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  {child.text}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                    {headings.length === 0 && (
                      <li
                        style={{
                          padding: "1rem",
                          textAlign: "center",
                          color: "var(--color-text-secondary, #666)",
                          fontSize: "0.9rem",
                          fontStyle: "italic",
                        }}
                      >
                        No headings found. Add H2 or H3 elements with id attributes to generate the table of contents.
                      </li>
                    )}
                  </ul>
                </nav>
              )}
            </div>
          </div>
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
