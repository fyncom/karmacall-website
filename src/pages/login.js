import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import CountryCodeSelector from "../components/country-codes"
import Seo from "../components/seo"
import { BannedNumberModal, OtpInputModal, ServerErrorModal } from "../components/Modal"
import { navigate } from "gatsby" // or useNavigate from react-router-dom
import { useLocation } from "@reach/router"
import { isEmpty } from "lodash"
import { getBrowserEnvironment } from "../utils/browserUtils"
import "../components/login.css" // Import the login-specific CSS
import CookieConsentEEA from "../components/CookieConsentEEA"
import ClientOnly from "../components/ClientOnly"
import { checkRateLimit, recordAttempt, getRateLimitStatus } from "../utils/rateLimiter"

const Login = () => {
  const [countryCode, setCountryCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [otp, setOtp] = useState("")
  const [userId, setUserId] = useState("")
  const [nanoAccount, setNanoAccount] = useState("")
  const [countryCodesOption, setCountryCodesOption] = useState([])
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isBannedModalOpen, setIsBannedModalOpen] = useState(false)
  const [referralCode, setReferralCode] = useState("")
  const [returnTo, setReturnTo] = useState("")
  const [rateLimitStatus, setRateLimitStatus] = useState(null)
  const location = useLocation()
  const environment = getBrowserEnvironment()

  console.log("environment", environment)
  const openOtpModal = () => {
    setIsOtpModalOpen(true)
  }
  const openBannedModal = () => {
    setIsBannedModalOpen(true)
  }
  const openErrorModal = () => {
    setIsErrorModalOpen(true)
  }

  let baseUrl = `${process.env.GATSBY_API_URL_BASE}`
  let baseUrlV2 = `${process.env.GATSBY_API_URL}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const referralCodeFromUrl = searchParams.get("_referralCode")
    const returnToUrl = searchParams.get("returnTo")

    if (referralCodeFromUrl) {
      console.log("found referral code %s", referralCodeFromUrl)
      setReferralCode(referralCodeFromUrl)
    }
    if (returnToUrl) {
      console.log("found returnTo URL %s", returnToUrl)
      setReturnTo(returnToUrl)
    }

    // Auto-detect country code only on client-side, wrapped in a setTimeout
    // to ensure it runs after initial hydration is complete
    if (typeof window !== "undefined") {
      setTimeout(() => {
        getCallingCode()
      }, 0)
    }
  }, [])

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("sessionId", sessionId)
    }
    if (phoneNumber) {
      localStorage.setItem("phoneNumber", phoneNumber)
    }
    if (countryCode) {
      localStorage.setItem("countryCode", countryCode)
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
  }, [sessionId, phoneNumber, countryCode, otp, nanoAccount, userId])

  // Update rate limit status periodically
  useEffect(() => {
    if (!phoneNumber || !countryCode) return

    const identifier = `${countryCode}${phoneNumber}`

    const updateRateLimit = () => {
      const status = getRateLimitStatus("login", identifier)
      setRateLimitStatus(status)
    }

    // Update immediately
    updateRateLimit()

    // Set up interval to update every second when blocked
    const interval = setInterval(() => {
      const status = getRateLimitStatus("login", identifier)
      setRateLimitStatus(status)

      // Stop updating if no longer blocked
      if (!status.isBlocked) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [phoneNumber, countryCode])

  const handlePhoneSubmit = async event => {
    event.preventDefault()

    // Check rate limit before processing (use phone number as identifier)
    const identifier = `${countryCode}${phoneNumber}`
    const rateLimitCheck = checkRateLimit("login", identifier)

    if (!rateLimitCheck.allowed) {
      alert(rateLimitCheck.message || "Too many login attempts. Please wait before trying again.")
      // Update rate limit status for UI
      const status = getRateLimitStatus("login", identifier)
      setRateLimitStatus(status)
      return
    }

    try {
      // Record the attempt
      recordAttempt("login", identifier)

      const result = await triggerVerification()
      if (result.status === 200) {
        setSessionId(result.data.sessionId)
        setPhoneNumber(phoneNumber)
        setCountryCode(countryCode)
        openOtpModal()
      } else if (result.banned) {
        return
      } else {
        openErrorModal()
      }

      // Update rate limit status after attempt
      const status = getRateLimitStatus("login", identifier)
      setRateLimitStatus(status)
    } catch (error) {
      console.log(error)
      // Update rate limit status on error too
      const status = getRateLimitStatus("login", identifier)
      setRateLimitStatus(status)
    }
  }

  // get session ID & save number / country on success
  const triggerVerification = async () => {
    if (process.env.GATSBY_DEBUG_MODE === "true") {
      console.log("in debug mode")
      return {
        status: 200, // Simulate successful response
        data: { sessionId: process.env.GATSBY_DEBUG_SESSION_ID },
      }
    } else {
      try {
        const response = await fetch(baseUrl + "verification/trigger", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            countryCode: countryCode,
            number: phoneNumber,
          }),
        })
        if (response.status === 418) {
          openBannedModal()
          return {
            status: response.status,
            banned: true,
          }
        }
        const data = await response.json()
        return {
          status: response.status,
          data: data,
        }
      } catch (error) {
        console.error("Error caught in triggerVerification:", error)
        return {
          error: true,
          message: error.message || "An error occurred",
        }
      }
    }
  }

  // OTP value gets set in the Modal - cannot use states here..
  const handleOtpSubmit = async submittedOtp => {
    console.log("[DEBUG] handleOtpSubmit - Starting OTP verification with code", submittedOtp ? "[REDACTED]" : "null")
    console.log("[DEBUG] Browser info:", {
      userAgent: navigator.userAgent,
      browser: getBrowserName(),
      environment: environment,
    })

    try {
      console.log("[DEBUG] handleOtpSubmit - Calling verifyConfirm")
      const response = await verifyConfirm(submittedOtp)
      console.log("[DEBUG] handleOtpSubmit - verifyConfirm response:", response)

      if (response.status === 200) {
        console.log("[DEBUG] handleOtpSubmit - OTP verification successful")
        setIsOtpModalOpen(false)
        setOtp(response.data.opt)

        // Construct authentication data for potential app redirection
        const authData = {
          sessionId: sessionId,
          otp: submittedOtp,
          phoneNumber: phoneNumber,
          countryCode: countryCode,
        }
        console.log("[DEBUG] handleOtpSubmit - Authentication data prepared (phoneNumber & countryCode redacted)")

        // Use the existing handleSignUp function to check if user exists
        // and handle appropriate redirection
        // If user exists, it will redirect to cash-out page
        // If user doesn't exist, it will redirect to app stores
        console.log("[DEBUG] handleOtpSubmit - Calling handleSignUp with redirectToApp=true")
        const result = await handleSignUp(authData, true)
        console.log("[DEBUG] handleOtpSubmit - handleSignUp result:", result)
        return
      } else if (response.status === 500) {
        console.log("[DEBUG] handleOtpSubmit - Server error (500)")
        openErrorModal()
      } else if (response.status === 418) {
        console.log("[DEBUG] handleOtpSubmit - Banned number (418)")
        openBannedModal()
      } else if (response.data.verificationStatus === "FAILED") {
        console.log("[DEBUG] handleOtpSubmit - Verification failed")
      }
      setIsOtpModalOpen(false)
    } catch (error) {
      console.error("[DEBUG] handleOtpSubmit - Error occurred:", error)
      setIsOtpModalOpen(false)
    }
  }

  // Helper function to identify browser
  const getBrowserName = () => {
    const userAgent = navigator.userAgent
    let browserName

    if (userAgent.match(/firefox|fxios/i)) {
      browserName = "Firefox"
    } else if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "Chrome"
    } else if (userAgent.match(/safari/i)) {
      browserName = "Safari"
    } else if (userAgent.match(/opr\//i)) {
      browserName = "Opera"
    } else if (userAgent.match(/edg/i)) {
      browserName = "Edge"
    } else {
      browserName = "Unknown"
    }

    return browserName
  }

  const verifyConfirm = async submittedOtp => {
    try {
      const verifyResponse = await fetch(baseUrl + "verification/confirm", {
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

  // v2 user register handles all this now. Both new and existing users are handled here.
  // NOTE: "new" users are those who have never signed up before
  // TODO: get backend to return a "new user" flag so we can redirect to app later.
  // redirectToApp parameter controls whether to redirect to app stores for new users
  const handleSignUp = async (authData = null, redirectToApp = false) => {
    console.log("[DEBUG] handleSignUp - Starting with params:", {
      hasAuthData: authData !== null,
      redirectToApp,
    })

    try {
      const environment = getBrowserEnvironment()
      console.log("[DEBUG] handleSignUp - Environment detected:", environment)
      console.log("[DEBUG] handleSignUp - Browser:", getBrowserName())
      console.log("[DEBUG] handleSignUp - Making API call to user/register/full")

      const signUpResponse = await fetch(baseUrlV2 + "user/register/full", {
        method: "POST",
        headers: {
          ...headers,
          "device-os": environment,
        },
        body: JSON.stringify({
          countryCode: countryCode,
          number: phoneNumber,
        }),
      })

      console.log("[DEBUG] handleSignUp - API Response status:", signUpResponse.status)
      let signUpData = await signUpResponse.json()
      console.log("[DEBUG] handleSignUp - API Response data:", {
        // Redact sensitive info but show structure
        hasUserId: !!signUpData.userId,
        hasNanoAccount: !!signUpData.nanoAccount,
        responseKeys: Object.keys(signUpData),
      })

      if (signUpResponse.status === 200) {
        console.log("[DEBUG] handleSignUp - User %s successfully found with code 200", signUpData.userId)
        setUserId(signUpData.userId)
        setNanoAccount(signUpData.nanoAccount)

        // handle referrals
        if (referralCode !== "") {
          console.log("[DEBUG] handleSignUp - Processing referral code")
          const refTx = await recordReferral(signUpData.userId)
          if (refTx.data.referralResponse != null) {
            console.log("[DEBUG] handleSignUp - The Referral was successfully recorded!")
            localStorage.setItem("pendingReferralCode", referralCode)
          } else {
            console.error("[DEBUG] handleSignUp - Referral detected, and user signed up, but tx failed")
          }
        }

        // If redirectToApp is false or not provided, direct to cash-out page or returnTo URL
        if (!redirectToApp) {
          const redirectUrl = returnTo || "/cash-out"
          console.log("[DEBUG] handleSignUp - Redirecting to", redirectUrl, "(redirectToApp=false)")
          navigate(redirectUrl)
          return true
        } else {
          const redirectUrl = returnTo || "/cash-out"
          console.log("[DEBUG] handleSignUp - User exists, but redirectToApp=true. Redirecting to", redirectUrl, "anyway for existing user")
          navigate(redirectUrl)
          return true
        }
      } else {
        console.log("[DEBUG] handleSignUp - Failed to sign up user with status:", signUpResponse.status)
        return false
      }

      // This code should no longer be reachable for existing users,
      // as they should have been redirected to /cash-out above
      console.log("[DEBUG] handleSignUp - Code path for NEW USERS ONLY. If this is an existing user, this is a problem!")

      // If we're here and redirectToApp is true, proceed with app redirection
      if (redirectToApp && authData) {
        console.log("[DEBUG] handleSignUp - Preparing app redirection for NEW user")
        const encodedData = encodeURIComponent(JSON.stringify(authData))

        // Detect platform - safely check for browser environment
        const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined"
        const isIOS = isBrowser ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false
        console.log("[DEBUG] handleSignUp - Platform detection: isIOS=", isIOS)

        // Construct store URLs with deep link data
        const appStoreUrl = `https://apps.apple.com/us/app/karmacall/id1574524278?referrer=${encodedData}`
        const playStoreUrl = `https://play.google.com/store/apps/details?id=com.fyncom.robocash&referrer=${encodedData}`

        // Try opening app first
        const appUrl = `karmacall://login?data=${encodedData}`
        console.log("[DEBUG] handleSignUp - Attempting to open app with URL:", appUrl.substring(0, 20) + "...")
        window.location.href = appUrl

        // After short delay, check if we're still on the same page
        // If so, user likely doesn't have app installed
        setTimeout(() => {
          console.log("[DEBUG] handleSignUp - In setTimeout callback, document.hidden=", document.hidden)
          if (document.hidden) {
            // App opened successfully
            console.log("[DEBUG] handleSignUp - App opened successfully (document.hidden=true)")
            return
          }
          // Redirect to appropriate store with deep link data
          const storeUrl = isIOS ? appStoreUrl : playStoreUrl
          console.log("[DEBUG] handleSignUp - Redirecting to app store:", storeUrl.substring(0, 30) + "...")
          window.location.href = storeUrl
        }, 1000)

        return true
      }

      console.log("[DEBUG] handleSignUp - Reached end of function with no redirection")
      return false
    } catch (error) {
      console.error("[DEBUG] handleSignUp - Error occurred:", error)
      return false
    }
  }

  // referral api
  const recordReferral = async userId => {
    try {
      const response = await fetch(baseUrlV2 + "referral/record", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          referralCode: referralCode,
          referreeUserId: userId,
        }),
      })
      const data = await response.json()
      return {
        status: response.status,
        data: data,
      }
    } catch (error) {
      console.log(error)
    }
  }

  // organizes the selector value and the country code value
  const handleCountryChange = e => {
    const [code, dialCode] = e.target.value.split("-")
    setCountryCode(code)
    setCountryCodesOption(e.target.value)
  }

  // NOTE: Things like FastForward will block this.
  // Get the user's country code on load using a geolocation API
  const getCallingCode = () => {
    // Fetch the country code based on the user's IP
    // Using a free IP geolocation API
    const url = "https://ipapi.co/json/"

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then(data => {
        if (data && data.country) {
          setCallingCode(data.country)
        } else {
          // Default to US if no country detected
          setCallingCode("US")
        }
      })
      .catch(err => {
        console.log("Error detecting country:", err)
        // Default to US if there's an error
        setCallingCode("US")
      })
  }

  // Set the detected country code in the dropdown
  const setCallingCode = detectedCountryCode => {
    // Only run on client-side
    if (typeof document === "undefined") return

    // First find the matching country in our list
    const countryCodes = document.getElementById("countryCodes")
    if (!countryCodes) return

    let found = false

    // Loop through all options to find the matching country code
    for (let i = 0; i < countryCodes.options.length; i++) {
      const option = countryCodes.options[i]
      const countryCode = option.dataset.countryCode

      if (countryCode === detectedCountryCode) {
        // Found the matching country
        const value = option.value
        setCountryCodesOption(value)

        // Extract the dial code for our state
        const [code, dialCode] = value.split("-")
        setCountryCode(code)

        console.log(`Auto-detected country: ${detectedCountryCode} with dial code ${dialCode}`)
        found = true
        break
      }
    }

    if (!found) {
      // Default to US if country not found in our list
      for (let i = 0; i < countryCodes.options.length; i++) {
        const option = countryCodes.options[i]
        if (option.dataset.countryCode === "US") {
          const value = option.value
          setCountryCodesOption(value)

          const [code, dialCode] = value.split("-")
          setCountryCode(code)

          console.log(`Defaulting to US with dial code +1`)
          break
        }
      }
    }
  }

  const handleCloseModal = () => {
    setIsBannedModalOpen(false)
    setIsErrorModalOpen(false)
  }

  return (
    <div className="login">
      <CookieConsentEEA />
      <Seo title="Login KarmaCall" description="A simple login page to let you manage your account" />
      <Header />
      <div className="AppText">
        <section>
          <div id="phone-number-entry" className="network">
            <div className="container">
              <ClientOnly>
                <form method="get" id="phoneNumberInput" onSubmit={handlePhoneSubmit}>
                  {/* Rate Limit Status */}
                  {rateLimitStatus && rateLimitStatus.isBlocked && (
                    <div
                      style={{
                        marginBottom: "1rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: "#fff3cd",
                        color: "#856404",
                        border: "1px solid #ffeaa7",
                        borderRadius: "4px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                      }}
                    >
                      ⚠️ Too many login attempts. Please wait {rateLimitStatus.waitTimeSeconds} seconds before trying again.
                    </div>
                  )}

                  <div>
                    <p>
                      <CountryCodeSelector value={countryCodesOption} onChange={handleCountryChange} />
                    </p>
                    <p>
                      <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="Enter Phone Number"
                        className="form-control"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        pattern="[0-9]*"
                        title="Phone number should only contain digits."
                        required
                      />
                    </p>
                  </div>
                  <div className="input-group-btn" style={{ display: "flex", justifyContent: "center" }}>
                    <p>
                      <span className="input-group-btn">
                        <button
                          type="submit"
                          className="user"
                          disabled={rateLimitStatus && rateLimitStatus.isBlocked}
                          style={{
                            opacity: rateLimitStatus && rateLimitStatus.isBlocked ? 0.6 : 1,
                            cursor: rateLimitStatus && rateLimitStatus.isBlocked ? "not-allowed" : "pointer",
                          }}
                        >
                          {rateLimitStatus && rateLimitStatus.isBlocked ? "Rate Limited" : "Confirm Phone Number"}
                        </button>
                      </span>
                    </p>
                  </div>
                </form>
              </ClientOnly>
              {/* <h3> */}
              {/* <a href="/login-email">Click here to login with email</a> */}
              {/* </h3> */}
            </div>
          </div>
          <OtpInputModal isOpen={isOtpModalOpen} onSubmit={handleOtpSubmit} onClose={() => setIsOtpModalOpen(false)} />
          <BannedNumberModal isOpen={isBannedModalOpen} onClose={handleCloseModal} />
          <ServerErrorModal isOpen={isErrorModalOpen} onClose={handleCloseModal} />
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Login
