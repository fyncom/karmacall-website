import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import Seo from "../components/seo"
import { checkRateLimit, recordAttempt, getRateLimitStatus, resetRateLimit } from "../utils/rateLimiter"

const RateLimitDemo = () => {
  const [identifier, setIdentifier] = useState("demo-user")
  const [rateLimitStatus, setRateLimitStatus] = useState(null)
  const [message, setMessage] = useState("")
  const [attemptCount, setAttemptCount] = useState(0)

  // Update rate limit status when identifier changes
  useEffect(() => {
    if (identifier) {
      const status = getRateLimitStatus("comments", identifier)
      setRateLimitStatus(status)
    }
  }, [identifier])

  // Update rate limit status periodically
  useEffect(() => {
    if (!identifier) return

    const updateRateLimit = () => {
      const status = getRateLimitStatus("comments", identifier)
      setRateLimitStatus(status)
    }

    // Update immediately
    updateRateLimit()

    // Set up interval to update every second when blocked
    const interval = setInterval(() => {
      const status = getRateLimitStatus("comments", identifier)
      setRateLimitStatus(status)

      // Stop updating if no longer blocked
      if (!status.isBlocked) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [identifier])

  const handleSubmit = e => {
    e.preventDefault()

    if (!identifier) {
      alert("Please enter an identifier")
      return
    }

    // Check rate limit
    const rateLimitCheck = checkRateLimit("comments", identifier)

    if (!rateLimitCheck.allowed) {
      setMessage(`❌ Rate limited: ${rateLimitCheck.message}`)
      return
    }

    // Record the attempt
    recordAttempt("comments", identifier)

    // Update attempt count
    setAttemptCount(prev => prev + 1)

    // Update rate limit status
    const status = getRateLimitStatus("comments", identifier)
    setRateLimitStatus(status)

    setMessage(`✅ Action successful! Attempt #${attemptCount + 1}`)
  }

  const handleReset = () => {
    if (identifier) {
      resetRateLimit("comments", identifier)
      const status = getRateLimitStatus("comments", identifier)
      setRateLimitStatus(status)
      setMessage("🔄 Rate limit reset")
      setAttemptCount(0)
    }
  }

  return (
    <div>
      <Seo title="Rate Limit Demo" description="Demo page for testing rate limiting functionality" />
      <Header />
      <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1>Rate Limiting Demo</h1>
        <p>This demo shows how the rate limiting system works. The current configuration allows:</p>
        <ul>
          <li>
            <strong>3 attempts</strong> within a <strong>1-minute window</strong>
          </li>
          <li>
            <strong>5-minute block</strong> after exceeding the limit
          </li>
        </ul>

        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h3>Rate Limit Status</h3>
          {rateLimitStatus ? (
            <div>
              <p>
                <strong>Allowed:</strong> {rateLimitStatus.allowed ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <strong>Remaining Attempts:</strong> {rateLimitStatus.remainingAttempts}
              </p>
              <p>
                <strong>Blocked:</strong> {rateLimitStatus.isBlocked ? "🚫 Yes" : "✅ No"}
              </p>
              {rateLimitStatus.isBlocked && (
                <p>
                  <strong>Wait Time:</strong> {rateLimitStatus.waitTimeSeconds} seconds
                </p>
              )}
              {rateLimitStatus.resetTime && (
                <p>
                  <strong>Reset Time:</strong> {new Date(rateLimitStatus.resetTime).toLocaleTimeString()}
                </p>
              )}
            </div>
          ) : (
            <p>No rate limit data available</p>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="identifier" style={{ display: "block", marginBottom: "0.5rem" }}>
              User Identifier:
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
              placeholder="Enter user identifier (e.g., demo-user)"
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              disabled={rateLimitStatus && rateLimitStatus.isBlocked}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: rateLimitStatus && rateLimitStatus.isBlocked ? "#6c757d" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: rateLimitStatus && rateLimitStatus.isBlocked ? "not-allowed" : "pointer",
                fontSize: "1rem",
              }}
            >
              {rateLimitStatus && rateLimitStatus.isBlocked ? "Rate Limited" : "Submit Action"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Reset Rate Limit
            </button>
          </div>
        </form>

        {message && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: message.includes("❌") ? "#f8d7da" : "#d4edda",
              color: message.includes("❌") ? "#721c24" : "#155724",
              border: `1px solid ${message.includes("❌") ? "#f5c6cb" : "#c3e6cb"}`,
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            border: "1px solid #ffeaa7",
          }}
        >
          <h3>Instructions:</h3>
          <ol>
            <li>Click "Submit Action" multiple times quickly to trigger rate limiting</li>
            <li>After 3 attempts within 1 minute, you'll be blocked for 5 minutes</li>
            <li>Watch the countdown timer when blocked</li>
            <li>Use "Reset Rate Limit" to clear the rate limit for testing</li>
            <li>Try different identifiers to test separate rate limits</li>
          </ol>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default RateLimitDemo
