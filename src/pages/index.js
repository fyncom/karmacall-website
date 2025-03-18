import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import { Link } from "gatsby"
import { FaShieldAlt, FaDollarSign, FaUserSecret, FaEnvelope, FaCommentDots, FaLock } from "react-icons/fa"
import "../components/index.css"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { KarmacallAppStoreModal } from "../components/Modal"
import { useCombinedQuery } from "../components/useCombinedQuery"

// Detect platform - safely check for browser environment
const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined"
const isIOS = isBrowser ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false

if (isBrowser) {
  console.log("isIOS", isIOS)
  console.log("navigator.userAgent", navigator.userAgent)
}

const BlockSpamEarnCash = () => {
  const {
    heroKarmaCallImage,
    standingKarmaCallPost,
    evonexus,
    evonexusDark,
    appStoreBadge,
    googlePlayBadge,
    karmacallImage,
    karmacallImageDark,
    oneMillionCups,
    oneMillionCupsDark,
    disruptionBanking,
    disruptionBankingDark,
    smugLady,
    harold,
    happyLady,
  } = useCombinedQuery()
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }
  const nanoAccount = "nano_3rcpayu3g39njpq3mkizuepfr5rh1nwuz4xypwsmubkoiww88wubff8d719t"
  const [dynamicMessage, setDynamicMessage] = useState(
    `<span className="payments-counter">108,777 instant payments</span> have been made for blocked calls so far. What are you waiting for? Download the app and get paid! <a href="https://nanexplorer.com/nano/account/${nanoAccount}">See these payments happening in real-time!</a>`
  )
  const [nanoBlockCount, setNanoBlockCount] = useState("")
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const handleThumbnailClick = () => {
    setIsVideoLoaded(true)
  }
  let baseUrl = `${process.env.GATSBY_API_URL_BASE}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  // Use state to keep track of the images for the current theme
  const [karmacallLogo, setKarmacallLogo] = useState(karmacallImage)
  const [disruptionBankingLogo, setDisruptionBankingLogo] = useState(disruptionBanking)
  const [oneMillionCupsLogo, setOneMillionCupsLogo] = useState(oneMillionCups)
  const [evonexusLogo, setEvonexusLogo] = useState(evonexus)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = e => {
        setKarmacallLogo(e.matches ? karmacallImageDark : karmacallImage)
        setDisruptionBankingLogo(e.matches ? disruptionBankingDark : disruptionBanking)
        setOneMillionCupsLogo(e.matches ? oneMillionCupsDark : oneMillionCups)
        setEvonexusLogo(e.matches ? evonexusDark : evonexus)
      }
      handleChange(mediaQuery) // Initial check
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [karmacallImage, karmacallImageDark, disruptionBanking, disruptionBankingDark, oneMillionCups, oneMillionCupsDark, evonexusDark, evonexus])

  useEffect(() => {
    const getBlockCount = async () => {
      try {
        const response = await fetch(`${baseUrl}nano/accountBlockCount`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            destinationAddress: nanoAccount,
          }),
        })
        if (response.ok) {
          const data = await response.json()
          if (data.accountBlockCount > 0) {
            setNanoBlockCount(data.accountBlockCount)
            const numberWithCommas = data.accountBlockCount.toLocaleString()
            const newMessage = `<span class="payments-counter">${numberWithCommas} instant payments</span> have been made for blocked calls so far. What are you waiting for? Download the app and get paid! <a href="https://nanexplorer.com/nano/account/${nanoAccount}">See these payments happening in real-time!</a>`
            setDynamicMessage(newMessage)
          }
        }
      } catch (error) {
        console.error("ERROR", error)
      }
    }
    getBlockCount()
  }, [])

  return (
    <div>
      <Seo title="The Secret Service App" />
      <Header />
      <section>
        <div className="disclaimer-banner">
          <p>
            <strong>DISCLAIMER:</strong> This application is NOT affiliated with, endorsed by, or connected to the United States Secret Service or any
            government agency.
          </p>
        </div>
        <div className="parent-container">
          <div className="AppText">
            <div className="social-media-container">
              <div className="logo-container">
                <div className="bottom-logo">
                  <img
                    src={heroKarmaCallImage}
                    className={"hero-index-image"}
                    alt="The Secret Service App - Protecting your communication channels and paying you for it."
                  />
                </div>
              </div>
              <div className="text-block">
                <h1>The Secret Service App</h1>
                <h2>Modern Defense Against Communication Fraud</h2>
                <p>
                  Inspired by the original mission of the Secret Service to combat financial fraud, our app pays you to block unwanted calls. Creating a
                  financial filter for your communications that should be integrated into our national infrastructure.
                </p>
              </div>
            </div>
          </div>
          <div className={"app-store-row"} id="app-store-row">
            <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash">
              <GatsbyImage className="app-img-index" image={googlePlayBadge} alt="Get The Secret Service App on Google Play" />
            </a>
            <a href="https://apps.apple.com/us/app/karmacall/id1574524278">
              <GatsbyImage className="app-img-index" image={appStoreBadge} alt="Download The Secret Service App on the App Store" />
            </a>
          </div>
        </div>

        <div className="AppText">
          <div className="social-media-container">
            <div className="text-block-left">
              <h2 className="text-wrapper-5">
                National-Grade Protection. <br />
                For <span className="underline-karma">Your</span> Communications.
              </h2>
              <div className={"values-column"}>
                <div className="value-row">
                  <div className="icon-container">
                    <FaUserSecret />
                  </div>
                  <div className="text-container">
                    <h4>Counter-Fraud Initiative</h4>
                    <p>Continuing the historical mission of the Secret Service - protect Americans against financial fraud with modern technology.</p>
                  </div>
                </div>
                <div className="value-row">
                  <div className="icon-container">
                    <FaShieldAlt />
                  </div>
                  <div className="text-container">
                    <h4>Financial Shield Technology</h4>
                    <p>
                      Our proprietary system creates a financial barrier against scammers. When they call, they leave money behind that goes directly to you.
                    </p>
                  </div>
                </div>
                <div className="value-row">
                  <div className="icon-container">
                    <FaDollarSign />
                  </div>
                  <div className="text-container">
                    <h4>Get Paid For Protection!</h4>
                    <p>
                      Every blocked call puts money in your account. Join the national effort to financially penalize scammers while being compensated for your
                      participation in this security network.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="logo-container hero">
              <div className="bottom-logo">
                <img src={standingKarmaCallPost} className={"hero-index-image"} alt="The Secret Service App protects your communications." />
              </div>
            </div>
          </div>
        </div>
        <div className="payments-container">
          <p className="payment-text">
            <div className="html-dynamic" dangerouslySetInnerHTML={{ __html: dynamicMessage }}></div>
          </p>
        </div>

        {/* Features Section Row */}
        <div>
          <h2 className="centered">
            How <span className="semi-barlow-extra-bold">The Secret</span>
            <span className="semi-barlow-extra-light">Service App</span> Protects You
          </h2>
          <p className="values-container-sub">Our technology creates three tiers of communication filtering, ensuring your phone only rings when it matters.</p>
        </div>
        <div className="use-cases-sales-marketing-container">
          <div className="use-case">
            <GatsbyImage image={smugLady} alt="Automatic protection that blocks unwanted calls and pays you instantly." />
            <h2>Intercepted</h2>
            <sub className="sub-features">Advanced Protection Protocol</sub>
            <p>Suspicious calls are automatically intercepted. You receive an immediate security payment for each blocked threat.</p>
          </div>
          <div className="use-case">
            <GatsbyImage
              image={harold}
              alt="Callers can verify their legitimacy by making a small security deposit that gets refunded if they're legitimate."
            />
            <h2>Verification</h2>
            <sub className="sub-features">Security Deposit System</sub>
            <p>Legitimate callers can verify themselves with a $0.05 security deposit. Answer for 25 seconds to issue a full refund or keep their deposit.</p>
          </div>
          <div className="use-case">
            <GatsbyImage image={happyLady} alt="Priority communications that compensate you for your valuable time." />
            <h2>Priority</h2>
            <sub className="sub-features">Continuous Compensation</sub>
            <p>Premium callers are willing to continuously compensate you for your time and attention - creating a truly valuable communication.</p>
          </div>
        </div>

        <div className="future-roadmap">
          <h2>National Communication Protection Network</h2>
          <p>Our mission extends beyond phone calls. We're building a complete communications security system:</p>
          <div className="future-features">
            <div className="feature">
              <div className="feature-icon">
                <FaEnvelope />
              </div>
              <h3>SMS Protection</h3>
              <p>Coming soon: Get paid for blocked text messages</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <FaCommentDots />
              </div>
              <h3>Social DM Security</h3>
              <p>Future release: Extend protection to social media messages</p>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <FaLock />
              </div>
              <h3>Email Defense</h3>
              <p>In development: Gmail and email protection system</p>
            </div>
          </div>
        </div>

        <div className="video-row-container">
          <div className="video-row-text-content">
            <h2>See Our Technology In Action</h2>
            <p>Watch how our communication protection system ensures your security while paying you for each blocked threat.</p>
          </div>
          <div className="video-row-video-container">
            {!isVideoLoaded ? (
              <img
                className="video-thumbnail"
                src={`https://img.youtube.com/vi/VKuLB0CXzOM/hqdefault.jpg`}
                onClick={handleThumbnailClick}
                alt="Play Video"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <iframe
                className="video-row-video"
                src={`https://www.youtube.com/embed/VKuLB0CXzOM?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>

        <section className="why-fyncom">
          <h2 className="underline">The Future of National Communication Security</h2>
          <sub>Join the mission to build a financial barrier against the billions lost to communication fraud each year.</sub>
          <p>
            Inspired by the original mission of the Secret Service to prevent financial fraud, we've created a technology that should be integrated into our
            national telecommunications infrastructure. Until that happens, you can access this protection now and get paid for every blocked communication. Our
            financial filtering system creates accountability in digital communications, forcing scammers to have skin in the game before they can reach you.{" "}
            <br />
            <button className="learn-more-btn" onClick={toggleModal}>
              Download The Protection App Today
            </button>
            {isModalOpen && <KarmacallAppStoreModal onClose={toggleModal} />}
          </p>
        </section>
      </section>
      <Footer />
    </div>
  )
}

export default BlockSpamEarnCash
