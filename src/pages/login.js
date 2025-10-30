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
import { configureRevenueCat, loginRevenueCatUser, isRevenueCatUserSet } from "../utils/revenueCat"
import "../components/login.css" // Import the login-specific CSS
import CookieConsentEEA from "../components/CookieConsentEEA"
import ClientOnly from "../components/ClientOnly"

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
  let newUrl = `${process.env.GATSBY_API_URL}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const referralCodeFromUrl = searchParams.get("_referralCode")

    if (referralCodeFromUrl) {
      console.log("found referral code %s", referralCodeFromUrl)
      setReferralCode(referralCodeFromUrl)
    }

    // Auto-detect country code only on client-side, wrapped in a setTimeout
    // to ensure it runs after initial hydration is complete
    if (typeof window !== "undefined") {
      setTimeout(() => {
        getCallingCode()
      }, 0)

      // RevenueCat will be configured when user logs in
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

  const handlePhoneSubmit = async event => {
    event.preventDefault()
    try {
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
    } catch (error) {
      console.log(error)
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
          headers: {
            ...headers,
            "device-os": environment,
            "referral-code": referralCode,
          },
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
    try {
      const response = await verifyConfirm(submittedOtp)
      if (response.status === 200) {
        setIsOtpModalOpen(false)
        setOtp(response.data.opt)

        // Construct authentication data for potential app redirection
        const authData = {
          sessionId: sessionId,
          otp: submittedOtp,
          phoneNumber: phoneNumber,
          countryCode: countryCode,
        }

        // Use the existing handleSignUp function to check if user exists
        // and handle appropriate redirection
        // If user exists, it will redirect to cash-out page
        // If user doesn't exist, it will redirect to app stores
        const result = await handleSignUp(authData, true)
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
    try {
      const signUpResponse = await fetch(newUrl + "user/register/full", {
        method: "POST",
        headers: {
          ...headers,
          "device-os": environment,
          "referral-code": referralCode,
        },
        body: JSON.stringify({
          countryCode: countryCode,
          number: phoneNumber,
        }),
      })

      let signUpData = await signUpResponse.json()

      if (signUpResponse.status === 200) {
        setUserId(signUpData.userId)
        setNanoAccount(signUpData.nanoAccount)

        // Set up RevenueCat user profile FIRST - critical for referral attribution
        // This must happen before referral processing to ensure proper attribution
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
          // Don't block the login process if RevenueCat fails, but log the issue
          console.error("[DEBUG] handleSignUp - failed to set up revenuecat user:", error)
        }

        // handle referrals - only after RevenueCat setup attempt
        if (referralCode !== "") {
          if (revenueCatSetupSuccess) {
            console.log("[DEBUG] handleSignUp - processing referral code with revenuecat user configured")
          } else {
            console.warn("[DEBUG] handleSignUp - processing referral code but revenuecat setup failed")
          }

          console.log("[DEBUG] handleSignUp - Processing referral code")
          const refTx = await recordReferral(signUpData.userId)
          if (refTx.data.referralResponse != null) {
            console.log("[DEBUG] handleSignUp - The Referral was successfully recorded!")
            localStorage.setItem("pendingReferralCode", referralCode)
          } else {
            console.error("[DEBUG] handleSignUp - Referral detected, and user signed up, but tx failed")
          }
        }

        // If redirectToApp is false or not provided, direct to cash-out page
        if (!redirectToApp) {
          console.log("[DEBUG] handleSignUp - Redirecting to /cash-out (redirectToApp=false)")
          navigate("/cash-out")
          return true
        } else {
          console.log("[DEBUG] handleSignUp - User exists, but redirectToApp=true. Redirecting to /cash-out anyway for existing user")
          navigate("/cash-out")
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
      const response = await fetch(newUrl + "referral/record", {
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
                        <button type="submit" className="user">
                          Confirm Phone Number
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
