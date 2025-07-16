import React, { useState, useEffect } from "react";
import { marked } from "marked";

const MarkdownContent = ({ content }) => {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    if (content) {
      // Use a dynamic import to load DOMPurify only on the client-side
      import('dompurify').then(({ default: DOMPurify }) => {
        // DOMPurify should be destructured from the imported module
        setSanitizedContent(DOMPurify.sanitize(marked(content)));
      });
    }
  }, [content]);

  if (!sanitizedContent) {
    return null; // You can add a loading spinner here if you prefer
  }

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default MarkdownContent;
