import React, { useState, useEffect, lazy, Suspense } from "react"
import Header from "../components/header"
import { Link } from "gatsby"
import { FaRobot, FaDollarSign, FaUserShield } from "react-icons/fa"
import "../components/index.css"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { KarmacallAppStoreModal } from "../components/Modal"
import { useCombinedQuery } from "../components/useCombinedQuery"

// Lazy load components that are below the fold for better performance
const Footer = lazy(() => import("../components/footer"))

// Detect platform - safely check for browser environment
const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined"
const isIOS = isBrowser ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false

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
  // Nano accounts for different blocking types
  const nanoAccounts = {
    calls: "nano_3rcpayu3g39njpq3mkizuepfr5rh1nwuz4xypwsmubkoiww88wubff8d719t",
    texts: "nano_3kctxtpayjc43ythwmcj7w7nhxtgyy9rfgamrny4xp9cp1mz4doadd3a3bzf", // BlockTechMessage account
    emails: "nano_3kctxtpayjc43ythwmcj7w7nhxtgyy9rfgamrny4xp9cp1mz4doadd3a3bzf", // Placeholder - update when you have the email account
  }

  // State for individual counters
  const [blockCounts, setBlockCounts] = useState({
    calls: 487660, // Default fallback
    texts: 3780,
    emails: 38935,
  })

  // Calculate total for main message
  const totalBlocks = blockCounts.calls + blockCounts.texts + blockCounts.emails
  const [dynamicMessage, setDynamicMessage] = useState(
    `<span className="payments-counter">${totalBlocks.toLocaleString()} instant payments</span> have been made for blocked calls, texts, and emails. What are you waiting for? Download the app and get paid! <a href="https://nanexplorer.com/nano/account/${
      nanoAccounts.calls
    }">See these payments happening in real-time!</a>`
  )
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
      // const handleChange = () => setIsDarkMode(mediaQuery.matches);
      const handleChange = e => {
        setKarmacallLogo(e.matches ? karmacallImageDark : karmacallImage)
        setDisruptionBankingLogo(e.matches ? disruptionBankingDark : disruptionBanking)
        setOneMillionCupsLogo(e.matches ? oneMillionCupsDark : oneMillionCups)
        setEvonexusLogo(e.matches ? evonexusDark : evonexus)
      }
      // setIsDarkMode(mediaQuery.matches);
      handleChange(mediaQuery) // Initial check
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [karmacallImage, karmacallImageDark, disruptionBanking, disruptionBankingDark, oneMillionCups, oneMillionCupsDark, evonexusDark, evonexus])

  useEffect(() => {
    const getBlockCounts = async () => {
      const newBlockCounts = {
        calls: 108777, // Default fallback
        texts: 0,
        emails: 0,
      }
      let hasUpdates = false

      // Fetch block counts for calls and texts (nano accounts)
      for (const [type, account] of Object.entries(nanoAccounts)) {
        if (type === "emails") continue // Skip emails, handle separately

        try {
          const response = await fetch(`${baseUrl}nano/accountBlockCount`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              destinationAddress: account,
            }),
          })
          if (response.ok) {
            const data = await response.json()
            if (data.accountBlockCount > 0) {
              newBlockCounts[type] = data.accountBlockCount
              hasUpdates = true
            }
          }
        } catch (error) {
          console.error(`error fetching ${type} block count:`, error)
        }
      }

      // Fetch blocked email count from different endpoint
      try {
        const response = await fetch(`${baseUrl}v2/api/blocked-email-count`, {
          method: "GET",
          headers: headers,
        })
        if (response.ok) {
          const data = await response.json()
          if (data && typeof data === "number" && data > 0) {
            newBlockCounts.emails = data
            hasUpdates = true
          } else if (data && data.count && data.count > 0) {
            newBlockCounts.emails = data.count
            hasUpdates = true
          }
        }
      } catch (error) {
        console.error(`error fetching email block count:`, error)
      }

      // Update state if we have new data
      if (hasUpdates) {
        setBlockCounts(newBlockCounts)
        const total = newBlockCounts.calls + newBlockCounts.texts + newBlockCounts.emails
        const newMessage = `<span class="payments-counter">${total.toLocaleString()} instant payments</span> have been made for blocked calls, texts, and emails. What are you waiting for? Download the app and get paid! <a href="https://nanexplorer.com/nano/account/${
          nanoAccounts.calls
        }">See these payments happening in real-time!</a>`
        setDynamicMessage(newMessage)
      }
    }
    getBlockCounts()
  }, [])

  return (
    <div>
      <Seo
        title="KarmaCall - Block Spam Calls, Texts & Emails for Cash"
        description="Get paid to block spam calls, texts, and emails with KarmaCall. Complete digital protection that turns unwanted communications into cash rewards. Download today!"
        keywords={[
          "spam blocker",
          "spam call blocker",
          "text spam blocker",
          "email spam blocker",
          "block spam calls",
          "block spam texts",
          "get paid to block calls",
          "digital protection",
          "stop spam calling",
          "stop robocalls",
          "SMS filtering",
          "Gmail protection",
        ]}
      />
      <Header />
      <section>
        <div className="parent-container">
          <div className="AppText">
            <div className="social-media-container">
              <div className="logo-container">
                <div className="bottom-logo">
                  <img src={heroKarmaCallImage} className={"hero-index-image"} alt="A simple app that pays you to block scam calls." />
                </div>
              </div>
              <div className="text-block">
                <h1>Get Paid to Block Spam Calls, Texts & Emails.</h1>
                <h2>Complete digital protection with cash rewards</h2>
                {
                  <p>
                    If you like "do not disturb" mode on your phone, you'll love KarmaCall's comprehensive "cash-back" strategy. Block unwanted calls, texts,
                    and emails while earning money. Download the app today to protect all your communications.{" "}
                  </p>
                }
                {/* <p>
                  If you like "do not disturb" mode on your phone, you'll love the KarmaCall mobile app's "cash-back" strategy to fix the scam, spam, and fraud
                  that happens daily. Download today!
                </p> */}
              </div>
            </div>
          </div>
          <div className={"app-store-row"} id="app-store-row">
            <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash">
              <GatsbyImage className="app-img-index" image={googlePlayBadge} alt="Get KarmaCall on Google Play" loading="eager" />
            </a>
            <a href="https://apps.apple.com/us/app/karmacall/id1574524278">
              <GatsbyImage className="app-img-index" image={appStoreBadge} alt="Download KarmaCall on the App Store" loading="eager" />
            </a>
          </div>
          {!isIOS && (
            <div className="android-apk-notice">
              <p>
                <strong>🎉 Great news, Android users!</strong> We're back on the Google Play Store with all the latest updates and fixes! If you previously downloaded our APK,{" "}
                <Link to="/download-apk" className="apk-download-link">
                  please see these important migration instructions
                </Link>{" "}
                to switch back to the official Google Play version.
              </p>
            </div>
          )}
        </div>

        <div className="AppText">
          <div className="social-media-container">
            <div className="text-block-left">
              <h2 className="text-wrapper-5">
                Your Refundable Paywall. <br />
                Your <span className="underline-karma">Karma</span>Call.
              </h2>
              <div className={"values-column"}>
                <div className="value-row">
                  <div className="icon-container">
                    <FaUserShield />
                  </div>
                  <div className="text-container">
                    {/* /want to change this up a bit to focus on sanity / mental wellness / uniqueness */}
                    <h4>Your mind. Your time.</h4>
                    <p>Your data is valuable. We make sure you get paid for your data and time.</p>
                  </div>
                </div>
                <div className="value-row">
                  <div className="icon-container">
                    <FaRobot />
                  </div>
                  <div className="text-container">
                    <h4>End AI Scams Everywhere</h4>
                    <p>
                      Scammers target you through calls, texts, and emails. They depend on people responding to at least one channel. KarmaCall protects them
                      all, making your digital presence truly spam-free.
                    </p>
                  </div>
                </div>
                <div className="value-row">
                  <div className="icon-container">
                    {/* <div className="logo-container"> */}
                    <FaDollarSign />
                  </div>
                  <div className="text-container">
                    <h4>Get Paid for Protection!</h4>
                    <p>
                      Earn money for every spam call, text, and email you block. Turn digital harassment into cash rewards! Get immediate financial revenge
                      against scammers across all communication channels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="logo-container hero">
              <div className="bottom-logo">
                <img src={standingKarmaCallPost} className={"hero-index-image"} alt="A simple app that pays you to block scam calls." />
              </div>
            </div>
          </div>
        </div>
        <div className="payments-container">
          <p className="payment-text">
            <div className="html-dynamic" dangerouslySetInnerHTML={{ __html: dynamicMessage }}></div>
          </p>
        </div>

        {/* Individual Counter Cards */}
        <div className="counter-cards-container">
          <div className="counter-card">
            <a href={`https://nanexplorer.com/nano/account/${nanoAccounts.calls}`} target="_blank" rel="noopener noreferrer" className="counter-icon-link">
              <div className="counter-icon clickable">📞</div>
            </a>
            <div className="counter-number">{blockCounts.calls.toLocaleString()}</div>
            <div className="counter-label">Blocked Calls</div>
          </div>
          <div className="counter-card">
            <a href={`https://nanexplorer.com/nano/account/${nanoAccounts.texts}`} target="_blank" rel="noopener noreferrer" className="counter-icon-link">
              <div className="counter-icon clickable">💬</div>
            </a>
            <div className="counter-number">{blockCounts.texts.toLocaleString()}</div>
            <div className="counter-label">Blocked Texts</div>
          </div>
          <div className="counter-card">
            <div className="counter-icon">📧</div>
            <div className="counter-number">{blockCounts.emails.toLocaleString()}</div>
            <div className="counter-label">Blocked Emails</div>
          </div>
        </div>

        {/* Multi-Channel Protection Section */}
        <div className="AppText">
          <div className="social-media-container">
            <div className="text-block-centered">
              <h2 className="text-wrapper-6">Complete Digital Protection</h2>
              <p className="values-container-sub">
                KarmaCall now protects all your communication channels. Block spam calls with instant payouts, filter unwanted texts natively in the app, and
                introducing Gmail spam protection with Fyncom technology - all while earning cash rewards.
              </p>
              <div className="protection-features">
                <div className="protection-item">
                  <span className="protection-icon">📞</span>
                  <h4>Spam Call Blocking</h4>
                  <p>Proven technology with instant crypto payouts</p>
                </div>
                <div className="protection-item">
                  <span className="protection-icon">💬</span>
                  <h4>Native Text Filtering</h4>
                  <p>Built-in SMS spam protection directly in the app</p>
                </div>
                <div className="protection-item">
                  <span className="protection-icon">📧</span>
                  <h4>Gmail Protection</h4>
                  <p>Powered by Fyncom's advanced email filtering (coming soon)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section Row */}
        <div>
          <h2 className="centered">
            What kind of calls will I get with <span className="semi-barlow-extra-bold">Karma</span>
            <span className="semi-barlow-extra-light">Call</span>?
          </h2>
          <p className="values-container-sub-addition">
            In addition to getting normal uninterrupted calls from your contact, you'll get these 3 unique kinds of calls. Starting from most likely to least
            likely.
          </p>
        </div>
        <div className="use-cases-sales-marketing-container">
          <div className="use-case">
            <GatsbyImage
              image={smugLady}
              loading="lazy"
              alt="The most common kind of KarmaCall interaction. Unknown calls get blocked and you get instant cash-back!"
            />
            <h2>Blocked</h2>
            <sub className="sub-features">Instant CashBack!</sub>
            <p>Your phone will not ring. The call is sent to voicemail and we instantly pay you as thanks for fighting scams!</p>
          </div>
          <div className="use-case">
            <GatsbyImage
              image={harold}
              loading="lazy"
              alt="A unique kind of KarmaCall. Like a bank micro-deposit to verify ownership, this caller's deposited 5 cents to your account to verify they're willing to take a chance at losing money in order to talk to you. Give these callers a chance! Or don't - it's totally up to you!"
            />
            <h2>Refundable</h2>
            <sub className="sub-features">Possible Good Call</sub>
            <p>The caller made a $0.05 deposit! Answer & stay on for 25 seconds to give them a full refund. Hang up early to keep their deposit.</p>
          </div>
          <div className="use-case">
            <GatsbyImage
              image={happyLady}
              loading="lazy"
              alt="These are commmercial callers who are paying you for every second you're on the phone with them! You'll make more here by staying on the line, than you would by hanging up on them."
            />
            <h2>Cash</h2>
            <sub className="sub-features">Reverse Pay Phone</sub>
            <p>This person's willing to continually pay you to stay on the phone, like a reverse pay-phone!</p>
          </div>
        </div>

        <div className="video-row-container">
          <div className="video-row-text-content">
            <h2>Explainer Video!</h2>
            <p>Check out this quick video about our easy to use app.</p>
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
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>

        <section className="why-fyncom">
          <h2 className="underline">Be part of the Data Revolution</h2>
          <sub>Fight back against scammers who steal billions of dollars every year from vulnerable people. </sub>
          <p>
            Our mission is to create a privacy focused market that financially rewards all its participants and is strengthened by numbers. Through KarmaCall,
            data control becomes your commodity which you can sell or keep to yourself. We believe the future of great businesses is in shared prosperity and
            that requires that you are financially compensated for your data and time. <br />
            <button className="learn-more-btn" onClick={toggleModal}>
              Download Today!
            </button>
            {isModalOpen && <KarmacallAppStoreModal onClose={toggleModal} />}
          </p>
        </section>
      </section>
      <Suspense fallback={<div>Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  )
}

export default BlockSpamEarnCash
