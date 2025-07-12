import { useState, useEffect } from "react"
import { getShareCount, setMockShareCount } from "../../utils/shareCounter"
import { preloadUrls } from "../../utils/urlShortener"

const useBlogMetadata = articleMetadata => {
  const [shareCount, setShareCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [textSize, setTextSize] = useState("medium")

  const handleTextSizeChange = newSize => {
    setTextSize(newSize)
  }

  const handleCommentClick = () => {
    const commentsSection = document.getElementById("comments")
    if (commentsSection) {
      commentsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Share count handling and text size initialization
  useEffect(() => {
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
      setMockShareCount(articleMetadata.slug, 42) // Mock 42 shares for testing

      // Load current share count
      const currentCount = getShareCount(currentPath)
      setShareCount(currentCount)

      // Preload share URLs for better performance
      preloadUrls(currentPath)
    }
  }, [articleMetadata.slug])

  return {
    shareCount,
    setShareCount,
    commentCount,
    setCommentCount,
    textSize,
    setTextSize,
    handleTextSizeChange,
    handleCommentClick,
  }
}

export default useBlogMetadata
