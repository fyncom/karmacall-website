import React, { useState, useEffect } from "react"
import "./solana-wallet.css"

const SolanaWalletConnect = ({ userId, onClose }) => {
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState(null)
  const [error, setError] = useState("")
  const [showDepositInfo, setShowDepositInfo] = useState(false)

  let baseUrlV2 = `${process.env.GATSBY_API_URL}`

  useEffect(() => {
    // Check if user already has a Solana wallet connected
    checkExistingWallet()
  }, [userId])

  const checkExistingWallet = async () => {
    if (!userId) {
      console.log("no userId provided, skipping wallet check")
      return
    }
    try {
      console.log("checking existing wallet for userId:", userId)
      const response = await fetch(`${baseUrlV2}api/solana/balance?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
        // No wallet detected - show manual entry option
        setError("No Solana wallet detected. Please install Phantom or enter your address manually.")
        setIsConnecting(false)
        return
      }

      // Connect to wallet
      const response = await wallet.connect()
      const publicKey = response.publicKey.toString()

      // Step 1: Get challenge from backend
      const challengeResponse = await fetch(`${baseUrlV2}api/solana/generateChallenge?publicKey=${publicKey}`)

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
      const connectResponse = await fetch(`${baseUrlV2}api/solana/connectWallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(`${baseUrlV2}api/solana/connectWallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
            <p className="description">
              Connect your Solana wallet to deposit funds for KarmaCall protection. When spam calls are blocked, the caller gets paid from your escrow balance.
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
                <li>Cake Wallet (Manual Entry)</li>
                <li>Any Solana Wallet (Manual Entry)</li>
              </ul>
            </div>
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
                    Send SOL to: <code className="master-address">{process.env.GATSBY_SOLANA_MASTER_ADDRESS || "Loading..."}</code>
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

export default SolanaWalletConnect

