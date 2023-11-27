import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import { Link } from "gatsby"
import { FaRobot, FaDollarSign, FaUserShield } from "react-icons/fa"
import "../components/index.css"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { KarmacallAppStoreModal } from "../components/Modal"
import { useCombinedQuery } from "../components/useCombinedQuery"

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
  const [dynamicMessage, setDynamicMessage] = useState(
    '<span className="payments-counter">108,777 instant payments</span> have been made for blocked calls so far. What are you waiting for? Download the app and get paid! <a href="https://www.nanolooker.com/account/nano_3rcpayu3g39njpq3mkizuepfr5rh1nwuz4xypwsmubkoiww88wubff8d719t">See these payments happening in real-time!</a>'
  )
  const [nanoBlockCount, setNanoBlockCount] = useState("")
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
    getBlockCount("nano_3rcpayu3g39njpq3mkizuepfr5rh1nwuz4xypwsmubkoiww88wubff8d719t")
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

  const getBlockCount = async nanoAccount => {
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
          const newMessage = `<span class="payments-counter">${numberWithCommas} instant payments</span> have been made for blocked calls so far. What are you waiting for? Download the app and get paid! <a href="https://www.nanolooker.com/account/nano_3rcpayu3g39njpq3mkizuepfr5rh1nwuz4xypwsmubkoiww88wubff8d719t">See these payments happening in real-time!</a>`

          setDynamicMessage(newMessage)
        }
      }
    } catch (error) {
      console.error("ERROR", error)
    }
  }

  return (
    <div>
      <Seo title="KarmaCall" />
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
                <h1>Get Paid to Block Scam Calls.</h1>
                <h2>Cash out with no limits</h2>
                <p>
                  Hang up on scam phone call and take the caller's deposit! Get immediate financial revenge against scammers who waste your time. Join us in the
                  fight against malicious phone spammers by downloading KarmaCall today.
                </p>
              </div>
            </div>
          </div>
          <div className={"app-store-row"} id="app-store-row">
            <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash">
              <GatsbyImage className="app-img-index" image={googlePlayBadge} alt="Get KarmaCall on Google Play" />
            </a>
            <a href="https://apps.apple.com/us/app/karmacall/id1574524278">
              <GatsbyImage className="app-img-index" image={appStoreBadge} alt="Download KarmaCall on the App Store" />
            </a>
          </div>
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
                    {/* <div className="logo-container"> */}
                    <FaDollarSign />
                  </div>
                  <div className="text-container">
                    <h4>Get Paid!</h4>
                    <p>
                      For every call you let us block on your behalf, you get paid <a href="https://nano.org/en/foundation">nano</a>. Instantly. Cash-out at any
                      time to nano, cash, or gift cards!
                    </p>
                  </div>
                </div>
                <div className="value-row">
                  <div className="icon-container">
                    <FaRobot />
                  </div>
                  <div className="text-container">
                    <h4>End AI Scams</h4>
                    <p>
                      Scammers depend on the statistics of people answering calls. As long as your phone number works, you will get scam calls. We can stop
                      that.
                    </p>
                  </div>
                </div>
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

        {/* Features Section Row */}
        <div>
          <h2 className="centered">
            What kind of calls will I get with <span className="semi-barlow-extra-bold">Karma</span>
            <span className="semi-barlow-extra-light">Call</span>?
          </h2>
          <p className="values-container-sub">
            In addition to getting normal uninterrupted calls from your contact, you'll get these 3 unique kinds of calls. Starting from most likely to least
            likely.
          </p>
        </div>
        <div className="use-cases-sales-marketing-container">
          <div className="use-case">
            <GatsbyImage image={smugLady} alt="The most common kind of KarmaCall interaction. Unknown calls get blocked and you get instant cash-back!" />
            <h2>Blocked</h2>
            <sub className="sub-features">Instant CashBack!</sub>
            <p>Your phone will not ring. The call is sent to voicemail and we instantly pay you as thanks for fighting scams!</p>
          </div>
          <div className="use-case">
            <GatsbyImage
              image={harold}
              alt="A unique kind of KarmaCall. Like a bank micro-deposit to verify ownership, this caller's deposited 5 cents to your account to verify they're willing to take a chance at losing money in order to talk to you. Give these callers a chance! Or don't - it's totally up to you!"
            />
            <h2>Refundable</h2>
            <sub className="sub-features">Possible Good Call</sub>
            <p>The caller made a $0.05 deposit! Answer & stay on for 25 seconds to give them a full refund. Hang up early to keep their deposit.</p>
          </div>
          <div className="use-case">
            <GatsbyImage
              image={happyLady}
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
            <iframe
              className="video-row-video"
              src="https://www.youtube.com/embed/VKuLB0CXzOM"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
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
      <Footer />
    </div>
  )
}

export default BlockSpamEarnCash
