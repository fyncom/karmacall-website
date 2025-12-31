import React, { useState, useEffect, useRef } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import Seo from "../components/seo"
import { OtpInputModal, ServerErrorModal } from "../components/Modal"
import { navigate } from "gatsby"
import { useLocation } from "@reach/router"
import { getBrowserEnvironment } from "../utils/browserUtils"
import { loginRevenueCatUser, isRevenueCatUserSet } from "../utils/revenueCat"
import "../components/cash-out-email.css"
import ClientOnly from "../components/ClientOnly"

const CashOutEmail = () => {
  const [email, setEmail] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [otp, setOtp] = useState("")
  const [userId, setUserId] = useState("")
  const [nanoAccount, setNanoAccount] = useState("")
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [nanoValue, setNanoValue] = useState("")
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false)
  const isEmailSubmittingRef = useRef(false)
  const lastEmailSubmitAt = useRef(0)
  const location = useLocation()
  const environment = getBrowserEnvironment()
  const SUBMIT_DEBOUNCE_MS = 2000

  const openOtpModal = () => {
    setIsOtpModalOpen(true)
  }
  const openErrorModal = () => {
    setIsErrorModalOpen(true)
  }

  let baseUrl = `${process.env.GATSBY_API_URL_BASE}`
  let newUrl = `${process.env.GATSBY_API_URL}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const valueFromUrl = searchParams.get("value") || searchParams.get("_value")

    if (valueFromUrl) {
      setNanoValue(valueFromUrl)
    }
  }, [])

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("sessionId", sessionId)
    }
    if (email) {
      localStorage.setItem("email", email)
    }
    if (otp) {
      localStorage.setItem("otp", otp)
    }
    if (nanoAccount) {
      localStorage.setItem("nanoAccount", nanoAccount)
    }
    if (userId) {
      localStorage.setItem("userId", userId)
    }
  }, [sessionId, email, otp, nanoAccount, userId])

  const handleEmailSubmit = async event => {
    event.preventDefault()
    const now = Date.now()
    if (isEmailSubmittingRef.current || isOtpModalOpen || now - lastEmailSubmitAt.current < SUBMIT_DEBOUNCE_MS) {
      return
    }
    isEmailSubmittingRef.current = true
    lastEmailSubmitAt.current = now
    setIsEmailSubmitting(true)
    if (event?.nativeEvent?.submitter) {
      event.nativeEvent.submitter.disabled = true
    }
    try {
      const result = await triggerEmailVerification()
      if (result.status === 200) {
        setSessionId(result.data.sessionId)
        setEmail(email)
        openOtpModal()
      } else if (result.status === 429) {
        openErrorModal()
      } else {
        openErrorModal()
      }
    } catch (error) {
      console.log(error)
    } finally {
      isEmailSubmittingRef.current = false
      setIsEmailSubmitting(false)
    }
  }

  const triggerEmailVerification = async () => {
    if (process.env.GATSBY_DEBUG_MODE === "true") {
      console.log("in debug mode")
      return {
        status: 200,
        data: { sessionId: process.env.GATSBY_DEBUG_SESSION_ID },
      }
    } else {
      try {
        const response = await fetch(baseUrl + "verification/triggerEmailKarmacall", {
          method: "POST",
          headers: {
            ...headers,
            "device-os": environment,
          },
          body: JSON.stringify({
            emailAddress: email,
          }),
        })
        const data = await response.json()
        return {
          status: response.status,
          data: data,
        }
      } catch (error) {
        console.error("error caught in triggerEmailVerification:", error)
        return {
          error: true,
          message: error.message || "an error occurred",
        }
      }
    }
  }

  const handleOtpSubmit = async submittedOtp => {
    try {
      const response = await verifyConfirm(submittedOtp)
      if (response.status === 200) {
        setIsOtpModalOpen(false)
        setOtp(response.data.opt)

        const result = await handleSignUp()
        if (result) {
          navigate("/cash-out")
        }
        return
      } else if (response.status === 500) {
        console.log("[DEBUG] handleOtpSubmit - server error (500)")
        openErrorModal()
      } else if (response.data.verificationStatus === "FAILED") {
        console.log("[DEBUG] handleOtpSubmit - verification failed")
        openErrorModal()
      }
      setIsOtpModalOpen(false)
    } catch (error) {
      console.error("[DEBUG] handleOtpSubmit - error occurred:", error)
      setIsOtpModalOpen(false)
      openErrorModal()
    }
  }

  const verifyConfirm = async submittedOtp => {
    try {
      const verifyResponse = await fetch(baseUrl + "verification/confirmEmail", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          sessionId: sessionId,
          verificationCode: submittedOtp,
        }),
      })
      const verifyData = await verifyResponse.json()
      return {
        status: verifyResponse.status,
        data: verifyData,
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignUp = async () => {
    try {
      const signUpResponse = await fetch(newUrl + "user/register/full", {
        method: "POST",
        headers: {
          ...headers,
          "device-os": environment,
        },
        body: JSON.stringify({
          email: email,
        }),
      })

      let signUpData = await signUpResponse.json()

      if (signUpResponse.status === 200) {
        setUserId(signUpData.userId)
        setNanoAccount(signUpData.nanoAccount)

        let revenueCatSetupSuccess = false
        try {
          if (!isRevenueCatUserSet()) {
            await loginRevenueCatUser(signUpData.userId)
            revenueCatSetupSuccess = true
          } else {
            console.log("[DEBUG] handleSignUp - revenuecat user already set up, skipping")
            revenueCatSetupSuccess = true
          }
        } catch (error) {
          console.error("[DEBUG] handleSignUp - failed to set up revenuecat user:", error)
        }

        console.log("[DEBUG] handleSignUp - redirecting to /cash-out")
        return true
      } else {
        console.log("[DEBUG] handleSignUp - failed to sign up user with status:", signUpResponse.status)
        return false
      }
    } catch (error) {
      console.error("[DEBUG] handleSignUp - error occurred:", error)
      return false
    }
  }

  const handleCloseModal = () => {
    setIsErrorModalOpen(false)
  }

  return (
    <div className="cash-out-email">
      <Seo title="Claim Your Nano - KarmaCall" description="Claim the Nano that was sent to you via KarmaCall" />
      <Header />
      <div className="cash-out-email-content">
        <section>
          <div className="cash-out-email-container">
            <div className="cash-out-email-card">
              <div className="cash-out-email-header">
                <h1>KarmaCall</h1>
              </div>
              <div className="cash-out-email-body">
                <div className="cash-out-email-title">
                  {nanoValue ? `You've received $${nanoValue} in Nano` : "You've received Nano"}
                </div>
                <div className="cash-out-email-text">
                  Someone sent you Nano via KarmaCall. We've reserved it for your email address.
                </div>
                <div className="cash-out-email-text">
                  Claim it in a few seconds:
                </div>
                <ol className="cash-out-email-steps">
                  <li>Enter your email below</li>
                  <li>Verify with the code sent to your email</li>
                  <li>Choose: gift card, keep Nano, or cash out</li>
                </ol>
                <ClientOnly>
                  <form method="get" id="emailClaimForm" onSubmit={handleEmailSubmit}>
                    <div className="cash-out-email-input-group">
                      <input
                        type="email"
                        name="email"
                        id="claimEmail"
                        placeholder="Enter Email Address"
                        className="cash-out-email-input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="cash-out-email-button-container">
                      <button type="submit" className="cash-out-email-button" disabled={isEmailSubmitting || isOtpModalOpen}>
                        Claim your Nano
                      </button>
                    </div>
                  </form>
                </ClientOnly>
                <div className="cash-out-email-redeem-section">
                  <div className="cash-out-email-subtitle">Ways to redeem</div>
                  <ul className="cash-out-email-list">
                    <li>Gift cards (min $5, $0 fee, easy)</li>
                    <li>Keep Nano (no min, no fee)</li>
                    <li>Cash out (no min, $0 fee)</li>
                  </ul>
                </div>
                <div className="cash-out-email-footer-text">
                  Didn't expect this? Contact support@karmacall.com
                </div>
              </div>
            </div>
          </div>
          <OtpInputModal isOpen={isOtpModalOpen} onSubmit={handleOtpSubmit} onClose={() => setIsOtpModalOpen(false)} />
          <ServerErrorModal isOpen={isErrorModalOpen} onClose={handleCloseModal} />
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default CashOutEmail

