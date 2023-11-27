import React from "react"
import "../components/markdown.css"
import Header from "./header"
import Footer from "./footer"
import Seo from "./seo"

export const Wrapper = ({ children, seo }) => (
  <div>
    <Seo title={seo.title} description={seo.description} />
    <Header />
    <div className="gatsby-focus-wrapper">{children}</div>
    <Footer />
  </div>
)

export default ({ children }) => <Wrapper>{children}</Wrapper>
