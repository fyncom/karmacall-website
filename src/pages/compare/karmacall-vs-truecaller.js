import React from "react"
import { Link } from "gatsby"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import "../../components/index.css"
import "./compare.css"

const KarmaCallVsTruecaller = () => (
  <div>
    <Seo
      title="KarmaCall vs Truecaller | Compare Spam Call Blockers"
      description="Compare KarmaCall and Truecaller spam call blockers - See how KarmaCall pays you to block spam calls while Truecaller just blocks them. Find out which offers better protection and value."
    />
    <Header />

    <div className="comparison-container">
      <div className="comparison-header">
        <h1>KarmaCall vs Truecaller</h1>
        <p className="comparison-subtitle">Find out which spam call blocker is right for you</p>
      </div>

      <div className="comparison-summary">
        <p>
          Both KarmaCall and Truecaller are effective at blocking unwanted spam calls, but with key differences. While Truecaller identifies and blocks based on
          a large community database, KarmaCall goes further by
          <strong> paying you for every blocked spam call</strong>. Here's how these spam call blockers stack up.
        </p>
      </div>

      <div className="comparison-table">
        <div className="comparison-row header-row">
          <div className="comparison-cell feature-cell">Features</div>
          <div className="comparison-cell">KarmaCall</div>
          <div className="comparison-cell">Truecaller</div>
        </div>

        <div className="comparison-row">
          <div className="comparison-cell feature-cell">Spam Call Blocking</div>
          <div className="comparison-cell">
            <span className="check">✓</span> Block unwanted calls
            <br />
            <span className="highlight">Get paid for blocked calls</span>
          </div>
          <div className="comparison-cell">
            <span className="check">✓</span> Identifies and blocks spam calls
            <br />
            Uses community-sourced database
          </div>
        </div>

        <div className="comparison-row">
          <div className="comparison-cell feature-cell">SMS Spam Blocking</div>
          <div className="comparison-cell">
            <span className="partial">⟳</span> Coming soon
          </div>
          <div className="comparison-cell">
            <span className="check">✓</span> Identifies and filters spam SMS
          </div>
        </div>

        <div className="comparison-row">
          <div className="comparison-cell feature-cell">Pricing</div>
          <div className="comparison-cell">
            <span className="highlight">Free + earn money</span>
            <br />
            Cash out whenever you want
          </div>
          <div className="comparison-cell">
            Free version with ads
            <br />
            Premium: $9.99/month or $74.99/year
          </div>
        </div>

        <div className="comparison-row">
          <div className="comparison-cell feature-cell">Unique Features</div>
          <div className="comparison-cell">
            <span className="highlight">Get paid for blocked calls</span>
            <br />
            Refundable Paywall for unknown callers
            <br />
            Monetary incentive system for legitimate callers
          </div>
          <div className="comparison-cell">
            Advanced Caller ID
            <br />
            Reverse Number Lookup
            <br />
            AI Call Assistant (premium)
            <br />
            Call Recording (varies by region)
          </div>
        </div>

        <div className="comparison-row">
          <div className="comparison-cell feature-cell">Privacy</div>
          <div className="comparison-cell">
            <span className="check">✓</span> Privacy-focused
            <br />
            You control your data
          </div>
          <div className="comparison-cell">
            <span className="partial">⟳</span> Relies on community reporting
            <br />
            Collects user data
          </div>
        </div>

        <div className="comparison-row">
          <div className="comparison-cell feature-cell">Call Screening</div>
          <div className="comparison-cell">
            <span className="check">✓</span> Financial verification for unknown callers
          </div>
          <div className="comparison-cell">
            <span className="check">✓</span> AI Call Assistant (premium feature)
          </div>
        </div>
      </div>

      <div className="why-choose-section">
        <h2>Why Choose KarmaCall over Truecaller?</h2>

        <div className="reasons-grid">
          <div className="reason-card">
            <h3>Get Paid to Block Spam</h3>
            <p>Unlike Truecaller, KarmaCall actually pays you every time you block a spam call. It's like getting revenge on scammers while earning cash.</p>
          </div>

          <div className="reason-card">
            <h3>Completely Free</h3>
            <p>While Truecaller charges up to $74.99/year for premium features, KarmaCall is completely free AND pays you to use it.</p>
          </div>

          <div className="reason-card">
            <h3>Financial Call Filter</h3>
            <p>
              KarmaCall's unique refundable deposit system ensures only legitimate callers get through, creating accountability that Truecaller can't match.
            </p>
          </div>

          <div className="reason-card">
            <h3>Better Privacy</h3>
            <p>KarmaCall is built with your privacy in mind, unlike Truecaller which relies heavily on collecting and sharing user data.</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to start getting paid for blocked spam calls?</h2>
        <div className="cta-buttons">
          <Link to="/" className="primary-cta">
            Download KarmaCall Now
          </Link>
          <Link to="/compare" className="secondary-cta">
            Compare More Apps
          </Link>
        </div>
      </div>
    </div>

    <Footer />
  </div>
)

export default KarmaCallVsTruecaller
