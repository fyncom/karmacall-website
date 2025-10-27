import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/sales-and-marketing-use-cases.css"
import Seo from "../components/seo"
import { GiftCardModal, NanoNotEnoughModal, NanoSentModal, ReferralAppDownloadModal } from "../components/Modal"
import AppDownloadButton from "../components/AppDownloadButton"
import SolanaWalletConnect from "../components/SolanaWalletConnect"
import ReactGA from "react-ga4"

const CashOut = () => {
  const isBrowser = typeof window !== "undefined"
  const [userDetails, setUserDetails] = useState(null)
  const [dynamicMessage, setDynamicMessage] = useState("Your USD Balance is $0.00")
  const [nanoAccount, setNanoAccount] = useState("")
  const updateNanoAccount = newAccount => {
    setNanoAccount(newAccount)
    isBrowser && localStorage.setItem("nanoAccount", newAccount)
  }
  const [nanoBalance, setNanoBalance] = useState("")
  const updateNanoBalance = newBalance => {
    setNanoBalance(newBalance)
    isBrowser && localStorage.setItem("nanoBalanceInFiat", newBalance)
  }
  const [nanoBalanceInFiat, setNanoBalanceInFiat] = useState("")
  const updateNanoBalanceInFiat = newBalance => {
    setNanoBalanceInFiat(newBalance)
    isBrowser && localStorage.setItem("nanoBalanceInFiat", newBalance)
  }
  const [fiatType, setFiatType] = useState("")
  const updateFiatType = localFiatType => {
    setFiatType(localFiatType)
    isBrowser && localStorage.setItem("fiatType", localFiatType)
  }
  const [nanoRate, setNanoRate] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [destinationAccount, setDestinationAccount] = useState("")
  const sessionId = isBrowser ? localStorage.getItem("sessionId") : null
  const phoneNumber = isBrowser ? localStorage.getItem("phoneNumber") : null
  const countryCode = isBrowser ? localStorage.getItem("countryCode") : null
  const [isNanoSentModalOpen, setIsNanoSentModalOpen] = useState(false)
  const [isNanoOverBalanceModalOpen, setIsNanoOverBalanceModalOpen] = useState(false)
  const [isGiftCardModalOpen, setIsGiftCardModalOpen] = useState(false)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  const [referralCode, setReferralCode] = useState("")
  const [referralShareText, setReferralShareText] = useState("")
  const openNanoSentModal = () => {
    setIsNanoSentModalOpen(true)
  }
  const openNanoOverBalancedModal = () => {
    setIsNanoOverBalanceModalOpen(true)
  }
  const openGiftCardModal = () => {
    setIsGiftCardModalOpen(true)
  }
  const [showSolanaConnect, setShowSolanaConnect] = useState(false)
  const userId = isBrowser ? localStorage.getItem("userId") : null

  let baseUrl = `${process.env.GATSBY_API_URL_BASE}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    const account = localStorage.getItem("nanoAccount")
    if (account !== null) {
      getNanoBalanceAndUpdateMessage(account, "USD")
    }
    updateNanoAccount(account)

    // Check if there's a saved referral code and we're logged in
    const savedReferralCode = localStorage.getItem("pendingReferralCode")
    if (savedReferralCode && sessionId) {
      setIsReferralModalOpen(true)
      // Clear the saved code once we've shown the modal
      localStorage.removeItem("pendingReferralCode")
    }
  }, [sessionId])

  const fetchReferralCode = async () => {
    try {
      if (!userId) {
        console.error("no userId found")
        return
      }

      const response = await fetch(`${baseUrl}v2/referral/fetch`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          userId: userId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const referralCodeValue = data.referralCode || ""
        setReferralCode(referralCodeValue)
        const inviteLink = `https://www.karmacall.com/login?_referralCode=${referralCodeValue}`
        const shareText = `I get paid to block phone spam calls with KarmaCall! Sign up here and we will both get paid extra when you block your first call.\n${inviteLink}`
        setReferralShareText(shareText)
      } else {
        console.error("failed to fetch referral code")
      }
    } catch (error) {
      console.error("error fetching referral code:", error)
    }
  }

  // todo rate-limit the balance check by last time checked.
  const getNanoBalanceAndUpdateMessage = async (nanoAccount, fiatType) => {
    try {
      const response = await fetch(`${baseUrl}nano/user/balance/${nanoAccount}/${fiatType}`, {
        method: "GET",
        headers: headers,
      })
      if (response.ok) {
        const data = await response.json()
        setUserDetails(data) // kind of pointless since we have other consts
        // TODO - get the currency type from the country code or user preferences
        // TODO - setup the Currency denominator to match the currency type
        // TODO - limit the sig figs of each
        const newMessage = `<p>Your USD balance is $<span class="emphasis">${data.accountBalanceInFiat.toFixed(
          5
        )}</span></p> <p>Your nano balance is Ӿ<span class="emphasis">${data.accountBalanceInNano.toFixed(5)}</span></p>`
        setDynamicMessage(newMessage)
        updateNanoBalance(data.accountBalanceInNano)
        updateNanoBalanceInFiat(data.accountBalanceInFiat)
        updateFiatType(data.currencyType)
        setNanoRate(data.rate)
      } else {
        throw new Error("Failed to fetch user details")
      }
    } catch (error) {
      // todo standardize the server error message by retrieving from the responses
      // todo standardize responses on backend to be JSON structured.
      console.error("ERROR", error)
    }
  }

  const handleNanoWithdraw = async event => {
    event.preventDefault()
    try {
      const response = await sendNano(withdrawAmount, destinationAccount)
      if (!isBlank(response.transactionId)) {
        openNanoSentModal()
      }
    } catch (err) {
      console.log(err)
    }
  }

  // next updates
  const handleGiftCardWithdraw = async event => {
    event.preventDefault()
    alert("Coming soon!")
    // try {
    //   const response = await sendNano(withdrawAmount, destinationAccount)
    //   if (!isBlank(response.transactionId)) {
    //     alert("Gift Card successfully sent!")
    //     openGiftCardModal()
    //   }
    // } catch (err) {
    //   console.log(err)
    // }
  }

  const sendNano = async (amountToSend, accountToSendTo) => {
    var myNanoBalance
    myNanoBalance = nanoBalance
    // myNanoBalance = localStorage.getItem("nanoBalance")
    return new Promise((resolve, reject) => {
      if (amountToSend > myNanoBalance) {
        setIsNanoOverBalanceModalOpen(true)
        return
      }
      fetch(`${baseUrl}nano/userSend`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          amount: amountToSend,
          countryCode: countryCode,
          destinationAddress: accountToSendTo,
          sessionId: sessionId,
          sourceAddress: nanoAccount,
          userPhoneNumber: phoneNumber,
        }),
      })
        .then(res => {
          return res.json()
        })
        .then(data => {
          resolve(data)
        })
        .catch(error => reject(error))
    })
  }

  const copyReferralToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralShareText)
      alert("referral text copied to clipboard!")
    } catch (err) {
      console.error("failed to copy text: ", err)
      // fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = referralShareText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("referral text copied to clipboard!")
    }
  }

  // todo move this into a helper method later.
  function isBlank(str) {
    return !str || /^\s*$/.test(str)
  }

  const handleCloseModal = () => {
    setIsNanoSentModalOpen(false)
    setIsNanoOverBalanceModalOpen(false)
    setIsGiftCardModalOpen(false)
  }

  return (
    <div className="cash-out">
      <Seo title="Wallet Page" description="Manage your KarmaCall account here." />
      <Header />
      <div className="AppText">
        <div className="text-content">
          <h1>Cash Out</h1>
          <p>Copy in the nano account where you would like to send your nano to.</p>
          <div className="html-dynamic" dangerouslySetInnerHTML={{ __html: dynamicMessage }}></div>
          <form method="get" id="nanoAccountWithDraw" onSubmit={handleNanoWithdraw}>
            <p>Withdraw to external nano account</p>
            <div>
              <p>
                <input
                  type="text"
                  name="withdrawAmount"
                  className="form-control width100"
                  placeholder="Enter amount of Nano"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                />
              </p>
              <p>
                <input
                  type="text"
                  name="externalNanoAccount"
                  className="form-control width100"
                  placeholder="Enter destination Nano account"
                  value={destinationAccount}
                  onChange={e => setDestinationAccount(e.target.value)}
                />
              </p>
            </div>
            <button className="learn-more-btn ">Submit</button>
          </form>
          <form method="post" id="giftCardCashOut" onSubmit={handleGiftCardWithdraw}>
            <button className="submit-btn"> Cash Out To Gift Cards </button>
          </form>

          {/* SOalana wallet connector */}
          <div style={{ marginTop: "24px" }}>
            <button
              onClick={() => setShowSolanaConnect(true)}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginRight: "12px",
              }}
            >
              Connect Solana Wallet
            </button>
            <button
              onClick={() => window.close()}
              style={{
                background: "white",
                color: "#667eea",
                border: "2px solid #667eea",
                padding: "10px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
          <p style={{ marginTop: "16px", fontSize: "14px", color: "#6b7280" }}>Connect your Solana wallet to enable KarmaCall protection with crypto escrow.</p>

          {/* Referral sharing section */}
          <div className="referral-section" style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
            <h3>Share Your Referral Code</h3>
            <p>Earn extra money by referring friends to KarmaCall!</p>
            {!referralCode ? (
              <button className="learn-more-btn" onClick={fetchReferralCode}>
                Get My Referral Code
              </button>
            ) : (
              <div className="referral-content">
                <div
                  className="referral-text-box"
                  style={{
                    backgroundColor: "var(--color-background-alt, #f5f5f5)",
                    color: "var(--color-text, #1e293b)",
                    padding: "15px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    border: "1px solid var(--border-color, #ddd)",
                  }}
                >
                  <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.4", color: "inherit" }}>{referralShareText}</p>
                </div>
                <button className="learn-more-btn" onClick={copyReferralToClipboard}>
                  Copy Referral Text
                </button>
              </div>
            )}
          </div>

          {/* App download section with platform-specific button */}
          <div className="app-download-container" style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
            <AppDownloadButton />
          </div>
        </div>
      </div>
      <NanoSentModal isOpen={isNanoSentModalOpen} nanoExternal={destinationAccount} onClose={handleCloseModal} />
      <NanoNotEnoughModal isOpen={isNanoOverBalanceModalOpen} onClose={handleCloseModal} />
      <GiftCardModal isOpen={isGiftCardModalOpen} onClose={handleCloseModal} />
      <ReferralAppDownloadModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />

      {showSolanaConnect && userId && <SolanaWalletConnect userId={userId} onClose={() => setShowSolanaConnect(false)} />}
      <Footer />
    </div>
  )
}

export default CashOut
