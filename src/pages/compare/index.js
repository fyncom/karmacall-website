import React, { useState } from "react"
import { Link } from "gatsby"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import "../../components/index.css"
import "./compare.css"
import { KarmacallAppStoreModal } from "../../components/Modal"

const CompareIndex = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }
  const competitors = [
    {
      name: "Truecaller",
      description: "See how KarmaCall's innovative financial verification system compares to Truecaller's traditional approach.",
      link: "/compare/karmacall-vs-truecaller/",
      key_difference: "Financial verification vs pattern detection",
    },
    {
      name: "RoboKiller",
      description: "Compare KarmaCall's reward-based model with RoboKiller's subscription service.",
      link: "/compare/karmacall-vs-robokiller/",
      key_difference: "Earn rewards while blocking spam",
    },
    {
      name: "Hiya",
      description: "Discover why KarmaCall's financial verification is better than Hiya's enterprise pattern detection.",
      link: "/compare/karmacall-vs-hiya/",
      key_difference: "User rewards with guaranteed accuracy",
    },
    {
      name: "Call Control",
      description: "See how KarmaCall's deposit-based system beats Call Control's pattern detection approach.",
      link: "/compare/karmacall-vs-callcontrol/",
      key_difference: "Financial verification vs community reports",
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
            <Link to="#" className="pays-you-text">
              pays you to block spam calls
            </Link>{" "}
            while providing superior protection.
          </p>
        </div>

        <div className="comparison-cards">
          <div className="comparison-card">
            <h2>
              <span className="vs-text">KarmaCall vs</span>
              <span className="competitor-name">RoboKiller</span>
            </h2>
            <p>See how KarmaCall's financial verification system compares to RoboKiller's audio fingerprinting approach.</p>
            <Link to="/compare/karmacall-vs-robokiller" className="learn-more">
              Learn More
            </Link>
          </div>

          <div className="comparison-card">
            <h2>
              <span className="vs-text">KarmaCall vs</span>
              <span className="competitor-name">Hiya</span>
            </h2>
            <p>Compare KarmaCall's proactive blocking with Hiya's pattern detection system.</p>
            <Link to="/compare/karmacall-vs-hiya" className="learn-more">
              Learn More
            </Link>
          </div>

          <div className="comparison-card">
            <h2>
              <span className="vs-text">KarmaCall vs</span>
              <span className="competitor-name">Truecaller</span>
            </h2>
            <p>Discover the differences between KarmaCall's financial verification and Truecaller's crowdsourced database.</p>
            <Link to="/compare/karmacall-vs-truecaller" className="learn-more">
              Learn More
            </Link>
          </div>

          <div className="comparison-card">
            <h2>
              <span className="vs-text">KarmaCall vs</span>
              <span className="competitor-name">Call Control</span>
            </h2>
            <p>Learn how KarmaCall's financial verification differs from Call Control's community-driven blocking.</p>
            <Link to="/compare/karmacall-vs-callcontrol" className="learn-more">
              Learn More
            </Link>
          </div>

          <div className="comparison-card">
            <h2>
              <span className="vs-text">KarmaCall vs</span>
              <span className="competitor-name">NoMoRobo</span>
            </h2>
            <p>Compare KarmaCall's innovative financial verification with NoMoRobo's traditional blacklist approach.</p>
            <Link to="/compare/karmacall-vs-nomorobo" className="learn-more">
              Learn More
            </Link>
          </div>

          <div className="comparison-card">
            <h2>
              <span className="vs-text">KarmaCall vs</span>
              <span className="competitor-name">YouMail</span>
            </h2>
            <p>See how KarmaCall's financial verification system compares to YouMail's voicemail-focused approach.</p>
            <Link to="/compare/karmacall-vs-youmail" className="learn-more">
              Learn More
            </Link>
          </div>
        </div>

        <div className="why-karmacall-section">
          <h2>Why Choose KarmaCall?</h2>

          <div className="benefits-grid">
            <div className="benefit-column">
              <h3>For Users</h3>
              <ul className="benefits-list">
                <li>Earn rewards for blocking spam</li>
                <li>Free plan for Android users</li>
                <li>Premium features with higher rewards</li>
                <li>Customizable protection settings</li>
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
            <p>Yes! KarmaCall rewards you for blocking unwanted calls. Choose your platform to see available plans:</p>
            <div className="platform-pricing-grid">
              <div className="platform-card">
                <h4>Android</h4>
                <ul>
                  <li>Free plan: $0.0001 per blocked call</li>
                  <li>
                    Premium ($4.99/month):
                    <ul>
                      <li>$0.001 per blocked call</li>
                      <li>Customize minimum deposit (default: 5¢)</li>
                      <li>Customize verification timer (default: 25s)</li>
                    </ul>
                  </li>
                  <li>
                    Supreme ($9.99/month):
                    <ul>
                      <li>$0.01 per blocked call</li>
                      <li>Customize minimum deposit (default: 5¢)</li>
                      <li>Customize verification timer (default: 25s)</li>
                    </ul>
                  </li>
                  <li>Lifetime plan: $99 one-time payment</li>
                </ul>
              </div>
              <div className="platform-card">
                <h4>iOS</h4>
                <ul>
                  <li>
                    Basic ($1.99/month):
                    <ul>
                      <li>$0.0001 per blocked call</li>
                      <li>Standard protection settings</li>
                    </ul>
                  </li>
                  <li>
                    Premium ($4.99/month):
                    <ul>
                      <li>$0.001 per blocked call</li>
                      <li>Customize minimum deposit (default: 5¢)</li>
                      <li>Customize verification timer (default: 25s)</li>
                    </ul>
                  </li>
                  <li>
                    Supreme ($9.99/month):
                    <ul>
                      <li>$0.01 per blocked call</li>
                      <li>Customize minimum deposit (default: 5¢)</li>
                      <li>Customize verification timer (default: 25s)</li>
                    </ul>
                  </li>
                  <li>Lifetime plan: $99 one-time payment</li>
                </ul>
              </div>
            </div>
            <div className="pricing-disclaimer">
              <p>
                <strong>Note:</strong> iOS version is currently only available in the United States. Android version is available globally, with prices adjusted
                for each region (prices shown above are US rates - other countries may have lower rates).
              </p>
            </div>
          </div>

          <div className="faq-item">
            <h3>How does KarmaCall compare to subscription-based blockers?</h3>
            <p>
              While other apps just charge you monthly fees, KarmaCall's premium plans ($4.99-$9.99/month) come with increasing rewards for blocked calls.
              Android users can start with a free plan, and all users can access advanced features like custom deposit requirements and verification timers with
              premium plans. There's also a one-time lifetime package available for $99.
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
          <button onClick={toggleModal} className="primary-cta">
            Download KarmaCall Now
          </button>
        </div>
      </div>

      {isModalOpen && <KarmacallAppStoreModal onClose={toggleModal} />}

      <Footer />
    </div>
  )
}

export default CompareIndex
