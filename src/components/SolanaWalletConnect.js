import React, { useState, useEffect, useCallback } from "react"
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import QRCode from "qrcode"
import "./solana-wallet.css"
import bs58 from "bs58"

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
  const [view, setView] = useState("main") // main, qrConnect
  const [qrConnectSessionId, setQrConnectSessionId] = useState(null)
  const [qrConnectError, setQrConnectError] = useState("")
  const [isPolling, setIsPolling] = useState(false)
  const [qrSignAddress, setQrSignAddress] = useState("")
  const [qrSignMessage, setQrSignMessage] = useState("")
  const [qrSignSignature, setQrSignSignature] = useState("")
  const [qrSignError, setQrSignError] = useState("")

  let solanaPublicKey = process.env.GATSBY_SOLANA_ADDRESS
  let newUrl = `${process.env.GATSBY_API_URL}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    // Check if user already has a Solana wallet connected
    checkExistingWallet()
  }, [userId])

  useEffect(() => {
    // Expose sendSolana method to parent component after component mounts
    if (onSendSolana && typeof onSendSolana === "function") {
      console.log("Exposing sendSolana function to parent")
      onSendSolana(sendSolana)
    }
  }, [onSendSolana]) // Note: sendSolana not in deps to avoid infinite loop

  const checkExistingWallet = async () => {
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
  }

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
        setError("No Solana wallet detected. Please install Phantom or enter your address manually.")
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

  const startQrConnect = async () => {
    setView("qrConnect")
    setIsConnecting(true)
    setQrConnectError("")
    try {
      // Step 1: Initiate the QR connection session with the backend
      const response = await fetch(`${newUrl}api/solana/qr-init`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) {
        throw new Error("could not start QR session")
      }
      const { sessionId } = await response.json()
      setQrConnectSessionId(sessionId)

      // Step 2: Generate QR code pointing to the mobile signing page
      const mobileSignUrl = `https://www.karmacall.com/mobile-sign/${sessionId}`
      const qrDataUrl = await QRCode.toDataURL(mobileSignUrl)
      setQrCodeDataUrl(qrDataUrl)

      // Step 3: Start polling for status updates
      startPolling(sessionId)
    } catch (err) {
      console.error("error starting QR connect:", err)
      setQrConnectError("failed to start QR connection. please try again.")
      setView("main")
    } finally {
      setIsConnecting(false)
    }
  }

  const startPolling = sessionId => {
    if (!sessionId) return
    setIsPolling(true)

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`${newUrl}api/solana/qr-status?sessionId=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.status === "confirmed") {
            setIsPolling(false)
            clearInterval(intervalId)
            setQrConnectSessionId(null)
            setQrCodeDataUrl("")
            // Wallet is connected, refresh UI
            setIsConnected(true)
            setWalletAddress(data.publicKey)
            await checkExistingWallet()
          } else if (data.status === "expired" || data.status === "failed") {
            setIsPolling(false)
            clearInterval(intervalId)
            setQrConnectError("connection failed or timed out. please try again.")
            setView("main")
          }
        }
      } catch (err) {
        // Don't stop polling on network errors, just log them
        console.error("polling error:", err)
      }
    }, 3000) // Poll every 3 seconds

    // Stop polling after 3 minutes
    const timeoutId = setTimeout(() => {
      if (isPolling) {
        clearInterval(intervalId)
        setIsPolling(false)
        setQrConnectError("connection timed out. please try again.")
        setView("main")
      }
    }, 180000)

    // Cleanup function
    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }

  const cancelQrConnect = () => {
    setIsPolling(false)
    setQrConnectSessionId(null) // This will trigger cleanup in polling effect
    setView("main")
    setQrCodeDataUrl("")
    setQrConnectError("")
  }

  const handleQrSignRequest = async () => {
    if (!isValidSolanaAddress(qrSignAddress)) {
      setQrSignError("invalid Solana address format.")
      return
    }
    setQrSignError("")
    setIsConnecting(true)
    try {
      const challengeResponse = await fetch(`${newUrl}api/solana/generateChallenge?publicKey=${qrSignAddress}`)
      if (!challengeResponse.ok) {
        throw new Error("failed to generate challenge")
      }
      const { message } = await challengeResponse.json()
      setQrSignMessage(message)
      const qrDataUrl = await QRCode.toDataURL(message)
      setQrCodeDataUrl(qrDataUrl)
      setView("qrSignStep2")
    } catch (err) {
      console.error("error in QR sign request:", err)
      setQrSignError(err.message || "failed to generate QR code.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleQrSignVerify = async () => {
    setIsConnecting(true)
    setQrSignError("")
    try {
      let signatureBytes
      try {
        signatureBytes = bs58.decode(qrSignSignature)
      } catch (e) {
        throw new Error("invalid signature format. please provide a Base58 signature.")
      }

      const signatureBase64 = btoa(String.fromCharCode(...signatureBytes))

      const connectResponse = await fetch(`${newUrl}api/solana/connectWallet`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          userId: userId,
          publicKey: qrSignAddress,
          signature: signatureBase64,
          message: qrSignMessage,
        }),
      })

      const result = await connectResponse.json()

      if (result.success) {
        setIsConnected(true)
        setWalletAddress(qrSignAddress)
        setShowDepositInfo(true)
        await checkExistingWallet()
      } else {
        throw new Error(result.message || "failed to connect wallet")
      }
    } catch (err) {
      console.error("error verifying QR signature:", err)
      setQrSignError(err.message || "failed to verify signature. please try again.")
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
      const solanaUrl = `solana:${toAddress}?amount=${amount}&label=KarmaCall Payment`
      const qrDataUrl = await QRCode.toDataURL(solanaUrl)
      setQrCodeDataUrl(qrDataUrl)
      setQrAmount(amount)
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
            {view === "main" && (
              <>
                <p className="description">
                  Connect your Solana wallet to deposit funds for KarmaCall protection. When spam calls are blocked, the caller gets paid from your escrow
                  balance.
                </p>

                {error && <div className="error-message">{error}</div>}

                <div className="button-group">
                  <button className="primary-button" onClick={connectWallet} disabled={isConnecting}>
                    {isConnecting ? "Connecting..." : "Connect with Browser"}
                  </button>

                  <button className="secondary-button" onClick={startQrConnect} disabled={isConnecting}>
                    Sign with Mobile (QR)
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
                    <li>Any Solana Wallet (Sign with Mobile or Manual Entry)</li>
                  </ul>
                </div>
              </>
            )}

            {view === "qrConnect" && (
              <div className="qr-sign-flow">
                <h3>Sign with Mobile Wallet</h3>
                <p>Scan the QR code with your phone's camera to sign in with your mobile wallet.</p>
                {qrConnectError && <div className="error-message">{qrConnectError}</div>}

                {isConnecting ? (
                  <p>Generating secure QR code...</p>
                ) : (
                  <div className="qr-code-container" style={{ textAlign: "center", margin: "20px 0" }}>
                    <img src={qrCodeDataUrl} alt="Connect with mobile wallet" />
                  </div>
                )}
                <p className="info-text" style={{ wordBreak: "break-all" }}>
                  {isPolling ? "Waiting for you to sign on your mobile device..." : "Scan the code to continue."}
                </p>
                <div className="button-group">
                  <button className="secondary-button" onClick={cancelQrConnect}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {view === "qrSignStep1" && (
              <div className="qr-sign-flow">
                <h3>Sign with Mobile Wallet - Step 1 of 2</h3>
                <p>Enter your Solana wallet address to generate a secure sign-in message.</p>
                {qrSignError && <div className="error-message">{qrSignError}</div>}
                <input
                  type="text"
                  placeholder="Your Solana Wallet Address"
                  value={qrSignAddress}
                  onChange={e => setQrSignAddress(e.target.value)}
                  className="solana-input"
                />
                <div className="button-group">
                  <button className="primary-button" onClick={handleQrSignRequest} disabled={isConnecting}>
                    {isConnecting ? "Generating..." : "Next"}
                  </button>
                  <button className="secondary-button" onClick={() => setView("main")}>
                    Back
                  </button>
                </div>
              </div>
            )}

            {view === "qrSignStep2" && (
              <div className="qr-sign-flow">
                <h3>Sign with Mobile Wallet - Step 2 of 2</h3>
                <p>Scan the QR code with your wallet, sign the message, and paste the signature below.</p>
                <div className="qr-code-container" style={{ textAlign: "center", margin: "20px 0" }}>
                  <img src={qrCodeDataUrl} alt="Message to sign" />
                </div>
                <p className="info-text" style={{ wordBreak: "break-all" }}>
                  <strong>Message:</strong> {qrSignMessage}
                </p>
                {qrSignError && <div className="error-message">{qrSignError}</div>}
                <input
                  type="text"
                  placeholder="Paste signature here"
                  value={qrSignSignature}
                  onChange={e => setQrSignSignature(e.target.value)}
                  className="solana-input"
                />
                <div className="button-group">
                  <button className="primary-button" onClick={handleQrSignVerify} disabled={isConnecting}>
                    {isConnecting ? "Verifying..." : "Verify & Connect"}
                  </button>
                  <button className="secondary-button" onClick={() => setView("qrSignStep1")}>
                    Back
                  </button>
                </div>
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
                  <li>Open your Solana wallet (Cake Wallet, Phantom, etc.)</li>
                  <li>
                    Send SOL to: <code className="master-address">{solanaPublicKey || "Loading..."}</code>
                  </li>
                  <li>Wait 30-60 seconds for confirmation</li>
                  <li>
                    Submit your transaction signature{" "}
                    <a href="/deposit-solana" className="link">
                      here
                    </a>
                  </li>
                </ol>
                <p className="note">Minimum deposit: 0.01 SOL (~$2)</p>
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
