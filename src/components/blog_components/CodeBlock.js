import React from "react"
import { getFontSize } from "./FontSizeSystem"

const CodeBlock = ({ children, textSize = "medium", language = "", inline = false }) => {
  if (inline) {
    return (
      <code
        style={{
          backgroundColor: "var(--color-background-alt, #f5f5f5)",
          padding: "0.2rem 0.4rem",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: getFontSize("code", textSize),
          color: "var(--color-text, #333)",
        }}
      >
        {children}
      </code>
    )
  }

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "#d4d4d4",
        padding: "1rem",
        borderRadius: "6px",
        fontFamily: "monospace",
        fontSize: getFontSize("code", textSize),
        marginBottom: "1.5rem",
        overflow: "auto",
        position: "relative",
      }}
    >
      {language && (
        <div
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            fontSize: "0.7rem",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          {language}
        </div>
      )}
      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{children}</pre>
    </div>
  )
}

export default CodeBlock
