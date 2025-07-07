import React from "react"
import ShareButton from "./ShareButton"
import CommentButton from "./CommentButton"

const ActionBar = ({ articleData, shareCount, onShareCountUpdate, className, style }) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "0.1rem",
        marginBottom: "0.75rem",
        ...style,
      }}
    >
      <ShareButton articleData={articleData} shareCount={shareCount} onShareCountUpdate={onShareCountUpdate} />
      <CommentButton />
    </div>
  )
}

export default ActionBar
