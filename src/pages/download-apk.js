import React, { useState } from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import "../components/download-apk.css"
import Seo from "../components/seo"
import { FaAndroid, FaDownload, FaExclamationTriangle, FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa"

const DownloadApk = () => {
  const [showOlderVersions, setShowOlderVersions] = useState(false)
  return (
    <div>
      <Seo
        title="KarmaCall APK Migration Guide - Switch to Google Play"
        description="KarmaCall is back on Google Play Store! Learn how to migrate from the APK version to the official Google Play version for automatic updates and the best experience."
      />
      <Header />
      <section className="download-apk-section">
        <div className="download-hero">
          <FaAndroid className="android-icon" />
          <h1>KarmaCall APK Migration Guide</h1>
          <p className="subtitle">Switch back to the official Google Play Store version</p>
        </div>
        <div className="situation-notice">
          <div className="notice-header">
            <FaCheckCircle className="warning-icon" style={{color: '#4caf50'}} />
            <h2>🎉 We're Back on Google Play Store!</h2>
          </div>
          <p>
            <strong>Great news!</strong> After months of review, our updated app is now available on the Google Play Store with all the latest features and fixes.
          </p>
          <p>
            If you previously downloaded the KarmaCall APK from our website, we recommend switching back to the official Google Play Store version to receive automatic updates and the best experience.
          </p>
          <p>
            <strong>Important:</strong> To avoid conflicts, you'll need to uninstall the APK version before installing from Google Play. Don't worry - your account data, balance, settings, and contacts are safely stored on our servers and will be restored when you log back in.
          </p>
        </div>
        <div className="download-section">
          <h2>Switch to Google Play Store</h2>
          <p className="download-instructions">
            Click the button below to download KarmaCall from the official Google Play Store.
          </p>
          <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash" className="download-button" target="_blank" rel="noopener noreferrer">
            <FaDownload className="download-icon" />
            Get KarmaCall on Google Play
          </a>
          <p className="file-info">Official version • Automatic updates included</p>
        </div>
        <div className="installation-guide">
          <h2>Migration Instructions</h2>
          <ol className="install-steps">
            <li>
              <strong>Uninstall the APK Version</strong>
              <p>
                First, you need to uninstall the KarmaCall APK that you downloaded from our website. Find the KarmaCall app on your Android phone, long press on it, and select "Uninstall".
                Don't worry - your account data, balance, settings, and contacts are safely stored on our servers and won't be lost.
              </p>
            </li>
            <li>
              <strong>Download from Google Play Store</strong>
              <p>
                Click the "Get KarmaCall on Google Play" button above, or search for "KarmaCall" in the Google Play Store app on your phone.
                Tap "Install" to download the official version.
              </p>
            </li>
            <li>
              <strong>Log Back In</strong>
              <p>
                Open the newly installed KarmaCall app and log in with your existing account credentials. All your data, including your balance, settings, and contacts, will be automatically restored.
              </p>
            </li>
            <li>
              <strong>Grant Permissions</strong>
              <p>
                Make sure to grant all the necessary permissions for KarmaCall to block spam calls and texts, just like you did with the APK version.
              </p>
            </li>
            <li>
              <strong>Enjoy Automatic Updates!</strong>
              <p>
                That's it! You're now on the official Google Play Store version and will receive automatic updates as soon as we release them.
              </p>
            </li>
          </ol>
        </div>
        <div className="faq-section">
          <h2>Common Questions</h2>
          <div className="faq-item">
            <h3>Will I Lose My Data When I Uninstall?</h3>
            <p>
              No! Your account data, balance, settings, and contacts are all safely stored on our servers. When you log back in after installing the Google Play version, everything will be restored automatically.
            </p>
          </div>
          <div className="faq-item">
            <h3>Do I Have to Migrate to Google Play?</h3>
            <p>
              While you can continue using the APK version, we strongly recommend migrating to the Google Play Store version. The Google Play version will receive automatic updates, ensuring you always have the latest features and security fixes without needing to manually download new APK files.
            </p>
          </div>
          <div className="faq-item">
            <h3>What If I Want to Keep the APK Version?</h3>
            <p>
              If you prefer to continue using the APK version, you can keep it installed. However, you won't receive automatic updates and will need to manually download and install new versions from our website when they're released. For the best experience and security, we recommend using the Google Play Store version.
            </p>
          </div>
          <div className="faq-item">
            <h3>What's New in the Google Play Version?</h3>
            <p>
              The Google Play Store version includes all the latest features and fixes that were previously only available through our APK downloads, including improved text blocking, graylisting features, email signup/login for international users, and numerous bug fixes. Plus, you'll get automatic updates going forward!
            </p>
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
