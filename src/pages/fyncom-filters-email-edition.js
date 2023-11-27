import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/use-cases.css"
import "../components/pricing-table.css"
import { Link } from "gatsby"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { useCombinedQuery } from "../components/useCombinedQuery"

const PricingOption = ({ title, price, period, buttonText, buttonLink }) => (
  <div className="pricing-option">
    <h3>{title}</h3>
    <p className="price">
      {price}
      <span className="period">{period}</span>
    </p>
    <a href={buttonLink} className="learn-more-btn">
      {buttonText}
    </a>
  </div>
)

const FyncomFiltersEmailEdition = () => {
  const { heroImageFilter, emailFilterFyncom, getPaidToBlockSpamEmails, cleanInboxCleanMind, nanoQrCode } = useCombinedQuery()
  return (
    <div className="fyncom-email-filter">
      <Seo
        title="Email Cash Back"
        description="FynCom Filters for GMail let you decide the value an email should have before it hits your inbox. Works right in your GMail app"
      />
      <Header />
      <div className="hero-section">
        <GatsbyImage image={heroImageFilter} alt="Get paid to block spam emails with FynCom!" />
        <div className="hero-content">
          <h1>Block Spam Emails. Get Instantly Paid.</h1>
          <p>
            Save time. Only see unknown emails that are so important, <b>senders are willing to lose money (to you)</b> if you don't respond. Block 100 emails /
            month, free.
          </p>
          <a href="#pricing">
            <button className="demo-button">Start now</button>
          </a>
        </div>
      </div>

      <div className="use-cases-container">
        <h2>Get Paid to Block Spam Emails</h2>
        <sub>Save time. Only see unknown emails that are so important, senders are willing to lose money (to you) if you don't respond.</sub>
        <br />
        <br />

        <div className="use-case-section">
          <div className="use-case-image">
            <GatsbyImage image={getPaidToBlockSpamEmails} alt="Understand your customers better" />
            <p className="centered">Spam emails go into a "FynFiltered" folder and you get paid each time.</p>
          </div>
          <div className="use-case-image">
            <GatsbyImage image={cleanInboxCleanMind} alt="Understand your customers better" />
            <p className="centered">Your inbox is for known contacts & people who put their $$ where their email is.</p>
          </div>
        </div>

        <div className="use-case-section">
          <div className="use-case-image">
            <GatsbyImage image={emailFilterFyncom} alt="Understand your customers better" />
          </div>
          <div className="use-case-description">
            <h3>Reduce unwanted emails by 100%</h3>
            <p>...for less than $15 / year. Get paid for each blocked spam email. Get your FynCom Filter today!</p>
          </div>
        </div>

        <div className="pricing-table" id="pricing">
          <PricingOption
            title="Monthly"
            price="$2"
            period="/per month"
            buttonText="Get it Now!"
            buttonLink="https://fyncom.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=fyncom-filter-email-USD-Monthly&subscription_items[quantity][0]=1"
          />
          <PricingOption
            title="Yearly"
            price="$15"
            period="/per year"
            buttonText="Get it Now!"
            buttonLink="https://fyncom.chargebee.com/hosted_pages/checkout?subscription_items[item_price_id][0]=fyncom-filter-email-USD-Yearly&subscription_items[quantity][0]=1"
          />
          <PricingOption title="Lifetime" price="$49" period="/Lifetime" buttonText="Get it Now!" buttonLink="https://buy.stripe.com/00g9Er4zDdRiaFG9AA" />
        </div>

        <p className="centered">
          Block less than 100 email per month? <Link to="/user-help-center/email-filters-and-rewards">Try it for free!</Link>
        </p>

        <div className="use-case-section">
          <div className="use-case-description">
            <h3>Want to buy with nano?</h3>
            <p>Send us the USD equivalent of nano, then email us. Try the QR code or use the nano address below.</p>
            <p>
              pay to: <br />
              <b>nano_3fi1tert5344eh9w5u33349rogs7dyaq3twg71fqsw7rupno3hj7c6wj7k4j</b>
            </p>
            <p>
              email to:{" "}
              <a href="mailto:support@fyncom.com?subject=FynCom Filter - my nano payment">
                <br />
                support@fyncom.com
              </a>
            </p>
          </div>
          <div className="use-case-image">
            <GatsbyImage image={nanoQrCode} alt="Close more deals" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FyncomFiltersEmailEdition
