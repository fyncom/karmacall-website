import React from "react"
import Header from "../../components/header"
import Footer from "../../components/footer"
import "../../components/help-center.css"
import { helpItems } from "../../../static/help-items"
import { Link } from "gatsby"
import Seo from "../../components/seo"
import {FaAward, FaTools, FaEnvelopeOpenText, FaKey, FaMailBulk, FaChartLine, FaFileAlt, FaWallet, FaLanguage, FaFilter,} from "react-icons/fa"
const iconMap = {
  FaAward: <FaAward />,
  FaTools: <FaTools />,
  FaEnvelopeOpenText: <FaEnvelopeOpenText />,
  FaKey: <FaKey />,
  FaMailBulk: <FaMailBulk />,
  FaChartLine: <FaChartLine />,
  FaFileAlt: <FaFileAlt />,
  FaWallet: <FaWallet />,
  FaLanguage: <FaLanguage />,
  FaFilter: <FaFilter />,
};

const HelpCenter = () => {
  return (
    <div>
      <Seo
        title="Help Center"
        description="Setting up FynCom tools can be a challenge. We're here to help!"
      />
      <Header />
      <div className="help-center">
        <h1 className="centered">Help Center</h1>
        <p className="centered-p">What do you need help with?</p>
        Not a business?{" "}
        <Link to="/user-help-center">Click here for our User Help Center.</Link>
        <div className="help-items">
          {helpItems.map(item => (
            <Link to={`/help-center/${item.topicUrl}`} key={item.title} className="help-item">
              <div className="icon">{iconMap[item.icon]}</div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HelpCenter
