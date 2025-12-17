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
            Our Google Play app update has been in review for <strong>140 days</strong>. We have never had this issue and are{" "}
            <a href="https://support.google.com/googleplay/android-developer/thread/363840973" target="_blank" rel="noopener noreferrer">
              actively working with Google
            </a>
            &nbsp;to resolve this issue.
          </p>
          <p>
            The current version in the Google Play store has a critical bug: <strong>it blocks texts from everyone</strong>, not just unknown senders. This
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
            <div className="version-card">
              <div className="version-header">
                <h3>v4.9.71 (308)</h3>
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
            <div className="version-card featured-version">
              <div className="version-header">
                <h3>v4.9.72 (309)</h3>
                <span className="latest-badge">latest</span>
              </div>
              <div className="version-content">
                <FaCheckCircle className="check-icon" />
                <p>
                  Fixed a sneaky notification bug: if you had several text notifications from friends, then got one spam text, all your notifications would
                  vanish. Why? Android groups notifications together. Block the group leader, and everyone goes with it.
                </p>
                <p>Now fixed - your real text notifications stay put while spam gets blocked.</p>
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
          <a href="/KarmaCall-V4972-309.apk" className="download-button" download>
            <FaDownload className="download-icon" />
            Download KarmaCall v4.9.72
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
              <p>
                Search "Install Unknown Apps" in your Android phone, select it and enable "My Files" since the downloaded APK file will be saved in your
                "Downloads" folder. You can also enable your browser to install unknown apps - we recommend using your file manager to install the APK.
              </p>
              {/* <p>
                Another way to enable this, is to go to Settings → Security & Privacy → More security settings → Enable "Install Unknown Apps" for your browser
                or file manager
              </p> */}
            </li>
            <li>
              <strong>Uninstall the Google Play Version (If Installed)</strong>
              <p>
                If you last downloaded the Google Play version, you'll need to uninstall the KarmaCall app first. If you have already installed a KarmaCall APK
                from our site, you don't need to do this. Search for "KarmaCall" in your Android phone, long press on the app &* select "Uninstall". Your
                account data is safely stored on our servers, so you won't lose anything.
              </p>
            </li>
            <li>
              <strong>Install the KarmaCall APK</strong>
              <p>
                Open the downloaded KarmaCall APK file and follow the installation prompts. If prompted by Google Play Protect, you can safely scan the APK - it
                will pass verification.
              </p>
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
            <h3>Do I Need to Uninstall the Play Store Version First?</h3>
            <p>
              Yes, but if you have already installed a KarmaCall APK from our site, you don't need to do this - you can install the next latest APK and it will
              install right over the old one like normal. Otherwise, if you have the Google Play version, you will need to uninstall it before installing this
              APK due to package name conflicts. Don't worry - your account data (balance, settings, contacts) is stored on our servers, so you won't lose
              anything. Just log back in after installing.
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
