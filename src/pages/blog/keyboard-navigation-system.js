import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import { getShareCount, setMockShareCount } from "../../utils/shareCounter"
import { preloadUrls } from "../../utils/urlShortener"
import { generateTextSizeStyles, getFontSize } from "../../components/blog_components/FontSizeSystem"
import ArticleHeader from "../../components/blog_components/ArticleHeader"
import ActionBar from "../../components/blog_components/ActionBar"
import TableOfContents from "../../components/blog_components/TableOfContents"
import ScrollToTop from "../../components/blog_components/ScrollToTop"
import TextSizeControl from "../../components/blog_components/TextSizeControl"
import RelatedArticles from "../../components/blog_components/RelatedArticles"
import CommentSection from "../../components/blog_components/CommentSection"

// ============================================================
// ARTICLE METADATA - EDIT THIS SECTION FOR EACH NEW ARTICLE
// ============================================================
const articleMetadata = {
  title: "Keyboard Navigation System Documentation",
  description:
    "Comprehensive guide to the accessible keyboard navigation system implemented across KarmaCall's website, featuring smart detection, contextual help, and elegant user experience.",
  author: "KarmaCall Development Team",
  date: "2024-12-20",
  featuredImage: null,
  keywords: ["accessibility", "keyboard navigation", "WCAG", "web development", "user experience", "inclusive design"],
  slug: "/blog/keyboard-navigation-system",
}

