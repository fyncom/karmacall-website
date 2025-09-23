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
        title="KarmaCall Pricing - Family & Team Protection Plans"
        description="Protect your whole family or team with KarmaCall's revolutionary license sharing system."
        keywords={["pricing", "family protection", "team licenses", "spam blocker"]}
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
              Share your premium spam protection with up to 3 (Premium) or 7 (Supreme) family members and teammates. Same great protection, multiplied impact.
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
                    <strong>1 Premium = 3 phone numbers + 30 email addresses protected</strong>
                  </li>
                  <li>
                    <strong>1 Supreme = 7 phone numbers + 70 email addresses protected</strong>
                  </li>
                </ul>
                <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--karmacall-green)" }}>
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
        </div>
      </section>
    </div>
  )
}

export default PricingPage
