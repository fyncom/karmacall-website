import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/about.css"
import { Link } from "gatsby"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { useCombinedQuery } from "../components/useCombinedQuery"

const About = () => {
  const { innovation, collaboration, transparency, teamMeeting, customerFocus, continuousImprovement } = useCombinedQuery()
  return (
    <div>
      <Seo
        title="About Us"
        description="Spam has plauged communications for decades. AI will accelerate that trend. Discover the FynCom solution to protect
       your mental clarity, help you stand out, and get people paid!"
      />
      <Header />
      <section className="mission-section">
        <h1>About Us</h1>
        <sub>KarmaCall's mission is to disrupt the scam economy and get people paid to block spam.</sub>
        <div className="AppText">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>
              KarmaCall is the first application built from FynCom's Rewards technology (<Link to="/white-paper-original-scam-calls">Read more here</Link>).
              KarmaCall serves as a consumer empowerment tool and is using the phone call to debut its unique algorithm, driven by deposits and
              responses/engagement.
            </p>
            <h2>Our Logic</h2>
            <p>
              Monetary incentives is the biggest driver of spam calls, so we focus SPECIFICALLY on bringing money into the phone call. KarmaCall logic works
              simlarly to a bank's microdeposits transactions which help banks verify you own a bank account. The BIGGEST difference is we do not require a bank
              account. The biggest difference from KarmaCall and our friends in the industry, is...
              <ol>
                <li>We operate PRIMARILY on a whiltelist based on your contacts list. </li>
                <li>We allow non-contacts to deposit money into your KarmaCall account and get it back if a call lasts more than 25 seconds.</li>
                <li>We let paid KarmaCallers set their own minimum deposit and rewards limits. </li>
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
