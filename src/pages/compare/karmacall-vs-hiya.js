import React from "react"
import { Link } from "gatsby"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import "../../components/index.css"
import "./compare.css"

const KarmaCallVsHiya = () => (
  <div>
    <Seo
      title="KarmaCall vs Hiya | Compare Spam Call Blockers"
      description="Compare KarmaCall and Hiya spam call blockers - See how KarmaCall pays you to block spam calls while Hiya charges you monthly fees. Find the best solution for unwanted calls."
    />
    <Header />

    <div className="comparison-container">
      <div className="comparison-header">
        <h1>KarmaCall vs Hiya</h1>
        <p className="comparison-subtitle">Find out which spam call blocker is right for you</p>
      </div>

      <div className="comparison-summary">
        <p>
          Both KarmaCall and Hiya help protect you from unwanted calls, but with fundamentally different approaches. While Hiya focuses on identifying and
          blocking calls through advanced AI, KarmaCall adds a unique dimension by
          <strong> paying you for every blocked spam call</strong>. Let's see how they compare.
        </p>
      </div>

      <div className="comparison-table">
        <div className="comparison-row header-row">
          <div className="comparison-cell feature-cell">Features</div>
          <div className="comparison-cell">KarmaCall</div>
          <div className="comparison-cell">Hiya</div>
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
            Automatic blocking (premium only)
          </div>
        </div>

        <div className="comparison-row">
          <div className="comparison-cell feature-cell">SMS Spam Blocking</div>
          <div className="comparison-cell">
            <span className="partial">⟳</span> Coming soon
          </div>
          <div className="comparison-cell">
            <span className="partial">⟳</span> Limited; focus on call blocking
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
            Free version with limited features
            <br />
            Premium: $3.99/month or $24.99/year
            <br />
            AI Phone app: $9.99/month or $99.99/year
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
            Caller ID for businesses
            <br />
            Call Screener (Premium)
            <br />
            Reverse Number Lookup
            <br />
            Deepfake detection (AI Phone app)
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
            <span className="partial">⟳</span> Uses call data for detection
            <br />
            Relies on community feedback
          </div>
        </div>

        <div className="comparison-row">
          <div className="comparison-cell feature-cell">Platform Integration</div>
          <div className="comparison-cell">
            <span className="check">✓</span> Standalone app with direct benefits
          </div>
          <div className="comparison-cell">
            <span className="check">✓</span> Standalone app
            <br />
            Also powers some carrier-based solutions
          </div>
        </div>
      </div>

      <div className="why-choose-section">
        <h2>Why Choose KarmaCall over Hiya?</h2>

        <div className="reasons-grid">
          <div className="reason-card">
            <h3>Get Paid, Not Pay</h3>
            <p>While Hiya charges up to $99.99/year for their premium services, KarmaCall is completely free AND pays you each time you block a spam call.</p>
          </div>

          <div className="reason-card">
            <h3>Financial Accountability</h3>
            <p>
              KarmaCall's unique deposit system adds financial accountability for callers that Hiya doesn't offer, ensuring only people with legitimate reasons
              can reach you.
            </p>
          </div>

          <div className="reason-card">
            <h3>Simple and Effective</h3>
            <p>KarmaCall offers a straightforward solution without the tiered pricing and complex feature sets of Hiya and its separate AI Phone app.</p>
          </div>

          <div className="reason-card">
            <h3>True Control</h3>
            <p>
              With KarmaCall, you're not just blocking calls - you're actively profiting from the spam call problem while maintaining control over your data.
            </p>
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

export default KarmaCallVsHiya
