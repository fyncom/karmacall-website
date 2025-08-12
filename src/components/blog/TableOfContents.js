import React from "react"
// import { createKeyboardClickHandlers, handleListNavigation, handleEscapeKey, focusUtils } from "../../utils/keyboardNavigation"

const TableOfContents = ({ title, className, style }) => {
  const [tocCollapsed, setTocCollapsed] = React.useState(false)
  const [headings, setHeadings] = React.useState([])
  const [focusedIndex, setFocusedIndex] = React.useState(-1)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const tocRef = React.useRef(null)
  const linksRef = React.useRef([])

  const toggleToc = () => {
    setTocCollapsed(!tocCollapsed)
    setFocusedIndex(-1) // Reset focus when toggling
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setFocusedIndex(-1) // Reset focus when toggling
  }

  // Handle focus from skip link
  React.useEffect(() => {
    const handleFocus = () => {
      // If TOC is collapsed and gets focus (likely from skip link), expand it
      if (tocCollapsed) {
        setTocCollapsed(false)
      }
    }

    const tocElement = tocRef.current
    if (tocElement) {
      tocElement.addEventListener("focus", handleFocus)
      return () => tocElement.removeEventListener("focus", handleFocus)
    }
  }, [tocCollapsed])

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      // Close mobile menu after navigation
      setIsMobileMenuOpen(false)
      // Announce to screen readers
      if (typeof window !== "undefined") {
        const announcement = `Navigated to ${targetElement.textContent || targetId}`
        const announcer = document.createElement("div")
        announcer.setAttribute("aria-live", "polite")
        announcer.setAttribute("aria-atomic", "true")
        announcer.className = "sr-only"
        announcer.textContent = announcement
        document.body.appendChild(announcer)
        setTimeout(() => document.body.removeChild(announcer), 1000)
      }
    }
  }

  // Generate table of contents from headings
  React.useEffect(() => {
    const generateTOC = () => {
      if (typeof window !== "undefined") {
        // Find all H2 and H3 elements with IDs in document order
        const allHeadings = Array.from(document.querySelectorAll("h2[id], h3[id]"))

        const headingsList = []
        let currentH2 = null

        allHeadings.forEach(heading => {
          if (heading.tagName === "H2") {
            // Start a new H2 section
            currentH2 = {
              id: heading.id,
              text: heading.textContent,
              level: 2,
              children: [],
            }
            headingsList.push(currentH2)
          } else if (heading.tagName === "H3" && currentH2) {
            // Add H3 as child of current H2
            currentH2.children.push({
              id: heading.id,
              text: heading.textContent,
              level: 3,
            })
          }
        })

        setHeadings(headingsList)
        console.log("📋 Generated table of contents:", headingsList)
      }
    }

    // Generate TOC after component mounts and content is rendered
    const timer = setTimeout(generateTOC, 100)

    return () => clearTimeout(timer)
  }, [])

  // Prevent body scrolling when mobile TOC is open
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "unset"
      }

      // Cleanup on unmount
      return () => {
        document.body.style.overflow = "unset"
      }
    }
  }, [isMobileMenuOpen])

  // Create flat list of all links for keyboard navigation
  const flattenedLinks = React.useMemo(() => {
    const links = []
    headings.forEach(heading => {
      links.push(heading)
      heading.children.forEach(child => {
        links.push(child)
      })
    })
    return links
  }, [headings])

  // Handle keyboard navigation within the TOC
  const handleTocKeyDown = e => {
    if (tocCollapsed && !isMobileMenuOpen) return
  }

  // Handle link activation with Enter key
  const handleLinkKeyDown = (e, targetId, index) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSmoothScroll(e, targetId)
    }

    // Update focused index when tabbing through links
    if (e.key === "Tab") {
      setFocusedIndex(index)
    }
  }

  return (
    <>
      {/* Mobile TOC overlay - only visible on mobile when open */}
      {isMobileMenuOpen && (
        <div
          className="mobile-toc-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1001,
            display: "none", // Hidden by default, shown via CSS media query
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "var(--color-background, white)",
              borderRadius: "12px",
              padding: "1.5rem",
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              width: "320px",
            }}
            onClick={e => e.stopPropagation()}
            onKeyDown={handleTocKeyDown}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  margin: "0",
                  color: "var(--color-text, #333)",
                }}
              >
                {title}
              </h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "var(--color-text, #333)",
                  padding: "4px",
                }}
                aria-label="Close table of contents"
              >
                ✕
              </button>
            </div>
            <nav aria-label="Table of contents navigation">
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
                role="list"
              >
                {headings.map((heading, index) => {
                  const flatIndex = flattenedLinks.findIndex(link => link.id === heading.id)
                  return (
                    <li key={heading.id} style={{ marginBottom: "0.5rem" }} role="listitem">
                      <a
                        href={`#${heading.id}`}
                        ref={el => (linksRef.current[flatIndex] = el)}
                        onClick={e => handleSmoothScroll(e, heading.id)}
                        onKeyDown={e => handleLinkKeyDown(e, heading.id, flatIndex)}
                        onFocus={() => setFocusedIndex(flatIndex)}
                        style={{
                          color: "var(--color-text, #333)",
                          textDecoration: "none",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          lineHeight: "1.4",
                          display: "block",
                          padding: "0.5rem 0",
                          borderLeft: "3px solid transparent",
                          paddingLeft: "0.75rem",
                          transition: "all 0.2s ease",
                          ...(focusedIndex === flatIndex && {
                            borderLeft: "3px solid var(--color-primary, #007acc)",
                            backgroundColor: "var(--color-focus-bg, rgba(0, 122, 204, 0.1))",
                          }),
                        }}
                      >
                        {heading.text}
                      </a>
                      {heading.children.length > 0 && (
                        <ul
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: "0.5rem 0 0 1rem",
                          }}
                          role="list"
                        >
                          {heading.children.map((child, childIndex) => {
                            const childFlatIndex = flattenedLinks.findIndex(link => link.id === child.id)
                            return (
                              <li key={child.id} style={{ marginBottom: "0.25rem" }} role="listitem">
                                <a
                                  href={`#${child.id}`}
                                  ref={el => (linksRef.current[childFlatIndex] = el)}
                                  onClick={e => handleSmoothScroll(e, child.id)}
                                  onKeyDown={e => handleLinkKeyDown(e, child.id, childFlatIndex)}
                                  onFocus={() => setFocusedIndex(childFlatIndex)}
                                  style={{
                                    color: "var(--color-text-secondary, #666)",
                                    textDecoration: "none",
                                    fontSize: "0.85rem",
                                    fontWeight: "500",
                                    lineHeight: "1.4",
                                    display: "block",
                                    padding: "0.4rem 0",
                                    paddingLeft: "0.75rem",
                                    transition: "all 0.2s ease",
                                    ...(focusedIndex === childFlatIndex && {
                                      borderLeft: "3px solid var(--color-primary, #007acc)",
                                      backgroundColor: "var(--color-focus-bg, rgba(0, 122, 204, 0.1))",
                                    }),
                                  }}
                                >
                                  {child.text}
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop TOC - hidden on mobile */}
      <div
        className={`desktop-toc ${className || ""}`}
        style={{
          width: "280px",
          flexShrink: 0,
          position: "sticky",
          top: "2rem",
          alignSelf: "flex-start",
          ...style,
        }}
        ref={tocRef}
        onKeyDown={handleTocKeyDown}
      >
        <div
          style={{
            backgroundColor: "var(--color-background-alt, #f9f9f9)",
            border: "1px solid var(--border-color, #eee)",
            borderRadius: "8px",
            padding: "1.5rem",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                margin: "0",
                color: "var(--color-text, #333)",
                pointerEvents: "none",
                lineHeight: "1.3",
              }}
            >
              {title}
            </h3>
            <div
              style={{
                fontSize: "0.6rem",
                color: "var(--color-text, #333)",
                transition: "transform 0.2s ease",
                transform: tocCollapsed ? "rotate(90deg)" : "rotate(0deg)",
                pointerEvents: "none",
                lineHeight: "1",
              }}
              aria-hidden="true"
            >
              ▼
            </div>
          </div>

          {!tocCollapsed && (
            <nav id="toc-content" aria-label="Table of contents navigation">
              <div className="sr-only" aria-live="polite">
                Table of contents. Use arrow keys to navigate, Enter to select, Escape to close.
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
                role="list"
              >
                {headings.map((heading, index) => {
                  const flatIndex = flattenedLinks.findIndex(link => link.id === heading.id)
                  return (
                    <li key={heading.id} style={{ marginBottom: "0.5rem" }} role="listitem">
                      <a
                        href={`#${heading.id}`}
                        ref={el => (linksRef.current[flatIndex] = el)}
                        onClick={e => handleSmoothScroll(e, heading.id)}
                        onKeyDown={e => handleLinkKeyDown(e, heading.id, flatIndex)}
                        onFocus={() => setFocusedIndex(flatIndex)}
                        aria-describedby={`toc-level-${heading.level}`}
                        style={{
                          color: "var(--color-text, #333)",
                          textDecoration: "none",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          lineHeight: "1.4",
                          display: "block",
                          padding: "0.25rem 0",
                          borderLeft: "3px solid transparent",
                          paddingLeft: "0.75rem",
                          transition: "all 0.2s ease",
                          ...(focusedIndex === flatIndex && {
                            borderLeft: "3px solid var(--color-primary, #007acc)",
                            backgroundColor: "var(--color-focus-bg, rgba(0, 122, 204, 0.1))",
                          }),
                        }}
                      >
                        {heading.text}
                      </a>
                      {heading.children.length > 0 && (
                        <ul
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: "0.5rem 0 0 1rem",
                          }}
                          role="list"
                        >
                          {heading.children.map((child, childIndex) => {
                            const childFlatIndex = flattenedLinks.findIndex(link => link.id === child.id)
                            return (
                              <li key={child.id} style={{ marginBottom: "0.25rem" }} role="listitem">
                                <a
                                  href={`#${child.id}`}
                                  ref={el => (linksRef.current[childFlatIndex] = el)}
                                  onClick={e => handleSmoothScroll(e, child.id)}
                                  onKeyDown={e => handleLinkKeyDown(e, child.id, childFlatIndex)}
                                  onFocus={() => setFocusedIndex(childFlatIndex)}
                                  aria-describedby={`toc-level-${child.level}`}
                                  style={{
                                    color: "var(--color-text-secondary, #666)",
                                    textDecoration: "none",
                                    fontSize: "0.85rem",
                                    fontWeight: "500",
                                    lineHeight: "1.4",
                                    display: "block",
                                    padding: "0.25rem 0",
                                    paddingLeft: "0.75rem",
                                    transition: "all 0.2s ease",
                                    ...(focusedIndex === childFlatIndex && {
                                      borderLeft: "3px solid var(--color-primary, #007acc)",
                                      backgroundColor: "var(--color-focus-bg, rgba(0, 122, 204, 0.1))",
                                    }),
                                  }}
                                >
                                  {child.text}
                                </a>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                })}
                {headings.length === 0 && (
                  <li
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      color: "var(--color-text-secondary, #666)",
                      fontSize: "0.9rem",
                      fontStyle: "italic",
                    }}
                    role="listitem"
                  >
                    No headings found. Add H2 or H3 elements with id attributes to generate the table of contents.
                  </li>
                )}
              </ul>
              {/* Hidden accessibility descriptions */}
              <div className="sr-only">
                <div id="toc-level-2">Main section</div>
                <div id="toc-level-3">Subsection</div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </>
  )
}

export default TableOfContents
