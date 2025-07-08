import React from "react"

const CommentButton = ({ className, style, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Default behavior - could integrate with a comment system like Disqus
      console.log("💬 Comment button clicked - integrate with comment system")
    }
  }

  return (
    <button
      className={className}
      onClick={handleClick}
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
        ...style,
      }}
    >
      💬
    </button>
  )
}

export default CommentButton
