import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"

export default function DevTemplate() {
  // This page is completely removed in production builds via gatsby-node.js
  // This is just an extra safety check
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return <div>Page not found</div>
  }

  const seo = {
    title: "Blog Template - Developer Only",
    description: "Template for creating new blog articles",
  }

  const templateContent = `---
title: "Article Title: Keep It Clear and Engaging"
date: "YYYY-MM-DD"
author: "Author Name"
featuredImage: "../../images/blog/your-image-filename.jpg"
description: "Brief description of the article (150-160 characters for SEO). This appears in search results and social shares."
---

import { Link } from "gatsby"
import { Wrapper } from "../../components/Markdown-Wrapper"
import yourImage from "../../images/blog/your-image-filename.jpg"

export const meta = {
  title: "Article Title: Keep It Clear and Engaging",
  description: "Brief description of the article (150-160 characters for SEO). This appears in search results and social shares.",
}

<Wrapper seo={meta}>

# Main Article Title

**Lead paragraph with bold opening.** This should hook the reader and summarize what they'll learn. Keep it concise but compelling.

## Section Heading

Regular paragraph text goes here. Keep paragraphs focused on one main idea. Use clear, conversational language that's easy to read.

### Subsection Heading

Use subsections to break up longer sections and improve readability.

## Key Features or Benefits

Use bullet points for lists:

* **Bold key point**: Description of the point
* **Another key point**: More details here
* **Third point**: Keep it scannable

## Data or Statistics Section

When presenting data, use tables for better readability:

<div style={{ overflowX: 'auto', margin: '20px 0' }}>
  <div style={{ display: 'table', width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border-color, #ddd)' }}>
    <div style={{ display: 'table-header-group', backgroundColor: 'var(--table-header-bg, rgba(0,0,0,0.1))', fontWeight: 'bold' }}>
      <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', padding: '12px', border: '1px solid var(--border-color, #ddd)', textAlign: 'left' }}>Metric</div>
        <div style={{ display: 'table-cell', padding: '12px', border: '1px solid var(--border-color, #ddd)', textAlign: 'left' }}>Value</div>
        <div style={{ display: 'table-cell', padding: '12px', border: '1px solid var(--border-color, #ddd)', textAlign: 'left' }}>Impact</div>
      </div>
    </div>
    <div style={{ display: 'table-row-group' }}>
      <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', padding: '12px', border: '1px solid var(--border-color, #ddd)' }}>Example Metric</div>
        <div style={{ display: 'table-cell', padding: '12px', border: '1px solid var(--border-color, #ddd)' }}>Sample Data</div>
        <div style={{ display: 'table-cell', padding: '12px', border: '1px solid var(--border-color, #ddd)' }}>Description</div>
      </div>
      <div style={{ display: 'table-row', backgroundColor: 'var(--table-alt-bg, rgba(128,128,128,0.1))' }}>
        <div style={{ display: 'table-cell', padding: '12px', border: '1px solid var(--border-color, #ddd)' }}>Another Metric</div>
        <div style={{ display: 'table-cell', padding: '12px', border: '1px solid var(--border-color, #ddd)' }}>More Data</div>
        <div style={{ display: 'table-cell', padding: '12px', border: '1px solid var(--border-color, #ddd)' }}>More Description</div>
      </div>
    </div>
  </div>
</div>

## Call-to-Action Section

End with a clear call-to-action:

<div className="button-container">
  <a className="learn-more-btn cash centered" href="https://play.google.com/store/apps/details?id=com.fyncom.robocash">
    Download KarmaCall Today!
  </a>
</div>

## Conclusion

Wrap up the article with key takeaways and next steps for readers.

---

**About the Author**: Brief author bio can go here if needed.

</Wrapper>`

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h1>Blog Article Template (Development Only)</h1>
        <p>
          <strong>This page is only visible during development.</strong>
        </p>

        <div style={{ marginBottom: "2rem" }}>
          <h2>Instructions:</h2>
          <ol>
            <li>Copy the template code below</li>
            <li>
              Create a new file: <code>your-article-name.mdx</code>
            </li>
            <li>Paste and modify the template</li>
            <li>
              Add your featured image to <code>src/images/blog/</code>
            </li>
          </ol>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h2>Template Code:</h2>
          <div
            style={{
              backgroundColor: "var(--color-code-bg, #f5f5f5)",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid var(--border-color, #ddd)",
              position: "relative",
            }}
          >
            <button
              onClick={() => navigator.clipboard.writeText(templateContent)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "0.5rem 1rem",
                backgroundColor: "var(--karmacall-green)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Copy Template
            </button>
            <pre
              style={{
                overflow: "auto",
                margin: 0,
                paddingTop: "2rem",
                fontSize: "0.9rem",
                lineHeight: "1.4",
              }}
            >
              <code>{templateContent}</code>
            </pre>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--color-background-alt, #f9f9f9)",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid var(--border-color, #ddd)",
          }}
        >
          <h3>Quick Reference:</h3>
          <ul>
            <li>
              <strong>Template file location:</strong> <code>src/pages/blog/_TEMPLATE.mdx</code>
            </li>
            <li>
              <strong>Images directory:</strong> <code>src/images/blog/</code>
            </li>
            <li>
              <strong>Recommended image size:</strong> 1200x630px
            </li>
            <li>
              <strong>Date format:</strong> YYYY-MM-DD
            </li>
          </ul>
        </div>
      </div>
    </Wrapper>
  )
}
