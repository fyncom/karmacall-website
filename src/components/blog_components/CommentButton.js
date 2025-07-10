import React from "react"
import { formatCommentCount } from "../../utils/numberFormatter"

const CommentButton = ({ className, style, onClick, commentCount }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Default behavior - scroll to comments section
      const commentsSection = document.getElementById("comments")
      if (commentsSection) {
        commentsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      } else {
        console.log("💬 Comments section not found")
      }
    }
  }

  const formattedCount = formatCommentCount(commentCount)

  return (
    <button
      className={className}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: formattedCount ? "0.3rem" : "0",
        width: formattedCount ? "auto" : "32px",
        height: "32px",
        padding: formattedCount ? "0 0.6rem" : "0",
        backgroundColor: "transparent",
        border: "2px solid var(--border-color, #ddd)",
        borderRadius: formattedCount ? "16px" : "50%",
        color: "var(--color-text, #333)",
        fontSize: "0.9rem",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span>💬</span>
      {formattedCount && <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>{formattedCount}</span>}
    </button>
  )
}

export default CommentButton
