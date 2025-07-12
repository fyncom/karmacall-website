import React, { useState, useEffect } from "react"
import TableOfContents from "./TableOfContents"

const BlogSidebar = ({ title }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const checkScreenSize = () => {
      const windowWidth = window.innerWidth
      const mobileThreshold = 768
      setIsMobile(windowWidth <= mobileThreshold)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null
  }

  // Hide table of contents on mobile
  if (isMobile) {
    return null
  }

  return (
    <div style={{ width: "280px", flexShrink: 0, position: "relative" }}>
      <TableOfContents title={title} />
    </div>
  )
}

export default BlogSidebar
