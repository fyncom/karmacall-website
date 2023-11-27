import React, { useState } from "react"

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className={`accordion-item ${isOpen ? "open" : ""}`}>
      <button className="accordion-question" onClick={toggle}>
        {question}
      </button>
      {isOpen && <div className="accordion-answer">{answer}</div>}
    </div>
  )
}
const FaqAccordion = () => {
  const faqData = [
    {
      question: "What if a good call is blocked?",
      answer:
        "We reject all non-contacts calls that do not leave a cash deposit (reject means we send them to voicemail). They will still be able to leave you a voicemail. 50-70% of unknown calls are not answered, so people are used to leaving voicemails. Just remember, if the call is important, they will leave a voicemail. https://bgr.com/2019/01/29/smartphone-usage-statistics-new-data/",
    },
    {
      question: "What countries do you support?",
      answer: "People in every country can register their phone number and get paid to start rejecting scam calls.",
    },
    {
      question: "What languages does the app support?",
      answer:
        "Arabic, Chinese, English, Filipino, Hebrew, Hindi, Indonesian, Italian, Malay, Russian, Portuguese, Sinhalese, Spanish, Zulu. Are we missing your language? Let us know.",
    },
    {
      question: "What is Nano?",
      answer:
        "Nano is a digital currency based on blockchain technology. It is designed to be fast, scalable, and has zero fees! Every account is assigned its own blockchain. [Learn more](https://docs.nano.org/what-is-nano/overview/)",
    },
    {
      question: "What is a Nano account, and what does KarmaCall do with it?",
      answer:
        "Think of your Nano account as a digital coin purse. When you sign up with your phone number, KarmaCall gives you a Nano account that is attached to your phone number. You can withdraw and spend any amount any time you want. Every time you block a call, We deposit Nano into your Nano account. If a bad caller calls you and you hang up before 25 seconds, the Nano deposit of that caller goes into your Nano account. In KarmaCall, your Nano account is associated with your phone number. You can create external Nano accounts if you want to withdraw Nano from KarmaCall to an external Nano account that you own.",
    },
    {
      question: "How can I add funds to my Nano balance?",
      answer:
        "Currently, we do not have a deposit functionality in the app to allow users to add funds to their Nano account. However, we do have a faucet that allows you to receive a small amount of Nano to start using immediately for free!",
    },
    {
      question: "What is a faucet?",
      answer:
        "A Nano faucet is just like a sink faucet, except it dispenses small amounts of digital currency, in our case Nano. Our faucet can be used once by each user. This can be done by navigating to the 'Wallet' page in the app and clicking the 'FAUCET = FREE $$$' button. Using our faucet will give you 0.0001 Nano.",
    },
    {
      question: "How do I use the faucet?",
      answer: "When you're in the app, Just click our 'FAUCET = FREE $$$' button on the 'Wallet' page and you will instantly get Nano to use for free!",
    },
    {
      question: "What can I do with my Nano?",
      answer:
        "Please visit [usenano.org](https://usenano.org) to see the different ways you can use your Nano. Within the KarmaCall app, the Nano you get from our Faucet will allow you to make 5 free outbound calls to receivers who do not have you (the caller) as a contact. This will give you the opportunity to try out more functionalities of KarmaCall.",
    },
    {
      question: "How do I make an external Nano account?",
      answer:
        "If you want to transfer Nano out of KarmaCall and into another Nano account that you own, please visit this link to see wallet options for your phone or computer. [Get Nano](https://nano.org/get-nano)",
    },
    {
      question: "How do I earn more Nano?",
      answer: "Check out this website to see more options. We are huge fans of NanoQuakeJS :) [Earn Nano](https://earn-nano.com/)",
    },
    {
      question: "This seems too good to be true. Am I the product?",
      answer:
        "Yes, you are the product and our mission is to get you paid what you deserve. Currently, you do not get paid for the data you give out every day. Instead, most companies make money by selling your attention to advertisers. We invented a way to force companies to pay you for your time in order to get your attention. Our technology will be used to help businesses get in contact with real, honest customers like you. Businesses will pay you in order to keep you on the line or you can just hang up on them right away to collect their deposit! You can also just opt-out from these calls entirely. Either way, we want to give you the power to get paid for your data and time. Of course, a fraction of these payments will be kept by KarmaCall so we can continue to improve our technology for a world with meaningful communication. Our mission is to stop scam, get you paid for your data, and convince other companies that they should be paying you for your data too.",
    },
    {
      question: "How can I find out more about Nano?",
      answer: "We recommend checking out the Nano community. [Nano Reddit](https://www.reddit.com/r/nanocurrency/)",
    },
  ]

  return (
    <div className="faq-accordion">
      {faqData.map((faq, index) => (
        <AccordionItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  )
}

export default FaqAccordion
