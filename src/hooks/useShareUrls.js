import { useEffect, useState } from "react"
import { trackShare, trackLinkCopy, trackEmailShare } from "../utils/analytics"

// Custom hook for sharing functionality with PostHog tracking
export const useShareUrls = () => {
  const [linkCopied, setLinkCopied] = useState(false)

  // Initialize PostHog tracking when hook is used
  useEffect(() => {
    // PostHog handles URL tracking automatically
  }, [])

  // Get current page URL without parameters
  const getCurrentUrl = () => {
    if (typeof window === "undefined") return ""
    return window.location.href.split("?")[0]
  }

  // Get current URL for sharing (no shortening needed)
  const getShareUrl = () => {
    return getCurrentUrl()
  }

  // Handle share action with dual tracking (GA + PostHog)
  const handleShareAction = platform => {
    if (typeof window !== "undefined") {
      const articlePath = window.location.pathname
      const articleTitle = document.title
      
      if (platform === 'copy_link') {
        trackLinkCopy(articlePath, articleTitle)
      } else if (platform === 'email') {
        trackEmailShare(articlePath, articleTitle)
      } else {
        trackShare(platform, articlePath, articleTitle)
      }
    }
  }

  // Copy link to clipboard
  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator.clipboard) return false

    try {
      const shareUrl = getShareUrl()
      await navigator.clipboard.writeText(shareUrl)
      setLinkCopied(true)

      // Track with PostHog
      handleShareAction("copy_link")

      return true
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      return false
    }
  }

  // Share via email
  const shareViaEmail = () => {
    const shareUrl = getShareUrl()
    const subject = encodeURIComponent("Check out this article")
    const body = encodeURIComponent(`Check out this article: ${shareUrl}`)

    window.open(`mailto:?subject=${subject}&body=${body}`)

    // Track with PostHog
    handleShareAction("email")
  }

  // Share on social platform
  const shareOnPlatform = platform => {
    const shareUrl = getShareUrl()
    const encodedUrl = encodeURIComponent(shareUrl)

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check out this article`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case "reddit":
        shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=Check out this article`
        break
      case "bluesky":
        shareUrl = `https://bsky.app/intent/compose?text=Check out this article: ${encodedUrl}`
        break
      default:
        console.warn(`Unknown platform: ${platform}`)
        return
    }

    if (shareUrl) {
      window.open(shareUrl)

      // Track with PostHog
      handleShareAction(platform)
    }
  }

  // Reset copied state
  const resetCopiedState = () => {
    setLinkCopied(false)
  }

  return {
    linkCopied,
    copyToClipboard,
    shareViaEmail,
    shareOnPlatform,
    getShareUrl,
    resetCopiedState,
  }
}
