import React, { useState } from "react"
import { Link } from "gatsby"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import { KarmacallAppStoreModal } from "../../components/Modal"
import "../../components/index.css"
import "./compare.css"

const KarmaCallVsTruecaller = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }

  return (
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
            Both KarmaCall and Truecaller are effective at blocking unwanted spam calls, but with key differences. While Truecaller identifies and blocks based
            on a large community database, KarmaCall goes further by
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
              Basic free version
              <br />
              Premium: $2.99/month
              <br />
              Gold: $4.99/month
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
              Premium features:
              <br />
              • Call recording
              <br />
              • Advanced spam blocking
              <br />• Contact backup
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
              <h3>Affordable and Rewarding</h3>
              <p>While Truecaller charges up to $74.99/year for premium features, KarmaCall offers affordable plans for both Android and iOS, and pays you to block spam calls.</p>
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

export default KarmaCallVsTruecaller
