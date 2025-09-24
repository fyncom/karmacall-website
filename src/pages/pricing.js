import React, { useState } from "react"
import Header from "../components/header"
import { FaCheck, FaTimes, FaUsers, FaCrown } from "react-icons/fa"
import "../components/pricing.css"
import Seo from "../components/seo"

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly")

  const handlePlanAction = planName => {
    window.location.href = `/login?plan=${planName.toLowerCase()}&billing=${billingPeriod}`
  }

  return (
    <div>
      <Seo
        title="KarmaCall Pricing - Complete Digital Protection for Families & Teams"
        description="Protect your whole family or team from spam calls, texts, and emails with KarmaCall's revolutionary license sharing system."
        keywords={["pricing", "family protection", "team licenses", "spam blocker", "comprehensive protection", "call text email blocking"]}
      />
      <Header />

      <section className="pricing-page">
        <div className="pricing-hero">
          <div className="pricing-container">
            <div className="hero-announcement">
              🎉 <span>Introducing Family & Team Licensing - Share Your Protection!</span>
            </div>
            <h1 className="pricing-hero-title">
              One Subscription. <br />
              <span className="underline-karma">Whole Family Protected.</span>
            </h1>
            <p className="pricing-hero-subtitle">
              Share your comprehensive digital protection with up to 3 (Premium) or 7 (Supreme) family members and teammates. Block spam calls, texts, and
              emails together - same great protection, multiplied impact.
            </p>
          </div>
        </div>

        <div className="pricing-container">
          <div className="feature-comparison">
            <h2 className="feature-title">🔥 Revolutionary New Feature: License Sharing</h2>
            <p className="feature-description">Transform your subscription from protecting just yourself to protecting your entire family or team!</p>

            <div className="before-after-grid">
              <div className="before-after-card">
                <h3>Before: Solo Protection</h3>
                <ul>
                  <li>1 Premium = 1 phone number protected</li>
                  <li>1 Supreme = 1 phone number + limited email protection</li>
                </ul>
              </div>
              <div className="before-after-card highlight">
                <h3>After: Family/Team Protection</h3>
                <ul>
                  <li>
                    <strong>Premium = 3 phone numbers + 30 email addresses protected</strong>
                  </li>
                  <li>
                    <strong>Supreme = 7 phone numbers + 70 email addresses protected</strong>
                  </li>
                </ul>
                <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
                  Share your subscription power! Invite family members, teammates, or friends to join your protection umbrella through our smart referral
                  system.
                </p>
              </div>
            </div>
          </div>

          <div className="feature-notes">
            <p className="feature-description">
              <b>Important:</b> <em>Purchases available through iOS and Android app only. Web browser purchases coming soon.</em>
            </p>
          </div>

          <div className="billing-toggle">
            <span className={billingPeriod === "monthly" ? "active" : ""}>Monthly</span>
            <button className="toggle-switch" onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly")}>
              <div className={`toggle-knob ${billingPeriod === "annual" ? "annual" : ""}`}></div>
            </button>
            <span className={billingPeriod === "annual" ? "active" : ""}>
              Annual <span className="savings-badge">Save 20%</span>
            </span>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="plan-header">
                <h3 className="plan-name">Free</h3>
                <div className="plan-price">
                  <span className="price">$0</span>
                  <span className="period">/month</span>
                </div>
                <p className="plan-description">Basic protection for trial users</p>
              </div>

              <ul className="feature-list">
                <li>
                  <FaTimes className="icon-no" /> Phone Numbers Protected: 1
                </li>
                <li>
                  <FaTimes className="icon-no" /> Email Addresses Protected: 0
                </li>
                <li>
                  <FaTimes className="icon-no" /> Family/Team Sharing
                </li>
                <li>
                  <FaTimes className="icon-no" /> KarmaCall Premium Features
                </li>
                <li>
                  <FaTimes className="icon-no" /> FynEmail Premium Features
                </li>
                <li>
                  <FaTimes className="icon-no" /> Future Spam Apps Included
                </li>
              </ul>

              <button className="plan-button plan-button-free" onClick={() => handlePlanAction("Free")}>
                Get Started Free
              </button>
            </div>

            <div className="pricing-card featured">
              <div className="plan-badge">Most Popular</div>
              <div className="plan-header">
                <h3 className="plan-name">
                  <FaUsers className="plan-icon" />
                  Premium
                </h3>
                <div className="plan-price">
                  <span className="price">${billingPeriod === "monthly" ? "4.99" : "3.99"}</span>
                  <span className="period">/{billingPeriod === "monthly" ? "month" : "month"}</span>
                </div>
                <p className="plan-description">Perfect for families and small teams</p>
              </div>

              <ul className="feature-list">
                <li>
                  <FaCheck className="icon-yes" /> <strong>3 Phone Numbers</strong> (Account Holder + 2 Shares)
                </li>
                <li>
                  <FaCheck className="icon-yes" /> <strong>30 Email Addresses</strong> (Flexible Sharing)
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Account Holder: ∞ email usage
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Shared Users: 10 emails per person
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Family/Team Sharing
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Cross-Platform Access
                </li>
                <li>
                  <FaCheck className="icon-yes" /> KarmaCall Premium Features
                </li>
                <li>
                  <FaCheck className="icon-yes" /> FynEmail Premium Features
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Future Spam Apps Included
                </li>
              </ul>

              <button className="plan-button plan-button-premium" onClick={() => handlePlanAction("Premium")}>
                Choose Premium
              </button>
            </div>

            <div className="pricing-card">
              <div className="plan-header">
                <h3 className="plan-name">
                  <FaCrown className="plan-icon" />
                  Supreme
                </h3>
                <div className="plan-price">
                  <span className="price">${billingPeriod === "monthly" ? "9.99" : "8.25"}</span>
                  <span className="period">/{billingPeriod === "monthly" ? "month" : "month"}</span>
                </div>
                <p className="plan-description">Enterprise-grade sharing for larger teams</p>
              </div>

              <ul className="feature-list">
                <li>
                  <FaCheck className="icon-yes" /> <strong>7 Phone Numbers</strong> (Account Holder + 6 Shares)
                </li>
                <li>
                  <FaCheck className="icon-yes" /> <strong>70 Email Addresses</strong> (Flexible Sharing)
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Account Holder: ∞ email usage
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Shared Users: 10 emails per person
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Family/Team Sharing
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Cross-Platform Access
                </li>
                <li>
                  <FaCheck className="icon-yes" /> KarmaCall Premium Features
                </li>
                <li>
                  <FaCheck className="icon-yes" /> FynEmail Premium Features
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Future Spam Apps Included
                </li>
                <li>
                  <FaCheck className="icon-yes" /> Priority Support
                </li>
              </ul>

              <button className="plan-button plan-button-supreme" onClick={() => handlePlanAction("Supreme")}>
                Choose Supreme
              </button>
            </div>
          </div>

          <div className="use-cases-section">
            <h2 className="section-title">Perfect For Every Situation</h2>

            <div className="use-cases-grid">
              <div className="use-case-card">
                <div className="use-case-icon">🏠</div>
                <h3>Families</h3>
                <h4>"Protect Your Whole Family!"</h4>
                <p>
                  One subscription covers parents, kids, grandparents. Smart limits ensure each family member gets up to 10 email protections, but the account
                  holder can use all 30 (Premium) / 70 (Supreme) emails.
                </p>
                <div className="example">
                  <strong>Example:</strong> "The Johnson Family" - 1 adult + 2 grandparents all protected under one Premium plan
                </div>
              </div>

              <div className="use-case-card">
                <div className="use-case-icon">💼</div>
                <h3>Teams & Organizations</h3>
                <h4>"Enterprise-Grade Sharing"</h4>
                <p>
                  Perfect for small businesses and teams. Flexible allocation lets you distribute phone and email licenses as needed. Cost effective for entire
                  teams.
                </p>
                <div className="example">
                  <strong>Example:</strong> "StartupCo Team" - 7-person startup team shares one Supreme subscription
                </div>
              </div>

              <div className="use-case-card">
                <div className="use-case-icon">⚡</div>
                <h3>Power Users</h3>
                <h4>"Unlimited Email Usage"</h4>
                <p>
                  Use all your email licenses yourself if you want. Full control to manage who gets access, revoke anytime. Seamless integration across all
                  platforms.
                </p>
                <div className="example">
                  <strong>Example:</strong> "Power User Pro" - Solo user who needs 50+ email addresses protected
                </div>
              </div>
            </div>
          </div>

          <div className="key-features-section">
            <h2 className="section-title">🎯 Key Selling Points</h2>

            <div className="features-grid">
              <div className="feature-highlight">
                <h3>🏠 Family-First Design</h3>
                <p>Built for households and small teams with intuitive sharing controls</p>
              </div>

              <div className="feature-highlight">
                <h3>🎮 Gaming-Style Referrals</h3>
                <p>Share codes like inviting friends to a game - easy invites via text or email</p>
              </div>

              <div className="feature-highlight">
                <h3>🔄 Smart Restoration</h3>
                <p>If you cancel and resubscribe, your family connections are remembered</p>
              </div>

              <div className="feature-highlight">
                <h3>📱 Works Everywhere</h3>
                <p>Seamless across all your devices and platforms (iOS, Android, Web)</p>
              </div>

              <div className="feature-highlight">
                <h3>🎛️ Advanced Controls Coming</h3>
                <p>Future updates will include a "toggle share" button for even more granular control over who can access your protection</p>
              </div>
            </div>
          </div>

          <div className="faq-section">
            <h2 className="section-title">Frequently Asked Questions</h2>

            <div className="faq-grid">
              <div className="faq-item">
                <h3>How does license sharing work?</h3>
                <p>
                  Simply share your unique referral code with family members or team members. When they use your code, they automatically get access to your
                  subscription protection - no additional setup required!
                </p>
              </div>

              <div className="faq-item">
                <h3>How do I find my referral code?</h3>
                <p>Your referral code is available in the KarmaCall app after you subscribe. Look for the referral page in the app.</p>
              </div>

              <div className="faq-item">
                <h3>Can I control who has access?</h3>
                <p>
                  Currently, anyone with your referral code gets automatic access (up to your plan limits). Future updates will include a "toggle share" button
                  for more granular control.
                </p>
              </div>

              <div className="faq-item">
                <h3>What happens if I reach my sharing limit?</h3>
                <p>
                  If you've already shared with the maximum number of people (2 for Premium, 6 for Supreme), additional referral code uses won't grant access
                  until a spot opens up.
                </p>
              </div>

              <div className="faq-item">
                <h3>Can I change my plan anytime?</h3>
                <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences.</p>
              </div>

              <div className="faq-item">
                <h3>How many devices can I use?</h3>
                <p>All premium plans work seamlessly across unlimited devices - iOS, Android, and Web platforms.</p>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Ready to Protect Your Family?</h2>
            <p>Join thousands of families already protecting themselves with KarmaCall's revolutionary license sharing system.</p>
            <div className="cta-buttons">
              <button className="cta-button cta-premium" onClick={() => handlePlanAction("Premium")}>
                Start with Premium
              </button>
              <button className="cta-button cta-supreme" onClick={() => handlePlanAction("Supreme")}>
                Go Supreme
              </button>
            </div>
            <p className="cta-note">🔒 30-day money-back guarantee • Cancel anytime • No setup fees</p>
          </div>
          <div className="sharing-instructions">
            <h2 className="section-title">📱 How License Sharing Works</h2>

            <div className="instructions-grid">
              <div className="instruction-step">
                <div className="step-number">1</div>
                <h3>Subscribe to Premium or Supreme</h3>
                <p>Choose your plan and complete your subscription through the iOS or Android app.</p>
              </div>

              <div className="instruction-step">
                <div className="step-number">2</div>
                <h3>Share Your Referral Code</h3>
                <p>Find your unique referral code in the app and share it with family members or teammates via text, email, or any messaging app.</p>
              </div>

              <div className="instruction-step">
                <div className="step-number">3</div>
                <h3>Automatic License Grant</h3>
                <p>
                  <strong>When someone uses your referral code, they automatically get access to your protection!</strong> No additional setup required.
                </p>
              </div>

              <div className="instruction-step">
                <div className="step-number">4</div>
                <h3>Manage Your Family/Team</h3>
                <p>View and manage all connected users in your app. Future updates will include a "toggle share" button for more control.</p>
              </div>
            </div>

            <div className="sharing-highlight">
              <h3>🎯 Key Points:</h3>
              <ul>
                <li>
                  <strong>Instant Access:</strong> Referral codes grant immediate protection when used
                </li>
                <li>
                  <strong>No Limits:</strong> Share with up to 2 (Premium) or 6 (Supreme) additional people
                </li>
                <li>
                  <strong>Email Flexibility:</strong> Account holders can use unlimited emails, shared users get 10 each
                </li>
                <li>
                  <strong>Easy Management:</strong> All sharing happens through your referral code - no complex setup
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
