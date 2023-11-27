import React, { useState, useEffect, useRef } from "react"
import "./header.css"
import { Link } from "gatsby"
import { FaBars } from "react-icons/fa"
import Img from "gatsby-image"
import { KarmacallAppStoreModal } from "../components/Modal"
import { useCombinedQuery } from "./useCombinedQuery"

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()
  const hamburgerRef = useRef() // Ref for the hamburger menu icon
  const toggleMenu = event => {
    event.stopPropagation()
    setMenuOpen(!isMenuOpen)
  }
  const [isHeaderModalOpen, setHeaderModalOpen] = useState(false)
  const toggleHeaderModal = () => {
    setHeaderModalOpen(!isHeaderModalOpen)
  }
  const { fyncomProductLogoLight, fyncomProductLogoDark, karmacallLogoNoTaglineLight, karmacallLogoNoTaglineDark } = useCombinedQuery()
  // State to hold which logo to show
  const [logoData, setLogoData] = useState(fyncomProductLogoLight)
  const [karmacallLogoData, setKarmacallLogoData] = useState(karmacallLogoNoTaglineLight)

  // Effect for setting the logo based on the system color scheme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = e => {
        setLogoData(e.matches ? fyncomProductLogoDark : fyncomProductLogoLight)
        setKarmacallLogoData(e.matches ? karmacallLogoNoTaglineDark : karmacallLogoNoTaglineLight)
      }
      handleChange(mediaQuery) // Initial check
      mediaQuery.addListener(handleChange) // Listen for changes
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [fyncomProductLogoLight, fyncomProductLogoDark, karmacallLogoNoTaglineDark, karmacallLogoNoTaglineLight])

  useEffect(() => {
    const closeMenu = event => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target) && !hamburgerRef.current.contains(event.target)) {
        setMenuOpen(false) // Close the mobile menu
      }
    }

    document.addEventListener("click", closeMenu)
    return () => {
      document.removeEventListener("click", closeMenu)
    }
  }, [isMenuOpen])

  return (
    <header className="header-top">
      <div className="header-container">
        <Link to="/">
          <div className="fyncom-logo-header">
            <Img className="left-header-logo" fixed={karmacallLogoData} alt="KarmaCall Logo" />
            <div className="arrow-container"></div>
            <Img className="right-header-logo" fixed={logoData} alt="FynCom Logo, which indicates that KarmaCall is built with FynCom tech" />
          </div>
        </Link>
        <div ref={hamburgerRef} className="mobile-menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>
        {/* Mobile Menu Panel */}
        <nav ref={menuRef} className={isMenuOpen ? "mobile-menu open" : "mobile-menu"}>
          <ul>
            <li className="mobile-menu-item">
              <Link to="/about">About</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/faq">FAQ</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/white-paper-original-scam-calls">Why?</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="#" onClick={toggleHeaderModal}>
                Download
              </Link>
            </li>
          </ul>
        </nav>

        <ul className="nav-links">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
          <li>
            <Link to="/white-paper-original-scam-calls">Why?</Link>
          </li>
          <li>
            <Link to="#" onClick={toggleHeaderModal}>
              Download
            </Link>
          </li>
        </ul>
        <div className="login-buttons">
          <Link to="/login">
            <button className="user">Login</button>
          </Link>
        </div>
        {isHeaderModalOpen && <KarmacallAppStoreModal onClose={toggleHeaderModal} />}
      </div>
    </header>
  )
}

export default Header
