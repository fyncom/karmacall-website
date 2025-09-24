import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/about.css"
import { Link } from "gatsby"
import Seo from "../components/seo"

const About = () => {
  return (
    <div>
      <Seo
        title="About KarmaCall - Complete Digital Protection"
        description="Spam has plagued communications for decades across calls, texts, and emails. AI will accelerate that trend. Discover the FynCom solution to protect your mental clarity and get paid for blocking spam across all channels!"
      />
      <Header />
      <section className="mission-section">
        <h1>About Us</h1>
        <sub>KarmaCall's mission is to disrupt the scam economy and get people paid to block spam calls, texts, and emails.</sub>
        <div className="AppText">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>
              KarmaCall is the first application built from FynCom's Rewards technology (<Link to="/white-paper-original-scam-calls">Read more here</Link>).
              KarmaCall serves as a comprehensive consumer empowerment tool, starting with phone calls and expanding to text messages and email protection. Our
              unique algorithm is driven by deposits and responses/engagement across all communication channels.
            </p>
            <h2>Our Logic</h2>
            <p>
              Monetary incentives drive spam across all communication channels - calls, texts, and emails. We focus on bringing economic consequences to
              unwanted communications. KarmaCall logic works similarly to a bank's microdeposit transactions which help banks verify you own a bank account. The
              BIGGEST difference is we do not require a bank account. The biggest difference from KarmaCall and our competitors in the industry is:
              <ol>
                <li>We operate PRIMARILY on a whitelist based on your contacts list across all communication types.</li>
                <li>We allow non-contacts to deposit money into your KarmaCall account and get it back if the interaction meets legitimacy criteria.</li>
                <li>We let paid users set their own minimum deposit and rewards limits for comprehensive protection.</li>
                <li>We protect calls natively, texts through in-app filtering, and emails through Fyncom integration.</li>
              </ol>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default About
