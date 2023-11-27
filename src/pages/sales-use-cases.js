import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/sales-and-marketing-use-cases.css"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { useCombinedQuery } from "../components/useCombinedQuery"

const SalesUseCases = () => {
  const { sendgrid, slicktext, zapier, salesHeroImage, increaseBookings, accelerateDeals, minMax } = useCombinedQuery()
  return (
    <div className="sales-use-cases">
      <Seo
        title="Sales Use Cases"
        description="Getting your sales team to hit their targets is hard. FynCom helps you close more deals by using rewards at key stages of your sales process."
      />
      <Header />
      <div className="hero-section">
        <GatsbyImage image={salesHeroImage} alt="use rewards at each touchpoint to keep leads moving down through the customer journey" />
        <div className="hero-content">
          <h1>Accelerate Sales</h1>
          <p>Close more deals with customers by using interactive rewards at key stages of your sales process</p>
          <a href="https://calendly.com/adrian-fyncom/30min">
            <button className="demo-button">Request Demo</button>
          </a>
        </div>
      </div>

      <div className="use-cases-sales-marketing-container">
        <div className="use-case">
          <GatsbyImage image={increaseBookings} alt="Increase bookings with rewards before and after a meeting" />
          <h2>Increase Bookings</h2>
          <p>Incentivize your prospective buyers to book time with you by offering rewards for scheduling meetings</p>
        </div>
        <div className="use-case">
          <GatsbyImage image={accelerateDeals} alt="Accelerate Deals with customer journey rewards" />
          <h2>Accelerate Deals</h2>
          <p>Move prospective clients through your sales journey by providing rewards for reaching the next stage</p>
        </div>
        <div className="use-case">
          <GatsbyImage image={minMax} alt="Min / max the value you give based on the revenue you generate" />
          <h2>Min/Max Gifts/Value</h2>
          <p>Only pay for rewards when your sales target moves along to the next stage of your sales journey</p>
        </div>
      </div>

      <div className="integrations-section">
        <h2 className="background-stripe">Popular Integrations</h2>
        <div className="logos-container">
          <GatsbyImage image={sendgrid} alt="SendGrid" className={"logo"} />
          <GatsbyImage image={slicktext} alt="SlickText" className={"logo"} />
          <GatsbyImage image={zapier} alt="Zapier" className={"logo"} />
        </div>
      </div>

      <div className="call-to-action">
        <h2>Accelerate sales pipeline & hit revenue targets by using action-oriented rewards to guide prospects through your funnels</h2>
        <a href="https://calendly.com/adrian-fyncom/30min" className="cta-button">
          Request Demo
        </a>
      </div>

      <Footer />
    </div>
  )
}

export default SalesUseCases
