import React from "react"
import { Link } from "gatsby"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import "../../components/index.css"
import "./compare.css"

const CompareIndex = () => {
  const competitors = [
    {
      name: "Truecaller",
      description: "See how KarmaCall's unique rewards system compares to Truecaller's traditional approach.",
      link: "/compare/karmacall-vs-truecaller/",
      key_difference: "Get paid for blocking spam calls",
    },
    {
      name: "RoboKiller",
      description: "Compare KarmaCall's free service with RoboKiller's subscription model.",
      link: "/compare/karmacall-vs-robokiller/",
      key_difference: "No subscription fees + earn money",
    },
    {
      name: "Hiya",
      description: "Discover why KarmaCall is better for individual users compared to Hiya's enterprise focus.",
      link: "/compare/karmacall-vs-hiya/",
      key_difference: "User-focused with cash rewards",
    },
  ]

  return (
    <div>
      <Seo
        title="Compare KarmaCall vs Other Spam Blockers - Get Paid to Block Spam"
        description="See how KarmaCall compares to Truecaller, RoboKiller, Hiya, and other spam call blockers. Learn why KarmaCall's unique approach of paying users to block spam calls makes it the best choice."
      />
      <Header />

      <div className="comparison-container">
        <div className="comparison-header">
          <h1>Compare KarmaCall with Other Spam Blockers</h1>
          <p className="comparison-subtitle">Find the best solution for unwanted calls</p>
        </div>

        <div className="comparison-summary">
          <p>
            See how KarmaCall stacks up against other spam call blocking solutions. Unlike traditional apps, KarmaCall{" "}
            <span className="pays-you-text">pays you to block spam calls</span> while providing superior protection.
          </p>
        </div>

        <div className="comparison-cards">
          {competitors.map(competitor => (
            <div key={competitor.name} className="comparison-card">
              <h2>
                <span className="vs-text">KarmaCall vs</span>
                <span className="competitor-name">{competitor.name}</span>
              </h2>
              <p>{competitor.description}</p>
              <div className="key-advantage">
                <h3>Key Advantage</h3>
                <p>{competitor.key_difference}</p>
              </div>
              <Link to={competitor.link} className="comparison-link">
                See Full Comparison
              </Link>
            </div>
          ))}
        </div>

        <div className="why-karmacall-section">
          <h2>Why Choose KarmaCall?</h2>

          <div className="benefits-grid">
            <div className="benefit-column">
              <h3>For Users</h3>
              <ul className="benefits-list">
                <li>Earn money while blocking spam</li>
                <li>Free to use - no subscriptions</li>
                <li>Modern, user-friendly interface</li>
                <li>Advanced protection against unwanted calls</li>
              </ul>
            </div>

            <div className="benefit-column">
              <h3>Community Benefits</h3>
              <ul className="benefits-list">
                <li>Contribute to fighting scammers</li>
                <li>Help protect others from scams</li>
                <li>Reduce overall spam call volume</li>
                <li>Participate in a better communication system</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="comparison-faq">
          <h2>Common Questions About Spam Call Blockers</h2>

          <div className="faq-item">
            <h3>Do I really get paid for blocking spam calls with KarmaCall?</h3>
            <p>
              Yes! Unlike other call blocking apps that charge you subscription fees, KarmaCall actually pays you real money each time you block unwanted calls.
              You're helping fight spam while earning cash.
            </p>
          </div>

          <div className="faq-item">
            <h3>How does KarmaCall compare to subscription-based blockers?</h3>
            <p>
              While apps like RoboKiller and premium Truecaller charge monthly fees, KarmaCall is completely free AND puts money in your pocket. Our unique
              refundable deposit system creates accountability while rewarding you.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is KarmaCall's blocking as effective as other apps?</h3>
            <p>
              Absolutely. KarmaCall's approach is highly effective at stopping unwanted calls, with the added benefit of financial incentives for both you and
              legitimate callers.
            </p>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to start earning money while blocking spam calls?</h2>
          <Link to="/" className="primary-cta">
            Download KarmaCall Now
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CompareIndex
