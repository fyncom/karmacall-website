import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { formatVoteScore, getTotalCommentCount } from "../../utils/numberFormatter"
import { getRelativeTime, formatDate } from "../../utils/timeFormatter"
import { sanitizeComment, sanitizeName, sanitizeEmail } from "../../utils/sanitizer"
import { validateEmail, validateName, validateMessage } from "../../utils/inputValidation"
import { checkRateLimit, recordAttempt } from "../../utils/rateLimiter"

// Mobile detection hook
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Transform Cusdis comment format to our expected format
const transformCusdisComment = cusdisComment => {
  if (process.env.NODE_ENV === "development") {
    console.log("Transforming comment:", cusdisComment)
  }

  return {
    id: cusdisComment.id,
    author: cusdisComment.by_nickname || "Anonymous",
    text: cusdisComment.content || "",
    date: new Date(cusdisComment.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    likes: 0, // Cusdis doesn't have built-in likes, so we start with 0
    replies: cusdisComment.replies && cusdisComment.replies.data ? cusdisComment.replies.data.map(transformCusdisComment) : [],
    approved: true, // Comments from the API are already approved
  }
}

const CommentSection = ({ articleSlug, articleTitle, onCommentCountChange }) => {
  const cusdisAppId = process.env.GATSBY_CUSDIS
  const commentRef = useRef(null)
  const isMobile = useMobile()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [expandedComments, setExpandedComments] = useState(new Set())
  const [collapsingComments, setCollapsingComments] = useState(new Set())
  const [expandingComments, setExpandingComments] = useState(new Set())
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [commentVotes, setCommentVotes] = useState({}) // Store votes: { commentId: { likes: 5, dislikes: 2, userVote: 'like'|'dislike'|null } }
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [sortBy, setSortBy] = useState(() => {
    // Load saved sort preference from localStorage, default to "top"
    if (typeof window !== "undefined") {
      return localStorage.getItem("comments_sort_preference") || "top"
    }
    return "top"
  })
  const [topSortedComments, setTopSortedComments] = useState([])

  // Production logging (only errors)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("CommentSection - Cusdis App ID:", cusdisAppId)
      console.log("CommentSection - Article Slug:", articleSlug)
      console.log("CommentSection - Article Title:", articleTitle)
    }
  }, [cusdisAppId, articleSlug, articleTitle])

  // Update comment count when comments change
  useEffect(() => {
    if (onCommentCountChange) {
      const totalCount = getTotalCommentCount(comments)
      onCommentCountChange(totalCount)
    }
  }, [comments, onCommentCountChange])

  // Load saved user info and votes from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedNickname = localStorage.getItem("cusdis_nickname")
      const savedEmail = localStorage.getItem("cusdis_email")
      const savedVotes = localStorage.getItem(`comment_votes_${articleSlug}`)

      if (savedNickname) setNickname(savedNickname)
      if (savedEmail) setEmail(savedEmail)
      if (savedVotes) {
        try {
          setCommentVotes(JSON.parse(savedVotes))
        } catch (e) {
          console.warn("Failed to parse saved votes:", e)
        }
      }
    }
  }, [articleSlug])

  // Save nickname to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && nickname) {
      localStorage.setItem("cusdis_nickname", nickname)
    }
  }, [nickname])

  // Save email to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined" && email) {
      localStorage.setItem("cusdis_email", email)
    }
  }, [email])

  // Save votes to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined" && Object.keys(commentVotes).length > 0) {
      localStorage.setItem(`comment_votes_${articleSlug}`, JSON.stringify(commentVotes))
    }
  }, [commentVotes, articleSlug])

  // Save sort preference to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("comments_sort_preference", sortBy)
    }
  }, [sortBy])

  // Function to recursively collect all comment IDs that have replies
  const getAllCommentIdsWithReplies = comments => {
    const ids = []
    const processComment = comment => {
      if (comment.replies && comment.replies.length > 0) {
        ids.push(comment.id)
        comment.replies.forEach(processComment)
      }
    }
    comments.forEach(processComment)
    return ids
  }

  // Initialize expanded comments when comments load (expand all by default)
  // Also calculate the initial top sorting that will be preserved
  useEffect(() => {
    if (comments.length > 0) {
      const allCommentIdsWithReplies = getAllCommentIdsWithReplies(comments)

      // Set all comments as expanding initially for animation
      setExpandingComments(new Set(allCommentIdsWithReplies))
      setExpandedComments(new Set(allCommentIdsWithReplies))

      // Clean up expanding state after animation
      setTimeout(() => {
        setExpandingComments(new Set())
      }, 300)

      // Calculate top sorting once on page load
      const commentsWithVotes = comments.map(comment => ({
        ...comment,
        voteData: getVoteData(comment.id),
      }))

      const initialTopSorted = commentsWithVotes.sort((a, b) => {
        const scoreA = a.voteData.score
        const scoreB = b.voteData.score
        if (scoreA !== scoreB) {
          return scoreB - scoreA // Higher score first
        }
        // If scores are equal, sort by most likes
        return b.voteData.likes - a.voteData.likes
      })

      setTopSortedComments(initialTopSorted)
    }
  }, [comments])

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
    if (!cusdisAppId || cusdisAppId === "YOUR_CUSDIS_APP_ID" || cusdisAppId === "undefined") {
      console.log("Cusdis App ID not configured, showing configuration message")
      setLoadingComments(false)
      return
    }

    // Fetch comments from Cusdis API
    const fetchComments = async () => {
      try {
        if (process.env.NODE_ENV === "development") {
          console.log("Fetching comments from Cusdis API...")
        }
        const response = await fetch(`https://cusdis.com/api/open/comments?appId=${cusdisAppId}&pageId=${articleSlug}`)
        if (response.ok) {
          const data = await response.json()
          if (process.env.NODE_ENV === "development") {
            console.log("Comments fetched successfully:", data)
            console.log("Raw comment data:", data.data)

            // Check each comment's approval status
            if (data.data && data.data.data && data.data.data.length > 0) {
              data.data.data.forEach((comment, index) => {
                console.log(`Comment ${index}:`, {
                  id: comment.id,
                  content: comment.content,
                  approved: comment.approved,
                  by_nickname: comment.by_nickname,
                })
              })
            }
          }

          // Access the correct nested data structure: data.data.data
          const transformedComments = (data.data && data.data.data ? data.data.data : []).map(transformCusdisComment)
          if (process.env.NODE_ENV === "development") {
            console.log("Transformed comments:", transformedComments)
          }
          setComments(transformedComments)
          if (process.env.NODE_ENV === "development") {
            console.log("Comments state updated with", transformedComments.length, "comments")
          }
        } else {
          console.error("Failed to fetch comments - Response not OK:", response.status, response.statusText)
          setComments([])
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
        setComments([])
      } finally {
        setLoadingComments(false)
      }
    }

    fetchComments()

    // Also load the Cusdis script for potential future use
    if (commentRef.current) {
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
    }
  }, [cusdisAppId, articleSlug])

  // Function to refresh comments
  const refreshComments = useCallback(async () => {
    if (!cusdisAppId || cusdisAppId === "YOUR_CUSDIS_APP_ID" || cusdisAppId === "undefined") {
      return
    }

    try {
      console.log("Refreshing comments...")
      const response = await fetch(`https://cusdis.com/api/open/comments?appId=${cusdisAppId}&pageId=${articleSlug}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Comments refreshed:", data)
        console.log("Refresh - Raw comment data:", data.data)

        // Access the correct nested data structure: data.data.data
        const transformedComments = (data.data && data.data.data ? data.data.data : []).map(transformCusdisComment)
        setComments(transformedComments)
      } else {
        console.error("Failed to refresh comments:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error refreshing comments:", error)
    }
  }, [cusdisAppId, articleSlug])

  // Utility functions needed by useMemo
  const getVoteData = commentId => {
    const voteData = commentVotes[commentId] || { likes: 0, dislikes: 0, userVote: null }
    const score = voteData.likes - voteData.dislikes
    return { ...voteData, score }
  }

  const getTotalReplyCount = comment => {
    if (!comment.replies || comment.replies.length === 0) {
      return 0
    }

    let total = comment.replies.length
    comment.replies.forEach(reply => {
      total += getTotalReplyCount(reply)
    })

    return total
  }

  // Memoized sorted comments - must be before early returns
  const getSortedComments = useMemo(() => {
    if (sortBy === "top") {
      // Use the cached top sorting calculated on page load
      // Update vote data for display but preserve the original order
      return topSortedComments.map(comment => ({
        ...comment,
        voteData: getVoteData(comment.id),
      }))
    } else {
      // Sort by most recent (assuming comment.date is a valid date string)
      const commentsWithVotes = comments.map(comment => ({
        ...comment,
        voteData: getVoteData(comment.id),
      }))
      return commentsWithVotes.sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
      })
    }
  }, [comments, sortBy, topSortedComments, commentVotes])

  if (!cusdisAppId || cusdisAppId === "YOUR_CUSDIS_APP_ID" || cusdisAppId === "undefined") {
    // In production, don't show setup instructions to regular users
    if (process.env.NODE_ENV === "production") {
      return (
        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f8f9fa", color: "#6c757d", borderRadius: "8px" }}>
          <h3>💬 Comments</h3>
          <p>Comments are temporarily unavailable. Please check back later.</p>
        </div>
      )
    }

    // Development mode - show setup instructions
    return (
      <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "8px" }}>
        <h3>💬 Comment System Setup Required</h3>
        <p>
          <strong>For site administrator:</strong> To enable comments, you need to configure the Cusdis comment system:
        </p>
        <ol style={{ paddingLeft: "1.5rem", margin: "1rem 0" }}>
          <li>
            Sign up for a free account at{" "}
            <a href="https://cusdis.com" target="_blank" rel="noopener noreferrer">
              cusdis.com
            </a>
          </li>
          <li>Create a new website/app in your Cusdis dashboard</li>
          <li>Copy your App ID from the dashboard</li>
          <li>
            Add <code>GATSBY_CUSDIS=your_app_id_here</code> to your <code>.env.development</code> and <code>.env.production</code> files
          </li>
          <li>Restart the development server</li>
        </ol>
        <p>
          <strong>Current status:</strong> GATSBY_CUSDIS = "{cusdisAppId || "undefined"}"
        </p>
      </div>
    )
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage("")

    if (process.env.NODE_ENV === "development") {
      console.log("Submitting comment to Cusdis API...")
    }

    // Input validation and sanitization
    const sanitizedNickname = sanitizeName(nickname)
    const sanitizedEmail = sanitizeEmail(email)
    const sanitizedComment = sanitizeComment(comment)

    // Validate inputs
    const nameValidation = validateName(sanitizedNickname, { minLength: 2, maxLength: 50 })
    const emailValidation = validateEmail(sanitizedEmail)
    const commentValidation = validateMessage(sanitizedComment, { minLength: 5, maxLength: 2000 })

    if (!nameValidation.isValid) {
      setSubmitMessage(`Name error: ${nameValidation.errors[0]}`)
      setSubmitting(false)
      return
    }

    if (!emailValidation.isValid) {
      setSubmitMessage(`Email error: ${emailValidation.errors[0]}`)
      setSubmitting(false)
      return
    }

    if (!commentValidation.isValid) {
      setSubmitMessage(`Comment error: ${commentValidation.errors[0]}`)
      setSubmitting(false)
      return
    }

    // Rate limiting check
    const identifier = `${sanitizedEmail}_${typeof window !== "undefined" ? window.location.pathname : ""}`
    const rateLimitResult = checkRateLimit("comments", identifier)

    if (!rateLimitResult.allowed) {
      setSubmitMessage(rateLimitResult.message || "Too many comments. Please wait before posting again.")
      setSubmitting(false)
      return
    }

    try {
      // Submit to Cusdis API
      const response = await fetch("https://cusdis.com/api/open/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appId: cusdisAppId,
          pageId: articleSlug,
          pageTitle: articleTitle,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          nickname: sanitizedNickname,
          email: sanitizedEmail,
          content: sanitizedComment,
        }),
      })

      if (process.env.NODE_ENV === "development") {
        console.log("Comment submission response:", response.status, response.statusText)
      }

      if (response.ok) {
        const responseData = await response.json()
        if (process.env.NODE_ENV === "development") {
          console.log("Comment submission successful:", responseData)
        }

        // Record successful attempt for rate limiting
        recordAttempt("comments", identifier)

        // Check if comment needs approval
        if (responseData.data && responseData.data.approved === false) {
          setSubmitMessage("Thank you! Your comment has been submitted and is waiting for approval. It will appear once reviewed.")
        } else {
          setSubmitMessage("Comment posted successfully!")
        }

        setComment("")

        // Always refresh comments to show any that are approved
        await refreshComments()

        // Clear success message after 5 seconds for approval messages, 3 for regular
        const timeout = responseData.data && responseData.data.approved === false ? 8000 : 3000
        setTimeout(() => setSubmitMessage(""), timeout)
      } else {
        const errorText = await response.text()
        console.error("Comment submission failed:", response.status, errorText)
        throw new Error(`Failed to post comment: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      setSubmitMessage(`Error posting comment: ${error.message}`)
      setTimeout(() => setSubmitMessage(""), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (commentId, replyText) => {
    setSubmitting(true)
    setSubmitMessage("")

    console.log("Submitting reply to Cusdis API...")

    // Input validation and sanitization for replies
    const sanitizedNickname = sanitizeName(nickname)
    const sanitizedEmail = sanitizeEmail(email)
    const sanitizedReply = sanitizeComment(replyText)

    // Validate inputs
    const nameValidation = validateName(sanitizedNickname, { minLength: 2, maxLength: 50 })
    const emailValidation = validateEmail(sanitizedEmail)
    const replyValidation = validateMessage(sanitizedReply, { minLength: 5, maxLength: 2000 })

    if (!nameValidation.isValid) {
      setSubmitMessage(`Name error: ${nameValidation.errors[0]}`)
      setSubmitting(false)
      return
    }

    if (!emailValidation.isValid) {
      setSubmitMessage(`Email error: ${emailValidation.errors[0]}`)
      setSubmitting(false)
      return
    }

    if (!replyValidation.isValid) {
      setSubmitMessage(`Reply error: ${replyValidation.errors[0]}`)
      setSubmitting(false)
      return
    }

    // Rate limiting check for replies
    const identifier = `${sanitizedEmail}_${typeof window !== "undefined" ? window.location.pathname : ""}`
    const rateLimitResult = checkRateLimit("comments", identifier)

    if (!rateLimitResult.allowed) {
      setSubmitMessage(rateLimitResult.message || "Too many replies. Please wait before posting again.")
      setSubmitting(false)
      return
    }

    try {
      // Submit reply to Cusdis API
      const response = await fetch("https://cusdis.com/api/open/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appId: cusdisAppId,
          pageId: articleSlug,
          pageTitle: articleTitle,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          nickname: sanitizedNickname,
          email: sanitizedEmail,
          content: sanitizedReply,
          parentId: commentId,
        }),
      })

      console.log("Reply submission response:", response.status, response.statusText)

      if (response.ok) {
        const responseData = await response.json()
        console.log("Reply submission successful:", responseData)

        // Record successful attempt for rate limiting
        recordAttempt("comments", identifier)

        // Check if reply needs approval
        if (responseData.data && responseData.data.approved === false) {
          setSubmitMessage("Thank you! Your reply has been submitted and is waiting for approval. It will appear once reviewed.")
        } else {
          setSubmitMessage("Reply posted successfully!")
        }

        setReplyingTo(null)
        setReplyText("")

        // Always refresh comments to show any that are approved
        await refreshComments()

        // Clear success message after 8 seconds for approval messages, 3 for regular
        const timeout = responseData.data && responseData.data.approved === false ? 8000 : 3000
        setTimeout(() => setSubmitMessage(""), timeout)
      } else {
        const errorText = await response.text()
        console.error("Reply submission failed:", response.status, errorText)
        throw new Error(`Failed to post reply: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error posting reply:", error)
      setSubmitMessage(`Error posting reply: ${error.message}`)
      setTimeout(() => setSubmitMessage(""), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleReplies = commentId => {
    const isExpanded = expandedComments.has(commentId)

    if (isExpanded) {
      // Start collapse animation
      setCollapsingComments(prev => new Set(prev).add(commentId))

      // After animation completes, actually collapse
      setTimeout(() => {
        setExpandedComments(prev => {
          const newSet = new Set(prev)
          newSet.delete(commentId)
          return newSet
        })
        setCollapsingComments(prev => {
          const newSet = new Set(prev)
          newSet.delete(commentId)
          return newSet
        })
      }, 300)
    } else {
      // Start expand animation
      setExpandingComments(prev => new Set(prev).add(commentId))

      // Immediately add to expanded (content appears in DOM)
      setExpandedComments(prev => new Set(prev).add(commentId))

      // Use setTimeout to trigger the animation after DOM update
      setTimeout(() => {
        // This triggers the CSS transition from 0 to full height
        setExpandingComments(prev => {
          const newSet = new Set(prev)
          newSet.delete(commentId)
          return newSet
        })
      }, 10) // Small delay to ensure DOM is updated
    }
  }

  const startReply = commentId => {
    setReplyingTo(commentId)
    setReplyText("")
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyText("")
  }

  // Vote handling functions
  const handleVote = (commentId, voteType) => {
    setCommentVotes(prevVotes => {
      const currentVote = prevVotes[commentId] || { likes: 0, dislikes: 0, userVote: null }
      const newVotes = { ...prevVotes }

      // If user is voting the same way, remove their vote (toggle off)
      if (currentVote.userVote === voteType) {
        newVotes[commentId] = {
          ...currentVote,
          [voteType === "like" ? "likes" : "dislikes"]: Math.max(0, currentVote[voteType === "like" ? "likes" : "dislikes"] - 1),
          userVote: null,
        }
      }
      // If user is switching votes, adjust both counts
      else if (currentVote.userVote && currentVote.userVote !== voteType) {
        const oldVoteType = currentVote.userVote
        newVotes[commentId] = {
          ...currentVote,
          [oldVoteType === "like" ? "likes" : "dislikes"]: Math.max(0, currentVote[oldVoteType === "like" ? "likes" : "dislikes"] - 1),
          [voteType === "like" ? "likes" : "dislikes"]: currentVote[voteType === "like" ? "likes" : "dislikes"] + 1,
          userVote: voteType,
        }
      }
      // If user is voting for the first time
      else {
        newVotes[commentId] = {
          ...currentVote,
          [voteType === "like" ? "likes" : "dislikes"]: currentVote[voteType === "like" ? "likes" : "dislikes"] + 1,
          userVote: voteType,
        }
      }

      return newVotes
    })
  }

  // Responsive style functions
  const getResponsiveStyles = () => {
    const basePadding = isMobile ? "0.75rem" : "1rem"
    const baseFontSize = isMobile ? "0.85rem" : "0.9rem"
    const smallFontSize = isMobile ? "0.75rem" : "0.8rem"
    const buttonSize = isMobile ? "14px" : "28px"
    const buttonFontSize = isMobile ? "0.55rem" : "0.75rem"
    const scoreFontSize = isMobile ? "0.75rem" : "0.8rem"
    const scorePadding = isMobile ? "0 0.4rem" : "0 0.5rem"
    const replyButtonPadding = isMobile ? "0.15rem 0.3rem" : "0.4rem 0.8rem"
    const replyButtonFontSize = isMobile ? "0.6rem" : "0.8rem"
    const nestedMargin = isMobile ? "1rem" : "1.25rem"
    const nestedPadding = isMobile ? "0.5rem" : "0.75rem"

    return {
      commentItem: {
        padding: basePadding,
        backgroundColor: isDarkMode ? "#2a2a2a" : "#f8f9fa",
        borderRadius: "6px",
        marginBottom: "0.75rem",
        border: `1px solid ${isDarkMode ? "#333" : "#e1e5e9"}`,
      },
      nestedComment: {
        marginLeft: nestedMargin,
        marginTop: "0.75rem",
        paddingLeft: nestedPadding,
        borderLeft: `2px solid ${isDarkMode ? "#444" : "#ddd"}`,
      },
      commentHeader: {
        display: "grid",
        width: "100%",
        marginBottom: "0.5rem",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        textAlign: "left",
      },
      commentAuthor: {
        fontWeight: "600",
        color: isDarkMode ? "#66b3ff" : "#007bff",
        fontSize: baseFontSize,
        marginBottom: "0",
        textAlign: "left",
        gridColumn: "1",
      },
      commentText: {
        color: isDarkMode ? "#e1e5e9" : "#333",
        fontSize: baseFontSize,
        lineHeight: "1.4",
        marginBottom: "0.5rem",
      },
      commentDate: {
        color: isDarkMode ? "#999" : "#666",
        fontSize: smallFontSize,
        marginBottom: "0",
        textAlign: "right",
        gridColumn: "2",
      },
      votingButton: {
        width: buttonSize,
        height: buttonSize,
        padding: "0",
        margin: "0 0.125rem 0 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        fontSize: buttonFontSize,
        cursor: "pointer",
        transition: "all 0.2s",
      },
      scoreDisplay: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: scoreFontSize,
        fontWeight: "600",
        minWidth: "fit-content",
        padding: scorePadding,
        margin: "0 0.125rem 0 0",
      },
      replyButton: {
        padding: replyButtonPadding,
        fontSize: replyButtonFontSize,
      },
      commentActions: {
        display: isMobile ? "grid" : "flex",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "auto",
        gridTemplateRows: isMobile ? "auto auto" : "auto",
        alignItems: "center",
        justifyContent: isMobile ? "stretch" : "space-between",
        marginTop: "0.75rem",
        gap: isMobile ? "0.5rem" : "0",
      },
      commentVoting: {
        display: "flex",
        alignItems: "center",
        gap: "0",
        gridColumn: isMobile ? "1" : "auto",
        gridRow: isMobile ? "2" : "auto",
        justifySelf: isMobile ? "start" : "auto",
      },
      commentReplyActions: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        gridColumn: isMobile ? "2" : "auto",
        gridRow: isMobile ? "2" : "auto",
        justifySelf: isMobile ? "end" : "auto",
      },
    }
  }

  const styles = getResponsiveStyles()

  // Function to get custom button sizes - can be called with different size parameters
  const getButtonSizes = (sizeMultiplier = 1) => {
    const baseButtonSize = isMobile ? "16px" : "28px"
    const baseButtonFontSize = isMobile ? "0.55rem" : "0.75rem"
    const baseReplyPadding = isMobile ? "0.2rem 0.4rem" : "0.4rem 0.8rem"
    const baseReplyFontSize = isMobile ? "0.6rem" : "0.8rem"

    return {
      votingButton: {
        ...styles.votingButton,
        width: `calc(${baseButtonSize} * ${sizeMultiplier})`,
        height: `calc(${baseButtonSize} * ${sizeMultiplier})`,
        fontSize: `calc(${baseButtonFontSize} * ${sizeMultiplier})`,
      },
      replyButton: {
        ...styles.replyButton,
        padding:
          sizeMultiplier === 1
            ? baseReplyPadding
            : `calc(${baseReplyPadding.split(" ")[0]} * ${sizeMultiplier}) calc(${baseReplyPadding.split(" ")[1]} * ${sizeMultiplier})`,
        fontSize: `calc(${baseReplyFontSize} * ${sizeMultiplier})`,
      },
    }
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

  const likeButtonStyle = {
    padding: "0.4rem 0.8rem",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
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

  const renderComment = (comment, depth = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0
    const isExpanded = expandedComments.has(comment.id)
    const isReplying = replyingTo === comment.id
    const canReply = nickname.trim() && email.trim()
    const voteData = getVoteData(comment.id)
    const { likes, dislikes, score, userVote } = voteData

    const handleCommentClick = e => {
      // Don't toggle if clicking on interactive elements
      if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
        return
      }
      // Only toggle if comment has replies
      if (hasReplies) {
        toggleReplies(comment.id)
      }
    }

    return (
      <div key={comment.id} style={depth > 0 ? styles.nestedComment : {}}>
        <div
          style={{
            ...styles.commentItem,
            cursor: hasReplies ? "pointer" : "default",
          }}
          className="comment-item"
          onClick={handleCommentClick}
        >
          {/* Comment header */}
          <div className="comment-header" style={styles.commentHeader}>
            <div className="comment-author" style={styles.commentAuthor}>
              {comment.author}
            </div>
            <div className="comment-date" style={styles.commentDate} title={formatDate(comment.date, { includeTime: true })}>
              {getRelativeTime(comment.date)}
            </div>
          </div>
          <div className="comment-text" style={styles.commentText} dangerouslySetInnerHTML={{ __html: sanitizeComment(comment.text) }} />

          <div className="comment-actions" style={styles.commentActions}>
            {/* Left side: Voting buttons with score in between */}
            <div className="comment-voting" style={styles.commentVoting}>
              {/* Like Button */}
              <button
                className="comment-like-button"
                style={{
                  ...styles.votingButton,
                  backgroundColor:
                    userVote === "like" ? (isDarkMode ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.1)") : isDarkMode ? "#2a2a2a" : "#f8f9fa",
                  color: userVote === "like" ? "#28a745" : isDarkMode ? "#999" : "#666",
                  border: `1px solid ${userVote === "like" ? "#28a745" : isDarkMode ? "#444" : "#ddd"}`,
                }}
                onClick={() => handleVote(comment.id, "like")}
                onMouseOver={e => {
                  e.target.style.color = "#28a745"
                  e.target.style.backgroundColor = isDarkMode ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.1)"
                  e.target.style.borderColor = "#28a745"
                }}
                onMouseOut={e => {
                  e.target.style.color = userVote === "like" ? "#28a745" : isDarkMode ? "#999" : "#666"
                  e.target.style.backgroundColor =
                    userVote === "like" ? (isDarkMode ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.1)") : isDarkMode ? "#2a2a2a" : "#f8f9fa"
                  e.target.style.borderColor = userVote === "like" ? "#28a745" : isDarkMode ? "#444" : "#ddd"
                }}
                onFocus={e => {
                  e.target.style.color = "#28a745"
                  e.target.style.backgroundColor = isDarkMode ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.1)"
                  e.target.style.borderColor = "#28a745"
                }}
                onBlur={e => {
                  e.target.style.color = userVote === "like" ? "#28a745" : isDarkMode ? "#999" : "#666"
                  e.target.style.backgroundColor =
                    userVote === "like" ? (isDarkMode ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.1)") : isDarkMode ? "#2a2a2a" : "#f8f9fa"
                  e.target.style.borderColor = userVote === "like" ? "#28a745" : isDarkMode ? "#444" : "#ddd"
                }}
                title={userVote === "like" ? "Remove like" : "Like this comment"}
              >
                👍
              </button>

              {/* Score Display */}
              <span
                className="comment-score"
                style={{
                  ...styles.scoreDisplay,
                  color: score > 0 ? "#28a745" : score < 0 ? "#dc3545" : isDarkMode ? "#999" : "#666",
                }}
                title={`Net score: ${score > 0 ? "+" : ""}${score} (${likes} likes, ${dislikes} dislikes)`}
              >
                {formatVoteScore(score)}
              </span>

              {/* Dislike Button */}
              <button
                className="comment-dislike-button"
                style={{
                  ...styles.votingButton,
                  backgroundColor:
                    userVote === "dislike" ? (isDarkMode ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.1)") : isDarkMode ? "#2a2a2a" : "#f8f9fa",
                  color: userVote === "dislike" ? "#dc3545" : isDarkMode ? "#999" : "#666",
                  border: `1px solid ${userVote === "dislike" ? "#dc3545" : isDarkMode ? "#444" : "#ddd"}`,
                }}
                onClick={() => handleVote(comment.id, "dislike")}
                onMouseOver={e => {
                  e.target.style.color = "#dc3545"
                  e.target.style.backgroundColor = isDarkMode ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.1)"
                  e.target.style.borderColor = "#dc3545"
                }}
                onMouseOut={e => {
                  e.target.style.color = userVote === "dislike" ? "#dc3545" : isDarkMode ? "#999" : "#666"
                  e.target.style.backgroundColor =
                    userVote === "dislike" ? (isDarkMode ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.1)") : isDarkMode ? "#2a2a2a" : "#f8f9fa"
                  e.target.style.borderColor = userVote === "dislike" ? "#dc3545" : isDarkMode ? "#444" : "#ddd"
                }}
                onFocus={e => {
                  e.target.style.color = "#dc3545"
                  e.target.style.backgroundColor = isDarkMode ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.1)"
                  e.target.style.borderColor = "#dc3545"
                }}
                onBlur={e => {
                  e.target.style.color = userVote === "dislike" ? "#dc3545" : isDarkMode ? "#999" : "#666"
                  e.target.style.backgroundColor =
                    userVote === "dislike" ? (isDarkMode ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.1)") : isDarkMode ? "#2a2a2a" : "#f8f9fa"
                  e.target.style.borderColor = userVote === "dislike" ? "#dc3545" : isDarkMode ? "#444" : "#ddd"
                }}
                title={userVote === "dislike" ? "Remove dislike" : "Dislike this comment"}
              >
                👎
              </button>
            </div>

            {/* Right side: Reply button and show replies */}
            <div className="comment-reply-actions" style={styles.commentReplyActions}>
              {hasReplies && (
                <button
                  style={{
                    ...expandButtonStyle,
                    ...styles.replyButton,
                  }}
                  onClick={() => toggleReplies(comment.id)}
                  onMouseOver={e => (e.target.style.color = isDarkMode ? "#ccc" : "#333")}
                  onMouseOut={e => (e.target.style.color = isDarkMode ? "#999" : "#666")}
                  onFocus={e => (e.target.style.color = isDarkMode ? "#ccc" : "#333")}
                  onBlur={e => (e.target.style.color = isDarkMode ? "#999" : "#666")}
                >
                  {isExpanded ? "▼" : "▶"} {getTotalReplyCount(comment)} {getTotalReplyCount(comment) === 1 ? "reply" : "replies"}
                </button>
              )}

              <button
                style={{
                  ...replyButtonStyle,
                  ...styles.replyButton,
                  opacity: canReply ? 1 : 0.5,
                  cursor: canReply ? "pointer" : "not-allowed",
                  color: canReply ? (isDarkMode ? "#66b3ff" : "#007bff") : isDarkMode ? "#555" : "#999",
                  borderColor: canReply ? (isDarkMode ? "#66b3ff" : "#007bff") : isDarkMode ? "#555" : "#999",
                }}
                onClick={() => canReply && startReply(comment.id)}
                disabled={!canReply}
                title={!canReply ? "Please fill in your nickname and email above to reply" : ""}
                onMouseOver={e => {
                  if (canReply) {
                    e.target.style.backgroundColor = isDarkMode ? "#66b3ff" : "#007bff"
                    e.target.style.color = "white"
                  }
                }}
                onMouseOut={e => {
                  if (canReply) {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.color = isDarkMode ? "#66b3ff" : "#007bff"
                  }
                }}
                onFocus={e => {
                  if (canReply) {
                    e.target.style.backgroundColor = isDarkMode ? "#66b3ff" : "#007bff"
                    e.target.style.color = "white"
                  }
                }}
                onBlur={e => {
                  if (canReply) {
                    e.target.style.backgroundColor = "transparent"
                    e.target.style.color = isDarkMode ? "#66b3ff" : "#007bff"
                  }
                }}
              >
                Reply
              </button>
            </div>
          </div>

          {isReplying && (
            <div style={replyFormStyle}>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: isDarkMode ? "#999" : "#666",
                  marginBottom: "0.75rem",
                  fontStyle: "italic",
                }}
              >
                Replying as: {nickname} ({email})
              </div>
              <textarea
                placeholder={`Reply to ${comment.author}...`}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                style={{ ...textareaStyle, minHeight: "80px" }}
                maxLength={2000}
                autoComplete="off"
                spellCheck="true"
                rows="3"
              />
              <div style={{ marginTop: "0.75rem" }}>
                <button
                  style={{
                    ...buttonStyle,
                    ...smallButtonStyle,
                    opacity: replyText.trim() && !submitting ? 1 : 0.5,
                    cursor: replyText.trim() && !submitting ? "pointer" : "not-allowed",
                  }}
                  onClick={() => replyText.trim() && !submitting && handleReply(comment.id, replyText)}
                  disabled={!replyText.trim() || submitting}
                  onMouseOver={e => {
                    if (replyText.trim() && !submitting) {
                      e.target.style.backgroundColor = "#0056b3"
                    }
                  }}
                  onMouseOut={e => {
                    if (replyText.trim() && !submitting) {
                      e.target.style.backgroundColor = "#007bff"
                    }
                  }}
                  onFocus={e => {
                    if (replyText.trim() && !submitting) {
                      e.target.style.backgroundColor = "#0056b3"
                    }
                  }}
                  onBlur={e => {
                    if (replyText.trim() && !submitting) {
                      e.target.style.backgroundColor = "#007bff"
                    }
                  }}
                >
                  {submitting ? "Posting..." : "Reply"}
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
                  onFocus={e => {
                    e.target.style.backgroundColor = isDarkMode ? "#333" : "#f8f9fa"
                  }}
                  onBlur={e => {
                    e.target.style.backgroundColor = "transparent"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {hasReplies && (isExpanded || collapsingComments.has(comment.id)) && (
          <div
            style={{
              overflow: "hidden",
              transition: "max-height 0.3s ease-out, opacity 0.2s ease-out, transform 0.3s ease-out",
              maxHeight: collapsingComments.has(comment.id) ? "0" : expandingComments.has(comment.id) ? "0" : "1000px",
              opacity: collapsingComments.has(comment.id) ? 0 : expandingComments.has(comment.id) ? 0 : 1,
              transform: expandingComments.has(comment.id) ? "translateY(-10px)" : "translateY(0)",
            }}
          >
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
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
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              style={inputStyle}
              required
              maxLength={50}
              autoComplete="name"
              spellCheck="false"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              required
              maxLength={254}
              autoComplete="email"
              spellCheck="false"
            />
          </div>
          <textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={textareaStyle}
            required
            maxLength={2000}
            autoComplete="off"
            spellCheck="true"
            rows="4"
          />
          <div style={{ marginTop: "1rem" }}>
            <button
              type="submit"
              style={{
                ...buttonStyle,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
              disabled={submitting}
              onMouseOver={e => !submitting && (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={e => !submitting && (e.target.style.backgroundColor = "#007bff")}
              onFocus={e => !submitting && (e.target.style.backgroundColor = "#0056b3")}
              onBlur={e => !submitting && (e.target.style.backgroundColor = "#007bff")}
            >
              {submitting ? "Posting..." : "Comment"}
            </button>
            {submitMessage && (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  backgroundColor: submitMessage.includes("Error") ? (isDarkMode ? "#4a1e1e" : "#f8d7da") : isDarkMode ? "#1e4a1e" : "#d4edda",
                  color: submitMessage.includes("Error") ? (isDarkMode ? "#ff6b6b" : "#721c24") : isDarkMode ? "#5cb85c" : "#155724",
                  fontSize: "0.9rem",
                  border: `1px solid ${submitMessage.includes("Error") ? (isDarkMode ? "#6b2929" : "#f5c6cb") : isDarkMode ? "#2d5a2d" : "#c3e6cb"}`,
                }}
              >
                {submitMessage}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Comments */}
      <div style={recentCommentsStyle}>
        <div style={{ marginBottom: "1rem" }}>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              ...sectionTitleStyle,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              cursor: "pointer",
              appearance: "auto", // Show the dropdown arrow
              padding: "0",
              margin: "0",
            }}
          >
            <option value="top">Top</option>
            <option value="recent">Recent</option>
          </select>
        </div>
        {loadingComments ? (
          <div style={{ textAlign: "center", padding: "2rem", color: isDarkMode ? "#999" : "#666" }}>Loading comments...</div>
        ) : comments.length > 0 ? (
          getSortedComments.map(comment => renderComment(comment))
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", color: isDarkMode ? "#999" : "#666" }}>No comments yet. Be the first to comment!</div>
        )}
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
