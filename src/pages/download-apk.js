import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/download-apk.css"
import Seo from "../components/seo"
import { FaAndroid, FaDownload, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa"

const DownloadApk = () => {
  return (
    <div>
      <Seo
        title="Download KarmaCall APK - Sideload Latest Version"
        description="Download the latest KarmaCall APK to get critical updates while we wait for Google Play Store approval. Get the newest features including improved text blocking and graylisting."
      />
      <Header />
      <section className="download-apk-section">
        <div className="download-hero">
          <FaAndroid className="android-icon" />
          <h1>Download KarmaCall APK</h1>
          <p className="subtitle">get the latest version with critical updates</p>
        </div>
        <div className="situation-notice">
          <div className="notice-header">
            <FaExclamationTriangle className="warning-icon" />
            <h2>why we're offering direct downloads</h2>
          </div>
          <p>
            our google play app update has been in review for <strong>140 days</strong>. this is highly abnormal, and we're actively working with google to
            resolve this issue.
          </p>
          <p>
            the current version in the google play store has a critical bug: <strong>it blocks texts from everyone</strong>, not just unknown senders. this
            makes the app frustrating to use for text messaging.
          </p>
          <p>
            we've fixed this issue and added several important features in the versions below. rather than wait indefinitely, we're making these updates
            available for direct download so you can enjoy the app as it was meant to be.
          </p>
        </div>
        <div className="updates-container">
          <h2>what's new in these updates</h2>
          <div className="version-updates">
            <div className="version-card">
              <div className="version-header">
                <h3>v4.9.69 (306)</h3>
              </div>
              <div className="version-content">
                <FaCheckCircle className="check-icon" />
                <p>fixing issue for contacts texts notifications. works as expected now.</p>
              </div>
            </div>
            <div className="version-card">
              <div className="version-header">
                <h3>v4.9.70 (307)</h3>
              </div>
              <div className="version-content">
                <FaCheckCircle className="check-icon" />
                <p>added sounds to blocked notifications & localized some notification strings</p>
              </div>
            </div>
            <div className="version-card featured-version">
              <div className="version-header">
                <h3>v4.9.71 (308)</h3>
                <span className="latest-badge">latest</span>
              </div>
              <div className="version-content">
                <FaCheckCircle className="check-icon" />
                <p>
                  added new graylisting features, which is default "on". now, people you call, who are not contacts or karmacallers can call you back without
                  being blocked.
                </p>
                <p>
                  <strong>android 11 and lower:</strong> fix bug that caused active call to be ended when an incoming blocked call arrives. added a "protect
                  active call" setting.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="download-section">
          <h2>download the apk</h2>
          <p className="download-instructions">
            click the button below to download the latest version of karmacall. you'll need to enable installation from unknown sources in your android
            settings.
          </p>
          <a href="https://github.com/FynCom/KarmaCall-android/releases/latest/download/app-release.apk" className="download-button" download>
            <FaDownload className="download-icon" />
            download karmacall v4.9.71
          </a>
          <p className="file-info">apk file • android 6.0 or higher required</p>
        </div>
        <div className="installation-guide">
          <h2>how to install</h2>
          <ol className="install-steps">
            <li>
              <strong>download the apk</strong>
              <p>tap the download button above to save the apk file to your device</p>
            </li>
            <li>
              <strong>enable unknown sources</strong>
              <p>go to settings → security → enable "install unknown apps" for your browser or file manager</p>
            </li>
            <li>
              <strong>install the app</strong>
              <p>open the downloaded apk file and follow the installation prompts</p>
            </li>
            <li>
              <strong>grant permissions</strong>
              <p>allow the necessary permissions for karmacall to block spam calls and texts</p>
            </li>
          </ol>
        </div>
        <div className="faq-section">
          <h2>common questions</h2>
          <div className="faq-item">
            <h3>is this safe?</h3>
            <p>
              yes! this is the official karmacall apk, signed with our developer certificate. it's the exact same app that will eventually be on the google play
              store once the review is complete.
            </p>
          </div>
          <div className="faq-item">
            <h3>will i get automatic updates?</h3>
            <p>
              no, sideloaded apps don't update automatically. you'll need to check back here or follow our social media for new versions. once the google play
              store version is updated, you can switch back to that for automatic updates.
            </p>
          </div>
          <div className="faq-item">
            <h3>can i install this over the play store version?</h3>
            <p>
              yes! since this is signed with the same certificate, you can install it directly over your existing karmacall installation without losing your
              data or settings.
            </p>
          </div>
          <div className="faq-item">
            <h3>when will the play store be updated?</h3>
            <p>we're working with google to resolve the review delay. we'll announce on our website and social media as soon as the update is approved.</p>
          </div>
        </div>
        <div className="support-section">
          <h2>need help?</h2>
          <p>if you have any issues with installation or the app itself, please reach out to our support team.</p>
          <a href="/contact" className="support-link">
            contact support
          </a>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default DownloadApk
