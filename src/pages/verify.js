import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import CountryCodeSelector from "../components/country-codes"
import Seo from "../components/seo"
import { BannedNumberModal, ServerErrorModal } from "../components/Modal"
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
    const dataFromUrl = searchParams.get("_data")

    if (dataFromUrl) {
      console.log("found data %s", dataFromUrl)
      setData(dataFromUrl)
      const result = verifyConfirm()
      if (result.status === 200) {
        // setNano
        setUserId(result.data.userId)
      }
    } else {
      setIsLoading(false)
      setVerificationStatus("FAILED")
    }
  }, [location])

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId)
    }
  }, [userId])

  const verifyConfirm = async submittedOtp => {
    try {
      const verifyResponse = await fetch(baseUrlV2 + "user/verify/email/magic-link/confirm", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          data: data,
          verificationCode: submittedOtp,
        }),
      })
      // verificationStatus
      // nanoAccount
      console.log("seeing verify response %s", verifyResponse.verificationStatus)
      setVerificationStatus(verifyResponse.verificationStatus)
      const verifyData = await verifyResponse.json()
      return {
        status: verifyResponse.status,
        data: verifyData,
      }
    } catch (error) {
      console.log(error)
      openErrorModal()
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsErrorModalOpen(false)
  }

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
