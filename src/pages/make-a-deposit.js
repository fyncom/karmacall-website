import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/white-paper.css"
import "../components/blocked-email.css"
import { useLocation } from "@reach/router"
import whitePaper from "../../static/pdfs/fyncom-Original-White-Paper-For-KarmaCall-Update.pdf"
import Seo from "../components/seo"
import PdfContent from "../components/PdfContent"
import { MakeADepositModal } from "../components/Modal"

const MakeADeposit = () => {
  const [blockedEmailDetails, setBlockedEmailDetails] = useState(null)
  const location = useLocation()
  const [dynamicMessage, setDynamicMessage] = useState(
    "You're seeing this because you've gotten a \"PayCation\" email."
  )
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const blockedEmailId = searchParams.get("depositId")
    console.log("deposit ID is %s", blockedEmailId)
    if (blockedEmailId) {
      getBlockedEmailDetails(blockedEmailId)
    }
  }, [location])

  const getBlockedEmailDetails = async blockedEmailId => {
    let newUrl = `${process.env.GATSBY_API_URL}email/blocked/${blockedEmailId}`
    try {
      const response = await fetch(newUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        const depositPaid = data.depositPaid
        console.log("deposit paid status: " + depositPaid)
        const secondaryLabel = data.emailLabel ? data.emailLabel : "FynFiltered"
        const fynMail = "FynMail"
        if (depositPaid) {
          // provide extra info - we'll handle this later as it's an edge case for now
        }
        setBlockedEmailDetails(data) // Update the state, which will re-render the component
        const newMessage = data.depositPaid
          ? `Thank you for your $${data.recipientMin} deposit... [rest of the message]`
          : `<p>Your email (<span class="emphasis">${data.senderEmail}</span>) to <span class="emphasis">${data.recipientEmail}</span> landed in their 
                <span class="emphasis">${data.labelName}</span>, but was moved to a secondary inbox, <span class="emphasis">${secondaryLabel}</span>, 
                because they don't know you.
              </p>
              <p><span class="emphasis">${data.recipientEmail}</span> requires a <span class="emphasis">$${data.recipientMin}</span> 
                refundable deposit for your email to move to their main inbox and be marked as <span class="emphasis">${fynMail}</span>. If you pay 
                this deposit, <span class="emphasis">${data.recipientEmail}</span> will be notified and they will immediately see your email. If 
                <span class="emphasis">${data.recipientEmail}</span> responds to your FynMail within <span class="emphasis">${data.daysDeadline}</span> days, 
                you will get your deposit back. Then you may manage your deposit refund by accessing <a href="https://app.fyncom.com">app.fyncom.com</a>.
              </p>`
        setDynamicMessage(newMessage)
      } else {
        throw new Error("Failed to fetch email details")
      }
    } catch (error) {
      console.error("ERROR", error)
    }
  }

  // Function to render the payment button or any other elements based on the blocked email details
  function renderPaymentButton() {
    if (blockedEmailDetails) {
      console.log("data is here from {}", blockedEmailDetails)
      // Render your button and use the details from blockedEmailDetails
      const stripeUrl = `https://buy.stripe.com/fZe5obgilbJa5lm001?prefilled_email=${blockedEmailDetails.senderEmailRaw}&client_reference_id=${blockedEmailDetails.blockedEmailLogId}`
      // todo - only use this if you plan to show a button to everyone that visits this page.
      const stripeUrlDefault = `https://buy.stripe.com/fZe5obgilbJa5lm001`
      return (
        <>
          <a
            href={stripeUrl}
            className="learn-more-btn cash"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deposit cash
          </a>
          <button className="learn-more-btn xno" onClick={toggleModal}>
            Deposit nano
          </button>
          {isModalOpen && <MakeADepositModal onClose={toggleModal} />}
        </>
      )
    } else {
      console.log("no data present")
    }
  }

  return (
    <div>
      <Seo
        title="Deposits Refundable"
        description="Looks like you got a PayCation email from FynCom. Pay a small, refundable deposit to get your email to the top of your recipient's inbox
         & get their immediate attention. If they respond, you get your deposit back. Simple!"
      />
      <Header />
      <div className="content-container">
        <h1>Get Your Email Noticed. Make a Deposit. </h1>
        <sub>
          Pay a small, refundable deposit to get your email to my main inbox &
          get my immediate attention. If I respond, you get your deposit back.
          Simple!
        </sub>
        <div
          className="html-dynamic"
          dangerouslySetInnerHTML={{ __html: dynamicMessage }}
        ></div>
        {renderPaymentButton()}
        <p>
          Still here? Why not read something interesting? Ever get annoying
          calls? Emails? DMs? Read below to find out how we're helping fix that
          problem by getting people paid to block scam / spam and respond to
          good messages.
        </p>
        <h2>Why Do Spam Calls Still Exist?</h2>
        <p>...and how can I stop scams, but get useful outreach?</p>
        <p>
          That's the thought that started FynCom on a journey of exploring an
          emerging market based in "communications + currency" to create trust
          between strangers with shared interests. Here's our paper we wrote to
          record our thought process - it later became{" "}
          <a href="https://patents.google.com/patent/US11310368B2">
            our 1st patent
          </a>
          , <a href="https://karmacall.com/">app</a>, and is the basis for how
          we came to be. Thanks for reading! <br />
          <i>- Team FynCom</i>
        </p>
        <PdfContent file={whitePaper} />
      </div>
      <Footer />
    </div>
  )
}

export default MakeADeposit
