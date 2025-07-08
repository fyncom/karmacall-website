import React from "react"
import { Link } from "gatsby"
import { sanitizeFormData, sanitizeComment, sanitizeName } from "../../utils/sanitizer"
import { checkRateLimit, recordAttempt, getRateLimitStatus } from "../../utils/rateLimiter"

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
  const [rateLimitStatus, setRateLimitStatus] = React.useState(null)

  // Check login status and get user info
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId")
      const phoneNumber = localStorage.getItem("phoneNumber")
      const countryCode = localStorage.getItem("countryCode")
      const sessionId = localStorage.getItem("sessionId")

      if (userId && phoneNumber && sessionId) {
        setIsLoggedIn(true)
        // Use "KarmaCall User" as default name instead of phone number
        const displayName = "KarmaCall User"

        setUserInfo({
          userId,
          phoneNumber,
          countryCode,
          sessionId,
          displayName,
        })

        // Pre-fill the name field with the display name
        setNewComment(prev => ({
          ...prev,
          name: displayName,
        }))

        // Check rate limit status for this user
        const status = getRateLimitStatus("comments", userId)
        setRateLimitStatus(status)
      } else {
        setIsLoggedIn(false)
        setUserInfo(null)
        setRateLimitStatus(null)
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

  // Update rate limit status periodically
  React.useEffect(() => {
    if (!isLoggedIn || !userInfo?.userId) return

    const updateRateLimit = () => {
      const status = getRateLimitStatus("comments", userInfo.userId)
      setRateLimitStatus(status)
    }

    // Update immediately
    updateRateLimit()

    // Set up interval to update every second when blocked
    const interval = setInterval(() => {
      const status = getRateLimitStatus("comments", userInfo.userId)
      setRateLimitStatus(status)

      // Stop updating if no longer blocked
      if (!status.isBlocked) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isLoggedIn, userInfo?.userId])

  const handleInputChange = e => {
    const { name, value } = e.target
    setNewComment(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!newComment.name.trim() || !newComment.message.trim()) return

    // Check rate limit before processing
    if (!userInfo?.userId) {
      alert("Please log in to post comments")
      return
    }

    const rateLimitCheck = checkRateLimit("comments", userInfo.userId)
    if (!rateLimitCheck.allowed) {
      alert(rateLimitCheck.message || "Rate limit exceeded. Please wait before posting again.")
      return
    }

    setIsSubmitting(true)

    // Sanitize all form inputs
    const sanitizedData = sanitizeFormData(newComment)

    // Additional validation after sanitization
    if (!sanitizedData.name.trim() || !sanitizedData.message.trim()) {
      alert("Please enter valid name and message")
      setIsSubmitting(false)
      return
    }

    const comment = {
      id: Date.now().toString(),
      name: sanitizedData.name.trim(),
      email: sanitizedData.email.trim(),
      message: sanitizedData.message.trim(),
      timestamp: new Date().toISOString(),
      userId: userInfo?.userId || null, // Store userId to identify comment owner
    }

    // Record the attempt for rate limiting
    recordAttempt("comments", userInfo.userId)

    const updatedComments = [...comments, comment]
    setComments(updatedComments)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(`comments_${articleSlug}`, JSON.stringify(updatedComments))
    }

    // Update rate limit status
    const newStatus = getRateLimitStatus("comments", userInfo.userId)
    setRateLimitStatus(newStatus)

    // Reset form
    setNewComment({ name: userInfo?.displayName || "", email: "", message: "" })
    setIsSubmitting(false)
  }

  const handleDeleteComment = commentId => {
    const updatedComments = comments.filter(comment => comment.id !== commentId)
    setComments(updatedComments)

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(`comments_${articleSlug}`, JSON.stringify(updatedComments))
    }
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

          {/* Rate Limit Status */}
          {rateLimitStatus && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                backgroundColor: rateLimitStatus.isBlocked ? "#fff3cd" : "#d1ecf1",
                color: rateLimitStatus.isBlocked ? "#856404" : "#0c5460",
                border: `1px solid ${rateLimitStatus.isBlocked ? "#ffeaa7" : "#bee5eb"}`,
                borderRadius: "4px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>{rateLimitStatus.isBlocked ? "⚠️" : "ℹ️"}</span>
              <span>
                {rateLimitStatus.isBlocked
                  ? `Rate limit exceeded. Please wait ${rateLimitStatus.waitTimeSeconds} seconds before posting again.`
                  : `${rateLimitStatus.remainingAttempts} comment${rateLimitStatus.remainingAttempts !== 1 ? "s" : ""} remaining in this time window.`}
              </span>
            </div>
          )}

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
            disabled={isSubmitting || (rateLimitStatus && rateLimitStatus.isBlocked)}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor:
                isSubmitting || (rateLimitStatus && rateLimitStatus.isBlocked) ? "var(--color-text-secondary, #666)" : "var(--color-primary, #007acc)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: isSubmitting || (rateLimitStatus && rateLimitStatus.isBlocked) ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
              minWidth: "140px",
            }}
          >
            {isSubmitting ? "Posting..." : rateLimitStatus && rateLimitStatus.isBlocked ? "Rate Limited" : "Post Comment"}
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
                    {sanitizeName(comment.name || "Anonymous")}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--color-text-secondary, #666)",
                      }}
                    >
                      {formatDate(comment.timestamp)}
                    </div>
                    {/* Show delete button only for comments by current user */}
                    {isLoggedIn && userInfo && comment.userId === userInfo.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "transparent",
                          color: "var(--color-text-secondary, #666)",
                          border: "1px solid var(--border-color, #ddd)",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={e => {
                          e.target.style.backgroundColor = "var(--color-danger, #dc3545)"
                          e.target.style.color = "white"
                          e.target.style.borderColor = "var(--color-danger, #dc3545)"
                        }}
                        onMouseOut={e => {
                          e.target.style.backgroundColor = "transparent"
                          e.target.style.color = "var(--color-text-secondary, #666)"
                          e.target.style.borderColor = "var(--border-color, #ddd)"
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    color: "var(--color-text, #333)",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeComment(comment.message || ""),
                  }}
                />
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
