import React, {useEffect, useState} from "react"
import "../components/markdown.css"
import Header from "./header"
import Footer from "./footer"
import Seo from "./seo"
import { generateTextSizeStyles, getFontSize } from "../components/blog/FontSizeSystem"
import ArticleHeader from "../components/blog/ArticleHeader"
// import ActionBar from "../components/blog/ActionBar"
import TableOfContents from "../components/blog/TableOfContents"
import RelatedArticles from "../components/blog/RelatedArticles"
// import FeaturedImage from "../components/blog/FeaturedImage"
import ScrollToTop from "../components/blog/ScrollToTop"
import TextSizeControl from "../components/blog/TextSizeControl"


export const Wrapper = ({ children, seo }) => {
  const [textSize, setTextSize] = useState("medium")
  const textSizeStyles = generateTextSizeStyles(textSize) // Pass textSize here

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
      <div className="gatsby-focus-wrapper" style={textSizeStyles}>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default ({ children }) => <Wrapper>{children}</Wrapper>
