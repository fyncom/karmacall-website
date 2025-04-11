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
  let baseUrlV2 = `${process.env.GATSBY_API_URL}`
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
  }, [location])

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
        openErrorModal()
      } else if (response.status === 418) {
        openBannedModal()
      } else if (response.data.verificationStatus === "FAILED") {
        console.log("response failure")
      }
      setIsOtpModalOpen(false)
    } catch (error) {
      setIsOtpModalOpen(false)
      console.log(error)
    }
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
  // redirectToApp parameter controls whether to redirect to app stores for new users
  const handleSignUp = async (authData = null, redirectToApp = false) => {
    try {
      const environment = getBrowserEnvironment()
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
      let signUpData = await signUpResponse.json()
      if (signUpResponse.status === 200) {
        console.log("User %s successfully found with code 200", signUpData.userId)
        setUserId(signUpData.userId)
        setNanoAccount(signUpData.nanoAccount)
        // handle referrals
        if (referralCode !== "") {
          const refTx = await recordReferral(signUpData.userId)
          if (refTx.data.referralResponse != null) {
            console.log("The Referral was successfully recorded!")
            localStorage.setItem("pendingReferralCode", referralCode)
          } else {
            console.error("referral detected, and user signed up, but tx failed")
          }
        }
        
        // If redirectToApp is false or not provided, direct to cash-out page
        if (!redirectToApp) {
          navigate("/cash-out")
          return true
        }
      } else {
        console.log("Failed to sign up user")
        return false
      }
      
      // If we're here and redirectToApp is true, proceed with app redirection
      if (redirectToApp && authData) {
        const encodedData = encodeURIComponent(JSON.stringify(authData))
        
        // Detect platform - safely check for browser environment
        const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined"
        const isIOS = isBrowser ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false
        
        // Construct store URLs with deep link data
        const appStoreUrl = `https://apps.apple.com/us/app/karmacall/id1574524278?referrer=${encodedData}`
        const playStoreUrl = `https://play.google.com/store/apps/details?id=com.fyncom.robocash&referrer=${encodedData}`
        
        // Try opening app first
        const appUrl = `karmacall://login?data=${encodedData}`
        window.location.href = appUrl
        
        // After short delay, check if we're still on the same page
        // If so, user likely doesn't have app installed
        setTimeout(() => {
          if (document.hidden) {
            // App opened successfully
            return
          }
          // Redirect to appropriate store with deep link data
          window.location.href = isIOS ? appStoreUrl : playStoreUrl
        }, 1000)
        
        return true
      }
      
      return false
    } catch (error) {
      console.log(error)
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
  // This function will be used to get the user's country code on load
  // todo - handle this later
  // const getCallingCode = () => {
  //   // Fetch the country code based on the user's IP
  //   const url = "https://api.ipgeolocation.io/ipgeo?apiKey=9d0005d72b1a45619e83ccb9446e930b"
  //   fetch(url)
  //     .then(response => {
  //       return response.json()
  //     })
  //     .then(data => {
  //       country = data.country_code2
  //       setCallingCode(country)
  //     })
  //     .catch(err => {
  //       // Do something for an error here
  //     })
  // }

  // This function will be used to get the user's country code on load
  // const setCallingCode = () => {
  //   let IPcountryCode = countryCode
  //   let codeDropdown = document.getElementById("countryCodes")
  //   localStorage.setItem("IPcountryCode", IPcountryCode)
  //   for (let i, j = 0; (i = codeDropdown.options[j]); j++) {
  //     if (i.dataset.countryCode == IPcountryCode) {
  //       codeDropdown.selectedIndex = j
  //       i.selected = true
  //       return IPcountryCode
  //     }
  //   }
  // }

  const handleCloseModal = () => {
    setIsBannedModalOpen(false)
    setIsErrorModalOpen(false)
  }

  return (
    <div className="login">
      <Seo title="Login KarmaCall" description="A simple login page to let you manage your account" />
      <Header />
      <div className="AppText">
        <section>
          <div id="phone-number-entry" className="network">
            <div className="container">
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
                <div className="input-group-btn">
                  <p>
                    <span className="input-group-btn">
                      <button type="submit" className="user">
                        Confirm Phone Number
                      </button>
                    </span>
                  </p>
                </div>
              </form>
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
