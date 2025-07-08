import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import { getShareCount, setMockShareCount } from "../../utils/shareCounter"
import { preloadUrls } from "../../utils/urlShortener"
import { generateTextSizeStyles, generateCSSVariables, getFontSize } from "../../components/blog_components/FontSizeSystem"
import ArticleHeader from "../../components/blog_components/ArticleHeader"
import ActionBar from "../../components/blog_components/ActionBar"
import TableOfContents from "../../components/blog_components/TableOfContents"
import RelatedArticles from "../../components/blog_components/RelatedArticles"
import FeaturedImage from "../../components/blog_components/FeaturedImage"
import ScrollToTop from "../../components/blog_components/ScrollToTop"
import TextSizeControl from "../../components/blog_components/TextSizeControl"

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
  slug: "/blog/template", // Used for share tracking - update this to match your article's URL
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function BlogTemplate() {
  const [shareCount, setShareCount] = React.useState(0)
  const [textSize, setTextSize] = React.useState("medium")

  // Generate text size styles from centralized system
  const textSizeStyles = generateTextSizeStyles()

  const handleTextSizeChange = newSize => {
    setTextSize(newSize)
  }

  // Share count handling and text size initialization
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Scroll to top when component mounts (for navigation from other articles)
      window.scrollTo({ top: 0, behavior: "instant" })

      // Load saved text size preference
      const savedTextSize = localStorage.getItem("textSize")
      if (savedTextSize && ["small", "medium", "large"].includes(savedTextSize)) {
        setTextSize(savedTextSize)
      }

      const currentPath = window.location.pathname

      // Set mock data for testing (remove in production)
      setMockShareCount(articleMetadata.slug, 42) // Mock 42 shares for testing

      // Load current share count
      const currentCount = getShareCount(currentPath)
      setShareCount(currentCount)

      // Preload share URLs for better performance
      preloadUrls(currentPath)
    }
  }, [])

  // This page is completely removed in production builds via gatsby-node.js
  // This is just an extra safety check
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return <div>Page not found</div>
  }

  // SEO metadata using articleMetadata
  const seo = {
    title: articleMetadata.title,
    description: articleMetadata.description,
    keywords: articleMetadata.keywords,
  }

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Article Header */}
        <ArticleHeader articleData={articleMetadata} />

        {/* Main content container with sidebar layout - starts at featured image level */}
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start", marginTop: "0.5rem", position: "relative" }}>
          {/* Main article content */}
          <div style={{ flex: "1", minWidth: "0" }}>
            {/* Action bar with share and comment buttons */}
            <ActionBar articleData={articleMetadata} shareCount={shareCount} onShareCountUpdate={setShareCount} />

            {/* Featured image */}
            <FeaturedImage
              src={articleMetadata.featuredImage}
              alt={articleMetadata.title}
              imageDescription="Brief description of what the image shows and its relevance to the article content."
              imageCredit="Image source, photographer, or attribution information goes here."
            />

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
                `}
              </style>
              <div className={`article-content-${textSize}`}>
                <p style={{ marginBottom: "1.5rem" }}>
                  <strong>Welcome to the JavaScript Blog Template System!</strong> This template provides a complete solution for creating KarmaCall blog
                  articles using JavaScript instead of MDX. All metadata, SEO, and advanced features are centralized in the JavaScript file for easy management.
                </p>

                <div
                  style={{
                    backgroundColor: "var(--color-background-alt, #f9f9f9)",
                    border: "1px solid var(--border-color, #eee)",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                    borderLeft: "4px solid #007acc",
                  }}
                >
                  <p style={{ margin: "0", fontWeight: "600", color: "#007acc" }}>
                    📝 <strong>Quick Start:</strong> Copy this `template.js` file, rename it to your article name (e.g., `my-article.js`), update the metadata
                    at the top, and replace this content with your article.
                  </p>
                </div>

                <h2
                  id="getting-started"
                  style={{
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Getting Started
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  The JavaScript template system centralizes all article configuration in the `articleMetadata` object at the top of the file. This approach
                  provides better maintainability and ensures consistent SEO handling across all articles.
                </p>

                <h3
                  id="copy-rename"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Step 1: Copy and Rename
                </h3>

                <p style={{ marginBottom: "1.5rem" }}>Copy `template.js` to your new article filename:</p>

                <div
                  style={{
                    backgroundColor: "#1e1e1e",
                    color: "#d4d4d4",
                    padding: "1rem",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: getFontSize("code", textSize),
                    marginBottom: "1.5rem",
                    overflow: "auto",
                  }}
                >
                  cp template.js my-awesome-article.js
                </div>

                <h3
                  id="update-metadata"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Step 2: Update Article Metadata
                </h3>

                <p style={{ marginBottom: "1.5rem" }}>Edit the `articleMetadata` object at the top of your file:</p>

                <div
                  style={{
                    backgroundColor: "#1e1e1e",
                    color: "#d4d4d4",
                    padding: "1rem",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: getFontSize("code", textSize),
                    marginBottom: "1.5rem",
                    overflow: "auto",
                  }}
                >
                  {`const articleMetadata = {
  title: "Your Compelling Article Title",
  description: "SEO description 150-160 chars for search results",
  author: "Your Name",
  date: "2024-01-15", // YYYY-MM-DD format
  featuredImage: "../../images/blog/your-image.jpg",
  keywords: ["keyword1", "keyword2", "keyword3"],
  slug: "/blog/your-article-url", // Must match filename
}`}
                </div>

                <h2
                  id="metadata-configuration"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Metadata Configuration
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>Each field in the metadata object serves a specific purpose:</p>

                <h3
                  id="required-fields"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Required Fields
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>title:</strong> Appears in browser tab, search results, and social shares
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>description:</strong> SEO meta description (150-160 characters optimal)
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>author:</strong> Displayed in article byline
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>date:</strong> Publication date in YYYY-MM-DD format
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>slug:</strong> URL path for share tracking (must match your filename)
                  </li>
                </ul>

                <h3
                  id="optional-fields"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Optional Fields
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>featuredImage:</strong> Path to hero image (place in `src/images/blog/`)
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <strong>keywords:</strong> Array of SEO keywords for additional targeting
                  </li>
                </ul>

                <h2
                  id="content-structure"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Content Structure
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>Replace this guide content with your article. Use the following structure for consistency:</p>

                <h3
                  id="heading-hierarchy"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Heading Hierarchy
                </h3>

                <div
                  style={{
                    backgroundColor: "#1e1e1e",
                    color: "#d4d4d4",
                    padding: "1rem",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    marginBottom: "1.5rem",
                    overflow: "auto",
                  }}
                >
                  {`<h2 id="section-id" style={{...}}>Main Section</h2>
