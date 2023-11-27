import React, { useEffect, useState } from "react"
import googlePlayBadge from "../images/google-play-en.png"
import appStoreBadge from "../images/apple-en.png"
import "../components/unicorner.css"
import { Link } from "gatsby"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import Img from "gatsby-image"
import { useCombinedQuery } from "../components/useCombinedQuery"

const Unicorner = () => {
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
      <Seo title="For Unicorner's Eyes only" description="Hope you enjoyed that listing! This brief page shows you all of the service FynCom offers " />
      <Link to="/">
        <Img fixed={logoData} alt="FynCom Logo" className="fyncom-logo-header-image" />
      </Link>
      <h1>Spam Sucks!</h1>
      <h2>Get instantly paid to block bad emails & calls with...</h2>
      <Link to="/fyncom-filters-email-edition" className="fyncom-filters-image">
        <GatsbyImage image={filterLogo} alt="FynCom Filters" />
      </Link>

      <div className="info-section unicorner">
        <p>
          Save time & let us pay you to ignore those scam emails & calls! Be the first to know when our text / SMS blocking tech is ready by signing up to one
          of our apps today!
        </p>
        <ul className="info-list">
          <li>Calls</li>
          <ul className="calls-list">
            <li>
              Android. <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash">Free.</a>
              <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash" className="store-badges">
                <img className="app-img" src={googlePlayBadge} alt="Get KarmaCall on Google Play" />
              </a>
            </li>
            <li>
              iOS. <a href="https://apps.apple.com/us/app/karmacall/id1574524278">$1.99 with 1 month trial.</a>
              <a href="https://apps.apple.com/us/app/karmacall/id1574524278" className="store-badges">
                <img className="app-img" src={appStoreBadge} alt="Download KarmaCall on the App Store" />
              </a>
            </li>
          </ul>
          <li>Emails</li>
          <ul className="emails-list">
            <li>
              Gmail. <Link to="/fyncom-filters-email-edition">Free for 1st 100 blocked emails per month.</Link>
            </li>
          </ul>
        </ul>
      </div>

      <div className="footer-section">
        <p>
          Our FynCom Filters work in the background to save you time and get you paid. To find out more about why we're doing this & why this is you paid. To
          find out more about why we're doing this & why this is the only real solution to spam & scams, see our story.
        </p>
        <Link to="/white-paper-original-scam-calls">our story</Link>
      </div>
    </div>
  )
}

export default Unicorner
