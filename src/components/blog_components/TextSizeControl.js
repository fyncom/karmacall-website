import React from "react"

const TextSizeControl = ({ onSizeChange, currentSize = "medium" }) => {
  const sizes = [
    { id: "small", label: "A", fontSize: "0.7rem" },
    { id: "medium", label: "A", fontSize: "1rem" },
    { id: "large", label: "A", fontSize: "1.4rem" },
  ]

  const handleSizeChange = sizeId => {
    onSizeChange(sizeId)

    // Store preference in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("textSize", sizeId)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.75rem",
      }}
    >
      {sizes.map(size => (
        <button
          key={size.id}
          onClick={() => handleSizeChange(size.id)}
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: currentSize === size.id ? "var(--color-primary, #007acc)" : "var(--color-background, white)",
            color: currentSize === size.id ? "white" : "var(--color-text, #333)",
            border: "2px solid var(--border-color, #ddd)",
            borderColor: currentSize === size.id ? "var(--color-primary, #007acc)" : "var(--border-color, #ddd)",
            borderRadius: "50%",
            fontSize: size.fontSize,
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
          }}
          onMouseEnter={e => {
            if (currentSize !== size.id) {
              e.target.style.backgroundColor = "var(--color-background-alt, #f9f9f9)"
              e.target.style.borderColor = "var(--color-primary, #007acc)"
            }
          }}
          onMouseLeave={e => {
            if (currentSize !== size.id) {
              e.target.style.backgroundColor = "var(--color-background, white)"
              e.target.style.borderColor = "var(--border-color, #ddd)"
            }
          }}
        >
          {size.label}
        </button>
      ))}
    </div>
  )
}

export default TextSizeControl
