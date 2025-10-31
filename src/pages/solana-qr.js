import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import Seo from "../components/seo"

const SolanaQrPage = () => {
  const isBrowser = typeof window !== "undefined"
  const [sessionId, setSessionId] = useState(null)
  const [challenge, setChallenge] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const newUrl = `${process.env.GATSBY_API_URL}`
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    if (isBrowser) {
      // Get sessionId from URL
      const params = new URLSearchParams(window.location.search)
      const id = params.get("sessionId")
      if (id) {
        setSessionId(id)
        fetchChallenge(id)
      } else {
        setError("No session ID provided. Please scan the QR code again.")
      }
    }
  }, [isBrowser])

  const fetchChallenge = async sessionId => {
    try {
      const response = await fetch(`${newUrl}api/solana/qr-challenge?sessionId=${sessionId}`, {
        method: "GET",
        headers: headers,
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError("Session not found. It may have expired. Please generate a new QR code.")
          return
        }
        throw new Error("Failed to fetch challenge")
      }

      const data = await response.json()
      if (data.success) {
        setChallenge(data.challenge)
      } else {
        setError(data.message || "Failed to get challenge message")
      }
    } catch (err) {
      console.error("Error fetching challenge:", err)
      setError(err.message || "Failed to fetch challenge. Please try again.")
    }
  }

  const detectMobileWallet = () => {
    // Check for mobile wallets
    if (window.solana && window.solana.isPhantom) {
      return window.solana
    }
    if (window.solflare && window.solflare.isSolflare) {
      return window.solflare
    }
    // Check if we're in a Phantom mobile browser
    if (navigator.userAgent.includes("Phantom")) {
      return window.solana || window.phantom?.solana
    }
    return null
  }

  const handleConnect = async () => {
    if (!challenge || !sessionId) {
      setError("Missing session or challenge data")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const wallet = detectMobileWallet()

      if (!wallet) {
        setError("No Solana wallet detected. Please open this page in your Solana wallet browser or install a Solana wallet app.")
        setIsProcessing(false)
        return
      }

      // Connect to wallet
      const response = await wallet.connect()
      const publicKey = response.publicKey.toString()
      setWalletAddress(publicKey)

      // Sign the challenge message
      const encodedMessage = new TextEncoder().encode(challenge)
      const signedMessage = await wallet.signMessage(encodedMessage, "utf8")

      // Convert signature to base64
      const signatureBase64 = btoa(String.fromCharCode(...signedMessage.signature))

      // Verify with backend
      const verifyResponse = await fetch(`${newUrl}api/solana/qr-verify`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          sessionId: sessionId,
          publicKey: publicKey,
          signature: signatureBase64,
        }),
      })

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        throw new Error(errorData.message || "Failed to verify signature")
      }

      const verifyData = await verifyResponse.json()

      if (verifyData.success) {
        setSuccess(true)
      } else {
        setError(verifyData.message || "Failed to verify wallet")
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError(err.message || "Failed to connect wallet. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="solana-qr-page">
      <Seo title="Connect Solana Wallet" description="Connect your Solana wallet to KarmaCall" />
      <Header />
      <div className="AppText">
        <div className="text-content" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <h1>Connect Solana Wallet</h1>

          {!success ? (
            <>
              <p style={{ marginBottom: "24px" }}>Connect your Solana wallet to KarmaCall for secure transactions.</p>

              {error && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#991b1b",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    border: "1px solid #fecaca",
                  }}
                >
                  {error}
                </div>
              )}

              {challenge && !error && (
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      backgroundColor: "#f0fdf4",
                      padding: "16px",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      border: "1px solid #86efac",
                    }}
                  >
                    <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#166534" }}>Session Ready</p>
                    <p style={{ margin: "0", fontSize: "14px", color: "#166534" }}>Click the button below to connect your wallet.</p>
                  </div>

                  <button
                    onClick={handleConnect}
                    disabled={isProcessing}
                    style={{
                      width: "100%",
                      background: isProcessing ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      padding: "16px",
                      borderRadius: "8px",
                      fontSize: "18px",
                      fontWeight: "600",
                      cursor: isProcessing ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {isProcessing ? "Connecting..." : "Connect Wallet"}
                  </button>
                </div>
              )}

              {!challenge && !error && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div
                    style={{
                      display: "inline-block",
                      width: "40px",
                      height: "40px",
                      border: "4px solid #f3f4f6",
                      borderTop: "4px solid #667eea",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading session...</p>
                </div>
              )}

              <div style={{ marginTop: "32px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "16px", marginTop: "0", marginBottom: "12px" }}>Instructions:</h3>
                <ol style={{ paddingLeft: "20px", fontSize: "14px", lineHeight: "1.6" }}>
                  <li>This page should be opened from a QR code scan</li>
                  <li>Make sure you have a Solana wallet app installed (Phantom, Solflare, etc.)</li>
                  <li>Click "Connect Wallet" to connect and verify your wallet</li>
                  <li>Return to your desktop browser to complete the setup</li>
                </ol>
              </div>

              <div style={{ marginTop: "24px", fontSize: "14px", color: "#6b7280", textAlign: "center" }}>
                <p>
                  <strong>Supported Wallets:</strong>
                </p>
                <p>Phantom, Solflare, and other Solana-compatible mobile wallets</p>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 24px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24">
                  <path fill="white" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>

              <h2 style={{ color: "#166534", marginBottom: "16px" }}>Wallet Connected Successfully!</h2>

              {walletAddress && (
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    border: "1px solid #86efac",
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "#166534" }}>Wallet Address:</p>
                  <p style={{ margin: "0", fontSize: "14px", fontFamily: "monospace", color: "#166534", wordBreak: "break-all" }}>
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                  </p>
                </div>
              )}

              <p style={{ fontSize: "16px", marginBottom: "24px", color: "#6b7280" }}>You can now return to your desktop browser to continue.</p>

              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "12px 32px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Go to KarmaCall Home
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default SolanaQrPage
