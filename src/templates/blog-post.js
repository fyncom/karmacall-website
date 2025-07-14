import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import ReactMarkdown from "react-markdown"
import { Wrapper } from "../components/Markdown-Wrapper"
import "../components/blog.css"
import { getShareCount, setMockShareCount } from "../utils/shareCounter"
import { preloadUrls } from "../utils/urlShortener"
import { generateTextSizeStyles, getFontSize } from "../components/blog_components/FontSizeSystem"
import ArticleHeader from "../components/blog_components/ArticleHeader"
import ActionBar from "../components/blog_components/ActionBar"
import TableOfContents from "../components/blog_components/TableOfContents"
import RelatedArticles from "../components/blog_components/RelatedArticles"
import FeaturedImage from "../components/blog_components/FeaturedImage"
import ScrollToTop from "../components/blog_components/ScrollToTop"
import TextSizeControl from "../components/blog_components/TextSizeControl"
import CommentSection from "../components/blog_components/CommentSection"

export default function BlogPostTemplate({ data, children, pageContext, location }) {
  const { mdx } = data
  const { frontmatter, fields, body } = mdx

  // Custom components for ReactMarkdown to add IDs to headings
  const markdownComponents = {
    h1: ({ children, ...props }) => (
      <h1 id={`heading-${children?.toString().toLowerCase().replace(/\s+/g, "-")}`} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 id={`heading-${children?.toString().toLowerCase().replace(/\s+/g, "-")}`} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 id={`heading-${children?.toString().toLowerCase().replace(/\s+/g, "-")}`} {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 id={`heading-${children?.toString().toLowerCase().replace(/\s+/g, "-")}`} {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 id={`heading-${children?.toString().toLowerCase().replace(/\s+/g, "-")}`} {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 id={`heading-${children?.toString().toLowerCase().replace(/\s+/g, "-")}`} {...props}>
        {children}
      </h6>
    ),
  }

  // State management for blog features
  const [shareCount, setShareCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [textSize, setTextSize] = useState("medium")

  // Generate text size styles from centralized system
  const textSizeStyles = generateTextSizeStyles()

  const handleTextSizeChange = newSize => {
    setTextSize(newSize)
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("textSize", newSize)
    }
  }

  const handleCommentClick = () => {
    const commentsSection = document.getElementById("comments")
    if (commentsSection) {
      commentsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Initialize on mount
  useEffect(() => {
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
      if (process.env.NODE_ENV === "development") {
        setMockShareCount(fields.slug, Math.floor(Math.random() * 100))
      }

      // Load current share count
      const currentCount = getShareCount(currentPath)
      setShareCount(currentCount)

      // Preload share URLs for better performance
      preloadUrls(currentPath)
    }
  }, [fields.slug])

  // Transform frontmatter to match existing component expectations
  const articleMetadata = {
    title: frontmatter.title,
    description: frontmatter.description,
    author: frontmatter.author,
    date: frontmatter.date,
    featuredImage: frontmatter.featuredImage,
    keywords: frontmatter.keywords || [],
    slug: fields.slug,
  }

  // SEO metadata
  const seo = {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    image: frontmatter.featuredImage?.publicURL || frontmatter.featuredImage,
    pathname: fields.slug,
  }

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Article Header */}
        <ArticleHeader articleData={articleMetadata} />

        {/* Main content container with sidebar layout */}
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start", marginTop: "0.5rem", position: "relative" }}>
          {/* Main article content */}
          <div style={{ flex: "1", minWidth: "0" }}>
            {/* Action bar with share and comment buttons */}
            <ActionBar
              articleData={articleMetadata}
              shareCount={shareCount}
              onShareCountUpdate={setShareCount}
              commentCount={commentCount}
              onCommentClick={handleCommentClick}
            />

            {/* Featured image - only show if featuredImage is provided */}
            {frontmatter.featuredImage && (
              <FeaturedImage
                src={frontmatter.featuredImage}
                alt={frontmatter.title}
                imageDescription={frontmatter.imageDescription || "Featured image for this article."}
                imageCredit={frontmatter.imageCredit || ""}
              />
            )}

            {/* Text Size Control */}
            <TextSizeControl currentSize={textSize} onSizeChange={handleTextSizeChange} />

            {/* Article content - MDX content is rendered here */}
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
                  .article-content-${textSize} h4 {
                    font-size: calc(${textSizeStyles[textSize].fontSize} * 1.1) !important;
                  }
                  .article-content-${textSize} blockquote {
                    border-left: 4px solid var(--color-primary, #007acc);
                    background: var(--color-background-alt, #f0f8ff);
                    padding: 1rem 1.5rem;
                    margin: 1.5rem 0;
                    border-radius: 4px;
                    color: var(--color-text, #333);
                  }
                  .article-content-${textSize} code {
                    background: var(--color-background-alt, #f5f5f5);
                    color: var(--color-text, #333);
                    padding: 0.2rem 0.4rem;
                    border-radius: 3px;
                    font-family: monospace;
                    font-size: 0.9em;
                  }
                  .article-content-${textSize} pre {
                    background: var(--color-background-alt, #1e1e1e);
                    color: var(--color-text, #d4d4d4);
                    padding: 1rem;
                    border-radius: 6px;
                    overflow-x: auto;
                    margin: 1.5rem 0;
                    border: 1px solid var(--border-color, #ddd);
                  }
                  .article-content-${textSize} pre code {
                    background: none;
                    padding: 0;
                    color: inherit;
                  }
                  .article-content-${textSize} ul, 
                  .article-content-${textSize} ol {
                    padding-left: 2rem;
                    margin-bottom: 1.5rem;
                    color: var(--color-text, #333);
                  }
                  .article-content-${textSize} li {
                    margin-bottom: 0.5rem;
                    color: var(--color-text, #333);
                  }
                  .article-content-${textSize} a {
                    color: var(--color-primary, #007acc);
                    text-decoration: underline;
                  }
                  .article-content-${textSize} a:hover {
                    color: var(--color-link, #005c8a);
                  }
                  .article-content-${textSize} img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 6px;
                    margin: 1.5rem 0;
                    border: 1px solid var(--border-color, #eee);
                  }
                  .article-content-${textSize} table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                    background: var(--color-background, white);
                  }
                  .article-content-${textSize} th,
                  .article-content-${textSize} td {
                    border: 1px solid var(--border-color, #ddd);
                    padding: 0.75rem;
                    text-align: left;
                    color: var(--color-text, #333);
                  }
                  .article-content-${textSize} th {
                    background: var(--color-background-alt, #f5f5f5);
                    font-weight: 600;
                    color: var(--color-text, #333);
                  }
                `}
              </style>
              <div className={`article-content-${textSize}`}>
                {/* This is where the MDX content gets rendered */}
                <MDXProvider>{children || (body && <ReactMarkdown components={markdownComponents}>{body}</ReactMarkdown>)}</MDXProvider>
              </div>
            </div>

            {/* Related Articles */}
            <RelatedArticles currentArticleSlug={fields.slug} />

            {/* Comments Section */}
            <CommentSection />
          </div>

          {/* Table of Contents Sidebar */}
          <TableOfContents />
        </div>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </Wrapper>
  )
}

// GraphQL query to fetch MDX blog post data
export const pageQuery = graphql`
  query BlogPostBySlug($id: String!) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        description
        author
        date(formatString: "YYYY-MM-DD")
        dateDisplay: date(formatString: "MMMM DD, YYYY")
        featuredImage
        keywords
        imageDescription
        imageCredit
      }
      fields {
        slug
      }
    }
  }
`
