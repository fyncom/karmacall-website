import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"

export default function Template() {
  // This page is completely removed in production builds via gatsby-node.js
  // This is just an extra safety check
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return <div>Page not found</div>
  }

  const seo = {
    title: "Blog Template - Developer Only",
    description: "Template for creating new blog articles",
  }

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        {/* Blog post layout */}
        <div style={{ marginBottom: "3rem" }}>
          {/* Title */}
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              lineHeight: "1.2",
              marginBottom: "1rem",
              color: "var(--color-text, #333)",
            }}
          >
            Your Article Title Goes Here
          </h1>

          {/* Meta information */}
          <div
            className="blog-meta"
            style={{
              marginBottom: "2rem",
              fontSize: "1rem",
              borderBottom: "1px solid var(--border-color, #eee)",
              paddingBottom: "1rem",
            }}
          >
            <span className="blog-author">Author Name</span>
            <span className="blog-date">March 15, 2024</span>
          </div>

          {/* Placeholder content */}
          <div
            style={{
              lineHeight: "1.7",
              fontSize: "1.1rem",
              color: "var(--color-text, #333)",
            }}
          >
            <p style={{ marginBottom: "1.5rem" }}>
              <strong>This is where your lead paragraph would go.</strong> It should hook the reader and summarize what they'll learn from your article. Keep it
              engaging and concise.
            </p>

            <p style={{ marginBottom: "1.5rem" }}>
              This is regular paragraph text. You can write about your topic here, explaining key concepts and providing valuable insights to your readers. Make
              sure to break up long content into digestible paragraphs.
            </p>

            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginTop: "2.5rem",
                marginBottom: "1rem",
                color: "var(--color-text, #333)",
              }}
            >
              Section Heading Example
            </h2>

            <p style={{ marginBottom: "1.5rem" }}>
              Use headings to organize your content and make it scannable. This helps readers find the information they're looking for quickly.
            </p>

            <p style={{ marginBottom: "1.5rem" }}>
              You can continue adding more paragraphs, lists, images, and other content elements as needed for your specific article.
            </p>
          </div>
        </div>

        {/* Developer note */}
        <div
          style={{
            backgroundColor: "var(--color-background-alt, #f9f9f9)",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid var(--border-color, #ddd)",
            marginTop: "3rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "var(--color-text-secondary, #666)",
              fontStyle: "italic",
            }}
          >
            <strong>Developer Note:</strong> This is a template page only visible during development. Replace the placeholder content above with your actual
            article content.
          </p>
        </div>
      </div>
    </Wrapper>
  )
}
