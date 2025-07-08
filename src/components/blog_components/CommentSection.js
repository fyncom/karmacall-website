import React from "react"
import { Link } from "gatsby"

const CommentSection = ({ articleSlug }) => {
  const [comments, setComments] = React.useState([])
  const [newComment, setNewComment] = React.useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [userInfo, setUserInfo] = React.useState(null)

  // Check login status and get user info
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId")
      const phoneNumber = localStorage.getItem("phoneNumber")
      const countryCode = localStorage.getItem("countryCode")
      const sessionId = localStorage.getItem("sessionId")

      if (userId && phoneNumber && sessionId) {
        setIsLoggedIn(true)
        // Format phone number for display (e.g., "+1 555-123-4567")
        const formattedPhone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
        const displayName = `+${countryCode} ${formattedPhone}`

        setUserInfo({
          userId,
          phoneNumber,
          countryCode,
          displayName,
        })

        // Pre-fill the name field with the user's phone number
        setNewComment(prev => ({
          ...prev,
          name: displayName,
        }))
      }

      // Check if user returned from login and should scroll to comments
      if (window.location.hash === "#comments") {
        // Small delay to ensure the page has fully loaded
        setTimeout(() => {
          const commentsSection = document.getElementById("comments")
          if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: "smooth" })
          }
        }, 100)
      }
    }
  }, [])

  // Load comments from localStorage on component mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedComments = localStorage.getItem(`comments_${articleSlug}`)
      if (savedComments) {
        try {
          setComments(JSON.parse(savedComments))
        } catch (error) {
          console.error("failed to parse saved comments:", error)
        }
      }
    }
  }, [articleSlug])

  // Save comments to localStorage whenever comments change
  React.useEffect(() => {
    if (typeof window !== "undefined" && comments.length > 0) {
      localStorage.setItem(`comments_${articleSlug}`, JSON.stringify(comments))
    }
  }, [comments, articleSlug])

  const handleInputChange = e => {
    const { name, value } = e.target
    setNewComment(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!isLoggedIn) {
      alert("please log in to post a comment")
      return
    }

    if (!newComment.message.trim()) {
      alert("please enter a message")
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const comment = {
      id: Date.now(),
      name: userInfo.displayName,
      userId: userInfo.userId,
      message: newComment.message.trim(),
      timestamp: new Date().toISOString(),
    }

    setComments(prev => [comment, ...prev])
    setNewComment(prev => ({ ...prev, message: "" })) // Only clear message, keep name
    setIsSubmitting(false)
  }

  const formatDate = timestamp => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div
      id="comments"
      style={{
        marginTop: "3rem",
        padding: "2rem",
        backgroundColor: "var(--color-background-alt, #f9f9f9)",
        borderRadius: "12px",
        border: "1px solid var(--border-color, #eee)",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "600",
          marginBottom: "1.5rem",
          color: "var(--color-text, #333)",
        }}
      >
        Comments ({comments.length})
      </h2>

      {/* Comment Form or Login Prompt */}
      {isLoggedIn ? (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "var(--color-background, white)",
            borderRadius: "8px",
            border: "1px solid var(--border-color, #ddd)",
          }}
        >
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "var(--color-text, #333)",
            }}
          >
            Leave a Comment
          </h3>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="comment-name"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--color-text, #333)",
              }}
            >
              Posting as
            </label>
            <input
              id="comment-name"
              type="text"
              name="name"
              value={newComment.name}
              readOnly
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border-color, #ddd)",
                borderRadius: "4px",
                fontSize: "1rem",
                backgroundColor: "var(--color-background-alt, #f9f9f9)",
                color: "var(--color-text-secondary, #666)",
                cursor: "not-allowed",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="comment-message"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "var(--color-text, #333)",
              }}
            >
              Message *
            </label>
            <textarea
              id="comment-message"
              name="message"
              value={newComment.message}
              onChange={handleInputChange}
              required
              rows="4"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border-color, #ddd)",
                borderRadius: "4px",
                fontSize: "1rem",
                backgroundColor: "var(--color-background, white)",
                color: "var(--color-text, #333)",
                resize: "vertical",
                minHeight: "100px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: isSubmitting ? "var(--color-text-secondary, #666)" : "var(--color-primary, #007acc)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
              minWidth: "140px",
            }}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div
          style={{
            marginBottom: "2rem",
            padding: "2rem",
            backgroundColor: "var(--color-background, white)",
            borderRadius: "8px",
            border: "1px solid var(--border-color, #ddd)",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "var(--color-text, #333)",
            }}
          >
            Join the Conversation
          </h3>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--color-text-secondary, #666)",
              marginBottom: "1.5rem",
              lineHeight: "1.5",
            }}
          >
            Please log in to leave a comment and join the discussion.
          </p>
          <Link
            to={`/login?returnTo=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname + "#comments" : "")}`}
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              backgroundColor: "var(--color-primary, #007acc)",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "background-color 0.2s ease",
              minWidth: "140px",
            }}
          >
            Log In to Comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              marginBottom: "1rem",
              color: "var(--color-text, #333)",
            }}
          >
            Recent Comments
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {comments.map(comment => (
              <div
                key={comment.id}
                style={{
                  padding: "1.5rem",
                  backgroundColor: "var(--color-background, white)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color, #ddd)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "var(--color-text, #333)",
                    }}
                  >
                    {comment.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-secondary, #666)",
                    }}
                  >
                    {formatDate(comment.timestamp)}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    color: "var(--color-text, #333)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {comment.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--color-text-secondary, #666)",
            fontSize: "1rem",
          }}
        >
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  )
}

export default CommentSection
