import React, { useState, useEffect } from "react"
import { Wrapper } from "./Markdown-Wrapper"
import "./blog.css"
import { generateTextSizeStyles } from "./blog_components/FontSizeSystem"
import { trackPageView } from "../utils/analytics"
import ArticleHeader from "./blog_components/ArticleHeader"
import ActionBar from "./blog_components/ActionBar"
import TableOfContents from "./blog_components/TableOfContents"
import RelatedArticles from "./blog_components/RelatedArticles"
import FeaturedImage from "./blog_components/FeaturedImage"
import ScrollToTop from "./blog_components/ScrollToTop"
import TextSizeControl from "./blog_components/TextSizeControl"
import CommentSection from "./blog_components/CommentSection"

export default function BlogPost({ 
  title, 
  description, 
  author, 
  date, 
  featuredImage, 
  keywords = [], 
  imageDescription, 
  imageCredit,
  children 
}) {
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
      commentsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Load saved text size preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTextSize = localStorage.getItem("textSize")
      if (savedTextSize) {
        setTextSize(savedTextSize)
      }

      const currentPath = window.location.pathname

      // Track blog post view in both GA and PostHog
      trackPageView(currentPath, title, {
        article_author: author,
        article_date: date,
        article_keywords: keywords
      })
    }
  }, [title, author, date, keywords])

  // Transform frontmatter to match existing component expectations
  const articleMetadata = {
    title: title,
    description: description,
    author: author,
    date: date,
    featuredImage: featuredImage,
    keywords: keywords || [],
    slug: typeof window !== "undefined" ? window.location.pathname : "",
  }

  // SEO metadata
  const seo = {
    title: title,
    description: description,
    image: featuredImage,
    article: true,
  }

  return (
    <Wrapper seo={seo}>
      <div className="blog-post-container">
        {/* Inject dynamic text size styles */}
        <style dangerouslySetInnerHTML={{ __html: textSizeStyles }} />

        <div 
          className={`blog-post-content text-size-${textSize}`}
          style={{
            fontSize: textSize === "small" ? "0.9rem" : textSize === "large" ? "1.1rem" : "1rem",
            lineHeight: textSize === "small" ? "1.4" : textSize === "large" ? "1.7" : "1.6",
          }}
        >
          {/* Article Header */}
          <ArticleHeader 
            title={title}
            description={description}
            author={author}
            date={date}
            readingTime="5 min read" // You can calculate this dynamically if needed
          />

          {/* Featured Image */}
          {featuredImage && (
            <FeaturedImage 
              src={featuredImage}
              alt={title}
              imageDescription={imageDescription}
              imageCredit={imageCredit}
            />
          )}

          {/* Action Bar */}
          <ActionBar
            articleData={articleMetadata}
            shareCount={shareCount}
            commentCount={commentCount}
            onCommentClick={handleCommentClick}
          />

          {/* Table of Contents - will be populated by the TOC component */}
          <TableOfContents />

          {/* Text Size Control */}
          <TextSizeControl 
            currentSize={textSize}
            onSizeChange={handleTextSizeChange}
          />

          {/* Main Content */}
          <div className="blog-content">
            {children}
          </div>

          {/* Related Articles */}
          <RelatedArticles currentArticleSlug={articleMetadata.slug} />

          {/* Comments Section */}
          <CommentSection 
            articleSlug={articleMetadata.slug}
            articleTitle={title}
            onCommentCountChange={setCommentCount}
          />

          {/* Scroll to Top */}
          <ScrollToTop />
        </div>
      </div>
    </Wrapper>
  )
}