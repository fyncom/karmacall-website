import React, { useState } from "react"
import { Link } from "gatsby"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import { KarmacallAppStoreModal } from "../../components/Modal"
import "../../components/index.css"
import "./compare.css"

const KarmaCallVsNoMoRobo = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }

  return (
    <div>
      <Seo
        title="KarmaCall vs NoMoRobo | Compare Spam Call Blockers"
        description="Compare KarmaCall and NoMoRobo spam call blockers - See how KarmaCall's financial verification system differs from NoMoRobo's pattern detection. Find out which offers better protection."
      />
      <Header />

      <div className="comparison-container">
        <div className="comparison-header">
          <h1>KarmaCall vs NoMoRobo</h1>
          <p className="comparison-subtitle">Find out which spam call blocker is right for you</p>
        </div>

        <div className="comparison-summary">
          <p>
            While both KarmaCall and NoMoRobo aim to protect you from unwanted calls, they use fundamentally different approaches. NoMoRobo relies on blacklists
            and pattern detection, while KarmaCall introduces a revolutionary approach using
            <strong> financial verification and pays you for blocked calls</strong>. Instead of trying to predict spam through call characteristics, KarmaCall
            verifies legitimacy through a refundable deposit system.
          </p>
        </div>

        <div className="comparison-table">
          <div className="comparison-row header-row">
            <div className="comparison-cell feature-cell">Features</div>
            <div className="comparison-cell">KarmaCall</div>
            <div className="comparison-cell">NoMoRobo</div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Blocking Method</div>
            <div className="comparison-cell">
              <span className="check">✓</span> Financial verification system
              <br />
              <span className="highlight">No pattern analysis needed</span>
              <br />
              100% certainty through deposits
            </div>
            <div className="comparison-cell">
              Pattern detection & blacklists
              <br />
              Audio fingerprinting
              <br />
              Simultaneous ring technology
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">SMS Spam Blocking</div>
            <div className="comparison-cell">
              <span className="partial">⟳</span> Coming soon
            </div>
            <div className="comparison-cell">
              <span className="check">✓</span> Mobile text filtering
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
              VoIP/Landline: Often free via carrier
              <br />
              Mobile (NoMoRobo Max):
              <br />
              $49.99/year per device
              <br />
              14-day free trial
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
            <div className="comparison-cell feature-cell">Platform Support</div>
            <div className="comparison-cell">
              Mobile focus:
              <br />
              • Android (free & paid plans)
              <br />• iOS (paid plans)
            </div>
            <div className="comparison-cell">
              • VoIP landlines (primary)
              <br />
              • Mobile apps
              <br />• Carrier integration
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Privacy</div>
            <div className="comparison-cell">
              <span className="check">✓</span> No content analysis
              <br />
              No call pattern tracking
              <br />
              Financial verification only
            </div>
            <div className="comparison-cell">
              <span className="check">✓</span> Privacy-focused
              <br />
              No contact access needed
              <br />
              Uses call patterns
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Accuracy</div>
            <div className="comparison-cell">
              <span className="check">✓</span> 100% accuracy
              <br />
              No false positives
              <br />
              Deposit-based verification
            </div>
            <div className="comparison-cell">
              Pattern-based accuracy
              <br />
              Possible false positives
              <br />
              Blacklist dependence
            </div>
          </div>
        </div>

        <div className="why-choose-section">
          <h2>Why Choose KarmaCall over NoMoRobo?</h2>

          <div className="reasons-grid">
            <div className="reason-card">
              <h3>Guaranteed Accuracy</h3>
              <p>
                While NoMoRobo relies on pattern detection that can have false positives, KarmaCall's financial verification system provides 100% certainty
                about the caller's legitimacy.
              </p>
            </div>

            <div className="reason-card">
              <h3>Earn While Blocking</h3>
              <p>
                Instead of just blocking calls, KarmaCall pays you for each blocked call. NoMoRobo charges for mobile protection while offering no financial
                benefits.
              </p>
            </div>

            <div className="reason-card">
              <h3>Proactive Protection</h3>
              <p>
                KarmaCall prevents spam before it happens through financial deposits, while NoMoRobo reacts to patterns and known spam numbers after they're
                identified.
              </p>
            </div>

            <div className="reason-card">
              <h3>True Privacy</h3>
              <p>
                KarmaCall doesn't need to analyze call patterns or audio fingerprints. It simply verifies callers through deposits, keeping your privacy
                completely intact.
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

export default KarmaCallVsNoMoRobo
