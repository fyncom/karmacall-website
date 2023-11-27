import React, { useState, useEffect, useLocation } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/sales-and-marketing-use-cases.css"
import Seo from "../components/seo"
import { GatsbyImage } from "gatsby-plugin-image"
import { useCombinedQuery } from "../components/useCombinedQuery"

const Referral = () => {
  const { sendgrid, slicktext, zapier, salesHeroImage, increaseBookings, accelerateDeals, minMax } = useCombinedQuery()
  const [blockedEmailDetails, setBlockedEmailDetails] = useState(null)
  const location = useLocation()
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => {
    setModalOpen(!isModalOpen)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const blockedEmailId = searchParams.get("depositId")
    console.log("deposit ID is %s", blockedEmailId)
    if (blockedEmailId) {
      // getBlockedEmailDetails(blockedEmailId)
    }
  }, [location])
  return (
    <div className="Referral">
      <Seo title="Login KarmaCall" description="A simple login page to let you manage your account" />
      <Header />

      <Footer />
    </div>
  )
}

export default Referral
