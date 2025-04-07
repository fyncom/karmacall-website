import React, { useState } from "react"
import { Link } from "gatsby"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import { KarmacallAppStoreModal } from "../../components/Modal"
import "../../components/index.css"
import "./compare.css"

const KarmaCallVsCallControl = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }

  return (
    <div>
      <Seo
        title="KarmaCall vs Call Control | Compare Spam Call Blockers"
        description="Compare KarmaCall and Call Control spam call blockers - See how KarmaCall's unique financial verification system differs from traditional pattern detection methods. Find out which offers better protection."
      />
      <Header />

      <div className="comparison-container">
        <div className="comparison-header">
          <h1>KarmaCall vs Call Control</h1>
          <p className="comparison-subtitle">Find out which spam call blocker is right for you</p>
        </div>

        <div className="comparison-summary">
          <p>
            While both KarmaCall and Call Control aim to protect you from unwanted calls, they use fundamentally different approaches. Call Control relies on
            traditional pattern detection and community reporting, while KarmaCall introduces a revolutionary approach using
            <strong> financial verification and pays you for blocked calls</strong>. Instead of trying to predict if a call is spam, KarmaCall simply requires
            unknown callers to prove their legitimacy through a refundable deposit.
          </p>
        </div>

        <div className="comparison-table">
          <div className="comparison-row header-row">
            <div className="comparison-cell feature-cell">Features</div>
            <div className="comparison-cell">KarmaCall</div>
            <div className="comparison-cell">Call Control</div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Spam Call Blocking</div>
            <div className="comparison-cell">
              <span className="check">✓</span> Financial verification system
              <br />
              <span className="highlight">Get paid for blocked calls</span>
              <br />
              No guesswork - requires caller deposit
            </div>
            <div className="comparison-cell">
              <span className="check">✓</span> Pattern detection & blacklists
              <br />
              Community-based reporting
              <br />
              FTC/FCC Do Not Call list integration
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">SMS Spam Blocking</div>
            <div className="comparison-cell">
              <span className="partial">⟳</span> Coming soon
            </div>
            <div className="comparison-cell">
              <span className="check">✓</span> Text message blocking
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Pricing</div>
            <div className="comparison-cell">
              Android: Free plan available
              <br />
              Premium: $4.99/month (10x rewards)
              <br />
              Supreme: $9.99/month (100x rewards)
              <br />
              iOS: Starting at $1.99/month
              <br />
              <span className="highlight">Lifetime plan: $99</span>
            </div>
            <div className="comparison-cell">
              Free version with basic features
              <br />
              Premium: $42.99/year
              <br />
              7-day free trial
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Rewards</div>
            <div className="comparison-cell">
              Free: $0.001 per blocked call
              <br />
              Premium: $0.01 per blocked call
              <br />
              Supreme: $0.1 per blocked call
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
              Basic customization:
              <br />
              • Block/allow lists
              <br />
              • Wildcard blocking
              <br />• Do Not Disturb settings
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Unique Features</div>
            <div className="comparison-cell">
              <span className="highlight">Get paid for blocked calls</span>
              <br />
              Refundable deposit system
              <br />
              Financial verification of callers
              <br />
              No reliance on pattern detection
            </div>
            <div className="comparison-cell">
              CommunityIQ (12M+ users)
              <br />
              Wildcard blocking
              <br />
              Personal block/allow lists
              <br />
              Reverse phone lookup
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Privacy</div>
            <div className="comparison-cell">
              <span className="check">✓</span> Privacy-focused
              <br />
              No content analysis needed
              <br />
              You control your data
            </div>
            <div className="comparison-cell">
              <span className="partial">⟳</span> Relies on community data
              <br />
              Pattern analysis required
              <br />
              Data sharing for blocking
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Blocking Approach</div>
            <div className="comparison-cell">
              <span className="check">✓</span> Financial verification
              <br />
              100% certainty - no false positives
            </div>
            <div className="comparison-cell">
              Pattern detection
              <br />
              Community reports
              <br />
              Potential false positives
            </div>
          </div>
        </div>

        <div className="why-choose-section">
          <h2>Why Choose KarmaCall over Call Control?</h2>

          <div className="reasons-grid">
            <div className="reason-card">
              <h3>Revolutionary Approach</h3>
              <p>
                While Call Control tries to predict spam through patterns and community reports, KarmaCall's financial verification system provides 100%
                certainty. No more guessing or false positives.
              </p>
            </div>

            <div className="reason-card">
              <h3>Earn Instead of Pay</h3>
              <p>
                Call Control charges up to $42.99/year for premium features, while KarmaCall is not only free but actually pays you for blocking spam calls.
              </p>
            </div>

            <div className="reason-card">
              <h3>Better Privacy</h3>
              <p>
                KarmaCall doesn't need to analyze call patterns or share community data. It simply verifies callers through deposits, keeping your privacy
                intact.
              </p>
            </div>

            <div className="reason-card">
              <h3>Proactive Protection</h3>
              <p>
                Instead of reacting to spam patterns after they emerge, KarmaCall prevents unwanted calls before they happen through financial accountability.
              </p>
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

export default KarmaCallVsCallControl
