import React from "react"
import { trackShare, trackLinkCopy, trackEmailShare } from "../../utils/analytics"

export default function ShareButton({ articleData }) {
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
    // Track with both Google Analytics and PostHog
    if (typeof window !== "undefined") {
      const articlePath = window.location.pathname
      const articleTitle = articleData?.title || document.title
      
      if (platform === 'copy_link') {
        trackLinkCopy(articlePath, articleTitle)
      } else if (platform === 'email') {
        trackEmailShare(articlePath, articleTitle)
      } else {
        trackShare(platform, articlePath, articleTitle)
      }
    }
  }

  const copyToClipboard = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const currentUrl = window.location.href.split("?")[0] // Remove existing params
      navigator.clipboard.writeText(currentUrl)
      setLinkCopied(true)

      // Increment share count
      handleShareAction("copy_link")

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
          const subject = encodeURIComponent(articleData?.title || "Check out this article")
          const body = encodeURIComponent(`Check out this article: ${currentUrl}`)
          window.open(`mailto:?subject=${subject}&body=${body}`)

          // Increment share count
          handleShareAction("email")

        }
      },
    },
    {
      name: "Facebook",
      icon: "📘",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`)

          // Increment share count
          handleShareAction("facebook")

        }
      },
    },
    {
      name: "X (Twitter)",
      icon: "🐦",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          const tweetText = encodeURIComponent(`Check out this article: ${articleData?.title || ''}`)
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${tweetText}`)

          // Increment share count
          handleShareAction("twitter")

        }
      },
    },
    {
      name: "LinkedIn",
      icon: "💼",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`)

          // Increment share count
          handleShareAction("linkedin")

        }
      },
    },
    {
      name: "Reddit",
      icon: "🤖",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          const title = encodeURIComponent(articleData?.title || "Check out this article")
          window.open(`https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${title}`)

          // Increment share count
          handleShareAction("reddit")

        }
      },
    },
    {
      name: "Bluesky",
      icon: "🦋",
      action: () => {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href.split("?")[0]
          const blueskyText = encodeURIComponent(`Check out this article: ${articleData?.title || ''} ${currentUrl}`)
          window.open(`https://bsky.app/intent/compose?text=${blueskyText}`)

          // Increment share count
          handleShareAction("bluesky")

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
          gap: "0",
          width: "32px",
          height: "32px",
          padding: "0",
          backgroundColor: showShareDialog ? "var(--color-primary, #007acc)" : "transparent",
          border: "2px solid var(--border-color, #ddd)",
          borderRadius: "50%",
          color: showShareDialog ? "white" : "var(--color-text, #333)",
          fontSize: "0.9rem",
          cursor: "pointer",
          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
      >
        <span>📤</span>
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
                      color: option.isSuccess ? "var(--robocash-green, #3fa060)" : "var(--color-text, #333)",
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
