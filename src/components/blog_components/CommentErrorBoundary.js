import React from "react"

class CommentErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error in production for monitoring
    console.error("Comment system error:", error, errorInfo)

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to error tracking service
      // errorReportingService.logError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
            margin: "1rem 0",
          }}
        >
          <h3 style={{ color: "#6c757d", marginBottom: "1rem" }}>💬 Comments Temporarily Unavailable</h3>
          <p style={{ color: "#6c757d", marginBottom: "1rem" }}>
            We're experiencing technical difficulties with the comment system. Please try refreshing the page or check back later.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default CommentErrorBoundary
