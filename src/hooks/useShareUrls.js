import { useEffect, useState } from "react"
import { createShortUrl, preloadUrls } from "../utils/urlShortener"
import { getShareCount, incrementShareCount, formatShareCount } from "../utils/shareCounter"

// Custom hook for sharing functionality with share counting
export const useShareUrls = () => {
  const [linkCopied, setLinkCopied] = useState(false)
  const [shareCount, setShareCount] = useState(0)

  // Preload URLs and load share count when hook is used
  useEffect(() => {
    preloadUrls()

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname
      const currentCount = getShareCount(currentPath)
      setShareCount(currentCount)
    }
  }, [])

  // Get current page URL without parameters
  const getCurrentUrl = () => {
    if (typeof window === "undefined") return ""
    return window.location.href.split("?")[0]
  }

  // Generate short URL for a specific platform
  const getShortUrl = platform => {
    const currentUrl = getCurrentUrl()
    return createShortUrl(currentUrl, platform)
  }

  // Handle share action with counting
  const handleShareAction = platform => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname
      const newCount = incrementShareCount(currentPath)
      setShareCount(newCount)
      console.log(`📈 Share count incremented to ${newCount} for ${platform}`)
    }
  }

  // Copy link to clipboard
  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator.clipboard) return false

    try {
      const shortUrl = getShortUrl("copy_link")
      await navigator.clipboard.writeText(shortUrl)
      setLinkCopied(true)

      // Increment share count
      handleShareAction("copy_link")

      // Track with Google Analytics
      if (window.gtag) {
        window.gtag("event", "share", {
          method: "copy_link",
          content_type: "blog_post",
          item_id: window.location.pathname,
        })
      }

      return true
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      return false
    }
  }

  // Share via email
  const shareViaEmail = () => {
    const shortUrl = getShortUrl("email")
    const subject = encodeURIComponent("Check out this article")
    const body = encodeURIComponent(shortUrl)

    window.open(`mailto:?subject=${subject}&body=${body}`)

    // Increment share count
    handleShareAction("email")

    // Track with Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "share", {
        method: "email",
        content_type: "blog_post",
        item_id: window.location.pathname,
      })
    }
  }

  // Share on social platform
  const shareOnPlatform = platform => {
    const shortUrl = getShortUrl(platform)
    const encodedUrl = encodeURIComponent(shortUrl)

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

      // Increment share count
      handleShareAction(platform)

      // Track with Google Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "share", {
          method: platform,
          content_type: "blog_post",
          item_id: window.location.pathname,
        })
      }
    }
  }

  // Reset copied state
  const resetCopiedState = () => {
    setLinkCopied(false)
  }

  return {
    linkCopied,
    shareCount,
    copyToClipboard,
    shareViaEmail,
    shareOnPlatform,
    getShortUrl,
    resetCopiedState,
    formatShareCount: () => formatShareCount(shareCount),
  }
}
