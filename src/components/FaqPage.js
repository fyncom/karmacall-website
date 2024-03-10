import React, { useState, useRef } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/legal.css"
import Seo from "../components/seo"

const FaqSection = ({ id, title, content }) => {
  const [isOpen, setIsOpen] = useState(false)
  const sectionRef = useRef(null) // Create a ref for the section

  const toggleSection = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // If the section is about to be opened, scroll it into view
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="legal-text-container" style={{ marginBottom: "20px" }} ref={sectionRef}>
      <h2
        id={`section-${id}`}
        onClick={toggleSection}
        style={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "#007bff", // Example color, adjust as needed
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isOpen ? "−" : "+"} <span style={{ marginLeft: "10px" }}>{title}</span>
      </h2>
      {isOpen && <div dangerouslySetInnerHTML={{ __html: content }} />}
    </div>
  )
}

const FaqPage = () => {
  const faqData = [
    {
      id: 1,
      title: "What if a good call is blocked?",
      content:
        'We reject all non-contacts calls that do not leave a cash deposit (reject means we send them to voicemail). They will still be able to leave you a voicemail. 50-70% of unknown calls are not contented, so people are used to leaving voicemails. Just remember, if the call is important, they will leave a voicemail. <a href="https://bgr.com/2019/01/29/smartphone-usage-statistics-new-data/">https://bgr.com/2019/01/29/smartphone-usage-statistics-new-data/</a>',
    },
    {
      id: 2,
      title: "What countries do you support?",
      content: `We support people in 164 countries, enabling them to register their phone numbers and get paid to reject scam calls. However, due to high SMS fees or repeated SMS toll fraud, the following countries are not currently supported:
            <ul>
              <li>Algeria</li>
              <li>Azerbaijan</li>
              <li>Bangladesh</li>
              <li>Israel</li>
              <li>Nigeria</li>
              <li>Oman</li>
              <li>Pakistan</li>
              <li>Papua New Guinea</li>
              <li>Russia</li>
              <li>Sri Lanka</li>
              <li>Tajikistan</li>
              <li>Tunisia</li>
            </ul>
      At some point, we may open up an email sign-up to let let people in those countries use KarmaCall, but we do not expect to consider that until 2025.`,
    },
    {
      id: 3,
      title: "What languages does the app support?",
      content: `
        <ul> 
          <li>iOS
            <ul>
              <li>English</li>
            </ul>
          </li>
          <li>Android
            <ul>
              <li>Before V4.0.0</li>
                <ul>
                  <li>Arabic</li>
                  <li>Chinese</li>
                  <li>English</li>
                  <li>Filipino</li>
                  <li>Hebrew</li>
                  <li>Hindi</li>
                  <li>Indonesian</li>
                  <li>Italian</li>
                  <li>Malay</li>
                  <li>Russian</li>
                  <li>Portugeuse</li>
                  <li>Sinhalese</li>
                  <li>Spanish</li>
                  <li>Zulu</li>
                </ul>
            </ul>
            <ul>
              <li>After Version 4.0.0.
                <ul>
                  <li>English</li>
                <li>Italian</li>
                </ul>
            </ul>
          </li>
        </ul>
        Language support coming soon for others on V4.0.0`,
    },
    {
      id: 4,
      title: "What is Nano?",
      content:
        'Nano is a digital currency based on blockchain technology. It is designed to be fast, scalable, and has zero fees! Every account is assigned its own blockchain. <a href="https://docs.nano.org/what-is-nano/overview/" target="_blank" rel="noopener">Learn more</a>',
    },
    {
      id: 5,
      title: "What is a Nano account, and what does KarmaCall do with it?",
      content:
        "Think of your Nano account as a digital coin purse. When you sign up with your phone number, KarmaCall gives you a Nano account that is attached to your phone number. You can withdraw and spend any amount any time you want. Every time you block a call, We deposit Nano into your Nano account. If a bad caller calls you and you hang up before 25 seconds, the Nano deposit of that caller goes into your Nano account. In KarmaCall, your Nano account is associated with your phone number. You can create external Nano accounts if you want to withdraw Nano from KarmaCall to an external Nano account that you own.",
    },
    {
      id: 6,
      title: "How can I add funds to my Nano balance?",
      content:
        "Currently, we do not have a deposit functionality in the app to allow users to add funds to their Nano account. However, we do have a faucet that allows you to receive a small amount of Nano to start using immediately for free!",
    },
    {
      id: 7,
      title: "What is a faucet?",
      content:
        "A Nano faucet is just like a sink faucet, except it dispenses small amounts of digital currency, in our case Nano. Our faucet can be used once by each user. This can be done by navigating to the 'Wallet' page in the app and clicking the 'FAUCET = FREE $$$' button. Using our faucet will give you 0.0001 Nano.",
    },
    {
      id: 8,
      title: "How do I use the faucet?",
      content: "When you're in the app, Just click our 'FAUCET = FREE $$$' button on the 'Wallet' page and you will instantly get Nano to use for free!",
    },
    {
      id: 9,
      title: "What can I do with my Nano?",
      content: `Please visit <a href="https://usenano.org" target="_blank" rel="noopener">usenano.org</a> to see the different ways you can use your Nano. Within the KarmaCall app, the Nano you get from our Faucet will allow you to make 5 free outbound calls to receivers who do not have you (the caller) as a contact. This will give you the opportunity to try out more functionalities of KarmaCall.`,
    },
    {
      id: 10,
      title: "How do I make an external Nano account?",
      content:
        'If you want to transfer Nano out of KarmaCall and into another Nano account that you own, please visit this link to see wallet options for your phone or computer. <a href="https://nano.org/get-nano" target="_blank" rel="noopener">Get Nano</a>.',
    },
    {
      id: 11,
      title: "How do I earn more Nano?",
      content:
        'Check out this website to see more options. We are huge fans of NanoQuakeJS :) <a href="https://earn-nano.com/" target="_blank" rel="noopener">Earn Nano</a>',
    },
    {
      id: 12,
      title: "This seems too good to be true. Am I the product?",
      content:
        "Yes, you are the product and our mission is to get you paid what you deserve. Currently, you do not get paid for the data you give out every day. Instead, most companies make money by selling your attention to advertisers. We invented a way to force companies to pay you for your time in order to get your attention. Our technology will be used to help businesses get in contact with real, honest customers like you. Businesses will pay you in order to keep you on the line or you can just hang up on them right away to collect their deposit! You can also just opt-out from these calls entirely. Either way, we want to give you the power to get paid for your data and time. Of course, a fraction of these payments will be kept by KarmaCall so we can continue to improve our technology for a world with meaningful communication. Our mission is to stop scam, get you paid for your data, and convince other companies that they should be paying you for your data too.",
    },
    {
      id: 13,
      title: "How can I find out more about Nano?",
      content: 'We recommend checking out the Nano community. <a href="https://www.reddit.com/r/nanocurrency/" target="_blank" rel="noopener">Nano Reddit</a>',
    },
    {
      id: 14,
      title: "Does this work for Emails?",
      content:
        'Yes! This works for GMail only for now. You can <a href="https://fyncom.com/fyncom-filters-email-edition/" target="_blank" rel="noopener">purchase membership here</a> and see <a href="https://fyncom.com/user-help-center/email-filters-and-rewards/" target="_blank" rel="noopener">setup details here</a>',
    },
    {
      id: 15,
      title: "Does this work for SMS / text messages?",
      content: "Not yet. We may work on this in Late Q2 2024, but it is not promised. Let us know if this is something you would want.",
    },
    {
      id: 16,
      title: "Does this work for my Social Media or Chat DMs (direct messages)?",
      content: "Not yet, but we hope to make that happen soon. Let us know which sites/apps you would like this on?",
    },
  ]

  return (
    <div>
      <div className="AppText">
        <div className="faq-accordion">
          <h1>KarmaCall FAQ</h1>
          {faqData.map(faq => (
            <FaqSection key={faq.id} id={faq.id} title={faq.title} content={faq.content} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FaqPage
