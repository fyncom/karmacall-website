import React from "react"

const TextSizeControl = ({ onSizeChange, currentSize = "medium" }) => {
  const sizes = [
    { id: "small", label: "A", fontSize: "0.7rem", description: "Small text" },
    { id: "medium", label: "A", fontSize: "1rem", description: "Normal text" },
    { id: "large", label: "A", fontSize: "1.4rem", description: "Large text" },
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
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        backgroundColor: "var(--color-background-alt, #f9f9f9)",
        border: "1px solid var(--border-color, #eee)",
        borderRadius: "8px",
        marginBottom: "1.5rem",
      }}
    >
      <span
        style={{
          fontSize: "0.9rem",
          fontWeight: "600",
          color: "var(--color-text, #333)",
          marginRight: "0.25rem",
        }}
      >
        Text Size:
      </span>

      {sizes.map(size => (
        <button
          key={size.id}
          onClick={() => handleSizeChange(size.id)}
          title={size.description}
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: currentSize === size.id ? "var(--color-primary, #007acc)" : "var(--color-background-alt, #f9f9f9)",
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
              e.target.style.backgroundColor = "var(--color-background, white)"
              e.target.style.borderColor = "var(--color-primary, #007acc)"
            }
          }}
          onMouseLeave={e => {
            if (currentSize !== size.id) {
              e.target.style.backgroundColor = "var(--color-background-alt, #f9f9f9)"
              e.target.style.borderColor = "var(--border-color, #ddd)"
            }
          }}
        >
          {size.label}
        </button>
      ))}

      <span
        style={{
          fontSize: "0.8rem",
          color: "var(--color-text-secondary, #666)",
          marginLeft: "0.5rem",
          fontStyle: "italic",
        }}
      >
        Choose your preferred reading size
      </span>
    </div>
  )
}

export default TextSizeControl
