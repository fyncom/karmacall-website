import React, { useEffect, useRef, useState } from "react"

const CommentSection = ({ articleSlug, articleTitle }) => {
  const cusdisAppId = process.env.GATSBY_CUSDIS
  const commentRef = useRef(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")

  // Detect dark mode preference
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        setIsDarkMode(isDark)
      }
    }

    checkDarkMode()

    // Listen for changes in color scheme preference
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = e => setIsDarkMode(e.matches)
      mediaQuery.addEventListener("change", handler)
      return () => mediaQuery.removeEventListener("change", handler)
    }
  }, [])

  useEffect(() => {
    if (!cusdisAppId || cusdisAppId === "YOUR_CUSDIS_APP_ID" || !commentRef.current) {
      return
    }

    const script = document.createElement("script")
    script.src = "https://cusdis.com/js/cusdis.es.js"
    script.async = true
    script.defer = true

    // Hide the default Cusdis interface and let our custom UI handle it
    const style = document.createElement("style")
    style.textContent = `
      #cusdis_thread { display: none !important; }
    `
    document.head.appendChild(style)

    commentRef.current.appendChild(script)
  }, [cusdisAppId])

  if (!cusdisAppId || cusdisAppId === "YOUR_CUSDIS_APP_ID") {
    return (
      <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "8px" }}>
        <p>
          <strong>Note for site administrator:</strong> The comment system is not yet configured. Please replace <code>'YOUR_CUSDIS_APP_ID'</code> in{" "}
          <code>src/components/blog_components/CommentSection.js</code> with your actual Cusdis App ID.
        </p>
      </div>
    )
  }

  const handleSubmit = e => {
    e.preventDefault()
    // This would normally submit to Cusdis, but for now we'll just show a message
    alert("Comment functionality coming soon! This will integrate with Cusdis.")
  }

  const containerStyle = {
    marginTop: "3rem",
    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
    border: `1px solid ${isDarkMode ? "#333" : "#e1e5e9"}`,
    borderRadius: "12px",
    boxShadow: isDarkMode ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  }

  const headerStyle = {
    backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa",
    padding: "1rem 1.5rem",
    borderBottom: `1px solid ${isDarkMode ? "#333" : "#e1e5e9"}`,
    fontSize: "1.1rem",
    fontWeight: "600",
    color: isDarkMode ? "#e1e5e9" : "#333",
  }

  const formSectionStyle = {
    padding: "1.5rem",
    borderBottom: `1px solid ${isDarkMode ? "#333" : "#e1e5e9"}`,
  }

  const inputGroupStyle = {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  }

  const inputStyle = {
    flex: "1",
    minWidth: "200px",
    padding: "0.75rem",
    border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
    borderRadius: "6px",
    backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
    color: isDarkMode ? "#e1e5e9" : "#333",
    fontSize: "0.9rem",
  }

  const textareaStyle = {
    ...inputStyle,
    width: "100%",
    minHeight: "100px",
    resize: "vertical",
    fontFamily: "inherit",
  }

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  }

  const recentCommentsStyle = {
    padding: "1.5rem",
  }

  const sectionTitleStyle = {
    fontSize: "1rem",
    fontWeight: "600",
    color: isDarkMode ? "#e1e5e9" : "#333",
    marginBottom: "1rem",
  }

  const commentItemStyle = {
    padding: "1rem",
    backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa",
    borderRadius: "6px",
    marginBottom: "0.75rem",
    border: `1px solid ${isDarkMode ? "#333" : "#e1e5e9"}`,
  }

  const commentAuthorStyle = {
    fontWeight: "600",
    color: isDarkMode ? "#66b3ff" : "#007bff",
    fontSize: "0.9rem",
    marginBottom: "0.25rem",
  }

  const commentTextStyle = {
    color: isDarkMode ? "#e1e5e9" : "#333",
    fontSize: "0.9rem",
    lineHeight: "1.4",
    marginBottom: "0.5rem",
  }

  const commentDateStyle = {
    color: isDarkMode ? "#999" : "#666",
    fontSize: "0.8rem",
  }

  const placeholderComments = [
    {
      author: "Sarah M.",
      text: "Great article! This really helped me understand the topic better.",
      date: "2 hours ago",
    },
    {
      author: "John D.",
      text: "Thanks for sharing this insight. I've been looking for information like this.",
      date: "1 day ago",
    },
    {
      author: "Alex K.",
      text: "Excellent breakdown of the subject. Looking forward to more articles like this.",
      date: "3 days ago",
    },
  ]

  return (
    <div id="comments" style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>Comments</div>

      {/* Comment Form */}
      <div style={formSectionStyle}>
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <input type="text" placeholder="Nickname" value={nickname} onChange={e => setNickname(e.target.value)} style={inputStyle} required />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          </div>
          <textarea placeholder="Write your comment..." value={comment} onChange={e => setComment(e.target.value)} style={textareaStyle} required />
          <div style={{ marginTop: "1rem" }}>
            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={e => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={e => (e.target.style.backgroundColor = "#007bff")}
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>

      {/* Recent Comments */}
      <div style={recentCommentsStyle}>
        <div style={sectionTitleStyle}>Recent Comments</div>
        {placeholderComments.map((comment, index) => (
          <div key={index} style={commentItemStyle}>
            <div style={commentAuthorStyle}>{comment.author}</div>
            <div style={commentTextStyle}>{comment.text}</div>
            <div style={commentDateStyle}>{comment.date}</div>
          </div>
        ))}
      </div>

      {/* Hidden Cusdis integration */}
      <div
        id="cusdis_thread"
        ref={commentRef}
        data-host="https://cusdis.com"
        data-app-id={cusdisAppId}
        data-page-id={articleSlug}
        data-page-url={typeof window !== "undefined" ? window.location.href : ""}
        data-page-title={articleTitle}
        data-theme={isDarkMode ? "dark" : "light"}
        style={{ display: "none" }}
      ></div>
    </div>
  )
}

export default CommentSection
