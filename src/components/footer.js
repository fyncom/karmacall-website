import React, { useState } from "react"
import "./footer.css"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import Img from "gatsby-image"
import { KarmacallAppStoreModal } from "../components/Modal"
import { useCombinedQuery } from "./useCombinedQuery"

const Footer = () => {
  const { karmaCallDarkFooter, linkedInlogo, fbLogo, xLogo } = useCombinedQuery()
  const [isFooterModalOpen, setFooterModalOpen] = useState(false)
  const toggleFooterModal = () => {
    setFooterModalOpen(!isFooterModalOpen)
  }
  return (
    <div>
      <footer>
        <div className="footer-header">
          <a href="https://www.linkedin.com/company/fyncom">
            <GatsbyImage image={karmaCallDarkFooter} alt="Karmacall Logo and FynCom LinkedIn Profile" />
          </a>
          <div className="info-container">
            <p>
              <a href="mailto:support@karmacall.com">support@karmacall.com</a>
            </p>
            <p>We are located in Merced, CA, focused in the USA & operate globally.</p>
          </div>
        </div>
        <div className="footer-links-container">
          <div className="footer-socials">
            <a href="https://www.linkedin.com/company/fyncom">
              <Img fixed={linkedInlogo} alt="KarmaCall Company's Linkedin Page, FynCom" />
            </a>
            <a href="https://twitter.com/GetKarmaCall">
              <Img fixed={xLogo} alt="KarmaCall's X (formally known as Twitter) logo" />
            </a>
            <a href="https://www.facebook.com/GetKarmaCall">
              <Img fixed={fbLogo} alt="KarmaCall's Facebook page" />
            </a>
          </div>
          <ul className="footer-links left">
            <li>
              <Link to="#" onClick={toggleFooterModal}>
                Download
              </Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
          <ul className="footer-links right">
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/terms-of-service">Terms of Service</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
        {isFooterModalOpen && <KarmacallAppStoreModal onClose={toggleFooterModal} />}
      </footer>
    </div>
  )
}

export default Footer
