import React, {useEffect, useState} from "react"
import "../components/markdown.css"
import Header from "./header"
import Footer from "./footer"
import Seo from "./seo"
import { generateTextSizeStyles, getFontSize } from "../components/blog/FontSizeSystem"
import ArticleHeader from "../components/blog/ArticleHeader"
// import ActionBar from "../components/blog/ActionBar"
// import FeaturedImage from "../components/blog/FeaturedImage"
import TableOfContents from "../components/blog/TableOfContents"
import RelatedArticles from "../components/blog/RelatedArticles"
import ScrollToTop from "../components/blog/ScrollToTop"
import TextSizeControl from "../components/blog/TextSizeControl"


export const Wrapper = ({ children, seo }) => {
  const [textSize, setTextSize] = useState("medium")
  const textSizeStyles = generateTextSizeStyles()

  const handleTextSizeChange = newSize => {
    setTextSize(newSize)
    if (typeof window !== "undefined") {
      localStorage.setItem("textSize", newSize)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTextSize = localStorage.getItem("textSize")
      if (savedTextSize && ["small", "medium", "large"].includes(savedTextSize)) {
        setTextSize(savedTextSize)
      }
    }
  }, [])

  return (
    <div>
      <Seo title={seo?.title} description={seo?.description} />
      <Header />
      <ArticleHeader articleData={seo} />
      <TextSizeControl currentSize={textSize} onSizeChange={handleTextSizeChange} />
      <div className="gatsby-focus-wrapper" style={textSizeStyles[textSize]}>
        <style>{`
          .gatsby-focus-wrapper p,
          .gatsby-focus-wrapper li,
          .gatsby-focus-wrapper span,
          .gatsby-focus-wrapper div { font-size: ${textSizeStyles[textSize].fontSize} !important; line-height: ${textSizeStyles[textSize].lineHeight} !important; }
          .gatsby-focus-wrapper h1 { font-size: calc(${textSizeStyles[textSize].fontSize} * 2) !important; }
          .gatsby-focus-wrapper h2 { font-size: calc(${textSizeStyles[textSize].fontSize} * 1.6) !important; }
          .gatsby-focus-wrapper h3 { font-size: calc(${textSizeStyles[textSize].fontSize} * 1.3) !important; }
          .gatsby-focus-wrapper h4 { font-size: calc(${textSizeStyles[textSize].fontSize} * 1.1) !important; }
          .gatsby-focus-wrapper .article-content-small p,
          .gatsby-focus-wrapper .article-content-medium p,
          .gatsby-focus-wrapper .article-content-large p { font-size: ${textSizeStyles[textSize].fontSize} !important; line-height: ${textSizeStyles[textSize].lineHeight} !important; }
          .gatsby-focus-wrapper .article-content-small h1,
          .gatsby-focus-wrapper .article-content-medium h1,
          .gatsby-focus-wrapper .article-content-large h1 { font-size: calc(${textSizeStyles[textSize].fontSize} * 2) !important; }
          .gatsby-focus-wrapper .article-content-small h2,
          .gatsby-focus-wrapper .article-content-medium h2,
          .gatsby-focus-wrapper .article-content-large h2 { font-size: calc(${textSizeStyles[textSize].fontSize} * 1.6) !important; }
          .gatsby-focus-wrapper .article-content-small h3,
          .gatsby-focus-wrapper .article-content-medium h3,
          .gatsby-focus-wrapper .article-content-large h3 { font-size: calc(${textSizeStyles[textSize].fontSize} * 1.3) !important; }
          .gatsby-focus-wrapper .article-content-small h4,
          .gatsby-focus-wrapper .article-content-medium h4,
          .gatsby-focus-wrapper .article-content-large h4 { font-size: calc(${textSizeStyles[textSize].fontSize} * 1.1) !important; }
          .gatsby-focus-wrapper .mdx-content p { font-size: ${textSizeStyles[textSize].fontSize} !important; line-height: ${textSizeStyles[textSize].lineHeight} !important; }
          .gatsby-focus-wrapper .mdx-content h1 { font-size: calc(${textSizeStyles[textSize].fontSize} * 2) !important; }
          .gatsby-focus-wrapper .mdx-content h2 { font-size: calc(${textSizeStyles[textSize].fontSize} * 1.6) !important; }
          .gatsby-focus-wrapper .mdx-content h3 { font-size: calc(${textSizeStyles[textSize].fontSize} * 1.3) !important; }
          .gatsby-focus-wrapper .mdx-content h4 { font-size: calc(${textSizeStyles[textSize].fontSize} * 1.1) !important; }
        `}</style>
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start" }}>
          <div style={{ flex: "1", minWidth: "0" }}>{children}</div>
          <TableOfContents />
        </div>
        <ScrollToTop />
      </div>
      <Footer />
    </div>
  )
}

export default ({ children }) => <Wrapper>{children}</Wrapper>
