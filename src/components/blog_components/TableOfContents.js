import React from "react"

const TableOfContents = ({ title, className, style }) => {
  const [tocCollapsed, setTocCollapsed] = React.useState(false)
  const [headings, setHeadings] = React.useState([])

  const toggleToc = () => {
    setTocCollapsed(!tocCollapsed)
  }

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
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

  return (
    <div
      className={className}
      style={{
        width: "280px",
        flexShrink: 0,
        position: "sticky",
        top: "2rem",
        alignSelf: "flex-start",
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-background-alt, #f9f9f9)",
          border: "1px solid var(--border-color, #eee)",
          borderRadius: "8px",
          padding: "1.5rem",
        }}
      >
        <div
          onClick={toggleToc}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: tocCollapsed ? "0" : "1rem",
            position: "relative",
            cursor: "pointer",
            marginLeft: "-1.5rem",
            marginRight: "-1.5rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              margin: "0",
              color: "white",
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
          >
            ▼
          </div>
        </div>

        {!tocCollapsed && (
          <nav>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {headings.map((heading, index) => (
                <li key={heading.id} style={{ marginBottom: "0.5rem" }}>
                  <a
                    href={`#${heading.id}`}
                    onClick={e => handleSmoothScroll(e, heading.id)}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      lineHeight: "1.4",
                      display: "block",
                      padding: "0.25rem 0",
                      borderLeft: "3px solid transparent",
                      paddingLeft: "0.75rem",
                      transition: "all 0.2s ease",
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
                    >
                      {heading.children.map((child, childIndex) => (
                        <li key={child.id} style={{ marginBottom: "0.25rem" }}>
                          <a
                            href={`#${child.id}`}
                            onClick={e => handleSmoothScroll(e, child.id)}
                            style={{
                              color: "#e0e0e0",
                              textDecoration: "none",
                              fontSize: "0.85rem",
                              fontWeight: "500",
                              lineHeight: "1.4",
                              display: "block",
                              padding: "0.25rem 0",
                              paddingLeft: "0.75rem",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {child.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {headings.length === 0 && (
                <li
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    color: "var(--color-text-secondary, #666)",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                  }}
                >
                  No headings found. Add H2 or H3 elements with id attributes to generate the table of contents.
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </div>
  )
}

export default TableOfContents
