import React, { useState, useEffect } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import CountryCodeSelector from "../components/country-codes"
import Seo from "../components/seo"
import { BannedNumberModal, ServerErrorModal } from "../components/Modal"
import { navigate } from "gatsby" // or useNavigate from react-router-dom
import { useLocation } from "@reach/router"
// https://www.karmacall.com/verify/?data=/ZSE86Sg8NEmy9D6yP7ta/lqkfGMyYr+R7ee83jHUQBbofhHSFVCRcAcNZ4Kl5qFmc1MUoza31QC7xM/CkA9pxVKRXdJVmuGbB9We/3Vs3Ia2LQUcO1UcUOTrfpvGkhnuw==I

const Login = () => {
  const [userId, setUserId] = useState("")
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
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
      verifyConfirm()
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
      const verifyData = await verifyResponse.json()
      return {
        status: verifyResponse.status,
        data: verifyData,
      }
    } catch (error) {
      console.log(error)
      openErrorModal() // consider changing this to return actual messages?
    }
  }

  const handleCloseModal = () => {
    setIsBannedModalOpen(false)
    setIsErrorModalOpen(false)
  }

  return (
    <div className="verify">
      <Seo
        title="Email Verification for KarmaCall"
        description="A page that adds your email address to your KarmaCall Account. For this to work, you must start from the KarmaCall App."
      />
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
          <BannedNumberModal isOpen={isBannedModalOpen} onClose={handleCloseModal} />
          <ServerErrorModal isOpen={isErrorModalOpen} onClose={handleCloseModal} />
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Login
