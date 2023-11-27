import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import CountryCodeSelector from "../components/country-codes"
import Seo from "../components/seo"
import { useLocation } from "@reach/router"
import { BannedNumberModal, OtpInputModal, ServerErrorModal } from "../components/Modal"
import { Link } from "gatsby"
import { navigate } from "gatsby" // or useNavigate from react-router-dom

const Login = () => {
  const [countryCode, setCountryCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [otp, setOtp] = useState("")
  const [countryCodesOption, setCountryCodesOption] = useState([])
  const location = useLocation()
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isBannedModalOpen, setIsBannedModalOpen] = useState(false)
  const openOtpModal = () => {
    setIsOtpModalOpen(true)
  }
  const openBannedModal = () => {
    setIsBannedModalOpen(true)
  }
  const openErrorModal = () => {
    setIsErrorModalOpen(true)
  }

  let url = `${process.env.GATSBY_API_URL}`
  let baseUrl = `${process.env.GATSBY_API_URL_BASE}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    // Fetch country codes or other initial data here
    // setCountryCodes(...) after fetching
    // getCallingCode()
  }, [])

  const handlePhoneSubmit = async event => {
    event.preventDefault()
    try {
      const result = await triggerVerification()
      if (result.status === 200) {
        setSessionId(result.data.sessionId)
        setPhoneNumber(phoneNumber)
        setCountryCode(countryCode)
        localStorage.setItem("sessionId", result.data.sessionId)
        localStorage.setItem("countryCode", countryCode)
        localStorage.setItem("phoneNumber", phoneNumber)
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
    try {
      const response = await fetch(baseUrl + "verification/trigger", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          countryCode: countryCode,
          number: phoneNumber,
        }),
      })
      if (response.status == 418) {
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

  // OTP value gets set in the Modal - cannot use states here..
  const handleOtpSubmit = async submittedOtp => {
    try {
      const response = await verifyConfirm(submittedOtp)
      if (response.status == 200) {
        setIsOtpModalOpen(false)
        localStorage.setItem("otp", response.data.otp)
        handleSignUp()
      } else if (response.status === 500) {
        openErrorModal()
      } else if (response.status === 418) {
        openBannedModal()
      } else if (response.data.verificationStatus === "FAILED") {
        // todo add a "service failed modal"
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

  // complex user sign up flow since it handles both new users and existing users due to outdated backend.
  const handleSignUp = async () => {
    try {
      const signUpResponse = await fetch(baseUrl + "user/register", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          countryCode: countryCode,
          number: phoneNumber,
        }),
      })
      let signUpData = await signUpResponse.json()
      let successfulCall = false
      let thisUserId
      if (signUpResponse.status == 200) {
        // new users
        console.log("New User %s successfully Registered with code 200", signUpData.userId)
        thisUserId = signUpData.userId
        successfulCall = true
      } else if (signUpResponse.status == 400) {
        // existing users
        console.log("User already exists")
        const userResponse = await getUserId()
        if (userResponse.status == 200) {
          thisUserId = userResponse.data.userId
          successfulCall = true
        }
      }
      console.log("%s <- user Id", thisUserId)
      if (successfulCall) {
        const nanoAccount = await getNanoAccount()
        console.log("userID IS %s and userAccount is %s", thisUserId, nanoAccount.data.nanoNodeWalletAccount)
        const connectedAccount = await connectNanoAccountWithUserId(thisUserId, nanoAccount.data.nanoNodeWalletAccount)
        if (["Account address successfully saved", "Welcome back!"].includes(connectedAccount.data.message)) {
          console.log("Account address successfully saved")
          localStorage.setItem("nanoAccount", connectedAccount.data.currentDatabaseAccountAddress)
        }
        localStorage.setItem("userId", thisUserId)
        navigate("/cash-out")
      } else {
        // put an error thing here
        console.log("Failure at getting the user signed up")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // for existing users only
  const getUserId = async () => {
    try {
      const userIdResponse = await fetch(baseUrl + "user/getUser", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          countryCode: countryCode,
          number: phoneNumber,
        }),
      })
      const userIdData = await userIdResponse.json()
      return {
        status: userIdResponse.status,
        data: userIdData,
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getNanoAccount = async () => {
    try {
      const nanoWalletResponse = await fetch(baseUrl + "wallet/createSimpleNanoAccount", {
        method: "GET",
        headers: headers,
      })
      let nanoWalletData = await nanoWalletResponse.json()
      return {
        status: nanoWalletResponse.status,
        data: nanoWalletData,
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectNanoAccountWithUserId = async (userId, nanoAccount) => {
    try {
      const response = await fetch(baseUrl + "payment/crypto/save", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          address: nanoAccount,
          addressType: "NANO",
          userId: userId,
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
