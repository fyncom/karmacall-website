import React, { useEffect, useRef, useState } from "react"

const CommentSection = ({ articleSlug, articleTitle }) => {
  const cusdisAppId = process.env.GATSBY_CUSDIS
  const commentRef = useRef(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [expandedComments, setExpandedComments] = useState(new Set())
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")

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
    setNickname("")
    setEmail("")
    setComment("")
  }

  const handleReply = (commentId, replyText) => {
    // This would normally submit reply to Cusdis
    alert(`Reply to comment ${commentId}: "${replyText}"`)
    setReplyingTo(null)
    setReplyText("")
  }

  const toggleReplies = commentId => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  const startReply = commentId => {
    setReplyingTo(commentId)
    setReplyText("")
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyText("")
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

  const replyButtonStyle = {
    padding: "0.4rem 0.8rem",
    backgroundColor: "transparent",
    color: isDarkMode ? "#66b3ff" : "#007bff",
    border: `1px solid ${isDarkMode ? "#66b3ff" : "#007bff"}`,
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    marginRight: "0.5rem",
  }

  const expandButtonStyle = {
    padding: "0.4rem 0.8rem",
    backgroundColor: "transparent",
    color: isDarkMode ? "#999" : "#666",
    border: "none",
    borderRadius: "4px",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "color 0.2s",
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

  const nestedCommentStyle = {
    marginLeft: "2rem",
    marginTop: "0.75rem",
    paddingLeft: "1rem",
    borderLeft: `2px solid ${isDarkMode ? "#444" : "#ddd"}`,
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
    marginBottom: "0.5rem",
  }

  const replyFormStyle = {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
    border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
    borderRadius: "6px",
  }

  const smallButtonStyle = {
    padding: "0.5rem 1rem",
    fontSize: "0.8rem",
    marginRight: "0.5rem",
  }

  // Sample nested comments data
  const placeholderComments = [
    {
      id: 1,
      author: "Sarah M.",
      text: "Great article! This really helped me understand the topic better.",
      date: "2 hours ago",
      replies: [
        {
          id: 2,
          author: "John D.",
          text: "I agree! The examples were particularly helpful.",
          date: "1 hour ago",
          replies: [
            {
              id: 5,
              author: "Alex K.",
              text: "Yes, especially the third example. That cleared up my confusion.",
              date: "45 minutes ago",
              replies: [],
            },
          ],
        },
        {
          id: 3,
          author: "Mike R.",
          text: "Same here. I've bookmarked this for future reference.",
          date: "30 minutes ago",
          replies: [],
        },
      ],
    },
    {
      id: 4,
      author: "Lisa P.",
      text: "Thanks for sharing this insight. I've been looking for information like this for weeks!",
      date: "1 day ago",
      replies: [],
    },
  ]

  const renderComment = (comment, depth = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0
    const isExpanded = expandedComments.has(comment.id)
    const isReplying = replyingTo === comment.id

    return (
      <div key={comment.id} style={depth > 0 ? nestedCommentStyle : {}}>
        <div style={commentItemStyle}>
          <div style={commentAuthorStyle}>{comment.author}</div>
          <div style={commentTextStyle}>{comment.text}</div>
          <div style={commentDateStyle}>{comment.date}</div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              style={replyButtonStyle}
              onClick={() => startReply(comment.id)}
              onMouseOver={e => {
                e.target.style.backgroundColor = isDarkMode ? "#66b3ff" : "#007bff"
                e.target.style.color = "white"
              }}
              onMouseOut={e => {
                e.target.style.backgroundColor = "transparent"
                e.target.style.color = isDarkMode ? "#66b3ff" : "#007bff"
              }}
            >
              Reply
            </button>

            {hasReplies && (
              <button
                style={expandButtonStyle}
                onClick={() => toggleReplies(comment.id)}
                onMouseOver={e => (e.target.style.color = isDarkMode ? "#ccc" : "#333")}
                onMouseOut={e => (e.target.style.color = isDarkMode ? "#999" : "#666")}
              >
                {isExpanded ? "▼" : "▶"} {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {isReplying && (
            <div style={replyFormStyle}>
              <textarea
                placeholder={`Reply to ${comment.author}...`}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                style={{ ...textareaStyle, minHeight: "80px" }}
              />
              <div style={{ marginTop: "0.75rem" }}>
                <button
                  style={{ ...buttonStyle, ...smallButtonStyle }}
                  onClick={() => handleReply(comment.id, replyText)}
                  onMouseOver={e => (e.target.style.backgroundColor = "#0056b3")}
                  onMouseOut={e => (e.target.style.backgroundColor = "#007bff")}
                >
                  Reply
                </button>
                <button
                  style={{
                    ...buttonStyle,
                    ...smallButtonStyle,
                    backgroundColor: "transparent",
                    color: isDarkMode ? "#999" : "#666",
                    border: `1px solid ${isDarkMode ? "#444" : "#ddd"}`,
                  }}
                  onClick={cancelReply}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = isDarkMode ? "#333" : "#f8f9fa"
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = "transparent"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {hasReplies && isExpanded && <div>{comment.replies.map(reply => renderComment(reply, depth + 1))}</div>}
      </div>
    )
  }

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
              Comment
            </button>
          </div>
        </form>
      </div>

      {/* Recent Comments */}
      <div style={recentCommentsStyle}>
        <div style={sectionTitleStyle}>Recent Comments</div>
        {placeholderComments.map(comment => renderComment(comment))}
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
