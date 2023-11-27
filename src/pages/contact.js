import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import Header from "../components/header"
import Footer from "../components/footer"
import Seo from "../components/seo"
import "../components/contact.css"
import googlePlayBadge from "../images/google-play-en.png"
import appStoreBadge from "../images/apple-en.png"
import { SuccessModal, FailureModal } from "../components/Modal"
import { GatsbyImage } from "gatsby-plugin-image"
import { useCombinedQuery } from "../components/useCombinedQuery"

const Contact = () => {
  const { fyncomFiltersWords, fyncomFiltersWordsDark } = useCombinedQuery()
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false)
  const [isFailureModalOpen, setFailureModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [modalMessage, setModalMessage] = useState("")
  const [filterLogo, setFilterLogo] = useState(fyncomFiltersWords)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = e => {
        setFilterLogo(e.matches ? fyncomFiltersWordsDark : fyncomFiltersWords)
      }
      handleChange(mediaQuery) // Initial check
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [fyncomFiltersWords, fyncomFiltersWordsDark])

  // Function to handle form submission
  const handleSubmit = async e => {
    let newUrl = `${process.env.GATSBY_API_URL}api/public/contact`
    e.preventDefault()
    try {
      // You can send the data to your backend API endpoint
      const response = await fetch(newUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.status === 200) {
        console.log("Email sent successfully")
        setModalMessage("Your message has been sent.")
        setSuccessModalOpen(true)
      } else {
        console.error("Failed to send email")
        setModalMessage(data.message || "Failed to send your message.")
        setFailureModalOpen(true)
      }
    } catch (error) {
      console.error("Error submitting form", error)
    }
  }

  return (
    <div>
      <Seo title="Contact Us" description="Send a contact request to the KarmaCall team and we'll get back to you shortly" />
      <Header />
      <main className="contact-container">
        <h1>Contact Us</h1>
        <p>If you have any questions or inquiries, feel free to reach out to us.</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            // required
          />
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>

        <h2>What is KarmaCall?</h2>
        <p>
          KaramCall is a mobile app built to stop spam calls, scam calls, and unwanted calls in general. KarmaCall focuses purely on the monetary incentives
          that motivate spammers. By paying KarmaCall users to block unknown calls, KarmaCall makes your voice valuable; So valuable, that eventually...
          <ol>
            <li>
              Good callers (people not on your contacts list, like old friends & unknown but desired contacts) will risk losing money to you for the chance to
              start a conversation with you.
            </li>
            <li>Commercial callers will instantly pay you on a minute by minute basis to listen to them or talk.</li>
            <li>Scammers will lose more money than they can defraud.</li>
          </ol>
          <br />
          The paid version of KarmaCall allows you to set your own "deposit rates" and "reward rates".
        </p>
        <p>
          KarmaCall is made possible by FynCom's technology and is wholly owned by <a href="https://www.fyncom.com">FynCom</a>.
        </p>

        <i>
          <p className="centered">If you like KarmaCall, you may like our Email Scam Cash back tools too!</p>
        </i>
        <h1 className="centered">Spam Sucks!</h1>
        <h2 className="centered">Get instantly paid to block bad emails & calls with...</h2>
        <Link to="/fyncom-filters-email-edition">
          <GatsbyImage image={filterLogo} alt="FynCom Filters" />
        </Link>
        <div className="info-section">
          <p>
            Save time & let us pay you to ignore those scam emails & calls! Be the first to know when our text / SMS blocking tech is ready by signing up to one
            of our apps today!
          </p>
          <ul className="info-list">
            <li>Emails</li>
            <ul className="emails-list">
              <li>
                Gmail. <Link to="/fyncom-filters-email-edition">Free for 1st 100 blocked emails per month.</Link>
              </li>
            </ul>
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
          </ul>
        </div>
      </main>
      <Footer />
      <SuccessModal isOpen={isSuccessModalOpen} message={modalMessage} onClose={() => setSuccessModalOpen(false)} />
      <FailureModal isOpen={isFailureModalOpen} message={modalMessage} onClose={() => setFailureModalOpen(false)} />
    </div>
  )
}

export default Contact
