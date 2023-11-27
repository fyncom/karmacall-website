import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/white-paper.css"
import whitePaper from "../../static/pdfs/fyncom-Original-White-Paper-For-KarmaCall-Update.pdf"
import Seo from "../components/seo"
import PdfContent from "../components/PdfContent"
import { Link } from "gatsby"

const WhitePaperOriginalScamCalls = () => {
  return (
    <div>
      <Seo
        title="Cash-Back For Spam? Stop Scams & Increase Trust with Refundable Deposits"
        description="It started with endless scam / spam phone calls and evolved into a financial communications layer for the internet."
      />
      <Header />
      <div className="content-container">
        <h2 className={"centered"}>Why Do Spam Calls Still Exist?</h2>
        <p className={"centered"}>...and how can I stop scams, but let good callers reach me?</p>
        <p>
          That's the thought that started me on a journey of exploring an emerging market that blends communications & currency to create trust between
          strangers with shared interests. Here's the paper I wrote to record my thoughts - it later became{" "}
          <a href="https://patents.google.com/patent/US11310368B2">my 1st patent</a>, <Link to="/">this KarmaCall app</Link>, and is the basis for how{" "}
          <a href="https://www.fyncom.com">FynCom</a> came to be. Thanks for reading! <br />
          <i>- Adrian</i>
        </p>
        <PdfContent file={whitePaper} />
        <p>
          Thanks for reading our White Paper on stopping spam across the world, starting with scam calls! <Link to={"/"}>Try out the apps today </Link>to get
          started!
        </p>
      </div>
      <Footer />
    </div>
  )
}

export default WhitePaperOriginalScamCalls
