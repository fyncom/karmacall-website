import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import Seo from "../components/seo"
import FaqAccordion from "../components/FaqAccordion"

const Faq = () => {
  return (
    <div>
      <Seo title="Terms of Use" description="Stay compliant with FynCom by ensuing you follow our Terms of Use dicussed here." />
      <Header />
      {/* <div className="content-container"> */}
      <h1>Frequently Asked Questions</h1>
      <FaqAccordion />
      {/* </div>? */}
      <Footer />
    </div>
  )
}

export default Faq
