import React, { useState, useEffect } from "react"
import { Wrapper } from "../Markdown-Wrapper"
import "../blog.css"
import ArticleHeader from "./ArticleHeader"
import ActionBar from "./ActionBar"
import FeaturedImage from "./FeaturedImage"
import TextSizeControl from "./TextSizeControl"
import RelatedArticles from "./RelatedArticles"
import CommentSection from "./CommentSection"
import ScrollToTop from "./ScrollToTop"
import BlogSidebar from "./BlogSidebar"

const BlogLayout = ({ articleMetadata, shareCount, setShareCount, commentCount, setCommentCount, textSize, setTextSize, handleCommentClick, children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const checkScreenSize = () => {
      const windowWidth = window.innerWidth
      const mobileThreshold = 768
      setIsMobile(windowWidth <= mobileThreshold)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

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

        {/* Main content container with sidebar layout */}
        <div
          style={{
            display: "flex",
            gap: isMobile ? "0" : "3rem",
            alignItems: "flex-start",
            marginTop: "0.5rem",
            position: "relative",
          }}
        >
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

            {/* Featured image */}
            <FeaturedImage
              src={articleMetadata.featuredImage}
              alt={articleMetadata.title}
              imageDescription="Brief description of what the image shows and its relevance to the article content."
              imageCredit="Image source, photographer, or attribution information goes here."
            />

            {/* Text Size Control */}
            <TextSizeControl currentSize={textSize} onSizeChange={setTextSize} />

            {/* Article content */}
            {children}

            {/* Related Articles Section */}
            <RelatedArticles currentArticleSlug={articleMetadata.slug} />

            {/* Comment Section */}
            <CommentSection articleSlug={articleMetadata.slug} articleTitle={articleMetadata.title} onCommentCountChange={setCommentCount} />
          </div>

          {/* Sidebar - hidden on mobile */}
          {!isMobile && <BlogSidebar title={articleMetadata.title} />}
        </div>

        {/* Scroll-to-top button */}
        <ScrollToTop />
      </div>
    </Wrapper>
  )
}

export default BlogLayout
