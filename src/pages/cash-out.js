import React, { useState, useEffect, useLocation } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/sales-and-marketing-use-cases.css"
import Seo from "../components/seo"
import { GiftCardModal, NanoNotEnoughModal, NanoSentModal } from "../components/Modal"

const CashOut = () => {
  const [userDetails, setUserDetails] = useState(null)
  const [dynamicMessage, setDynamicMessage] = useState("Your USD Balance is $0.00")
  const [userId, setUserId] = useState("")
  const [nanoAccount, setNanoAccount] = useState("")
  const updateNanoAccount = newAccount => {
    setNanoAccount(newAccount)
    localStorage.setItem("nanoAccount", newAccount)
  }
  const [nanoBalance, setNanoBalance] = useState("")
  const updateNanoBalance = newBalance => {
    setNanoBalance(newBalance)
    localStorage.setItem("nanoBalance", newBalance)
  }
  const [nanoBalanceInFiat, setNanoBalanceInFiat] = useState("")
  const updateNanoBalanceInFiat = newBalance => {
    setNanoBalanceInFiat(newBalance)
    localStorage.setItem("nanoBalanceInFiat", newBalance)
  }
  const [fiatType, setFiatType] = useState("")
  const updateFiatType = localFiatType => {
    setFiatType(localFiatType)
    localStorage.setItem("fiatType", localFiatType)
  }
  const [nanoRate, setNanoRate] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [destinationAccount, setDestinationAccount] = useState("")
  const sessionId = localStorage.getItem("sessionId")
  const phoneNumber = localStorage.getItem("phoneNumber")
  const countryCode = localStorage.getItem("countryCode")
  const [isNanoSentModalOpen, setIsNanoSentModalOpen] = useState(false)
  const [isNanoOverBalanceModalOpen, setIsNanoOverBalanceModalOpen] = useState(false)
  const [isGiftCardModalOpen, setIsGiftCardModalOpen] = useState(false)
  const openNanoSentModal = () => {
    setIsNanoSentModalOpen(true)
  }
  const openNanoOverBalancedModal = () => {
    setIsNanoOverBalanceModalOpen(true)
  }
  const openGiftCardModal = () => {
    setIsGiftCardModalOpen(true)
  }
  let url = `${process.env.GATSBY_API_URL}`
  let baseUrl = `${process.env.GATSBY_API_URL_BASE}`
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  useEffect(() => {
    const account = localStorage.getItem("nanoAccount")
    if (account !== null) {
      getNanoBalanceAndUpdateMessage(account, "USD")
    }
    updateNanoAccount(account)
  }, [])

  // todo rate-limit the balance check by last time checked.
  const getNanoBalanceAndUpdateMessage = async (nanoAccount, fiatType) => {
    try {
      const response = await fetch(`${baseUrl}nano/user/balance/${nanoAccount}/${fiatType}`, {
        method: "GET",
        headers: headers,
      })
      if (response.ok) {
        const data = await response.json()
        setUserDetails(data) // kind of pointless since we have other consts
        // TODO - get the currency type from the country code or user preferences
        // TODO - setup the Currency denominator to match the currency type
        // TODO - limit the sig figs of each
        const newMessage = `<p>Your USD balance is $<span class="emphasis">${data.accountBalanceInFiat.toFixed(
          5
        )}</span></p> <p>Your nano balance is Ӿ<span class="emphasis">${data.accountBalanceInNano.toFixed(5)}</span></p>`
        setDynamicMessage(newMessage)
        updateNanoBalance(data.accountBalanceInNano)
        updateNanoBalanceInFiat(data.accountBalanceInFiat)
        updateFiatType(data.currencyType)
        setNanoRate(data.rate)
      } else {
        throw new Error("Failed to fetch user details")
      }
    } catch (error) {
      // todo standardize the server error message by retrieving from the responses
      // todo standardize responses on backend to be JSON structured.
      console.error("ERROR", error)
    }
  }

  const handleNanoWithdraw = async event => {
    event.preventDefault()
    try {
      const response = await sendNano(withdrawAmount, destinationAccount)
      if (!isBlank(response.transactionId)) {
        openNanoSentModal()
      }
    } catch (err) {
      console.log(err)
    }
  }

  // next updates
  const handleGiftCardWithdraw = async event => {
    event.preventDefault()
    alert("Coming soon!")
    // try {
    //   const response = await sendNano(withdrawAmount, destinationAccount)
    //   if (!isBlank(response.transactionId)) {
    //     alert("Gift Card successfully sent!")
    //     openGiftCardModal()
    //   }
    // } catch (err) {
    //   console.log(err)
    // }
  }

  const sendNano = async (amountToSend, accountToSendTo) => {
    var myNanoBalance
    myNanoBalance = nanoBalance
    // myNanoBalance = localStorage.getItem("nanoBalance")
    return new Promise((resolve, reject) => {
      if (amountToSend > myNanoBalance) {
        setIsNanoOverBalanceModalOpen(true)
        return
      }
      fetch(`${baseUrl}nano/userSend`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          amount: amountToSend,
          countryCode: countryCode,
          destinationAddress: accountToSendTo,
          sessionId: sessionId,
          sourceAddress: nanoAccount,
          userPhoneNumber: phoneNumber,
        }),
      })
        .then(res => {
          return res.json()
        })
        .then(data => {
          resolve(data)
        })
        .catch(error => reject(error))
    })
  }

  // todo move this into a helper method later.
  function isBlank(str) {
    return !str || /^\s*$/.test(str)
  }

  const handleCloseModal = () => {
    setIsNanoSentModalOpen(false)
    setIsNanoOverBalanceModalOpen(false)
    setIsGiftCardModalOpen(false)
  }

  return (
    <div className="cash-out">
      <Seo title="Wallet Page" description="Manage your KarmaCall account here." />
      <Header />
      <div className="AppText">
        <div className="text-content">
          <h1>Cash Out</h1>
          <p>Copy in the nano account where you would like to send your nano to.</p>
          <div className="html-dynamic" dangerouslySetInnerHTML={{ __html: dynamicMessage }}></div>
          <form method="get" id="nanoAccountWithDraw" onSubmit={handleNanoWithdraw}>
            <p>Withdraw to external nano account</p>
            <div>
              <p>
                <input
                  type="text"
                  name="withdrawAmount"
                  className="form-control width100"
                  placeholder="Enter amount of Nano"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                />
              </p>
              <p>
                <input
                  type="text"
                  name="externalNanoAccount"
                  className="form-control width100"
                  placeholder="Enter destination Nano account"
                  value={destinationAccount}
                  onChange={e => setDestinationAccount(e.target.value)}
                />
              </p>
            </div>
            <button className="learn-more-btn ">Submit</button>
          </form>
          <form method="post" id="giftCardCashOut" onSubmit={handleGiftCardWithdraw}>
            <button className="submit-btn"> Cash Out To Gift Cards </button>
          </form>
        </div>
      </div>
      <NanoSentModal isOpen={isNanoSentModalOpen} nanoExternal={destinationAccount} onClose={handleCloseModal} />
      <NanoNotEnoughModal isOpen={isNanoOverBalanceModalOpen} onClose={handleCloseModal} />
      <GiftCardModal isOpen={isGiftCardModalOpen} onClose={handleCloseModal} />
      <Footer />
    </div>
  )
}

export default CashOut
