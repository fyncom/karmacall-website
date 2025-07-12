import React from "react"
import { getFontSize } from "../../components/blog_components/FontSizeSystem"
import BlogLayout from "../../components/blog_components/BlogLayout"
import BlogContent from "../../components/blog_components/BlogContent"
import CodeBlock from "../../components/blog_components/CodeBlock"
import CalloutBox from "../../components/blog_components/CalloutBox"
import useBlogMetadata from "../../components/blog_components/useBlogMetadata"

// ============================================================
// ARTICLE METADATA - EDIT THIS SECTION FOR EACH NEW ARTICLE
// ============================================================
const articleMetadata = {
  title: "JavaScript Blog Template Guide - How to Create Articles",
  description:
    "Complete guide for developers on how to use the JavaScript template system for creating KarmaCall blog articles. Includes metadata setup, content structure, and advanced features.",
  author: "Draven Grondona",
  date: "2025-06-07", // Format: YYYY-MM-DD
  featuredImage: "../../images/blog/your-image-filename.jpg", // Place image in src/images/blog/

  // 2 Core Topics (2-3), Audiance Tags (1-2), Article Type (1-2), Technical / Concept Tags (1-2), Trends Tag (1), Product Tag (1-2)  |  (any of these are optional)
  keywords: ["javascript", "blog", "template", "employee", "how to", "guide", "metadata", "comand line interface", "cli", "karmacall", "fyncom"], // Optional: for additional SEO targeting
  slug: "/blog/template-refactored", // Used for share tracking - update this to match your article's URL
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function BlogTemplateRefactored() {
  const { shareCount, setShareCount, commentCount, setCommentCount, textSize, setTextSize, handleTextSizeChange, handleCommentClick } =
    useBlogMetadata(articleMetadata)

  return (
    <BlogLayout
      articleMetadata={articleMetadata}
      shareCount={shareCount}
      setShareCount={setShareCount}
      commentCount={commentCount}
      setCommentCount={setCommentCount}
      textSize={textSize}
      setTextSize={handleTextSizeChange}
      handleCommentClick={handleCommentClick}
    >
      <BlogContent textSize={textSize}>
        <p style={{ marginBottom: "1.5rem" }}>
          <strong>Welcome to the Refactored JavaScript Blog Template System!</strong> This template demonstrates how components have been broken down for better
          maintainability and reusability.
        </p>

        <CalloutBox type="info" icon="📝" title="Quick Start">
          <p style={{ margin: "0" }}>
            Copy this refactored template, update the metadata at the top, and replace this content with your article. Notice how much cleaner the code is!
          </p>
        </CalloutBox>

        <h2
          id="component-breakdown"
          style={{
            fontWeight: "600",
            marginTop: "2.5rem",
            marginBottom: "1rem",
            color: "var(--color-text, #333)",
          }}
        >
          Component Breakdown
        </h2>

        <p style={{ marginBottom: "1.5rem" }}>The blog system has been broken down into these reusable components:</p>

        <h3
          id="layout-components"
          style={{
            fontWeight: "600",
            marginTop: "2rem",
            marginBottom: "1rem",
            color: "var(--color-text, #333)",
          }}
        >
          Layout Components
        </h3>

        <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>BlogLayout:</strong> Main container and layout structure
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>BlogContent:</strong> Content wrapper with text size handling
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>BlogSidebar:</strong> Table of contents container
          </li>
        </ul>

        <h3
          id="utility-components"
          style={{
            fontWeight: "600",
            marginTop: "2rem",
            marginBottom: "1rem",
            color: "var(--color-text, #333)",
          }}
        >
          Utility Components
        </h3>

        <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>CodeBlock:</strong> Consistent code formatting
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>CalloutBox:</strong> Info boxes, warnings, tips
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>useBlogMetadata:</strong> State management hook
          </li>
        </ul>

        <h2
          id="code-examples"
          style={{
            fontSize: getFontSize("h2", textSize),
            fontWeight: "600",
            marginTop: "2.5rem",
            marginBottom: "1rem",
            color: "var(--color-text, #333)",
          }}
        >
          Code Examples
        </h2>

        <p style={{ marginBottom: "1.5rem" }}>Here's how to use the new components:</p>

        <h3
          id="code-blocks"
          style={{
            fontWeight: "600",
            marginTop: "2rem",
            marginBottom: "1rem",
            color: "var(--color-text, #333)",
          }}
        >
          Code Blocks
        </h3>

        <p style={{ marginBottom: "1rem" }}>Use the CodeBlock component for consistent code formatting:</p>

        <CodeBlock textSize={textSize} language="javascript">
          {`import CodeBlock from "../../components/blog_components/CodeBlock"

// In your article:
<CodeBlock textSize={textSize} language="javascript">
  Your code here
</CodeBlock>`}
        </CodeBlock>

        <p style={{ marginBottom: "1rem" }}>For inline code, use:</p>

        <CodeBlock textSize={textSize} language="jsx">
          {`<CodeBlock inline textSize={textSize}>inline code</CodeBlock>`}
        </CodeBlock>

        <h3
          id="callout-boxes"
          style={{
            fontWeight: "600",
            marginTop: "2rem",
            marginBottom: "1rem",
            color: "var(--color-text, #333)",
          }}
        >
          Callout Boxes
        </h3>

        <p style={{ marginBottom: "1rem" }}>Different types of callout boxes:</p>

        <CalloutBox type="tip" icon="💡" title="Pro Tip">
          <p style={{ margin: "0" }}>This is a tip callout box. Great for highlighting useful information.</p>
        </CalloutBox>

        <CalloutBox type="warning" icon="⚠️" title="Warning">
          <p style={{ margin: "0" }}>This is a warning callout box. Use it to highlight important caveats.</p>
        </CalloutBox>

        <CalloutBox type="error" icon="❌" title="Error">
          <p style={{ margin: "0" }}>This is an error callout box. Use it to highlight critical issues.</p>
        </CalloutBox>

        <CalloutBox type="success" icon="✅" title="Success">
          <p style={{ margin: "0" }}>This is a success callout box. Use it to highlight achievements or completed steps.</p>
        </CalloutBox>

        <h2
          id="benefits"
          style={{
            fontSize: getFontSize("h2", textSize),
            fontWeight: "600",
            marginTop: "2.5rem",
            marginBottom: "1rem",
            color: "var(--color-text, #333)",
          }}
        >
          Benefits of Component Breakdown
        </h2>

        <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Maintainability:</strong> Changes to layout or styling happen in one place
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Reusability:</strong> Components can be used across different articles
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Consistency:</strong> Uniform styling and behavior across all articles
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Cleaner Code:</strong> Article files focus on content, not layout logic
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong>Easier Testing:</strong> Individual components can be tested in isolation
          </li>
        </ul>

        <CalloutBox type="success" icon="🚀" title="Ready to Use">
          <p style={{ margin: "0" }}>
            The refactored template is now ready for production use. Copy this file, update the metadata, and start writing your content with these powerful
            components!
          </p>
        </CalloutBox>
      </BlogContent>
    </BlogLayout>
  )
}
