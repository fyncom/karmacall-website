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

  console.log("dkfjdasklfjadsk")
  const openErrorModal = () => {
    setIsErrorModalOpen(true)
  }

  let baseUrlV2 = `${process.env.GATSBY_API_URL}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    console.log("Parsing URL parameters")
    const searchParams = new URLSearchParams(location.search)
    const dataFromUrl = searchParams.get("_data")

    if (dataFromUrl) {
      const decodedData = decodeURIComponent(dataFromUrl)
      console.log("Decoded data:", decodedData)
      setData(decodedData)
      verifyConfirm(decodedData)

      // //
      // console.log("Found encrypted data:", dataFromUrl)
      // // Use encodeURIComponent to properly handle special characters
      // const encodedData = encodeURIComponent(dataFromUrl)
      // // Then decode it to get the original string with all special characters intact
      // const decodedData = decodeURIComponent(encodedData)
      // console.log("Decoded data:", decodedData)
      // setData(decodedData)
      // verifyConfirm(decodedData)
    } else {
      console.log("No encrypted data found in URL")
      setIsLoading(false)
      setVerificationStatus("FAILED")
    }
  }, [location])

  const verifyConfirm = async encryptedData => {
    try {
      const verifyResponse = await fetch(baseUrlV2 + "user/verify/email/magic-link/confirm", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          data: encryptedData,
        }),
      })
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
  // Render content based on loading and verification status
  return (
    <div className="verify">
      <Seo title="Email Verification for KarmaCall" description="Verifying your email address for your KarmaCall account." />
      <Header />
      <div className="AppText">
        <section>
          <div id="phone-number-entry" className="network">
            <div className="container">
              {/* Display loading animation while verifying */}
              {isLoading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Verifying your email...</p>
                </div>
              )}

              {/* Show modals based on verification status */}
              {!isLoading && verificationStatus === "SUCCESS" && (
                <div className="success-modal">
                  <h2>Email Verified!</h2>
                  <p>Your email has been successfully verified. You can now close this window and return to the app.</p>
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
