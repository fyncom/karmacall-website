import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/sales-and-marketing-use-cases.css"
import "../components/cash-out.css"
import Seo from "../components/seo"
import { GiftCardModal, NanoNotEnoughModal, NanoSentModal, ReferralAppDownloadModal } from "../components/Modal"
import AppDownloadButton from "../components/AppDownloadButton"
import SolanaWalletConnect, { sendSolanaTransaction } from "../components/SolanaWalletConnect"
import ReactGA from "react-ga4"
import { Link, navigate } from "gatsby"
import { logoutRevenueCatUser } from "../utils/revenueCat"

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
  const email = isBrowser ? localStorage.getItem("email") : null
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
  const [solanaDepositMode, setSolanaDepositMode] = useState("extension") // "extension" or "qr"
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [solanaPayUrl, setSolanaPayUrl] = useState("")
  const [showQrCode, setShowQrCode] = useState(false)
  const [qrSessionId, setQrSessionId] = useState(null)
  const [pollingInterval, setPollingInterval] = useState(null)

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

    // Cleanup polling on unmount
    return () => {
      stopPollingPaymentStatus()
    }
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
      const requestBody = {
        amount: amountToSend,
        destinationAddress: accountToSendTo,
        sessionId: sessionId,
        sourceAddress: nanoAccount,
      }
      if (phoneNumber) {
        requestBody.userPhoneNumber = phoneNumber
        requestBody.countryCode = countryCode
      }
      if (email) {
        requestBody.email = email
      }
      fetch(`${baseUrl}nano/userSend`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
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

  const detectWallet = () => {
    // Check for Phantom wallet
    if (typeof window !== "undefined" && window.solana && window.solana.isPhantom) {
      return window.solana
    }
    // Check for Solflare
    if (typeof window !== "undefined" && window.solflare && window.solflare.isSolflare) {
      return window.solflare
    }
    return null
  }

  const attemptWalletConnect = async () => {
    try {
      const wallet = detectWallet()
      if (!wallet) {
        return null
      }

      // Try to connect the wallet
      const response = await wallet.connect()
      const publicKey = response.publicKey.toString()

      // Update wallet address in state
      setSolanaWalletAddress(publicKey)
      await checkSolanaWallet()

      return publicKey
    } catch (err) {
      console.error("Error auto-connecting wallet:", err)
      return null
    }
  }

  const stopPollingPaymentStatus = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }

  const closeQrModal = () => {
    setShowQrCode(false)
    setQrCodeUrl("")
    setSolanaPayUrl("")
    setQrSessionId(null)
    stopPollingPaymentStatus()
  }

  const startPollingPaymentStatus = sessionId => {
    let attemptCount = 0
    const maxAttempts = 9 // 9 attempts × 20 seconds = 180 seconds (3 minutes)

    // Clear any existing polling
    stopPollingPaymentStatus()

    const checkPaymentStatus = async () => {
      attemptCount++
      console.log(`Polling payment status (attempt ${attemptCount}/${maxAttempts})...`)

      try {
        const response = await fetch(`${newUrl}api/solana/qr-payment-status?sessionId=${sessionId}`, {
          method: "GET",
          headers: headers,
        })

        if (!response.ok) {
          console.error("Failed to check payment status")
          return
        }

        const data = await response.json()
        console.log("Payment status:", data)

        if (data.status === "confirmed") {
          // Payment successful!
          stopPollingPaymentStatus()
          setShowQrCode(false)
          setQrCodeUrl("")
          setQrSessionId(null)
          setDepositSuccess(`Payment confirmed! Transaction: ${data.transactionSignature}`)

          // Update balance with new balance from backend
          if (data.newBalance !== undefined) {
            setSolanaBalance(data.newBalance)
          }

          // Refresh wallet info
          await checkSolanaWallet()

          ReactGA.event({
            category: "solana",
            action: "qr_payment_confirmed",
            label: sessionId,
          })
        } else if (data.status === "expired" || data.status === "failed") {
          // Session expired or failed
          stopPollingPaymentStatus()
          setDepositError(data.message || `Payment ${data.status}. Please try again.`)
          setShowQrCode(false)
          setQrCodeUrl("")
          setQrSessionId(null)
        } else if (data.status === "pending") {
          // Still waiting, check if we've exceeded max attempts
          if (attemptCount >= maxAttempts) {
            stopPollingPaymentStatus()
            setDepositError("Payment timeout. If you sent the transaction, it may still be processing. Check back in a minute or contact support.")
          }
          // Otherwise, continue polling
        }
      } catch (err) {
        console.error("Error checking payment status:", err)
        // Don't stop polling on network errors, just continue
        if (attemptCount >= maxAttempts) {
          stopPollingPaymentStatus()
        }
      }
    }

    // Do first check immediately
    checkPaymentStatus()

    // Then poll every 20 seconds
    const interval = setInterval(checkPaymentStatus, 20000)
    setPollingInterval(interval)
  }

  const generateQrCodeForDeposit = async (amount, planName) => {
    try {
      const escrowAddress = process.env.GATSBY_SOLANA_ADDRESS
      if (!escrowAddress) {
        throw new Error("Escrow address is not configured")
      }

      if (!userId) {
        throw new Error("User ID is required for QR deposit")
      }

      // Call backend to initialize QR session and get encrypted memo
      const initResponse = await fetch(
        `${newUrl}api/solana/qr-init?userId=${userId}&amount=${parseFloat(amount).toFixed(6)}&planName=${encodeURIComponent(planName)}`,
        {
          method: "POST",
          headers: headers,
        }
      )

      if (!initResponse.ok) {
        const errorData = await initResponse.json()
        throw new Error(errorData.message || "Failed to initialize QR session")
      }

      const { encryptedMemo, sessionId } = await initResponse.json()

      // Store session ID for polling
      setQrSessionId(sessionId)

      // Construct Solana Pay URL with encrypted memo
      const params = new URLSearchParams()
      params.set("amount", parseFloat(amount).toFixed(6))
      params.set("label", "KarmaCall Escrow")
      params.set("message", `Deposit for ${planName}`)
      params.set("memo", encryptedMemo)

      const solanaPayUrl = `solana:${escrowAddress}?${params.toString()}`

      // Dynamically import QRCode only on client-side
      let qrDataUrl = null
      if (isBrowser) {
        const QRCode = (await import("qrcode")).default
        qrDataUrl = await QRCode.toDataURL(solanaPayUrl, {
          width: 300,
          margin: 2,
        })
      }
      setQrCodeUrl(qrDataUrl)
      setSolanaPayUrl(solanaPayUrl)
      setShowQrCode(true)
      setDepositSuccess(
        `Scan the QR code with your mobile wallet to deposit ${formatSolAmount(
          parseFloat(amount)
        )} SOL for ${planName}. The payment will be detected automatically within 60 seconds.`
      )

      // Start polling for payment status
      startPollingPaymentStatus(sessionId)
    } catch (err) {
      console.error("Error generating QR code:", err)
      setDepositError(`Unable to generate QR code: ${err.message}`)
    }
  }

  const handleSolanaDeposit = async (amount, planName) => {
    const normalizedAmount = typeof amount === "number" ? amount : parseFloat(amount)

    if (!normalizedAmount || Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
      setDepositError("please enter a valid amount")
      return
    }

    setDepositLoading(true)
    setDepositError("")
    setDepositSuccess("")
    setShowQrCode(false)

    // If QR mode, show QR code
    if (solanaDepositMode === "qr") {
      await generateQrCodeForDeposit(normalizedAmount, planName)
      ReactGA.event({
        category: "solana",
        action: "deposit_qr_requested",
        label: planName,
        value: normalizedAmount,
      })
      setDepositLoading(false)
      return
    }

    // Extension mode - try to connect wallet if not connected
    if (!solanaWalletAddress) {
      console.log("No wallet connected, attempting auto-connect...")
      const connectedAddress = await attemptWalletConnect()

      if (!connectedAddress) {
        // No wallet detected, fallback to QR mode
        console.log("No wallet detected, falling back to QR mode")
        setSolanaDepositMode("qr")
        await generateQrCodeForDeposit(normalizedAmount, planName)
        ReactGA.event({
          category: "solana",
          action: "deposit_qr_auto_fallback",
          label: planName,
          value: normalizedAmount,
        })
        setDepositLoading(false)
        return
      }
    }

    try {
      console.log("Using standalone sendSolanaTransaction function")
      const transactionSignature = await sendSolanaTransaction(solanaWalletAddress, normalizedAmount, userId, planName)

      if (!transactionSignature) {
        setDepositError("transaction was cancelled or failed")
        return
      }

      setDepositSuccess(`Successfully deposited ${formatSolAmount(normalizedAmount)} SOL for ${planName}!`)
      await checkSolanaWallet()
      ReactGA.event({
        category: "solana",
        action: "deposit_escrow",
        label: planName,
        value: normalizedAmount,
      })
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

  const handleLogout = async () => {
    if (!isBrowser) return

    try {
      await logoutRevenueCatUser()
    } catch (error) {
      console.error("failed to logout revenuecat user:", error)
    }

    const keysToClear = [
      "sessionId",
      "phoneNumber",
      "email",
      "countryCode",
      "otp",
      "nanoAccount",
      "userId",
      "nanoBalanceInFiat",
      "fiatType",
      "pendingReferralCode",
      "revenuecat_user_set",
    ]

    keysToClear.forEach(key => localStorage.removeItem(key))
    navigate("/login")
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
          <div className="referral-section cash-out-section">
            <h3>Share Your Referral Code</h3>
            <p>Earn extra money by referring friends to KarmaCall!</p>
            {!referralCode ? (
              <button className="learn-more-btn" onClick={fetchReferralCode}>
                Get My Referral Code
              </button>
            ) : (
              <div className="referral-content">
                <div className="referral-text-box">
                  <p>{referralShareText}</p>
                </div>
                <button className="learn-more-btn" onClick={copyReferralToClipboard}>
                  Copy Referral Text
                </button>
              </div>
            )}
          </div>

          {/* App download section with platform-specific button */}
          <div className="app-download-container cash-out-section">
            <AppDownloadButton />
          </div>

          <div className="cash-out-section logout-section">
            <h3>Log Out</h3>
            <p>Clear your saved session on this device.</p>
            <button type="button" className="logout-button" onClick={handleLogout}>
              Log Out
            </button>
          </div>

          {/* solana wallet connector */}
          <div className="cash-out-section">
            <h2>Solana Wallet & Subscriptions</h2>
            <p>Deposit SOL for your KarmaCall subscription using a browser extension wallet or by scanning a Solana Pay QR code with your mobile wallet.</p>

            {/* Beautiful Mode Toggle */}
            <div className="mode-toggle-container">
              <button
                onClick={() => setSolanaDepositMode("extension")}
                className={`mode-toggle-btn extension ${solanaDepositMode === "extension" ? "active" : ""}`}
              >
                Browser Wallet
              </button>
              <button onClick={() => setSolanaDepositMode("qr")} className={`mode-toggle-btn qr ${solanaDepositMode === "qr" ? "active" : ""}`}>
                Mobile QR
              </button>
            </div>

            {/* Extension Mode Info */}
            {solanaDepositMode === "extension" ? (
              solanaWalletAddress ? (
                <div className="info-box success">
                  <p>
                    <strong>Wallet Connected:</strong> {solanaWalletAddress.slice(0, 4)}...{solanaWalletAddress.slice(-4)}
                  </p>
                  <p>
                    <strong>Escrow Balance:</strong> {solanaBalance !== null ? `${solanaBalance} SOL` : "loading..."}
                  </p>
                  <button onClick={checkSolanaWallet} className="refresh-balance-btn">
                    Refresh Balance
                  </button>
                </div>
              ) : (
                <div className="info-box warning">
                  <p>We couldn't detect a Solana browser wallet on this device. If you have Phantom or Solflare installed, click below to connect.</p>
                  <button onClick={() => setShowSolanaConnect(true)} className="connect-wallet-btn">
                    Connect Solana Wallet
                  </button>
                  <p>
                    Prefer to deposit from your phone? Switch to <strong>Mobile QR</strong> above.
                  </p>
                </div>
              )
            ) : (
              <div className="info-box info">
                <h3>Mobile Wallet Deposits</h3>
                <p>
                  Pick a plan below and click <strong>Get QR</strong> to generate a Solana Pay request. Scan it with any Solana wallet on your phone (Phantom,
                  Solflare, etc.) to send SOL. After sending the funds, tap <strong>Refresh Balance</strong> to see your updated escrow.
                </p>
                <p>
                  Escrow address: <code>{process.env.GATSBY_SOLANA_ADDRESS || "Loading..."}</code>
                </p>
              </div>
            )}

            {/* Show green connected indicator in QR mode if wallet is connected on desktop */}
            {solanaDepositMode === "qr" && solanaWalletAddress && (
              <div className="info-box info-green">
                <strong>Connected on desktop:</strong> {solanaWalletAddress.slice(0, 4)}...{solanaWalletAddress.slice(-4)} – you can still refresh your balance
                after sending from mobile.
                <button onClick={checkSolanaWallet} className="refresh-balance-inline">
                  Refresh Balance
                </button>
              </div>
            )}

            {depositError && <div className="alert error">{depositError}</div>}

            {depositSuccess && <div className="alert success">{depositSuccess}</div>}

            <h3 className="margin-bottom-16">Subscription Plans</h3>
            {solUsdRate && <p>Current rate: 1 SOL = ${solUsdRate.toFixed(2)} USD</p>}

            <h4 className="margin-bottom-16">
              For more pricing info, see our <Link to="/pricing">Pricing Page</Link>
            </h4>

            <div className="subscription-plans-grid">
              {/* free plan */}
              <div className="plan-card free">
                <h4>Free</h4>
                <p className="price">$0/mo</p>
                <p className="description">Free on Android Only. For iOS, use Premium or Supreme plan</p>
                <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash" target="_blank">
                  <button>Download Android</button>
                </a>
              </div>

              {/* premium plan */}
              <div className="plan-card premium">
                <h4>Premium</h4>
                <p className="price">$4.99/mo</p>
                <p className="description">Get 2 Licenses to Share + Set Own Rates + 10x Rewards</p>
                <button
                  onClick={() => {
                    const amount = calculateSolAmount(4.99)
                    if (amount) handleSolanaDeposit(amount, "premium (1 month)")
                  }}
                  disabled={depositLoading || !solUsdRate}
                  className={solanaDepositMode === "qr" ? "qr-mode" : ""}
                >
                  {depositLoading
                    ? solanaDepositMode === "qr"
                      ? "Preparing QR..."
                      : "Processing..."
                    : solUsdRate
                    ? solanaDepositMode === "qr"
                      ? `Get QR for ${formatSolAmount(calculateSolAmount(4.99))} SOL`
                      : `Deposit ${formatSolAmount(calculateSolAmount(4.99))} SOL`
                    : "loading..."}
                </button>
              </div>

              {/* supreme plan */}
              <div className="plan-card supreme">
                <h4>Supreme</h4>
                <p className="price">$9.99/mo</p>
                <p className="description">Get 6 Licenses to Share + Priority Support + 100x Rewards</p>
                <button
                  onClick={() => {
                    const amount = calculateSolAmount(9.99)
                    if (amount) handleSolanaDeposit(amount, "supreme (1 month)")
                  }}
                  disabled={depositLoading || !solUsdRate}
                  className={solanaDepositMode === "qr" ? "qr-mode" : ""}
                >
                  {depositLoading
                    ? solanaDepositMode === "qr"
                      ? "Preparing QR..."
                      : "Processing..."
                    : solUsdRate
                    ? solanaDepositMode === "qr"
                      ? `Get QR for ${formatSolAmount(calculateSolAmount(9.99))} SOL`
                      : `Deposit ${formatSolAmount(calculateSolAmount(9.99))} SOL`
                    : "loading..."}
                </button>
              </div>
            </div>

            {/* custom deposit */}
            <div className="custom-deposit-box">
              <h3>Custom Deposit</h3>
              <p>Deposit a custom SOL amount towards your preferred plan.</p>

              <div className="form-group">
                <label>1. Select Plan</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="customPlan" value="premium" checked={customPlan === "premium"} onChange={() => setCustomPlan("premium")} />
                    Premium (${subscriptionPlans.premium.price}/mo)
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="customPlan" value="supreme" checked={customPlan === "supreme"} onChange={() => setCustomPlan("supreme")} />
                    Supreme (${subscriptionPlans.supreme.price}/mo)
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>2. Enter Amount (SOL)</label>
                <input type="number" step="0.01" min="0.01" placeholder="0.00" value={customAmount} onChange={e => setCustomAmount(e.target.value)} />
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
                className={`custom-deposit-btn ${solanaDepositMode === "qr" ? "qr-mode" : "extension-mode"}`}
              >
                {depositLoading
                  ? solanaDepositMode === "qr"
                    ? "Preparing QR..."
                    : "Processing..."
                  : solanaDepositMode === "qr"
                  ? "Get QR for Custom Amount"
                  : "Deposit Custom Amount"}
              </button>
            </div>

            <div className="info-box tip">
              <p>
                <strong>Tip:</strong> After depositing from any device, click <em>Refresh Balance</em> above to sync your escrow.
              </p>
            </div>
          </div>
        </div>
      </div>
      <NanoSentModal isOpen={isNanoSentModalOpen} nanoExternal={destinationAccount} onClose={handleCloseModal} />
      <NanoNotEnoughModal isOpen={isNanoOverBalanceModalOpen} onClose={handleCloseModal} />
      <GiftCardModal isOpen={isGiftCardModalOpen} onClose={handleCloseModal} />
      <ReferralAppDownloadModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />

      {showSolanaConnect && userId && <SolanaWalletConnect userId={userId} onClose={() => setShowSolanaConnect(false)} />}

      {/* QR Code Modal - Center Screen */}
      {showQrCode && qrCodeUrl && (
        <div className="qr-modal-overlay" onClick={closeQrModal}>
          <div className="qr-modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={closeQrModal} className="qr-modal-close">
              ×
            </button>

            <h3>Scan to Pay</h3>

            <div className="qr-code-container">
              <a href={solanaPayUrl}>
                <img src={qrCodeUrl} alt="Solana Pay QR code (click to open wallet)" />
              </a>
              <p className="qr-code-hint">💡 On mobile? Tap the QR code to open your wallet directly</p>
            </div>

            <div className="qr-instructions-box">
              <p>Instructions:</p>
              <ol>
                <li>
                  <strong>Option 1:</strong> Tap the QR code above to open your wallet directly (mobile/tablet)
                </li>
                <li>
                  <strong>Option 2:</strong> Open your Solana wallet, tap "Scan" or "Send", and scan the QR code
                </li>
                <li>Review and confirm the transaction</li>
                <li>Payment will be detected automatically within 60 seconds</li>
              </ol>
            </div>

            <button onClick={closeQrModal} className="qr-modal-close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default CashOut
