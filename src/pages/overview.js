import React, { useEffect, useState } from "react"
import googlePlayBadge from "../images/google-play-en.png"
import appStoreBadge from "../images/apple-en.png"
import "../components/unicorner.css"
import { Link } from "gatsby"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import Img from "gatsby-image"
import { useCombinedQuery } from "../components/useCombinedQuery"

const Overview = () => {
  const { fyncomFiltersWords, fyncomFiltersWordsDark, fyncomLogoLight, fyncomLogoDark } = useCombinedQuery()
  const [filterLogo, setFilterLogo] = useState(fyncomFiltersWords)
  const [logoData, setLogoData] = useState(fyncomLogoLight)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = e => {
        setFilterLogo(e.matches ? fyncomFiltersWordsDark : fyncomFiltersWords)
        setLogoData(e.matches ? fyncomLogoDark : fyncomLogoLight)
      }
      handleChange(mediaQuery) // Initial check
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [fyncomFiltersWords, fyncomFiltersWordsDark, fyncomLogoLight, fyncomLogoDark])

  return (
    <div className="unicorner-container">
      <Seo 
        title="FynCom Overview – The Internet's Rewards Layer in Action" 
        description="Discover FynCom's complete product ecosystem: KarmaCall spam blocking, email filters, and reward systems that turn digital interactions into instant payments. See how we're building the internet's rewards layer." 
        keywords={["FynCom products", "rewards layer", "spam blocking", "KarmaCall", "email filters", "digital rewards", "internet rewards", "spam protection ecosystem"]}
      />
      <Link to="/">
        <Img fixed={logoData} alt="FynCom Logo" className="fyncom-logo-header-image" />
      </Link>
      <h1>The Internet's Rewards Layer in Action</h1>
      <h2>Get instantly paid to block spam emails & calls with our complete product ecosystem</h2>
      <Link to="/fyncom-filters-email-edition" className="fyncom-filters-image">
        <GatsbyImage image={filterLogo} alt="FynCom Filters - Email spam blocking with rewards" />
      </Link>

      <div className="info-section unicorner">
        <p>
          Save time & let us pay you to ignore those scam emails & calls! Be the first to know when our text / SMS blocking tech is ready by signing up to one
          of our apps today!
        </p>
        <ul className="info-list">
          <li>Call Protection & Rewards</li>
          <ul className="calls-list">
            <li>
              Android. <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash">Free KarmaCall app.</a>
              <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash" className="store-badges">
                <img className="app-img" src={googlePlayBadge} alt="Get KarmaCall on Google Play" />
              </a>
            </li>
            <li>
              iOS. <a href="https://apps.apple.com/us/app/karmacall/id1574524278">KarmaCall - $1.99 with 1 month trial.</a>
              <a href="https://apps.apple.com/us/app/karmacall/id1574524278" className="store-badges">
                <img className="app-img" src={appStoreBadge} alt="Download KarmaCall on the App Store" />
              </a>
            </li>
          </ul>
          <li>Email Protection & Rewards</li>
          <ul className="emails-list">
            <li>
              Gmail Integration. <Link to="/fyncom-filters-email-edition">Free for first 100 blocked emails per month.</Link>
            </li>
          </ul>
          <li>Business Rewards Solutions</li>
          <ul className="business-list">
            <li>
              Interactive Rewards Platform. <Link to="/pricing">Reward customers for engagement and responses.</Link>
            </li>
            <li>
              Customer Engagement Tools. <Link to="/use-cases">Drive behavior with strategic reward placement.</Link>
            </li>
          </ul>
        </ul>
      </div>

      <div className="footer-section">
        <p>
          Our FynCom ecosystem works in the background to save you time and get you paid while building a more trustworthy internet. 
          To find out more about why we're building the internet's rewards layer and why this is the only real solution to spam & scams, see our story.
        </p>
        <Link to="/white-paper-original-scam-calls">Read our story</Link>
      </div>
    </div>
  )
}

export default Overview