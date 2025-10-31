import React, { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import QRCode from "qrcode"
import "./solana-wallet.css"

const SolanaWalletConnect = ({ userId, onClose, onSendSolana }) => {
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState(null)
  const [error, setError] = useState("")
  const [showDepositInfo, setShowDepositInfo] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState("")
  const [sendSuccess, setSendSuccess] = useState("")
  const [showQRFallback, setShowQRFallback] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("")
  const [qrAmount, setQrAmount] = useState(0)
  const [connectMode, setConnectMode] = useState("extension")
  const [connectQrDataUrl, setConnectQrDataUrl] = useState("")
  const [connectQrError, setConnectQrError] = useState("")
  const [connectQrMessage, setConnectQrMessage] = useState("")
  const [connectQrStatus, setConnectQrStatus] = useState("idle")
  const [connectQrStatusMessage, setConnectQrStatusMessage] = useState("")
  const [connectQrCountdown, setConnectQrCountdown] = useState("")
  const [connectQrSession, setConnectQrSession] = useState(null)
  const [connectQrPayload, setConnectQrPayload] = useState(null)
  const connectQrPollRef = useRef(null)

  const solanaPublicKey = process.env.GATSBY_SOLANA_ADDRESS
  const newUrl = `${process.env.GATSBY_API_URL}`
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    []
  )

  useEffect(() => {
    // Expose sendSolana method to parent component after component mounts
    if (onSendSolana && typeof onSendSolana === "function") {
      console.log("Exposing sendSolana function to parent")
      onSendSolana(sendSolana)
    }
  }, [onSendSolana]) // Note: sendSolana not in deps to avoid infinite loop

  const checkExistingWallet = useCallback(async () => {
    if (!userId) {
      console.log("no userId provided, skipping wallet check")
      return
    }
    try {
      console.log("checking existing wallet for userId:", userId)
      const response = await fetch(`${newUrl}api/solana/balance?userId=${userId}`, {
        method: "GET",
        headers: headers,
      })
      console.log("balance check response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("balance data:", data)
        if (data.hasWallet) {
          setIsConnected(true)
          setWalletAddress(data.walletAddress)
          setBalance(data.availableBalance)
        }
      } else {
        console.log("balance check failed with status:", response.status)
      }
    } catch (err) {
      console.error("error checking existing wallet:", err)
    }
  }, [headers, newUrl, userId])

  useEffect(() => {
    // Check if user already has a Solana wallet connected
    checkExistingWallet()
  }, [checkExistingWallet])

  const stopConnectQrPolling = useCallback(() => {
    if (connectQrPollRef && connectQrPollRef.current) {
      clearInterval(connectQrPollRef.current)
      connectQrPollRef.current = null
    }
  }, [])

  const handleConnectQrStatusUpdate = useCallback(
    statusData => {
      if (!statusData) return

      setConnectQrStatus(statusData.status || "pending")
      setConnectQrStatusMessage(statusData.message || "")

      if (statusData.status === "pending") {
        setConnectQrError("")
      }

      if (statusData.status === "confirmed") {
        setConnectQrMessage("Wallet connected via mobile QR.")
        setConnectQrError("")
        stopConnectQrPolling()
        if (statusData.publicKey) {
          setWalletAddress(statusData.publicKey)
        }
        setIsConnected(true)
        setShowDepositInfo(true)
        checkExistingWallet()
      } else if (statusData.status === "expired") {
        setConnectQrError(statusData.message || "QR session expired. Generate a new QR code to try again.")
        stopConnectQrPolling()
      } else if (statusData.status === "failed") {
        setConnectQrError(statusData.message || "Wallet verification failed. Please try again.")
        stopConnectQrPolling()
      }
    },
    [checkExistingWallet, stopConnectQrPolling]
  )

  const pollConnectQrStatus = useCallback(
    sessionId => {
      if (!sessionId) return

      stopConnectQrPolling()

      const checkStatus = async () => {
        try {
          const response = await fetch(`${newUrl}api/solana/qr-status?sessionId=${encodeURIComponent(sessionId)}`, {
            method: "GET",
            headers,
          })

          if (response.status === 404) {
            stopConnectQrPolling()
            setConnectQrError("QR session not found. Generate a new QR code to try again.")
            setConnectQrStatus("not_found")
            setConnectQrStatusMessage("session not found")
            return
          }

          if (!response.ok) {
            throw new Error(`status ${response.status}`)
          }

          const data = await response.json()
          handleConnectQrStatusUpdate(data)

          if (["confirmed", "expired", "failed"].includes(data.status)) {
            stopConnectQrPolling()
          }
        } catch (err) {
          console.error("error polling solana connect qr status:", err)
        }
      }

      checkStatus()
      connectQrPollRef.current = setInterval(checkStatus, 4000)
    },
    [handleConnectQrStatusUpdate, headers, newUrl, stopConnectQrPolling]
  )

  const startMobileConnectQrSession = useCallback(async () => {
    if (typeof window === "undefined") {
      return
    }

    try {
      setConnectQrError("")
      setConnectQrMessage("")
      setConnectQrDataUrl("")
      setConnectQrStatus("pending")
      setConnectQrStatusMessage("Awaiting wallet scan...")
      setConnectQrCountdown("")
      setConnectQrSession(null)
      setConnectQrPayload(null)

      const initResponse = await fetch(`${newUrl}api/solana/qr-init`, {
        method: "POST",
        headers,
      })

      if (!initResponse.ok) {
        throw new Error(`Failed to initialize QR session (${initResponse.status})`)
      }

      const initData = await initResponse.json()
      if (!initData.success || !initData.sessionId) {
        throw new Error(initData.message || "Missing sessionId from QR init response")
      }

      let challengeMessage = null
      try {
        const challengeResponse = await fetch(`${newUrl}api/solana/qr-challenge?sessionId=${encodeURIComponent(initData.sessionId)}`, {
          method: "GET",
          headers,
        })

        if (challengeResponse.ok) {
          const challengeData = await challengeResponse.json()
          if (challengeData.success !== false && challengeData.challenge) {
            challengeMessage = challengeData.challenge
          }
        }
      } catch (innerErr) {
        console.warn("unable to fetch solana connect challenge:", innerErr)
      }

      const origin = window.location?.origin || "https://app.karmacall.com"
      const payload = {
        type: "karmacall_solana_wallet_connect",
        version: "1.0",
        sessionId: initData.sessionId,
        expiresAt: initData.expiresAt,
        endpoints: {
          status: `${newUrl}api/solana/qr-status`,
          challenge: `${newUrl}api/solana/qr-challenge`,
          verify: `${newUrl}api/solana/qr-verify`,
        },
        challenge: challengeMessage,
        metadata: {
          userId,
          origin,
        },
      }

      const qrImage = await QRCode.toDataURL(JSON.stringify(payload))

      setConnectQrDataUrl(qrImage)
      setConnectQrPayload(payload)
      setConnectQrSession({ sessionId: initData.sessionId, expiresAt: initData.expiresAt })
      setConnectQrMessage("Scan with your mobile wallet to link it to KarmaCall.")
      pollConnectQrStatus(initData.sessionId)
    } catch (err) {
      console.error("error generating mobile connect qr:", err)
      setConnectQrDataUrl("")
      setConnectQrStatus("error")
      setConnectQrError(err.message || "Failed to generate the QR details. Try again or copy the session payload below.")
      stopConnectQrPolling()
    }
  }, [headers, newUrl, pollConnectQrStatus, stopConnectQrPolling, userId])

  const copyConnectLink = async () => {
    if (!connectQrPayload) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(connectQrPayload))
      setConnectQrMessage("Session payload copied to clipboard.")
      setConnectQrError("")
    } catch (err) {
      console.error("error copying solana connect payload:", err)
      setConnectQrError("Unable to copy automatically. Select and copy the session details below.")
      setConnectQrMessage("")
    }
  }

  useEffect(() => {
    if (connectMode !== "qr") {
      stopConnectQrPolling()
      return
    }

    startMobileConnectQrSession()

    return () => {
      stopConnectQrPolling()
    }
  }, [connectMode, startMobileConnectQrSession, stopConnectQrPolling])

  useEffect(() => {
    if (!connectQrSession?.expiresAt || ["confirmed", "expired", "failed"].includes(connectQrStatus)) {
      if (connectQrStatus === "expired") {
        setConnectQrCountdown("Expired")
      } else {
        setConnectQrCountdown("")
      }
      return
    }

    const updateCountdown = () => {
      const remaining = connectQrSession.expiresAt - Date.now()
      if (remaining <= 0) {
        setConnectQrCountdown("Expired")
        return
      }
      const minutes = Math.floor(remaining / 60000)
      const seconds = Math.floor((remaining % 60000) / 1000)
      setConnectQrCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }

    updateCountdown()
    const intervalId = setInterval(updateCountdown, 1000)
    return () => clearInterval(intervalId)
  }, [connectQrSession?.expiresAt, connectQrStatus])

  useEffect(() => {
    return () => {
      stopConnectQrPolling()
    }
  }, [stopConnectQrPolling])

  const detectWallet = () => {
    // Check for Phantom wallet
    if (window.solana && window.solana.isPhantom) {
      return window.solana
    }
    // Check for Solflare
    if (window.solflare && window.solflare.isSolflare) {
      return window.solflare
    }
    return null
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    setError("")

    try {
      const wallet = detectWallet()

      if (!wallet) {
        setError("")
        setConnectMode("qr")
        setConnectQrError("")
        setConnectQrMessage("No browser wallet detected. Use this QR to continue from your mobile wallet.")
        setIsConnecting(false)
        return
      }

      // Connect to wallet
      const response = await wallet.connect()
      const publicKey = response.publicKey.toString()

      // Step 1: Get challenge from backend
      const challengeResponse = await fetch(`${newUrl}api/solana/generateChallenge?publicKey=${publicKey}`)

      if (!challengeResponse.ok) {
        throw new Error("Failed to generate challenge")
      }

      const { message } = await challengeResponse.json()

      // Step 2: Sign the message
      const encodedMessage = new TextEncoder().encode(message)
      const signedMessage = await wallet.signMessage(encodedMessage, "utf8")

      // Convert signature to base64
      const signatureBase64 = btoa(String.fromCharCode(...signedMessage.signature))

      // Step 3: Send to backend for verification
      const connectResponse = await fetch(`${newUrl}api/solana/connectWallet`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          userId: userId,
          publicKey: publicKey,
          signature: signatureBase64,
          message: message,
        }),
      })

      const result = await connectResponse.json()

      if (result.success) {
        setIsConnected(true)
        setWalletAddress(publicKey)
        setShowDepositInfo(true)
        await checkExistingWallet() // Refresh balance
      } else {
        setError(result.message || "Failed to connect wallet")
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError(err.message || "Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const isValidSolanaAddress = address => {
    if (!address || typeof address !== "string") return false
    if (address.length < 32 || address.length > 44) return false
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/
    return base58Regex.test(address)
  }

  const connectManually = async () => {
    const address = prompt("Enter your Solana wallet address:")

    if (!address) return
    if (!isValidSolanaAddress(address)) {
      setError("invalid Solana address format. please check and try again.")
      return
    }

    setIsConnecting(true)
    setError("")

    try {
      console.log("connecting wallet manually:", address)
      const response = await fetch(`${newUrl}api/solana/connectWallet`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          userId: userId,
          publicKey: address,
          signature: "manual_entry", // Backend should handle this specially
          message: "Manual wallet entry",
        }),
      })

      console.log("response status:", response.status)
      const result = await response.json()
      console.log("response data:", result)

      if (response.ok && result.success) {
        setIsConnected(true)
        setWalletAddress(address)
        setShowDepositInfo(true)
        await checkExistingWallet()
      } else {
        const errorMsg = result.message || result.error || "failed to connect wallet"
        console.error("backend error:", errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      console.error("error connecting wallet manually:", err)
      setError(`failed to connect wallet: ${err.message || "please check the address and try again."}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const refreshBalance = async () => {
    await checkExistingWallet()
  }

  const sendSolana = async (fromAddress, amount, planName = "deposit") => {
    console.log("Sending Solana:", { fromAddress, amount, planName })
    if (!fromAddress || !amount || amount <= 0) {
      setSendError("Invalid sender address or amount")
      return null
    }

    setIsSending(true)
    setSendError("")
    setSendSuccess("")
    setShowQRFallback(false)

    try {
      const wallet = detectWallet()

      if (!wallet) {
        // Show QR code fallback
        await generateQRFallback(fromAddress, solanaPublicKey, amount)
        setIsSending(false)
        return null
      }

      // Step 1: Get prepared transaction from backend
      const initiateResponse = await fetch(`${newUrl}api/solana/initiateDeposit`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          userId: userId,
          amount: amount,
          planName: planName,
        }),
      })

      if (!initiateResponse.ok) {
        const errorData = await initiateResponse.json()
        throw new Error(errorData.message || "Failed to prepare transaction")
      }

      const transactionData = await initiateResponse.json()

      if (!transactionData.success) {
        throw new Error(transactionData.message || "Failed to prepare transaction")
      }

      console.log("Transaction data received:", {
        escrowAddress: transactionData.escrowAddress,
        userWalletAddress: transactionData.userWalletAddress,
        amountSol: transactionData.amountSol,
        lamports: transactionData.lamports,
        recentBlockhash: transactionData.recentBlockhash,
      })

      // Step 2: Deserialize the transaction from backend (contains dummy signature)
      // Use browser-compatible base64 decoding
      const transactionBytes = Uint8Array.from(atob(transactionData.transactionData), c => c.charCodeAt(0))
      const transaction = Transaction.from(transactionBytes)

      // Ensure wallet is connected
      if (!wallet.isConnected) {
        console.log("Wallet not connected, connecting...")
        await wallet.connect()
      }

      // Use signAndSendTransaction (recommended by Phantom docs)
      const { signature } = await wallet.signAndSendTransaction(transaction)

      // Wait a moment for the transaction to propagate
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Step 5: Confirm the transaction with backend
      console.log("Confirming transaction with backend...")
      const confirmResponse = await fetch(`${newUrl}api/solana/confirmDeposit`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          userId: userId,
          amount: amount,
          transactionSignature: signature,
          planName: planName,
        }),
      })

      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json()
        throw new Error(errorData.message || "Failed to confirm transaction")
      }

      const confirmData = await confirmResponse.json()

      if (!confirmData.success) {
        throw new Error(confirmData.message || "Failed to confirm transaction")
      }

      console.log("Transaction confirmed with backend, new balance:", confirmData.newBalance)

      setSendSuccess(`Successfully sent ${amount} SOL! Transaction: ${signature}`)
      return signature
    } catch (err) {
      console.error("Error sending Solana:", err)
      setSendError(`Failed to send transaction: ${err.message}`)

      // Show QR code fallback on error
      await generateQRFallback(fromAddress, solanaPublicKey, amount)

      return null
    } finally {
      setIsSending(false)
    }
  }

  const generateQRFallback = async (fromAddress, toAddress, amount) => {
    try {
      const numericAmount = typeof amount === "number" ? amount : parseFloat(amount)
      if (!numericAmount || Number.isNaN(numericAmount)) {
        throw new Error("Invalid amount for QR fallback")
      }

      const params = new URLSearchParams()
      params.set("amount", numericAmount.toFixed(6))
      params.set("label", "KarmaCall Payment")
      if (userId) {
        params.set("memo", `user:${userId}`)
      }

      const solanaUrl = `solana:${toAddress}?${params.toString()}`
      const qrDataUrl = await QRCode.toDataURL(solanaUrl)
      setQrCodeDataUrl(qrDataUrl)
      setQrAmount(numericAmount)
      setShowQRFallback(true)
    } catch (err) {
      console.error("Error generating QR code:", err)
      setSendError("Failed to generate QR code fallback")
    }
  }

  const formatAddress = address => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="solana-wallet-modal">
      <div className="solana-wallet-content">
        <button className="close-button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2>Connect Solana Wallet</h2>

        {!isConnected ? (
          <>
            <div className="mode-toggle">
              <button
                type="button"
                className={`mode-button ${connectMode === "extension" ? "active" : ""}`}
                onClick={() => setConnectMode("extension")}
                disabled={isConnecting}
              >
                Browser Extension
              </button>
              <button type="button" className={`mode-button ${connectMode === "qr" ? "active" : ""}`} onClick={() => setConnectMode("qr")}>
                Mobile QR
              </button>
            </div>

            {connectMode === "extension" ? (
              <>
                <p className="description">
                  Connect your Solana wallet to deposit funds for KarmaCall protection. When spam calls are blocked, the caller gets paid from your escrow
                  balance.
                </p>

                {error && <div className="error-message">{error}</div>}

                <div className="button-group">
                  <button className="primary-button" onClick={connectWallet} disabled={isConnecting}>
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </button>

                  <button className="secondary-button" onClick={connectManually} disabled={isConnecting}>
                    Enter Address Manually
                  </button>
                </div>

                <div className="wallet-info">
                  <p className="info-text">
                    <strong>Supported Wallets:</strong>
                  </p>
                  <ul>
                    <li>Phantom (Browser Extension)</li>
                    <li>Solflare (Browser Extension)</li>
                    <li>Mobile wallets via QR (Phantom, Solflare, Backpack, etc.)</li>
                    <li>Any Solana Wallet (Manual Entry)</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="qr-mode-panel">
                <p>Scan this QR code with your mobile Solana wallet to approve the connection and finish linking your wallet to KarmaCall.</p>

                {connectQrError && <div className="error-message">{connectQrError}</div>}
                {connectQrMessage && (
                  <div
                    style={{
                      backgroundColor: "#ecfdf5",
                      color: "#047857",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      marginBottom: "12px",
                      textAlign: "center",
                    }}
                  >
                    {connectQrMessage}
                  </div>
                )}

                {connectQrDataUrl ? (
                  <div className="qr-wrapper">
                    <img src={connectQrDataUrl} alt="Connect KarmaCall wallet from mobile" />
                  </div>
                ) : (
                  <p style={{ textAlign: "center", marginBottom: "16px" }}>Preparing QR...</p>
                )}

                <div
                  style={{
                    backgroundColor: "#ede9fe",
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    lineHeight: 1.5,
                    marginBottom: "12px",
                  }}
                >
                  {connectQrSession?.sessionId && (
                    <p style={{ margin: "0 0 6px 0", wordBreak: "break-all", color: "#4c1d95" }}>
                      <strong>Session:</strong> <code>{connectQrSession.sessionId}</code>
                    </p>
                  )}
                  {connectQrCountdown && connectQrStatus !== "confirmed" && (
                    <p style={{ margin: "0 0 6px 0", color: "#4c1d95" }}>
                      <strong>Expires in:</strong> {connectQrCountdown}
                    </p>
                  )}
                  {connectQrStatus && connectQrStatus !== "idle" && (
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        color:
                          connectQrStatus === "confirmed"
                            ? "#166534"
                            : connectQrStatus === "expired"
                            ? "#b91c1c"
                            : connectQrStatus === "failed"
                            ? "#b45309"
                            : "#4c1d95",
                      }}
                    >
                      <strong>Status:</strong> {connectQrStatus}
                    </p>
                  )}
                  {connectQrStatusMessage && <p style={{ margin: "0", color: "#4c1d95" }}>{connectQrStatusMessage}</p>}
                </div>

                {connectQrPayload && (
                  <div className="qr-link">
                    <p style={{ marginBottom: "8px" }}>Share with wallet app if needed:</p>
                    <button
                      type="button"
                      onClick={copyConnectLink}
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      Copy Session Payload
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="success-message">
              <svg width="48" height="48" viewBox="0 0 24 24" style={{ marginBottom: "16px" }}>
                <path fill="#10b981" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <h3>Wallet Connected!</h3>
            </div>

            <div className="wallet-details">
              <div className="detail-row">
                <span className="label">Address:</span>
                <span className="value" title={walletAddress}>
                  {formatAddress(walletAddress)}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Escrow Balance:</span>
                <span className="value">{balance !== null ? `${balance} SOL` : "Loading..."}</span>
              </div>

              <button className="refresh-button" onClick={refreshBalance}>
                Refresh Balance
              </button>
            </div>

            {showDepositInfo && (
              <div className="deposit-info">
                <h4>How to Deposit:</h4>
                <ol>
                  <li>Open your Solana wallet (browser extension or mobile).</li>
                  <li>
                    Send SOL to: <code className="master-address">{solanaPublicKey || "Loading..."}</code>
                  </li>
                  <li>
                    Wait about a minute, then click <strong>Refresh Balance</strong> above.
                  </li>
                </ol>
                <p className="note">Tip: You can also switch to the Mobile QR tab to generate a Solana Pay link instantly.</p>
              </div>
            )}

            {sendError && (
              <div className="error-message" style={{ marginTop: "16px" }}>
                {sendError}
              </div>
            )}

            {sendSuccess && (
              <div
                className="success-message"
                style={{ marginTop: "16px", backgroundColor: "#f0fdf4", color: "#166534", padding: "12px", borderRadius: "6px" }}
              >
                {sendSuccess}
              </div>
            )}

            {isSending && (
              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <p>Processing transaction...</p>
              </div>
            )}

            {showQRFallback && (
              <div
                className="qr-fallback"
                style={{ marginTop: "16px", padding: "16px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}
              >
                <h4>Manual Transaction</h4>
                <p>Scan this QR code with your Solana wallet app or copy the details below:</p>
                {qrCodeDataUrl && (
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <img src={qrCodeDataUrl} alt="Solana Payment QR Code" style={{ maxWidth: "200px" }} />
                  </div>
                )}
                <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  <p>
                    <strong>Recipient:</strong> <code>{solanaPublicKey}</code>
                  </p>
                  <p>
                    <strong>Amount:</strong> {qrAmount} SOL
                  </p>
                  <p>
                    <strong>Label:</strong> KarmaCall Payment
                  </p>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button className="primary-button" onClick={() => (window.location.href = "/deposit-solana")}>
                Deposit SOL
              </button>
              <button className="secondary-button" onClick={onClose}>
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Standalone function for sending Solana using backend-prepared transactions
export const sendSolanaTransaction = async (fromAddress, amount, userId, planName = "deposit") => {
  let newUrl = `${process.env.GATSBY_API_URL}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
  if (!fromAddress || !amount || amount <= 0) {
    throw new Error("Invalid sender address or amount")
  }

  if (!userId) {
    throw new Error("User ID is required")
  }

  const wallet = window.solana || window.solflare

  if (!wallet) {
    throw new Error("No Solana wallet detected. Please install Phantom or Solflare.")
  }

  // Step 1: Get prepared transaction from backend
  const initiateResponse = await fetch(`${newUrl}api/solana/initiateDeposit`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      userId: userId,
      amount: amount,
      planName: planName,
    }),
  })

  if (!initiateResponse.ok) {
    const errorData = await initiateResponse.json()
    throw new Error(errorData.message || "Failed to prepare transaction")
  }

  const transactionData = await initiateResponse.json()

  if (!transactionData.success) {
    throw new Error(transactionData.message || "Failed to prepare transaction")
  }

  console.log("Standalone - Transaction data received:", {
    escrowAddress: transactionData.escrowAddress,
    userWalletAddress: transactionData.userWalletAddress,
    amountSol: transactionData.amountSol,
    lamports: transactionData.lamports,
    recentBlockhash: transactionData.recentBlockhash,
  })

  // Step 2: Deserialize the transaction from backend (contains dummy signature)
  // Use browser-compatible base64 decoding
  const transactionBytes = Uint8Array.from(atob(transactionData.transactionData), c => c.charCodeAt(0))
  const originalTransaction = Transaction.from(transactionBytes)
  console.log("Standalone - Transaction deserialized successfully, fee payer:", originalTransaction.feePayer?.toString())

  // Re-create the transaction from the message to ensure it's unsigned and in the right format for the wallet.
  // This strips the dummy signature from the backend.
  const transaction = Transaction.populate(originalTransaction.compileMessage())

  // Step 3: Ensure wallet is connected
  console.log("Standalone - Requesting wallet signature and send...")
  console.log("Standalone - Wallet object:", wallet)
  console.log("Standalone - Wallet isConnected:", wallet.isConnected)
  console.log("Standalone - Wallet publicKey:", wallet.publicKey?.toString())

  // Ensure wallet is connected
  if (!wallet.isConnected) {
    console.log("Standalone - Wallet not connected, connecting...")
    await wallet.connect()
  }

  // Use signAndSendTransaction (recommended by Phantom docs)
  console.log("Standalone - Using signAndSendTransaction...")
  const { signature } = await wallet.signAndSendTransaction(transaction)
  console.log("Standalone - Transaction signed and sent by wallet, signature:", signature)

  // Wait a moment for the transaction to propagate
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 5: Confirm the transaction with backend
  const confirmResponse = await fetch(`${newUrl}api/solana/confirmDeposit`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      userId: userId,
      amount: amount,
      transactionSignature: signature,
      planName: planName,
    }),
  })

  if (!confirmResponse.ok) {
    const errorData = await confirmResponse.json()
    throw new Error(errorData.message || "Failed to confirm transaction")
  }

  const confirmData = await confirmResponse.json()

  if (!confirmData.success) {
    throw new Error(confirmData.message || "Failed to confirm transaction")
  }

  return signature
}

export default SolanaWalletConnect
