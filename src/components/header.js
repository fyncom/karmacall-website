import React, { useState, useEffect, useRef, lazy, Suspense } from "react"
import "./header.css"
import { Link } from "gatsby"
import { FaBars } from "react-icons/fa"
import { GatsbyImage } from "gatsby-plugin-image"
import { useCombinedQuery } from "./useCombinedQuery"

const KarmacallAppStoreModal = lazy(() =>
  import("../components/Modal").then(module => ({ default: module.KarmacallAppStoreModal }))
)

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()
  const hamburgerRef = useRef() // Ref for the hamburger menu icon
  const [hasAccountSession, setHasAccountSession] = useState(false)
  const toggleMenu = event => {
    event.stopPropagation()
    setMenuOpen(!isMenuOpen)
  }
  const [isHeaderModalOpen, setHeaderModalOpen] = useState(false)
  const toggleHeaderModal = () => {
    setHeaderModalOpen(!isHeaderModalOpen)
  }
  const { fyncomProductLogoLight, fyncomProductLogoDark, karmacallLogoNoTaglineLight, karmacallLogoNoTaglineDark } = useCombinedQuery()
  // State to hold which logo to show - initialized with light mode as default
  const [logoData, setLogoData] = useState(fyncomProductLogoLight)
  const [karmacallLogoData, setKarmacallLogoData] = useState(karmacallLogoNoTaglineLight)
  const [isClient, setIsClient] = useState(false)

  // Effect to mark when we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === "undefined") {
      return
    }

    const updateAccountSession = () => {
      const sessionId = window.localStorage.getItem("sessionId")
      const stored = window.localStorage.getItem("karmacall_cookie_preferences")
      let functionalConsent = false

      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const preferences = parsed.preferences || parsed
          functionalConsent = Boolean(preferences && preferences.functional)
        } catch (error) {
          functionalConsent = false
        }
      }

      setHasAccountSession(Boolean(sessionId) && functionalConsent)
    }

    updateAccountSession()
    window.addEventListener("storage", updateAccountSession)
    window.addEventListener("focus", updateAccountSession)

    return () => {
      window.removeEventListener("storage", updateAccountSession)
      window.removeEventListener("focus", updateAccountSession)
    }
  }, [isClient])

  // Effect for setting the logo based on the system color scheme
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = e => {
        setLogoData(e.matches ? fyncomProductLogoDark : fyncomProductLogoLight)
        setKarmacallLogoData(e.matches ? karmacallLogoNoTaglineDark : karmacallLogoNoTaglineLight)
      }
      handleChange(mediaQuery) // Initial check
      mediaQuery.addListener(handleChange) // Listen for changes
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [isClient, fyncomProductLogoLight, fyncomProductLogoDark, karmacallLogoNoTaglineDark, karmacallLogoNoTaglineLight])

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

  const accountLabel = hasAccountSession ? "Account" : "Login"
  const accountLink = hasAccountSession ? "/cash-out" : "/login"

  return (
    <header className="header-top">
      <div className="header-container">
        <div className="fyncom-logo-header">
          <Link to="/">
            <GatsbyImage className="left-header-logo" image={karmacallLogoData} alt="KarmaCall Logo" />
          </Link>
          <div className="arrow-container"></div>
          <Link to="https://fyncom.com">
            <GatsbyImage className="right-header-logo" image={logoData} alt="FynCom Logo, which indicates that KarmaCall is built with FynCom tech" />
          </Link>
        </div>
        <div
          ref={hamburgerRef}
          className="mobile-menu-icon"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </div>
        {/* Mobile Menu Panel */}
        <nav ref={menuRef} id="mobile-menu" className={isMenuOpen ? "mobile-menu open" : "mobile-menu"}>
          <ul>
            <li className="mobile-menu-item">
              <Link to={accountLink}>{accountLabel}</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/about">About</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/pricing">Pricing</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/faq">FAQ</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/white-paper-original-scam-calls">Why?</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/compare">Compare</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="#" onClick={toggleHeaderModal}>
                Download
              </Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/mentions">Mentions</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/blog">Blog</Link>
            </li>
            <li className="mobile-menu-item">
              <Link to="/ai-collaboration">AI Use</Link>
            </li>
            {/* this is from fyncom site - if you want it - change for karamcall relevance and update content */}
            {/* <li className="mobile-menu-item">
              <Link to="/help-center">Help</Link>
            </li> */}
          </ul>
        </nav>

        <ul className="nav-links">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/pricing">Pricing</Link>
          </li>
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
          <li>
            <Link to="/white-paper-original-scam-calls">Why?</Link>
          </li>
          <li>
            <Link to="/compare">Compare</Link>
          </li>
          <li>
            <Link to="#" onClick={toggleHeaderModal}>
              Download
            </Link>
          </li>
          <li>
            <Link to="/mentions">Mentions</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/ai-collaboration">AI Use</Link>
          </li>
          {/* <li>
            <Link to="/help-center">Help</Link>
          </li> */}
        </ul>
        <div className="login-buttons">
          <Link to={accountLink}>
            <button className="user">{accountLabel}</button>
          </Link>
        </div>
        {isHeaderModalOpen && (
          <Suspense fallback={null}>
            <KarmacallAppStoreModal onClose={toggleHeaderModal} />
          </Suspense>
        )}
      </div>
    </header>
  )
}

export default Header
