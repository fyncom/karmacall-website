import React from "react"

const CalloutBox = ({ children, type = "info", icon = "", title = "", style = {} }) => {
  const getTypeStyles = type => {
    const baseStyles = {
      padding: "1.5rem",
      marginBottom: "2rem",
      borderRadius: "8px",
      border: "1px solid",
    }

    switch (type) {
      case "info":
        return {
          ...baseStyles,
          backgroundColor: "var(--color-background-alt, #f9f9f9)",
          borderColor: "var(--border-color, #eee)",
          borderLeft: "4px solid #007acc",
        }
      case "success":
        return {
          ...baseStyles,
          backgroundColor: "#f0f8ff",
          borderColor: "#b0d4f1",
          borderLeft: "4px solid #007acc",
        }
      case "warning":
        return {
          ...baseStyles,
          backgroundColor: "#fff8e1",
          borderColor: "#ffcc02",
          borderLeft: "4px solid #ff9800",
        }
      case "error":
        return {
          ...baseStyles,
          backgroundColor: "#ffebee",
          borderColor: "#ffcdd2",
          borderLeft: "4px solid #f44336",
        }
      case "tip":
        return {
          ...baseStyles,
          backgroundColor: "#e8f5e8",
          borderColor: "#c8e6c9",
          borderLeft: "4px solid #4caf50",
        }
      default:
        return baseStyles
    }
  }

  const getTextColor = type => {
    switch (type) {
      case "info":
      case "success":
        return "#007acc"
      case "warning":
        return "#e65100"
      case "error":
        return "#c62828"
      case "tip":
        return "#2e7d32"
      default:
        return "var(--color-text, #333)"
    }
  }

  const typeStyles = getTypeStyles(type)
  const textColor = getTextColor(type)

  return (
    <div style={{ ...typeStyles, ...style }}>
      {(icon || title) && (
        <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600", color: textColor }}>
          {icon && <span style={{ marginRight: "0.5rem" }}>{icon}</span>}
          {title && <strong>{title}</strong>}
        </p>
      )}
      <div style={{ margin: title ? "0" : "0", color: textColor }}>{children}</div>
    </div>
  )
}

export default CalloutBox
