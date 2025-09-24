import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import Seo from "../components/seo"
import FaqPage from "../components/FaqPage"

const Faq = () => {
  return (
    <div className="email-filters-rewards-container">
      <Seo
        title="Frequently Asked Questions"
        description="Find answers to commonly asked questions about KarmaCall's comprehensive protection for calls, texts, and emails."
      />
      <Header />
      <div className="content-container">
        <h1>Frequently Asked Questions</h1>
        <FaqPage />
      </div>
      <Footer />
    </div>
  )
}

export default Faq
