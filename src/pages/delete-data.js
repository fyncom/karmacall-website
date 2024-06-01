import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/legal.css"
import Seo from "../components/seo"
import { Link } from "gatsby"

const DataDeletionPage = () => {
  return (
    <div>
      <Seo title="Delete Your KarmaCall Data" description="Learn how to permanently delete your personal information from KarmaCall." />
      <Header />
      <div className="AppText">
        <div className="legal-container">
          <h1>Delete Your KarmaCall Data</h1>
          <p>
            At KarmaCall, we respect your privacy and want to ensure you have full control over your data. If you wish to permanently delete your personal
            information from our system, you can follow these simple steps:
          </p>

          <div className="legal-text-container-table">
            <h2>How to Delete Your Data</h2>
            <ol>
              <li>
                <h3>Open the KarmaCall app.</h3>
                <p>Make sure you're logged in to your KarmaCall account.</p>
              </li>
              <li>
                <h3>Navigate to the Settings section.</h3>
                <p>You can typically find this by tapping on your profile icon or a gear icon within the app.</p>
              </li>
              <li>
                <h3>Select "Delete My Data."</h3>
                <p>This option is usually located within the privacy or security settings.</p>
              </li>
              <li>
                <h3>Confirm your request.</h3>
                <p>The app will prompt you to confirm your decision. After confirmation, your data will be permanently deleted.</p>
              </li>
            </ol>
          </div>

          <p>
            If you have any questions or need assistance with deleting your data, please don't hesitate to contact our support team at&nbsp;
            <a href="mailto:support@karmacall.com">support@karmacall.com</a>.
          </p>

          <h2>What Happens When You Delete Your Data</h2>
          <p>Deleting your KarmaCall data will permanently remove your account, including:</p>

          <ul>
            <li>Your phone number and associated information</li>
            <li>Your Nano account balance and transaction history</li>
            <li>Your call blocking settings and logs</li>
            <li>Any other personal information you provided.</li>
          </ul>

          <p>Please note that:</p>
          <ul>
            <li>We may retain some anonymized data for analytical purposes. This data will not be identifiable to you.</li>
            <li>We may retain some data to comply with legal obligations or for fraud prevention purposes.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DataDeletionPage
