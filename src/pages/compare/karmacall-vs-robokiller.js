import React, { useState } from "react"
import { Link } from "gatsby"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import { KarmacallAppStoreModal } from "../../components/Modal"
import "../../components/index.css"
import "./compare.css"

const KarmaCallVsRoboKiller = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }

  return (
    <div>
      <Seo
        title="KarmaCall vs RoboKiller | Compare Spam Call Blockers"
        description="Compare KarmaCall and RoboKiller spam call blockers - See how KarmaCall pays you to block spam calls while RoboKiller charges subscription fees. Find the best solution for robocalls."
      />
      <Header />

      <div className="comparison-container">
        <div className="comparison-header">
          <h1>KarmaCall vs RoboKiller</h1>
          <p className="comparison-subtitle">Find out which spam call blocker is right for you</p>
        </div>

        <div className="comparison-summary">
          <p>
            Both KarmaCall and RoboKiller offer effective solutions against unwanted calls, but with different approaches. While RoboKiller focuses on
            aggressive blocking and "Answer Bots" to waste scammers' time, KarmaCall takes a unique approach by
            <strong> paying you for every blocked spam call</strong>. Let's compare these two popular options.
          </p>
        </div>

        <div className="comparison-table">
          <div className="comparison-row header-row">
            <div className="comparison-cell feature-cell">Features</div>
            <div className="comparison-cell">KarmaCall</div>
            <div className="comparison-cell">RoboKiller</div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Spam Call Blocking</div>
            <div className="comparison-cell">
              <span className="check">✓</span> Block unwanted calls
              <br />
              <span className="highlight">Get paid for blocked calls</span>
            </div>
            <div className="comparison-cell">
              <span className="check">✓</span> Claims to block up to 99% of spam calls
              <br />
              Uses predictive algorithms and audio fingerprinting
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">SMS Spam Blocking</div>
            <div className="comparison-cell">
              <span className="partial">⟳</span> Coming soon
            </div>
            <div className="comparison-cell">
              <span className="check">✓</span> Claims to block up to 95% of spam texts
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Pricing</div>
            <div className="comparison-cell">
              Android: Free basic plan available
              <br />
              Premium: $4.99/month (10x rewards)
              <br />
              Supreme: $9.99/month (100x rewards)
              <br />
              iOS: Plans start at $1.99/month (no free plan)
              <br />
              <span className="highlight">Lifetime plan: $99</span>
            </div>
            <div className="comparison-cell">
              No free version
              <br />
              $4.99/month or $39.99/year
              <br />
              7-day trial only
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Rewards</div>
            <div className="comparison-cell">
              Free: $0.0001 per blocked call
              <br />
              Premium: $0.001 per blocked call
              <br />
              Supreme: $0.01 per blocked call
              <br />
              <span className="highlight">Customizable settings</span>
            </div>
            <div className="comparison-cell">
              No monetary rewards
              <br />
              Standard blocking only
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Customization</div>
            <div className="comparison-cell">
              Premium/Supreme plans:
              <br />
              • Custom deposit amounts
              <br />
              • Adjustable verification time
              <br />• Enhanced control
            </div>
            <div className="comparison-cell">
              Standard features:
              <br />
              • Answer bots
              <br />
              • Block/allow lists
              <br />• Call screening
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
              <span className="partial">⟳</span> Uses call data for algorithms
              <br />
              Maintains a global database
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Philosophy</div>
            <div className="comparison-cell">
              Create accountability through financial incentives
              <br />
              Reward users for fighting spam
            </div>
            <div className="comparison-cell">
              Aggressively fight spam calls
              <br />
              Waste scammers' time with Answer Bots
            </div>
          </div>
        </div>

        <div className="why-choose-section">
          <h2>Why Choose KarmaCall over RoboKiller?</h2>

          <div className="reasons-grid">
            <div className="reason-card">
              <h3>Earn Money vs Pay Money</h3>
              <p>While RoboKiller charges $39.99/year with no free version, KarmaCall offers a free basic plan for Android users (paid plans on iOS) and pays you each time you block a spam call.</p>
            </div>

            <div className="reason-card">
              <h3>Genuine Financial Incentive</h3>
              <p>
                KarmaCall's unique financial model gives you real cash for blocked calls, while RoboKiller's "revenge" is just entertainment with no monetary
                benefit.
              </p>
            </div>

            <div className="reason-card">
              <h3>No Subscription Required</h3>
              <p>KarmaCall provides its service without any subscription, while RoboKiller requires ongoing payment after the trial period.</p>
            </div>

            <div className="reason-card">
              <h3>Better Caller Filtering</h3>
              <p>KarmaCall's refundable deposit system creates financial accountability for callers that RoboKiller's technology-only approach can't match.</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to start getting paid for blocked spam calls?</h2>
          <div className="cta-buttons">
            <button onClick={toggleModal} className="primary-cta">
              Download KarmaCall Now
            </button>
            <Link to="/compare" className="secondary-cta">
              Compare More Apps
            </Link>
          </div>
        </div>
      </div>

      {isModalOpen && <KarmacallAppStoreModal onClose={toggleModal} />}

      <Footer />
    </div>
  )
}

export default KarmaCallVsRoboKiller
