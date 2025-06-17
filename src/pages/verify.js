import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import Seo from "../components/seo"
import { ServerErrorModal } from "../components/Modal"
import { navigate } from "gatsby" // or useNavigate from react-router-dom
import { useLocation } from "@reach/router"
import "../components/verify.css"
// https://www.karmacall.com/verify/?data=/ZSE86Sg8NEmy9D6yP7ta/lqkfGMyYr+R7ee83jHUQBbofhHSFVCRcAcNZ4Kl5qFmc1MUoza31QC7xM/CkA9pxVKRXdJVmuGbB9We/3Vs3Ia2LQUcO1UcUOTrfpvGkhnuw==I

const Verify = () => {
  const [userId, setUserId] = useState("")
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [data, setData] = useState("")
  const location = useLocation()

  const openErrorModal = () => {
    setIsErrorModalOpen(true)
  }

  let baseUrlV2 = `${process.env.GATSBY_API_URL}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    // backend sometimes sends links with _ prepended, especially for mobile app email verifications.
    const dataFromUrl = searchParams.get("_data") || searchParams.get("data")

    if (dataFromUrl) {
      try {
        // First decode the URI component
        const decodedData = decodeURIComponent(dataFromUrl)
        setData(decodedData)
        // Don't call verifyConfirm() here
      } catch (error) {
        console.error("Error decoding URL data:", error)
        setIsLoading(false)
        setVerificationStatus("FAILED")
      }
    } else {
      console.log("No encrypted data found in URL")
      setIsLoading(false)
      setVerificationStatus("FAILED")
    }
  }, [location])

  // Add a new useEffect to handle verification after data is set
  useEffect(() => {
    if (data) {
      verifyConfirm()
    }
  }, [data]) // This will run whenever data changes

  const verifyConfirm = async () => {
    if (!data) {
      console.error("No data available to send")
      setIsLoading(false)
      setVerificationStatus("FAILED")
      return
    }

    try {
      console.log("Sending verification request with data:", data)

      const verifyResponse = await fetch(baseUrlV2 + "user/verify/email/magic-link/confirm", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          data: data,
        }),
      })
      console.log("Raw response:", verifyResponse)

      // Check for HTTP error status codes before trying to parse JSON
      if (!verifyResponse.ok) {
        console.error(`Email verification failed with status: ${verifyResponse.status}`)
        if (verifyResponse.status >= 500) {
          // Server error (5xx)
          openErrorModal()
        } else if (verifyResponse.status >= 400) {
          // Client error (4xx) - treat as verification failure
          setVerificationStatus("FAILED")
        }
        return
      }

      const verifyData = await verifyResponse.json()
      console.log("Verification response:", verifyData)
      setVerificationStatus(verifyData.verificationStatus)
      if (verifyResponse.status === 200) {
        setUserId(verifyData.userId)
      }
    } catch (error) {
      console.error("Error during verification:", error)
      openErrorModal()
    } finally {
      console.log("in finally with email status %s!", verificationStatus)
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsErrorModalOpen(false)
  }

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId)
    }
  }, [userId])

  return (
    <div className="verify">
      <Seo title="Email Verification for KarmaCall" description="Verifying your email address for your KarmaCall account." />
      <Header />
      <div className="AppText">
        <section>
          <div id="phone-number-entry" className="network">
            <div className="container">
              {isLoading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Verifying your email...</p>
                </div>
              )}

              {!isLoading && verificationStatus === "VERIFIED" && (
                <div className="success-modal">
                  <svg width="48" height="48" viewBox="0 0 24 24" style={{ marginBottom: "16px" }}>
                    <path fill="#2C3E50" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <h2>Email Verified!</h2>
                  <p>Your email has been successfully verified. You can now close this window and return to the app.</p>
                </div>
              )}

              {!isLoading && (verificationStatus === "FAILED" || verificationStatus === null) && (
                <div className="error-modal">
                  <svg width="48" height="48" viewBox="0 0 24 24" style={{ marginBottom: "16px" }}>
                    <path fill="#E74C3C" d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                  </svg>
                  <h2>Verification Failed</h2>
                  <p>Unable to verify your email. The link may be expired or invalid. Please try requesting a new verification email from the app.</p>
                </div>
              )}
              <ServerErrorModal isOpen={isErrorModalOpen} onClose={handleCloseModal} />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Verify
