import React, { useState } from "react"
import { Link } from "gatsby"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import { KarmacallAppStoreModal } from "../../components/Modal"
import "../../components/index.css"
import "./compare.css"

const KarmaCallVsYouMail = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }

  return (
    <div>
      <Seo
        title="KarmaCall vs YouMail | Compare Spam Call Blockers"
        description="Compare KarmaCall and YouMail spam call blockers - See how KarmaCall's financial verification system differs from YouMail's pattern detection and voicemail approach. Find out which offers better protection."
      />
      <Header />

      <div className="comparison-container">
        <div className="comparison-header">
          <h1>KarmaCall vs YouMail</h1>
          <p className="comparison-subtitle">Find out which spam call blocker is right for you</p>
        </div>

        <div className="comparison-summary">
          <p>
            While both KarmaCall and YouMail protect against unwanted calls, they take fundamentally different approaches. YouMail focuses on enhanced voicemail
            features and uses "out of service" messages to deter spammers, while KarmaCall introduces a revolutionary approach using
            <strong> financial verification and pays you for blocked calls</strong>. Instead of trying to trick spammers or analyze call patterns, KarmaCall
            verifies legitimacy through a refundable deposit system.
          </p>
        </div>

        <div className="comparison-table">
          <div className="comparison-row header-row">
            <div className="comparison-cell feature-cell">Features</div>
            <div className="comparison-cell">KarmaCall</div>
            <div className="comparison-cell">YouMail</div>
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
              "Out of service" message
              <br />
              Pattern detection & blacklists
              <br />
              User reports
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">SMS Spam Blocking</div>
            <div className="comparison-cell">
              <span className="partial">⟳</span> Coming soon
            </div>
            <div className="comparison-cell">
              <span className="check">✓</span> Text filtering (iOS focus)
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
              Free plan with ads
              <br />
              Plus: $5.99/month
              <br />
              Professional: $11.99+/month
              <br />
              14-day trial available
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
            <div className="comparison-cell feature-cell">Voicemail Features</div>
            <div className="comparison-cell">
              Standard voicemail
              <br />
              Focus on prevention
              <br />
              Deposit-based screening
            </div>
            <div className="comparison-cell">
              <span className="check">✓</span> Visual voicemail
              <br />
              Transcription service
              <br />
              Custom greetings
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Additional Features</div>
            <div className="comparison-cell">
              Custom deposit amounts
              <br />
              Verification timer settings
              <br />
              <span className="highlight">Get paid to block</span>
            </div>
            <div className="comparison-cell">
              Virtual phone numbers
              <br />
              Auto-attendant (paid)
              <br />
              Business features
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
              Uses call data
              <br />
              Pattern analysis
              <br />
              Community reporting
            </div>
          </div>

          <div className="comparison-row">
            <div className="comparison-cell feature-cell">Focus</div>
            <div className="comparison-cell">
              Spam prevention
              <br />
              User compensation
              <br />
              Financial accountability
            </div>
            <div className="comparison-cell">
              Voicemail enhancement
              <br />
              Business features
              <br />
              Spam deterrence
            </div>
          </div>
        </div>

        <div className="why-choose-section">
          <h2>Why Choose KarmaCall over YouMail?</h2>

          <div className="reasons-grid">
            <div className="reason-card">
              <h3>Proactive Protection</h3>
              <p>While YouMail tries to deter spammers after they call, KarmaCall prevents unwanted calls before they happen through financial verification.</p>
            </div>

            <div className="reason-card">
              <h3>Get Paid to Block</h3>
              <p>
                Instead of just offering voicemail features, KarmaCall pays you for each blocked call. YouMail charges for premium features while offering no
                financial benefits.
              </p>
            </div>

            <div className="reason-card">
              <h3>Simple but Effective</h3>
              <p>
                KarmaCall focuses on what matters most - stopping unwanted calls - through a simple deposit system, while YouMail splits focus between blocking
                and enhanced voicemail features.
              </p>
            </div>

            <div className="reason-card">
              <h3>Better Privacy</h3>
              <p>
                KarmaCall doesn't need to analyze calls or rely on community reports. It simply verifies callers through deposits, keeping your privacy
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

export default KarmaCallVsYouMail
