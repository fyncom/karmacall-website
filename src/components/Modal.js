import React, { useState } from "react"
import "../components/contact.css"
import "../components/blocked-email.css"
import { GatsbyImage } from "gatsby-plugin-image"
import { FaGift, FaFileAlt, FaSearch, FaSadCry, FaBan, FaBug, FaMoneyBill, FaGifts, FaSadTear } from "react-icons/fa"
import { useCombinedQuery } from "./useCombinedQuery"

export const KarmacallAppStoreModal = ({ onClose }) => {
  const { appStoreBadge, googlePlayBadge } = useCombinedQuery()
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Ready for something new?</h2>
        <p>Download KarmaCall today!</p>
        <div className={"app-store-row"} id="app-store-row">
          <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash">
            <GatsbyImage className="app-img-index" image={googlePlayBadge} alt="Get KarmaCall on Google Play" />
          </a>
          <a href="https://apps.apple.com/us/app/karmacall/id1574524278">
            <GatsbyImage className="app-img-index" image={appStoreBadge} alt="Download KarmaCall on the App Store" />
          </a>
        </div>
      </div>
    </div>
  )
}

export const OtpInputModal = ({ isOpen, onSubmit, onClose }) => {
  const [otp, setOtp] = useState("")
  if (!isOpen) return null
  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(otp)
  }
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Enter OTP</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength="6" placeholder="6-digit OTP" />
          <button type="submit">Submit OTP</button>
        </form>
      </div>
    </div>
  )
}

export const BannedNumberModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal-failure">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <FaBan size={80} />
        <h2>Number was banned</h2>
        <p>It looks like your number was banned. Try contacting support.</p>
      </div>
    </div>
  )
}

export const ServerErrorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal-failure">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <FaBug size={80} />
        <h2>Server Error!</h2>
        <p>We had a server error - please try again later.</p>
      </div>
    </div>
  )
}

export const NanoSentModal = ({ isOpen, nanoExternal, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <FaMoneyBill size={80} />
        <h2>Nano was successfully sent!</h2>
        <p>Check the external nano account below</p>
        <p>
          <a href={`https://www.nanolooker.com/account/${nanoExternal}`}>{nanoExternal}</a>
        </p>
      </div>
    </div>
  )
}

export const NanoNotEnoughModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal-failure">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <FaSadTear size={80} />
        <h2>This is more nano than you have</h2>
        <p>You cannot send more nano than you have in your account balance.</p>
      </div>
    </div>
  )
}

export const GiftCardModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <FaGifts size={80} />
        <h2>Gift Card Was successfully requested!</h2>
        <p>Check your email account</p>
      </div>
    </div>
  )
}

/** BIZ MODALS FOR ORGANIZATIONAL USE **/ 
/** BIZ MODALS FOR ORGANIZATIONAL USE **/ 
export const SuccessModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Thank You!</h2>
        <p>{message}</p>
      </div>
    </div>
  )
}

export const FailureModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal-failure">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Submission Failed</h2>
        <p>{message}</p>
      </div>
    </div>
  )
}

export const MakeADepositModal = ({ onClose }) => {
  const { nanoQrCode } = useCombinedQuery()
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Got nano?</h2>
        <p>Use "nano"-transactions!</p>
        <p>Deposit 0.1 nano to</p>
        <p className="nano-address">nano_1bf3r8pqfsutekxunazj895an8h84ai3ao1ftqyejqiul65p3xsb9k99kc1</p>
        <div className="qr-code-container">
          <GatsbyImage
            className={"nano-qr-code"}
            image={nanoQrCode}
            alt="QR Code of the nano address you should send your deposit to. nano_1bf3r8pqfsutekxunazj895an8h84ai3ao1ftqyejqiul65p3xsb9k99kc1"
          />
        </div>
      </div>
    </div>
  )
}

// Handle one click easy rewards
export const GiftCardSentToEmail = ({ isOpen, organizationName, onClose, urlRedirect }) => {
  if (!isOpen) return null
  setTimeout(() => {
    window.location.href = urlRedirect
  }, 10000)
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <FaGift size={80} />
        <h2>Whoo!</h2>
        <p>Your Reward will be sent to your email within 5 minutes.</p>
        <p>{organizationName}</p>
        <p>Thanks you!</p>
      </div>
    </div>
  )
}

export const GiftCardTxIdNotFound = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal-failure">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="qr-code-container">
          <div style={{ position: "relative", display: "inline-block" }}>
            <FaFileAlt size={50} />
            <FaSearch
              size={30}
              style={{
                position: "absolute",
                bottom: 0,
                right: -10,
                color: "red", // You can adjust the color as needed
                //rgba(var(--fyncom-red-rgb), 0.5) // adjust to this later
              }}
            />
          </div>
        </div>
        <h2>Transaction not found</h2>
        <p>Sorry, we are unable to locate this transaction ID. Please send an email to support@fyncom.com if you think this is wrong.</p>
      </div>
    </div>
  )
}

export const GiftCardNotEnoughBalance = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  setTimeout(() => {
    window.location.href = "https://www.fyncom.com/about-the-fyncom-team"
  }, 8000)
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <FaSadCry size={80} />
        <h2>Low Balance.</h2>
        <p>It looks like your balance is not enough to purchase this.</p>
      </div>
    </div>
  )
}
