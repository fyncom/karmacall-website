import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/sales-and-marketing-use-cases.css"
import Seo from "../components/seo"
import { GiftCardModal, NanoNotEnoughModal, NanoSentModal, ReferralAppDownloadModal } from "../components/Modal"
import AppDownloadButton from "../components/AppDownloadButton"
import SolanaWalletConnect, { sendSolanaTransaction } from "../components/SolanaWalletConnect"
import ReactGA from "react-ga4"
import { Link } from "gatsby"
import QRCode from "qrcode"

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
  const [showSolanaDeposit, setShowSolanaDeposit] = useState(false)
  const [solanaWalletAddress, setSolanaWalletAddress] = useState("")
  const [solanaBalance, setSolanaBalance] = useState(null)
  const [customAmount, setCustomAmount] = useState("")
  const [customPlan, setCustomPlan] = useState("premium")
  const [depositLoading, setDepositLoading] = useState(false)
  const [depositError, setDepositError] = useState("")
  const [depositSuccess, setDepositSuccess] = useState("")
  const [solUsdRate, setSolUsdRate] = useState(null)
  const userId = isBrowser ? localStorage.getItem("userId") : null
  const [paymentMethod, setPaymentMethod] = useState("auto") // "auto", "extension", or "qr"
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [showQrForDeposit, setShowQrForDeposit] = useState(false)

  const subscriptionPlans = {
    premium: { name: "Premium", price: 4.99 },
    supreme: { name: "Supreme", price: 9.99 },
  }

  let baseUrl = `${process.env.GATSBY_API_URL_BASE}`
  let newUrl = `${process.env.GATSBY_API_URL}`
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

    checkSolanaWallet()
  }, [sessionId])

  const checkSolanaWallet = async () => {
    if (!userId) return
    try {
      const response = await fetch(`${newUrl}api/solana/balance?userId=${userId}`, {
        method: "GET",
        headers: headers,
      })
      if (response.ok) {
        const data = await response.json()
        if (data.hasWallet) {
          setSolanaWalletAddress(data.walletAddress)
          setSolanaBalance(data.availableBalance)
        }
      }
    } catch (err) {
      console.error("error checking solana wallet:", err)
    }
  }

  const fetchReferralCode = async () => {
    try {
      if (!userId) {
        console.error("no userId found")
        return
      }

      const response = await fetch(`${newUrl}referral/fetch`, {
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
        const newMessage = `<p>Your USD balance is $<span class="emphasis">${data.accountBalanceInFiat.toFixed(5)}</span></p> 
        <p>Your nano balance is Ӿ<span class="emphasis">${data.accountBalanceInNano.toFixed(5)}</span></p>`
        setDynamicMessage(newMessage)
        updateNanoBalance(data.accountBalanceInNano)
        updateNanoBalanceInFiat(data.accountBalanceInFiat)
        updateFiatType(data.currencyType)
        setNanoRate(data.rate)
        if (data.rateSolUsd) {
          setSolUsdRate(data.rateSolUsd)
        }
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
      if (!response.transactionId.isBlank()) {
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
    //   if (!response.transactionId.isBlank()) {
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

  const generateQrCodeForDeposit = async (amount, planName) => {
    try {
      const escrowAddress = process.env.GATSBY_SOLANA_ADDRESS
      // Create Solana Pay URL with memo containing userId and planName
      const memo = encodeURIComponent(`${userId}_${planName}`)
      const solanaPayUrl = `solana:${escrowAddress}?amount=${amount}&label=${encodeURIComponent("KarmaCall Deposit")}&memo=${memo}`

      const qrDataUrl = await QRCode.toDataURL(solanaPayUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })

      setQrCodeUrl(qrDataUrl)
      setShowQrForDeposit(true)
    } catch (err) {
      console.error("Error generating QR code:", err)
      setDepositError("Failed to generate QR code")
    }
  }

  const handleSolanaDeposit = async (amount, planName) => {
    if (!solanaWalletAddress) {
      setDepositError("please connect your solana wallet first")
      return
    }

    setDepositLoading(true)
    setDepositError("")
    setDepositSuccess("")
    setShowQrForDeposit(false)

    // If user explicitly chose QR method, show QR code
    if (paymentMethod === "qr") {
      await generateQrCodeForDeposit(amount, planName)
      setDepositLoading(false)
      return
    }

    try {
      let transactionSignature = null

      // If auto or extension mode, try browser extension
      if (paymentMethod === "auto" || paymentMethod === "extension") {
        console.log("Using standalone sendSolanaTransaction function")
        try {
          transactionSignature = await sendSolanaTransaction(solanaWalletAddress, parseFloat(amount), userId, planName)
        } catch (standaloneError) {
          console.log("Standalone transaction failed:", standaloneError)

          // If explicitly extension mode, don't fallback
          if (paymentMethod === "extension") {
            throw standaloneError
          }

          // Auto mode: fallback to QR code
          await generateQrCodeForDeposit(amount, planName)
          setDepositLoading(false)
          return
        }
      }

      if (!transactionSignature) {
        setDepositError("transaction was cancelled or failed")
        setDepositLoading(false)
        return
      }

      // For the new backend flow, the transaction has a dummy signature, need to replace
      // Only call the old API for manual signature fallback
      if (transactionSignature.length === 64 && !transactionSignature.includes(" ")) {
        // This looks like a manual signature, use old API
        const response = await fetch(`${newUrl}api/solana/depositEscrow`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            userId: userId,
            transactionSignature: transactionSignature,
            amount: parseFloat(amount),
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setDepositSuccess(`Successfully deposited ${amount} SOL for ${planName}!`)
          await checkSolanaWallet()
          ReactGA.event({
            category: "solana",
            action: "deposit_escrow",
            label: planName,
            value: parseFloat(amount),
          })
        } else {
          const errorData = await response.json()
          setDepositError(errorData.message || "failed to process deposit")
        }
      } else {
        // New backend flow already handled everything
        setDepositSuccess(`Successfully deposited ${amount} SOL for ${planName}!`)
        await checkSolanaWallet()
        ReactGA.event({
          category: "solana",
          action: "deposit_escrow",
          label: planName,
          value: parseFloat(amount),
        })
      }
    } catch (err) {
      console.error("error processing solana deposit:", err)
      setDepositError(`error: ${err.message}`)
    } finally {
      setDepositLoading(false)
    }
  }

  const handleCustomDeposit = async () => {
    const amount = parseFloat(customAmount)
    if (!amount || amount <= 0) {
      setDepositError("please enter a valid amount")
      return
    }
    const selectedPlanDetails = subscriptionPlans[customPlan]
    const calculatedMonths = calculateMonthsFromAmount(parseFloat(customAmount) * solUsdRate, selectedPlanDetails.price)
    const monthsText = calculatedMonths === 1 ? `1 month` : `${calculatedMonths} months`
    await handleSolanaDeposit(amount, `Custom ${selectedPlanDetails.name} (${monthsText})`)
  }

  const calculateMonthsFromAmount = (amount, monthlyRate) => {
    if (!monthlyRate || monthlyRate <= 0) return 0
    return Math.floor(amount / monthlyRate)
  }

  const calculateSolAmount = usdAmount => {
    if (!solUsdRate || solUsdRate === 0) return null
    const solAmount = usdAmount / solUsdRate
    return solAmount
  }

  const formatSolAmount = solAmount => {
    if (solAmount === null) return "..."
    return solAmount.toFixed(5)
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

          {/* solana wallet connector */}
          <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
            <h2>Solana Wallet & Subscriptions</h2>
            {!solanaWalletAddress ? (
              <>
                <p>connect your solana wallet to deposit SOL for your KarmaCall subscription.</p>
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
                    marginTop: "12px",
                  }}
                >
                  Connect Solana Wallet
                </button>
              </>
            ) : (
              <>
                <div style={{ backgroundColor: "#f0fdf4", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#166534" }}>
                    <strong>Wallet Connected:</strong> {solanaWalletAddress.slice(0, 4)}...{solanaWalletAddress.slice(-4)}
                  </p>
                  <p style={{ margin: "0", fontSize: "14px", color: "#166534" }}>
                    <strong>Escrow Balance:</strong> {solanaBalance !== null ? `${solanaBalance} SOL` : "loading..."}
                  </p>
                  <button
                    onClick={checkSolanaWallet}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                      marginTop: "8px",
                    }}
                  >
                    Refresh Balance
                  </button>
                </div>

                {depositError && (
                  <div style={{ backgroundColor: "#fef2f2", color: "#991b1b", padding: "12px", borderRadius: "6px", marginBottom: "16px" }}>{depositError}</div>
                )}

                {depositSuccess && (
                  <div style={{ backgroundColor: "#f0fdf4", color: "#166534", padding: "12px", borderRadius: "6px", marginBottom: "16px" }}>
                    {depositSuccess}
                  </div>
                )}

                {/* Payment method toggle */}
                <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                  <h4 style={{ marginTop: "0", marginBottom: "12px" }}>Payment Method:</h4>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => setPaymentMethod("auto")}
                      style={{
                        padding: "8px 16px",
                        border: paymentMethod === "auto" ? "2px solid #667eea" : "1px solid #ddd",
                        borderRadius: "6px",
                        background: paymentMethod === "auto" ? "#f0f0ff" : "white",
                        cursor: "pointer",
                        fontWeight: paymentMethod === "auto" ? "600" : "400",
                        fontSize: "14px",
                      }}
                    >
                      Auto (Try Extension, Fallback to QR)
                    </button>
                    <button
                      onClick={() => setPaymentMethod("extension")}
                      style={{
                        padding: "8px 16px",
                        border: paymentMethod === "extension" ? "2px solid #667eea" : "1px solid #ddd",
                        borderRadius: "6px",
                        background: paymentMethod === "extension" ? "#f0f0ff" : "white",
                        cursor: "pointer",
                        fontWeight: paymentMethod === "extension" ? "600" : "400",
                        fontSize: "14px",
                      }}
                    >
                      Browser Extension Only
                    </button>
                    <button
                      onClick={() => setPaymentMethod("qr")}
                      style={{
                        padding: "8px 16px",
                        border: paymentMethod === "qr" ? "2px solid #667eea" : "1px solid #ddd",
                        borderRadius: "6px",
                        background: paymentMethod === "qr" ? "#f0f0ff" : "white",
                        cursor: "pointer",
                        fontWeight: paymentMethod === "qr" ? "600" : "400",
                        fontSize: "14px",
                      }}
                    >
                      QR Code (Mobile)
                    </button>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px", marginBottom: "0" }}>
                    {paymentMethod === "auto" && "Recommended: Automatically tries browser extension, shows QR code if unavailable"}
                    {paymentMethod === "extension" && "Use your browser wallet extension (Phantom, Solflare, etc.)"}
                    {paymentMethod === "qr" && "Scan a QR code with your mobile Solana wallet app"}
                  </p>
                </div>

                {/* QR Code Display */}
                {showQrForDeposit && qrCodeUrl && (
                  <div style={{ marginBottom: "24px", padding: "20px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "2px solid #667eea" }}>
                    <h3 style={{ marginTop: "0", marginBottom: "16px", textAlign: "center" }}>Scan to Pay with Mobile Wallet</h3>
                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                      <img src={qrCodeUrl} alt="Solana Payment QR Code" style={{ maxWidth: "300px", width: "100%", borderRadius: "8px" }} />
                    </div>
                    <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                      <p style={{ fontWeight: "600", marginBottom: "8px" }}>Instructions:</p>
                      <ol style={{ paddingLeft: "20px", margin: "0" }}>
                        <li>Open your Solana mobile wallet app (Phantom, Solflare, etc.)</li>
                        <li>Tap "Send" or scan QR code</li>
                        <li>Confirm the transaction in your wallet</li>
                        <li>Wait for confirmation (usually 30-60 seconds)</li>
                      </ol>
                    </div>
                    <button
                      onClick={() => {
                        setShowQrForDeposit(false)
                        setQrCodeUrl("")
                      }}
                      style={{
                        width: "100%",
                        marginTop: "16px",
                        padding: "10px",
                        background: "#6b7280",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Close QR Code
                    </button>
                  </div>
                )}

                <h3 style={{ marginBottom: "16px" }}>Subscription Plans</h3>
                {solUsdRate && <p>Current rate: 1 SOL = ${solUsdRate.toFixed(2)} USD</p>}

                <h4 style={{ marginBottom: "16px" }}>
                  For more pricing info, see our <Link to="/pricing">Pricing Page</Link>
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                  {/* free plan */}
                  <div style={{ border: "2px solid #e5e7eb", borderRadius: "8px", padding: "16px", backgroundColor: "#f9fafb" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>Free</h4>
                    <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#1f2937" }}>$0/mo</p>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>Free on Android Only. For iOS, use Premium or Supreme plan</p>
                    <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash" target="_blank">
                      <button
                        style={{
                          width: "100%",
                          background: "#6b7280",
                          color: "white",
                          border: "none",
                          padding: "10px",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        Download Android
                      </button>
                    </a>
                  </div>

                  {/* ios basic */}
                  <div style={{ border: "2px solid #dbeafe", borderRadius: "8px", padding: "16px", backgroundColor: "#eff6ff" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#1e40af" }}>Premium</h4>
                    <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#1e40af" }}>$4.99/mo</p>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>Get 2 Licenses to Share + Set Own Rates + 10x Rewards</p>
                    <button
                      onClick={() => {
                        const amount = calculateSolAmount(4.99)
                        if (amount) handleSolanaDeposit(amount.toString(), "premium (1 month)")
                      }}
                      disabled={depositLoading || !solUsdRate}
                      style={{
                        width: "100%",
                        background: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: depositLoading || !solUsdRate ? "not-allowed" : "pointer",
                        opacity: depositLoading || !solUsdRate ? 0.6 : 1,
                      }}
                    >
                      {depositLoading ? "processing..." : solUsdRate ? `Deposit ${formatSolAmount(calculateSolAmount(4.99))} SOL` : "loading..."}
                    </button>
                  </div>

                  {/* supreme */}
                  <div style={{ border: "2px solid #fef3c7", borderRadius: "8px", padding: "16px", backgroundColor: "#fffbeb" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#92400e" }}>Supreme</h4>
                    <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#92400e" }}>$9.99/mo</p>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>Get 6 Licenses to Share + Priority Support + 100x Rewards</p>
                    <button
                      onClick={() => {
                        const amount = calculateSolAmount(9.99)
                        if (amount) handleSolanaDeposit(amount.toString(), "supreme (1 month)")
                      }}
                      disabled={depositLoading || !solUsdRate}
                      style={{
                        width: "100%",
                        background: "#f59e0b",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: depositLoading || !solUsdRate ? "not-allowed" : "pointer",
                        opacity: depositLoading || !solUsdRate ? 0.6 : 1,
                      }}
                    >
                      {depositLoading ? "processing..." : solUsdRate ? `Deposit ${formatSolAmount(calculateSolAmount(9.99))} SOL` : "loading..."}
                    </button>
                  </div>
                </div>

                {/* custom deposit */}
                <div style={{ border: "2px solid #e5e7eb", borderRadius: "8px", padding: "20px" }}>
                  <h3 style={{ marginTop: "0", marginBottom: "12px" }}>Custom Deposit</h3>
                  <p>Deposit a custom SOL amount towards your preferred plan.</p>

                  <div style={{ marginBottom: "16px" }}>
                    <label>1. Select Plan</label>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "14px" }}>
                        <input
                          type="radio"
                          name="customPlan"
                          value="premium"
                          checked={customPlan === "premium"}
                          onChange={() => setCustomPlan("premium")}
                          style={{ marginRight: "8px", width: "16px", height: "16px" }}
                        />
                        Premium (${subscriptionPlans.premium.price}/mo)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "14px" }}>
                        <input
                          type="radio"
                          name="customPlan"
                          value="supreme"
                          checked={customPlan === "supreme"}
                          onChange={() => setCustomPlan("supreme")}
                          style={{ marginRight: "8px", width: "16px", height: "16px" }}
                        />
                        Supreme (${subscriptionPlans.supreme.price}/mo)
                      </label>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block" }}>2. Enter Amount (SOL)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  {customAmount && parseFloat(customAmount) > 0 && solUsdRate && (
                    <p>
                      {parseFloat(customAmount).toFixed(5)} SOL (≈ ${(parseFloat(customAmount) * solUsdRate).toFixed(2)} USD) will grant you ~
                      <strong>{calculateMonthsFromAmount(parseFloat(customAmount) * solUsdRate, subscriptionPlans[customPlan].price)} months</strong> of the{" "}
                      {subscriptionPlans[customPlan].name} plan.
                    </p>
                  )}

                  <button
                    onClick={handleCustomDeposit}
                    disabled={depositLoading || !customAmount || parseFloat(customAmount) <= 0}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      padding: "12px",
                      borderRadius: "6px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: depositLoading || !customAmount || parseFloat(customAmount) <= 0 ? "not-allowed" : "pointer",
                      opacity: depositLoading || !customAmount || parseFloat(customAmount) <= 0 ? 0.6 : 1,
                    }}
                  >
                    {depositLoading ? "Processing..." : "Deposit Custom Amount"}
                  </button>
                </div>

                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#eff6ff", borderRadius: "6px" }}>
                  <p style={{ margin: "0", fontSize: "13px", color: "#1e40af" }}>
                    <strong>Note:</strong> Send SOL from your wallet to the escrow address first, then paste your transaction signature when prompted.
                  </p>
                </div>
              </>
            )}
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
