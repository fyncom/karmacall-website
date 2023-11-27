import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import mobileMarketing from "../images/illustrations/marketing-mobile-survey.webp"
import phoneCalls from "../images/illustrations/sales-phone-calls.webp"
import closingDeals from "../images/close-deals-customers-engagement.webp"
import "../components/use-cases.css"
import fyncomLogo from "../images/fyncom-logo.png"
import { Link } from "gatsby"

// NOTE: This is suppose to be the 2nd main page - currently this is an old version of what is currently index.js
const ScamBlockCashBlock = () => {
  return (
    <div>
      <Header />
      <div className="use-cases-sales-marketing-container">
        <h1>Profit from Scam Blocking</h1>
        <br />
        <h2>Cash in effortlessly</h2>
        <p>Emails, direct messages, calls - we do it all!</p>

        {/*<sub>Enhance your sales, marketing & customer feedback tools</sub>*/}
        <br />
        <br />
        <p>
          Today's Attention Economy makes time spent with your brand
          increasingly valuable, yet people's attention span gets progressively
          worse! Use FynCom's interactive rewards to grow the attention span of
          their target audiences, creating engagement that would otherwise be
          lost.
        </p>

        <div className="use-case-section">
          <div className="use-case-image">
            <img src={mobileMarketing} alt="Understand your customers better" />
          </div>
          <div className="use-case-description">
            <h3>Are your customers getting phished?</h3>
            <p>
              Stop scams with refundable deposits. Our tech asks unknown senders
              to risk losing money to your audience before they can reach them.
              Learn more.
            </p>
            <Link
              to="/use-cases/understand-customers"
              className="learn-more-btn"
            >
              LEARN MORE
            </Link>
          </div>
        </div>

        <div className="use-case-section">
          <div className="use-case-description">
            <h3>Too many scam DMs in chats?</h3>
            <p>
              Your community loves making connections, but not with scammers &
              imposters. Help mods by adding FynCom's Direct Message tech into
              your Discord, Telegram, or other chat-based community. Bonus -
              your users make $$ for every blocked spam DM!{" "}
              <a href="mailto:support@fyncom.com?subject=FynCom DMs">
                Contact us
              </a>
            </p>
            {/*<a href="/use-cases/close-deals" className="learn-more-btn">LEARN MORE</a>*/}
          </div>
          <div className="use-case-image">
            <img src={phoneCalls} alt="Close more deals" />
          </div>
        </div>

        <div className="use-case-section">
          <div className="use-case-image">
            <img src={closingDeals} alt="Increase Customer Engagement" />
          </div>
          <div className="use-case-description">
            <h3>Increase Customer Engagement</h3>
            <p>
              Increase customer engagement and increase customer loyalty by
              offering incentivized rewards along the sales funnel to encourage
              your audience to learn more about your products and offerings
            </p>
            <Link
              to="/use-cases/customer-engagement"
              className="learn-more-btn"
            >
              LEARN MORE
            </Link>
          </div>
        </div>

        <div className="demo-form">
          <h2>REQUEST A DEMO</h2>
          <p>Get in contact with us!</p>
          <form action="/submit-demo-request" method="post">
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="text" name="subject" placeholder="Subject" />
            <textarea
              name="message"
              placeholder="Type your message here..."
              required
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="fyncom-logo">
          <img src={fyncomLogo} alt="FynCom Logo" />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ScamBlockCashBlock
