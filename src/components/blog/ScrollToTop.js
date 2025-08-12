import React from "react"

const ScrollToTop = ({ showThreshold = 300 }) => {
  const [showScrollToTop, setShowScrollToTop] = React.useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        setShowScrollToTop(scrollTop > showThreshold)
      }

      // Add scroll listener with a small delay to ensure page is loaded
      const timer = setTimeout(() => {
        window.addEventListener("scroll", handleScroll)
      }, 250)

      // Cleanup
      return () => {
        clearTimeout(timer)
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [showThreshold])

  if (!showScrollToTop) return null

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        backgroundColor: "var(--color-background, white)",
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
        opacity: 0.4,
      }}
      title="Scroll to top"
      onMouseEnter={e => {
        e.target.style.backgroundColor = "var(--color-background, white)"
        e.target.style.transform = "translateY(-2px)"
        e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
        e.target.style.opacity = "1"
      }}
      onMouseLeave={e => {
        e.target.style.backgroundColor = "var(--color-background, white)"
        e.target.style.transform = "translateY(0)"
        e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)"
        e.target.style.opacity = "0.4"
      }}
      onFocus={e => {
        e.target.style.opacity = "1"
      }}
      onBlur={e => {
        e.target.style.opacity = "0.4"
      }}
    >
      ⬆
    </button>
  )
}

export default ScrollToTop
