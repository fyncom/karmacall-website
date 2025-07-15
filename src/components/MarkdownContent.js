import React from "react"

let DOMPurify = null
if (typeof window !== "undefined") {
  // Only import DOMPurify in the browser
  DOMPurify = require("dompurify")?.default || require("dompurify")
}

const MarkdownContent = ({ content }) => {
  if (!content) {
    return null
  }

  // Simple markdown to HTML conversion for basic formatting
  const convertMarkdown = text => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br />")
  }

  const html = convertMarkdown(content)
  // Only sanitize in the browser (DOMPurify is not available in SSR)
  const sanitizedHtml = DOMPurify ? DOMPurify.sanitize(html) : html

  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export default MarkdownContent
