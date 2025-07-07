import React from "react"
import { createShortUrl } from "../utils/urlShortener"
import { incrementShareCount, getShareCount, formatShareCount } from "../utils/shareCounter"

export default function ShareButton({ articleData, shareCount, onShareCountUpdate }) {
  const [showShareDialog, setShowShareDialog] = React.useState(false)
  const [linkCopied, setLinkCopied] = React.useState(false)

  const handleShare = () => {
    setShowShareDialog(!showShareDialog)
  }

  const handleCloseShare = () => {
    setShowShareDialog(false)
    setLinkCopied(false) // Reset copied state when dialog closes
  }

  const handleShareAction = platform => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname
      const newCount = incrementShareCount(currentPath)
      if (onShareCountUpdate) {
        onShareCountUpdate(newCount)
      }
      console.log(`📈 Share count incremented to ${newCount} for ${platform}`)
    }
  }

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

  return (
    <div style={{ position: "relative" }}>
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
  )
}
