import React from "react"

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

  return <div className="markdown-content" dangerouslySetInnerHTML={{ __html: convertMarkdown(content) }} />
}

export default MarkdownContent
