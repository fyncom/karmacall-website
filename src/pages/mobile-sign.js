import React, { useState, useEffect, useMemo } from "react"
import { Router } from "@reach/router"
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { SolflareWalletAdapter, PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import "@solana/wallet-adapter-react-ui/styles.css"
import bs58 from "bs58"

// Main component that handles the signing logic
const MobileSigner = ({ sessionId }) => {
  const { publicKey, signMessage, connected } = useWallet()
  const [status, setStatus] = useState("loading") // loading, ready, signing, success, error
  const [error, setError] = useState("")
  const [messageToSign, setMessageToSign] = useState("")

  const newUrl = process.env.GATSBY_API_URL

  // 1. Fetch the unique challenge message from the backend
  useEffect(() => {
    const fetchChallenge = async () => {
      if (typeof window === "undefined") return

      if (!sessionId) {
        setError("session ID is missing.")
        setStatus("error")
        return
      }
      try {
        const response = await fetch(`${newUrl}/api/solana/qr-challenge?sessionId=${sessionId}`)
        if (!response.ok) throw new Error("could not fetch challenge message")
        const { message } = await response.json()
        setMessageToSign(message)
        setStatus("ready")
      } catch (err) {
        setError(err.message || "failed to load challenge message.")
        setStatus("error")
      }
    }
    fetchChallenge()
  }, [sessionId, newUrl])

  // 2. Automatically trigger the signing process once the wallet is connected
  useEffect(() => {
    const signAndVerify = async () => {
      if (connected && publicKey && messageToSign && status === "ready") {
        setStatus("signing")
        try {
          // Sign the message
          const encodedMessage = new TextEncoder().encode(messageToSign)
          const signatureBytes = await signMessage(encodedMessage)
          const signature = bs58.encode(signatureBytes)

          // Send the signature and public key to the backend for verification
          const response = await fetch(`${newUrl}/api/solana/qr-verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              publicKey: publicKey.toBase58(),
              signature,
            }),
          })

          if (!response.ok) {
            const result = await response.json()
            throw new Error(result.message || "verification failed")
          }

          setStatus("success")
        } catch (err) {
          setError(err.message || "message signing failed.")
          setStatus("error")
        }
      }
    }
    signAndVerify()
  }, [connected, publicKey, signMessage, messageToSign, sessionId, newUrl, status])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>KarmaCall Secure Sign-In</h1>
      {!connected ? (
        <>
          <p>Please connect your wallet to continue.</p>
          <WalletMultiButton />
        </>
      ) : (
        <div>
          {status === "loading" && <p>Loading secure session...</p>}
          {status === "ready" && <p>Preparing to sign...</p>}
          {status === "signing" && <p>Please approve the signature request in your wallet...</p>}
          {status === "success" && (
            <div>
              <h2>Success!</h2>
              <p>Your wallet is connected. You can now close this window.</p>
            </div>
          )}
          {status === "error" && (
            <div>
              <h2>Error</h2>
              <p style={{ color: "red" }}>{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const MobileSignPage = () => {
  const network = WalletAdapterNetwork.Mainnet
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [network])
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <ConnectionProvider endpoint={`https://api.mainnet-beta.solana.com`}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router basepath="/mobile-sign">
            <MobileSigner path="/:sessionId" />
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default MobileSignPage