<h3 id="subsection-id" style={{...}}>Subsection</h3>
<p style={{...}}>Paragraph content...</p>`}
                </div>

                <p style={{ marginBottom: "1.5rem" }}>
                  Always include `id` attributes on H2 and H3 headings for table of contents navigation. The template automatically handles smooth scrolling.
                </p>

                <h3
                  id="styling-guidelines"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Styling Guidelines
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Use CSS variables for colors: `var(--color-text, #333)`</li>
                  <li style={{ marginBottom: "0.5rem" }}>Maintain consistent spacing: `marginBottom: "1.5rem"`</li>
                  <li style={{ marginBottom: "0.5rem" }}>Keep line height readable: `lineHeight: "1.7"`</li>
                  <li style={{ marginBottom: "0.5rem" }}>Use responsive font sizes: `fontSize: "1.1rem"`</li>
                </ul>

                <h2
                  id="advanced-features"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Advanced Features
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>This template includes several advanced features that work automatically:</p>

                <h3
                  id="share-system"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Share System
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Automatic URL shortening for all share platforms</li>
                  <li style={{ marginBottom: "0.5rem" }}>Share count tracking and display</li>
                  <li style={{ marginBottom: "0.5rem" }}>UTM parameter handling and Google Analytics integration</li>
                  <li style={{ marginBottom: "0.5rem" }}>Support for 7 platforms: Copy Link, Email, Facebook, X, LinkedIn, Reddit, Bluesky</li>
                </ul>

                <h3
                  id="table-of-contents"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Table of Contents
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Automatically generated from H2 and H3 headings</li>
                  <li style={{ marginBottom: "0.5rem" }}>Smooth scrolling navigation</li>
                  <li style={{ marginBottom: "0.5rem" }}>Collapsible sidebar design</li>
                  <li style={{ marginBottom: "0.5rem" }}>Responsive mobile behavior</li>
                </ul>

                <h3
                  id="seo-optimization"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  SEO Optimization
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Automatic meta tag generation from metadata</li>
                  <li style={{ marginBottom: "0.5rem" }}>Open Graph and Twitter Card support</li>
                  <li style={{ marginBottom: "0.5rem" }}>Structured data markup</li>
                  <li style={{ marginBottom: "0.5rem" }}>Optimized for search engine indexing</li>
                </ul>

                <h2
                  id="best-practices"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Best Practices
                </h2>

                <h3
                  id="content-guidelines"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Content Guidelines
                </h3>

                <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Write engaging headlines that include target keywords</li>
                  <li style={{ marginBottom: "0.5rem" }}>Keep descriptions between 150-160 characters for optimal SEO</li>
                  <li style={{ marginBottom: "0.5rem" }}>Use descriptive H2/H3 headings for better navigation</li>
                  <li style={{ marginBottom: "0.5rem" }}>Include relevant internal and external links</li>
                  <li style={{ marginBottom: "0.5rem" }}>Optimize images for web (1200x630px for social sharing)</li>
                </ul>

                <h3
                  id="development-workflow"
                  style={{
                    fontWeight: "600",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Development Workflow
                </h3>

                <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Copy template.js to your article filename</li>
                  <li style={{ marginBottom: "0.5rem" }}>Update articleMetadata with your content</li>
                  <li style={{ marginBottom: "0.5rem" }}>Replace this guide content with your article</li>
                  <li style={{ marginBottom: "0.5rem" }}>Add featured image to `src/images/blog/`</li>
                  <li style={{ marginBottom: "0.5rem" }}>Test locally with `gatsby develop`</li>
                  <li style={{ marginBottom: "0.5rem" }}>No need to manually update table of contents - it's automatic!</li>
                  <li style={{ marginBottom: "0.5rem" }}>Commit and deploy</li>
                </ol>

                <div
                  style={{
                    backgroundColor: "#f0f8ff",
                    border: "1px solid #b0d4f1",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                    borderLeft: "4px solid #007acc",
                  }}
                >
                  <p style={{ margin: "0", fontWeight: "600", color: "#007acc" }}>
                    💡 <strong>Pro Tip:</strong> This template is only visible in development mode. It's automatically excluded from production builds, so you
                    can safely keep it as a reference while developing new articles.
                  </p>
                </div>

                <h2
                  id="conclusion"
                  style={{
                    fontSize: getFontSize("h2", textSize),
                    fontWeight: "600",
                    marginTop: "2.5rem",
                    marginBottom: "1rem",
                    color: "var(--color-text, #333)",
                  }}
                >
                  Ready to Create Your Article?
                </h2>

                <p style={{ marginBottom: "1.5rem" }}>
                  You now have everything you need to create professional blog articles using the JavaScript template system. The centralized metadata approach
                  ensures consistent SEO, while the advanced features provide a rich reading experience for your audience.
                </p>

                <p style={{ marginBottom: "1.5rem" }}>
                  Start by copying this file, updating the metadata, and replacing this content with your article. The template handles all the technical
                  details, so you can focus on creating great content.
                </p>

                <div
                  style={{
                    backgroundColor: "var(--color-background-alt, #f9f9f9)",
                    border: "2px solid #28a745",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: "0", fontWeight: "600", color: "#28a745", fontSize: "1.1rem" }}>
                    🚀 <strong>Happy Writing!</strong> Create engaging content that helps KarmaCall users and grows our community.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles Section */}
            <RelatedArticles currentArticleSlug={articleMetadata.slug} />
          </div>

          {/* Table of Contents Sidebar */}
          <TableOfContents title={articleMetadata.title} />
        </div>

        {/* Scroll-to-top button */}
        <ScrollToTop />
      </div>
    </Wrapper>
  )
}
