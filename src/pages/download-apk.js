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
          <p className="subtitle">Get the latest version with critical updates</p>
        </div>
        <div className="situation-notice">
          <div className="notice-header">
            <FaExclamationTriangle className="warning-icon" />
            <h2>Why We're Offering Direct Downloads</h2>
          </div>
          <p>
            Our google play app update has been in review for <strong>140 days</strong>. This is highly abnormal, and we're actively working with google to
            resolve this issue.
          </p>
          <p>
            The current version in the google play store has a critical bug: <strong>it blocks texts from everyone</strong>, not just unknown senders. This
            makes the app frustrating to use for text messaging.
          </p>
          <p>
            We've fixed this issue and added several important features in the versions below. Rather than wait indefinitely, we're making these updates
            available for direct download so you can enjoy the app as it was meant to be.
          </p>
        </div>
        <div className="updates-container">
          <h2>What's New in These Updates</h2>
          <div className="version-updates">
            <div className="version-card">
              <div className="version-header">
                <h3>v4.9.69 (306)</h3>
              </div>
              <div className="version-content">
                <FaCheckCircle className="check-icon" />
                <p>Fixed issue for contacts texts notifications. Works as expected now.</p>
              </div>
            </div>
            <div className="version-card">
              <div className="version-header">
                <h3>v4.9.70 (307)</h3>
              </div>
              <div className="version-content">
                <FaCheckCircle className="check-icon" />
                <p>Added sounds to blocked notifications & localized some notification strings</p>
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
                  Added new graylisting features, which is default "on". Now, people you call, who are not contacts or KarmaCallers can call you back without
                  being blocked.
                </p>
                <p>
                  <strong>Android 11 and lower:</strong> Fixed bug that caused active call to be ended when an incoming blocked call arrives. Added a "Protect
                  Active Call" setting.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="download-section">
          <h2>Download the APK</h2>
          <p className="download-instructions">
            Click the button below to download the latest version of KarmaCall. You'll need to enable installation from unknown sources in your Android
            settings.
          </p>
          <a href="https://github.com/FynCom/KarmaCall-android/releases/latest/download/app-release.apk" className="download-button" download>
            <FaDownload className="download-icon" />
            Download KarmaCall v4.9.71
          </a>
          <p className="file-info">APK file • Android 10 or higher required</p>
        </div>
        <div className="installation-guide">
          <h2>How to Install</h2>
          <ol className="install-steps">
            <li>
              <strong>Download the APK</strong>
              <p>Tap the download button above to save the APK file to your device</p>
            </li>
            <li>
              <strong>Enable Unknown Sources</strong>
              <p>Go to Settings → Security → Enable "Install Unknown Apps" for your browser or file manager</p>
            </li>
            <li>
              <strong>Install the App</strong>
              <p>Open the downloaded APK file and follow the installation prompts</p>
            </li>
            <li>
              <strong>Grant Permissions</strong>
              <p>Allow the necessary permissions for KarmaCall to block spam calls and texts</p>
            </li>
          </ol>
        </div>
        <div className="faq-section">
          <h2>Common Questions</h2>
          <div className="faq-item">
            <h3>Is This Safe?</h3>
            <p>
              Yes! This is the official KarmaCall APK, signed with our developer certificate. It's the exact same app that will eventually be on the Google Play
              Store once the review is complete.
            </p>
          </div>
          <div className="faq-item">
            <h3>Will I Get Automatic Updates?</h3>
            <p>
              No, sideloaded apps don't update automatically. You'll need to check back here or follow our social media for new versions. Once the Google Play
              Store version is updated, you can switch back to that for automatic updates.
            </p>
          </div>
          <div className="faq-item">
            <h3>Can I Install This Over the Play Store Version?</h3>
            <p>
              Yes! Since this is signed with the same certificate, you can install it directly over your existing KarmaCall installation without losing your
              data or settings.
            </p>
          </div>
          <div className="faq-item">
            <h3>When Will the Play Store Be Updated?</h3>
            <p>We're working with Google to resolve the review delay. We'll announce on our website and social media as soon as the update is approved.</p>
          </div>
        </div>
        <div className="support-section">
          <h2>Need Help?</h2>
          <p>If you have any issues with installation or the app itself, please reach out to our support team.</p>
          <a href="/contact" className="support-link">
            Contact Support
          </a>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default DownloadApk
