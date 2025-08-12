import React, {useEffect, useState} from "react"
import "../components/markdown.css"
import Header from "./header"
import Footer from "./footer"
import Seo from "./seo"
import { useStaticQuery, graphql } from "gatsby"
import { generateTextSizeStyles, getFontSize } from "../components/blog/FontSizeSystem"
import ArticleHeader from "../components/blog/ArticleHeader"
// import ActionBar from "../components/blog/ActionBar"
import TableOfContents from "../components/blog/TableOfContents"
import RelatedArticles from "../components/blog/RelatedArticles"
import ScrollToTop from "../components/blog/ScrollToTop"
import TextSizeControl from "../components/blog/TextSizeControl"
import FeaturedImage from "../components/blog/FeaturedImage"

export const Wrapper = ({ children, seo, hideArticleHeader, hideTableOfContents, hideRelatedArticles, hideTextSizeControl }) => {
  const [textSize, setTextSize] = useState("medium")
  const textSizeStyles = generateTextSizeStyles()
  const [currentPath, setCurrentPath] = useState("")
  const imageQuery = useStaticQuery(graphql`
    query WrapperAllImagesQuery {
      allFile(filter: { sourceInstanceName: { eq: "images" } }) {
        nodes {
          relativePath
          publicURL
        }
      }
    }
  `)
  const featuredImageUrl = (() => {
    const pick = v => (v && v.publicURL) || (typeof v === "string" ? v : null)
    const candidate = pick(seo && seo.featuredImage) || pick(seo && seo.image)
    if (!candidate) return null
    if (/^https?:\/\//i.test(candidate)) return candidate
    if (candidate.includes("/images/")) {
      const relativePath = candidate.replace(/^.*images[\\\/]*/, "")
      const node = imageQuery?.allFile?.nodes?.find(n => n.relativePath === relativePath)
      return node?.publicURL || null
    }
    return candidate
  })()

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
      setCurrentPath(window.location.pathname)
    }
  }, [])

  return (
    <div>
      <Seo title={seo?.title} description={seo?.description} />
      <Header />
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
          <div style={{ flex: "1", minWidth: "0" }}>
            {!hideArticleHeader && <ArticleHeader articleData={seo} reserveSidebarSpace={false} />}
            <FeaturedImage seo={seo} src={featuredImageUrl} imageDescription={seo?.imageDescription} imageCredit={seo?.imageCredit} />
            {!hideTextSizeControl && (
              <div style={{ margin: "0.75rem 0 0.5rem 0" }}>
                <TextSizeControl currentSize={textSize} onSizeChange={handleTextSizeChange} />
              </div>
            )}
            {children}
            {!hideRelatedArticles && <RelatedArticles currentArticleSlug={seo?.pathname || seo?.slug || currentPath} keywords={seo?.keywords || []} />}
          </div>
          {!hideTableOfContents && <TableOfContents />}
        </div>
        <ScrollToTop />
      </div>
      <Footer />
    </div>
  )
}

export default ({ children }) => <Wrapper>{children}</Wrapper>