//
// MAIN COMPONENT
//
export default function KeyboardNavigationSystemDoc() {
  const [shareCount, setShareCount] = React.useState(0)
  const [textSize, setTextSize] = React.useState("medium")
  const [showKeyboardHint, setShowKeyboardHint] = React.useState(false)

  // Generate text size styles from centralized system
  const textSizeStyles = generateTextSizeStyles()

  const handleTextSizeChange = newSize => {
    setTextSize(newSize)
  }

  // Detect keyboard navigation and show helpful hints
  React.useEffect(() => {
    let keyboardDetected = false
    let hintShown = false

    const handleKeyDown = e => {
      // Detect Tab key usage (keyboard navigation)
      if (e.key === "Tab" && !keyboardDetected) {
        keyboardDetected = true

        // Show hint after a short delay, but only once
        if (!hintShown) {
          setTimeout(() => {
            setShowKeyboardHint(true)
            hintShown = true

            // Hide hint after 4 seconds
            setTimeout(() => {
              setShowKeyboardHint(false)
            }, 4000)
          }, 1500)
        }
      }

      // Alt+T to jump to table of contents
      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault()
        const toc = document.getElementById("table-of-contents")
        if (toc) {
          toc.focus()
          toc.scrollIntoView({ behavior: "smooth", block: "start" })

          // Show a subtle notification
          const notification = document.createElement("div")
          notification.textContent = "Jumped to table of contents"
          notification.className = "sr-only"
          notification.setAttribute("aria-live", "polite")
          document.body.appendChild(notification)
          setTimeout(() => document.body.removeChild(notification), 1000)
        }
      }

      // Alt+C to jump to main content
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault()
        const content = document.getElementById("main-content")
        if (content) {
          content.focus()
          content.scrollIntoView({ behavior: "smooth", block: "start" })

          // Show a subtle notification
          const notification = document.createElement("div")
          notification.textContent = "Jumped to main content"
          notification.className = "sr-only"
          notification.setAttribute("aria-live", "polite")
          document.body.appendChild(notification)
          setTimeout(() => document.body.removeChild(notification), 1000)
        }
      }
    }

    const handleMouseDown = () => {
      // Hide hint if user switches to mouse
      setShowKeyboardHint(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleMouseDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  // Share count handling and text size initialization
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Scroll to top when component mounts
      window.scrollTo({ top: 0, behavior: "instant" })

      // Load saved text size preference
      const savedTextSize = localStorage.getItem("textSize")
      if (savedTextSize && ["small", "medium", "large"].includes(savedTextSize)) {
        setTextSize(savedTextSize)
      }

      const currentPath = window.location.pathname

      // Set mock data for testing
      setMockShareCount(articleMetadata.slug, 8)

      // Load current share count
      const currentCount = getShareCount(currentPath)
      setShareCount(currentCount)

      // Preload share URLs for better performance
      preloadUrls(currentPath)
    }
  }, [])

  const seo = {
    title: articleMetadata.title,
    description: articleMetadata.description,
    keywords: articleMetadata.keywords,
  }

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Keyboard Navigation Hint - only shows for keyboard users */}
        {showKeyboardHint && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              background: "var(--color-background, #fff)",
              color: "var(--color-text, #333)",
              padding: "12px 16px",
              border: "2px solid var(--color-primary, #007acc)",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 1000,
              fontSize: "0.85rem",
              maxWidth: "280px",
              animation: "slideIn 0.3s ease-out",
            }}
            role="status"
            aria-live="polite"
          >
            <strong>Keyboard Navigation:</strong>
            <br />
            <code>Alt+T</code> - Jump to table of contents
            <br />
            <code>Alt+C</code> - Jump to main content
          </div>
        )}

        {/* Article Header */}
        <ArticleHeader articleData={articleMetadata} />

        {/* Main content container with sidebar layout */}
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start", marginTop: "0.5rem", position: "relative" }}>
          {/* Main article content */}
          <div
            id="main-content"
            style={{
              flex: "1",
              minWidth: "0",
            }}
            tabIndex="-1"
          >
            {/* Action bar with share and comment buttons */}
            <ActionBar articleData={articleMetadata} shareCount={shareCount} onShareCountUpdate={setShareCount} />

            {/* Text Size Control */}
            <TextSizeControl currentSize={textSize} onSizeChange={handleTextSizeChange} />

            {/* Article content */}
            <div
              style={{
                ...textSizeStyles[textSize],
                color: "var(--color-text, #333)",
              }}
            >
              <style>
                {`
                  .article-content-${textSize} p,
                  .article-content-${textSize} li,
                  .article-content-${textSize} span,
                  .article-content-${textSize} div {
                    font-size: ${textSizeStyles[textSize].fontSize} !important;
                    line-height: ${textSizeStyles[textSize].lineHeight} !important;
                  }
                  .article-content-${textSize} h2 {
                    font-size: calc(${textSizeStyles[textSize].fontSize} * 1.45) !important;
                  }
                  .article-content-${textSize} h3 {
                    font-size: calc(${textSizeStyles[textSize].fontSize} * 1.18) !important;
                  }
                  .article-content-${textSize} code {
                    background: var(--color-background-alt, #f5f5f5);
                    padding: 0.2em 0.4em;
                    border-radius: 3px;
                    font-family: var(--font-courier);
                    font-size: 0.9em;
                  }
                  .article-content-${textSize} pre {
                    background: var(--color-background-alt, #f5f5f5);
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                    border: 1px solid var(--border-color, #eee);
                  }
                `}
              </style>
              <div className={`article-content-${textSize}`}>
                <p style={{ marginBottom: "1.5rem", fontWeight: "600" }}>
                  <strong>This documentation covers the comprehensive keyboard navigation system implemented across KarmaCall's website.</strong> The system
                  provides full accessibility compliance while maintaining an elegant, non-intrusive user experience for all users.
                </p>

                <h2
                  id="overview"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  System Overview
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  Our keyboard navigation system addresses the common accessibility challenge where users must tab through entire articles to reach navigation
                  elements like table of contents. The solution is designed with these core principles:
                </p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Invisible to mouse users:</strong> No visual clutter or skip links that interfere with the design
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Discoverable for keyboard users:</strong> Contextual hints appear only when needed
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Standard patterns:</strong> Uses familiar keyboard shortcuts and navigation patterns
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Screen reader friendly:</strong> Comprehensive ARIA support and announcements
                  </li>
                </ul>

                <h2
                  id="keyboard-shortcuts"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Keyboard Shortcuts
                </h2>

                <div
                  style={{
                    backgroundColor: "var(--color-background-alt, #f9f9f9)",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    border: "1px solid var(--border-color, #eee)",
                  }}
                >
                  <h3
                    id="global-shortcuts"
                    style={{
                      fontSize: getFontSize("h3", textSize),
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "var(--color-text, #333)",
                    }}
                  >
                    Global Shortcuts
                  </h3>
                  <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <code>Alt + T</code> - Jump to table of contents
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <code>Alt + C</code> - Jump to main content
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <code>Tab</code> - Navigate forward through interactive elements
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <code>Shift + Tab</code> - Navigate backward through interactive elements
                    </li>
                  </ul>
                </div>

                <h3
                  id="table-of-contents-shortcuts"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Table of Contents Navigation
                </h3>

                <p style={{ marginBottom: "1rem" }}>When focused on the table of contents, additional shortcuts become available:</p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <code>Enter</code> or <code>Space</code> - Expand/collapse table of contents
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <code>Arrow Up/Down</code> - Navigate between links
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <code>Home</code> - Jump to first link
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <code>End</code> - Jump to last link
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <code>Enter</code> - Navigate to selected section
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <code>Escape</code> - Close table of contents
                  </li>
                </ul>

                <h2
                  id="smart-detection"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Smart Keyboard Detection
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  The system automatically detects when users are navigating with keyboards and provides contextual help without cluttering the interface for
                  mouse users.
                </p>

                <h3
                  id="detection-mechanism"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Detection Mechanism
                </h3>

                <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Tab key detection:</strong> System monitors for Tab key usage to identify keyboard navigation
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Mouse override:</strong> Any mouse activity immediately hides keyboard-specific UI elements
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Contextual timing:</strong> Help appears after 1.5 seconds of keyboard use, ensuring intentional navigation
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>One-time display:</strong> Hints show only once per session to avoid repetitive interruptions
                  </li>
                </ol>

                <h3
                  id="hint-behavior"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Hint Behavior
                </h3>

                <p style={{ marginBottom: "1.5rem" }}>The keyboard navigation hint follows these UX principles:</p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Non-intrusive positioning:</strong> Appears in top-right corner, away from main content
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Smooth animation:</strong> Slides in from the right with CSS transitions
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Auto-dismissal:</strong> Disappears after 4 seconds automatically
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Mouse-sensitive:</strong> Hides immediately when user switches to mouse
                  </li>
                </ul>

                <h2
                  id="implementation-details"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Implementation Details
                </h2>

                <h3
                  id="core-utilities"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Core Utilities
                </h3>

                <p style={{ marginBottom: "1rem" }}>
                  The system is built around several key utilities in <code>src/utils/keyboardNavigation.js</code>:
                </p>

                <div
                  style={{
                    backgroundColor: "var(--color-background-alt, #f9f9f9)",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    border: "1px solid var(--border-color, #eee)",
                  }}
                >
                  <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "600" }}>Key Functions</h4>
                  <ul style={{ paddingLeft: "1.5rem", margin: 0 }}>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <code>createKeyboardClickHandlers()</code> - Creates accessible click handlers for interactive elements
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <code>handleListNavigation()</code> - Manages arrow key navigation within lists
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <code>handleEscapeKey()</code> - Provides consistent escape key behavior
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <code>focusUtils</code> - Focus management utilities for complex interactions
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                      <code>ariaUtils</code> - ARIA announcement and state management helpers
                    </li>
                  </ul>
                </div>

                <h3
                  id="component-integration"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Component Integration
                </h3>

                <p style={{ marginBottom: "1.5rem" }}>The keyboard navigation system is integrated across multiple components:</p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Header:</strong> Mobile menu toggle with keyboard support
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>TableOfContents:</strong> Full arrow key navigation and keyboard shortcuts
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Video thumbnails:</strong> Keyboard activation for video playback
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Modal dialogs:</strong> Escape key handling and focus management
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Interactive buttons:</strong> Consistent Enter/Space key activation
                  </li>
                </ul>

                <h2
                  id="accessibility-compliance"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Accessibility Compliance
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>The system meets and exceeds WCAG 2.1 AA standards for keyboard accessibility:</p>

                <h3
                  id="wcag-compliance"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  WCAG Guidelines Addressed
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>2.1.1 Keyboard:</strong> All functionality available via keyboard
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>2.1.2 No Keyboard Trap:</strong> Focus can always move away from any component
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>2.4.3 Focus Order:</strong> Logical and intuitive focus sequence
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>2.4.7 Focus Visible:</strong> Clear visual focus indicators
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>4.1.2 Name, Role, Value:</strong> Proper ARIA attributes and semantics
                  </li>
                </ul>

                <h3
                  id="screen-reader-support"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Screen Reader Support
                </h3>

                <p style={{ marginBottom: "1.5rem" }}>Comprehensive screen reader support includes:</p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>ARIA live regions:</strong> Announce navigation actions and state changes
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Descriptive labels:</strong> Clear context for all interactive elements
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>State announcements:</strong> Expanded/collapsed states for collapsible elements
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Navigation instructions:</strong> Contextual help for complex interactions
                  </li>
                </ul>

                <h2
                  id="testing-verification"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Testing and Verification
                </h2>

                <h3
                  id="manual-testing"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Manual Testing Checklist
                </h3>

                <p style={{ marginBottom: "1rem" }}>To verify the keyboard navigation system:</p>

                <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Tab navigation:</strong> Verify logical tab order through all interactive elements
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Keyboard shortcuts:</strong> Test Alt+T and Alt+C shortcuts work correctly
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>TOC navigation:</strong> Verify arrow keys, Enter, and Escape work in table of contents
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Focus indicators:</strong> Ensure all focused elements have visible outlines
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Smart detection:</strong> Verify hints appear only for keyboard users
                  </li>
                </ol>

                <h3
                  id="automated-testing"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Automated Testing Tools
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Lighthouse Accessibility Audit:</strong> Automated WCAG compliance checking
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>axe-core:</strong> Comprehensive accessibility testing library
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>WAVE:</strong> Web accessibility evaluation tool
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Screen readers:</strong> NVDA (Windows), VoiceOver (Mac), Orca (Linux)
                  </li>
                </ul>

                <h2
                  id="performance-considerations"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Performance Considerations
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>The keyboard navigation system is designed with performance in mind:</p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Minimal overhead:</strong> Event listeners only added when needed
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Efficient detection:</strong> Smart keyboard detection with minimal CPU impact
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>CSS-only animations:</strong> Smooth transitions without JavaScript animation loops
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Cleanup handlers:</strong> Proper event listener cleanup to prevent memory leaks
                  </li>
                </ul>

                <h2
                  id="utm-parameter-cleaning"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  UTM Parameter Cleaning
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  The website includes automatic UTM parameter cleaning to provide a cleaner user experience while preserving analytics tracking data.
                </p>

                <h3
                  id="utm-cleaning-features"
                  style={{
                    fontSize: getFontSize("h3", textSize),
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  UTM Cleaning Features
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Automatic cleaning:</strong> UTM parameters are automatically removed from URLs after analytics tracking
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Preserves tracking:</strong> Analytics data is captured before URL cleaning occurs
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Comprehensive coverage:</strong> Removes UTM parameters plus Facebook, Google, and other tracking parameters
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Preserves other parameters:</strong> Non-tracking query parameters are maintained
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>History management:</strong> Uses replaceState to avoid creating additional browser history entries
                  </li>
                </ul>

                <div
                  style={{
                    backgroundColor: "var(--color-background-alt, #f9f9f9)",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    border: "1px solid var(--border-color, #eee)",
                  }}
                >
                  <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: "600" }}>Cleaned Parameters</h4>
                  <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>The system automatically removes these tracking parameters:</p>
                  <ul style={{ paddingLeft: "1.5rem", margin: 0, fontSize: "0.85rem" }}>
                    <li style={{ marginBottom: "0.3rem" }}>
                      <strong>UTM:</strong> utm_source, utm_medium, utm_campaign, utm_term, utm_content
                    </li>
                    <li style={{ marginBottom: "0.3rem" }}>
                      <strong>Facebook:</strong> fbclid (Facebook Click ID)
                    </li>
                    <li style={{ marginBottom: "0.3rem" }}>
                      <strong>Google:</strong> gclid (Google Click ID)
                    </li>
                    <li style={{ marginBottom: "0.3rem" }}>
                      <strong>Other platforms:</strong> msclkid, twclid, ttclid, rdt_cid, and more
                    </li>
                  </ul>
                </div>

                <h2
                  id="future-enhancements"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Future Enhancements
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>Planned improvements to the keyboard navigation system:</p>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Custom shortcut configuration:</strong> Allow users to customize keyboard shortcuts
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Voice control integration:</strong> Support for voice navigation commands
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Gesture support:</strong> Touch gesture equivalents for mobile devices
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>Advanced focus management:</strong> Smarter focus restoration and context awareness
                  </li>
                </ul>

                <div
                  style={{
                    backgroundColor: "var(--color-background-alt, #f9f9f9)",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    marginTop: "2rem",
                    border: "1px solid var(--border-color, #eee)",
                  }}
                >
                  <h3
                    id="developer-resources"
                    style={{
                      fontSize: getFontSize("h3", textSize),
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "var(--color-text, #333)",
                    }}
                  >
                    Developer Resources
                  </h3>
                  <p style={{ margin: 0, color: "var(--color-text, #333)" }}>
                    For technical implementation details, code examples, and integration guides, refer to the keyboard navigation utility at{" "}
                    <code>src/utils/keyboardNavigation.js</code>. For questions about accessibility implementation or suggestions for improvements, contact the
                    development team at{" "}
                    <a href="mailto:dev@karmacall.com" style={{ color: "var(--color-link, #007bff)", fontWeight: "600" }}>
                      dev@karmacall.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles Section */}
            <RelatedArticles currentArticleSlug={articleMetadata.slug} />

            {/* Comment Section */}
            <CommentSection articleSlug={articleMetadata.slug} articleTitle={articleMetadata.title} />
          </div>

          {/* Sidebar with Table of Contents */}
          <div
            id="table-of-contents"
            tabIndex="-1"
            style={{
              flexShrink: 0,
            }}
          >
            <TableOfContents title="Documentation Contents" />
          </div>
        </div>

        {/* Scroll to top button */}
        <ScrollToTop />
      </div>
    </Wrapper>
  )
}
