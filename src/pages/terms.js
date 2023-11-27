import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/white-paper.css"
import termsOfUse from "../../static/pdfs/Fyncom - Terms of Use (general) - 20211221.pdf"
import Seo from "../components/seo"
import PdfContent from "../components/PdfContent"

const Terms = () => {
  return (
    <div>
      <Seo
        title="Terms of Use"
        description="Stay compliant with FynCom by ensuing you follow our Terms of Use dicussed here."
      />
      <Header />
      <div className="content-container">
        <h1>FynCom's Terms of Use</h1>
        <PdfContent file={termsOfUse} />
      </div>
      <Footer />
    </div>
  )
}

export default Terms
