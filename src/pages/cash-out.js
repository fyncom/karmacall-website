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
  const [showSolanaDeposit, setShowSolanaDeposit] = useState(false)
  const [solanaWalletAddress, setSolanaWalletAddress] = useState("")
  const [solanaBalance, setSolanaBalance] = useState(null)
  const [customAmount, setCustomAmount] = useState("")
  const [customMonths, setCustomMonths] = useState(1)
  const [depositLoading, setDepositLoading] = useState(false)
  const [depositError, setDepositError] = useState("")
  const [depositSuccess, setDepositSuccess] = useState("")
  const [solUsdRate, setSolUsdRate] = useState(null)
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

    // check for existing solana wallet
    checkSolanaWallet()
  }, [sessionId])

  const checkSolanaWallet = async () => {
    if (!userId) return
    try {
      const response = await fetch(`${baseUrl}v2/api/solana/balance?userId=${userId}`, {
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

  const handleSolanaDeposit = async (amount, planName) => {
    if (!solanaWalletAddress) {
      setDepositError("please connect your solana wallet first")
      return
    }

    setDepositLoading(true)
    setDepositError("")
    setDepositSuccess("")

    try {
      const wallet = window.solana || window.solflare
      if (!wallet) {
        setDepositError("no solana wallet detected. please install phantom or solflare.")
        setDepositLoading(false)
        return
      }

      // request transaction signature from user's wallet
      const transactionSignature = prompt(`please send ${amount} SOL to the escrow address and paste your transaction signature here:`)
      if (!transactionSignature) {
        setDepositLoading(false)
        return
      }

      const response = await fetch(`${baseUrl}v2/api/solana/depositEscrow`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          userId: userId,
          transactionSignature: transactionSignature.trim(),
          amount: parseFloat(amount),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setDepositSuccess(`successfully deposited ${amount} SOL for ${planName}!`)
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
    if (customMonths < 1) {
      setDepositError("please enter at least 1 month")
      return
    }
    const monthsText = customMonths === 1 ? "1 month" : `${customMonths} months`
    await handleSolanaDeposit(amount, `custom plan (${monthsText})`)
  }

  const calculateMonthsFromAmount = amount => {
    const monthlyRate = 5.99
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
                    <strong>wallet connected:</strong> {solanaWalletAddress.slice(0, 4)}...{solanaWalletAddress.slice(-4)}
                  </p>
                  <p style={{ margin: "0", fontSize: "14px", color: "#166534" }}>
                    <strong>escrow balance:</strong> {solanaBalance !== null ? `${solanaBalance} SOL` : "loading..."}
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
                    refresh balance
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

                <h3 style={{ marginBottom: "16px" }}>subscription plans</h3>
                {solUsdRate && <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>current rate: 1 SOL = ${solUsdRate.toFixed(2)} USD</p>}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                  {/* free plan */}
                  <div style={{ border: "2px solid #e5e7eb", borderRadius: "8px", padding: "16px", backgroundColor: "#f9fafb" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>free</h4>
                    <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#1f2937" }}>$0/mo</p>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>android only - basic spam blocking</p>
                    <a href="https://play.google.com/store/apps/details?id=com.karmacall" target="_blank" rel="noopener noreferrer">
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
                        download android
                      </button>
                    </a>
                  </div>

                  {/* ios basic */}
                  <div style={{ border: "2px solid #dbeafe", borderRadius: "8px", padding: "16px", backgroundColor: "#eff6ff" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#1e40af" }}>iOS basic</h4>
                    <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#1e40af" }}>$2/mo</p>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>basic spam protection for iOS users</p>
                    <button
                      onClick={() => {
                        const amount = calculateSolAmount(2)
                        if (amount) handleSolanaDeposit(amount.toString(), "iOS basic (1 month)")
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
                      {depositLoading ? "processing..." : solUsdRate ? `deposit ${formatSolAmount(calculateSolAmount(1.99))} SOL` : "loading..."}
                    </button>
                  </div>

                  {/* premium */}
                  <div style={{ border: "2px solid #ddd4f4", borderRadius: "8px", padding: "16px", backgroundColor: "#f5f3ff" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#6b21a8" }}>premium</h4>
                    <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#6b21a8" }}>$5.99/mo</p>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>advanced spam blocking + rewards</p>
                    <button
                      onClick={() => {
                        const amount = calculateSolAmount(5.99)
                        if (amount) handleSolanaDeposit(amount.toString(), "premium (1 month)")
                      }}
                      disabled={depositLoading || !solUsdRate}
                      style={{
                        width: "100%",
                        background: "#9333ea",
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
                      {depositLoading ? "processing..." : solUsdRate ? `deposit ${formatSolAmount(calculateSolAmount(5.99))} SOL` : "loading..."}
                    </button>
                  </div>

                  {/* supreme */}
                  <div style={{ border: "2px solid #fef3c7", borderRadius: "8px", padding: "16px", backgroundColor: "#fffbeb" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#92400e" }}>supreme</h4>
                    <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#92400e" }}>$9.99/mo</p>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>premium + priority support</p>
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
                      {depositLoading ? "processing..." : solUsdRate ? `deposit ${formatSolAmount(calculateSolAmount(9.99))} SOL` : "loading..."}
                    </button>
                  </div>
                </div>

                {/* custom deposit */}
                <div style={{ border: "2px solid #e5e7eb", borderRadius: "8px", padding: "20px", backgroundColor: "white" }}>
                  <h3 style={{ marginTop: "0", marginBottom: "12px" }}>custom deposit</h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>deposit any amount for multiple months or custom plans</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>amount (SOL)</label>
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
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "6px", color: "#374151" }}>months</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={customMonths}
                        onChange={e => setCustomMonths(parseInt(e.target.value) || 1)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  {customAmount && parseFloat(customAmount) > 0 && solUsdRate && (
                    <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
                      at $5.99/month, {parseFloat(customAmount).toFixed(5)} SOL (≈ ${(parseFloat(customAmount) * solUsdRate).toFixed(4)} USD) ≈{" "}
                      {calculateMonthsFromAmount(parseFloat(customAmount) * solUsdRate)} months
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
                    {depositLoading ? "processing..." : "deposit custom amount"}
                  </button>
                </div>

                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#eff6ff", borderRadius: "6px" }}>
                  <p style={{ margin: "0", fontSize: "13px", color: "#1e40af" }}>
                    <strong>note:</strong> send SOL from your wallet to the escrow address first, then paste your transaction signature when prompted. deposits
                    are confirmed within 30-60 seconds.
                  </p>
                </div>
              </>
            )}
          </div>

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
