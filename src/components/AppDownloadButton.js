import React, { useEffect, useState } from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import { useCombinedQuery } from "./useCombinedQuery"
import ReactGA from "react-ga4"

const AppDownloadButton = ({ className = "", style = {} }) => {
  const { appStoreBadge, googlePlayBadge } = useCombinedQuery()
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // Handle analytics tracking
  const handleAndroidClick = () => {
    ReactGA.event({
      category: "App Store",
      action: "Play Store Visit",
      label: "Cash Out Page Play Store Button",
    })
  }

  const handleIOSClick = () => {
    ReactGA.event({
      category: "App Store",
      action: "App Store Visit",
      label: "Cash Out Page App Store Button",
    })
  }

  useEffect(() => {
    // Ensure this only runs in browser
    setIsClient(true)
    
    // Detect platform
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase()
      
      // Check for iOS devices
      const isIOSDevice = /iphone|ipad|ipod|macintosh/.test(userAgent) && 
                         !window.MSStream // Exclude IE11
      
      // Check for Android devices
      const isAndroidDevice = /android/.test(userAgent)
      
      setIsIOS(isIOSDevice)
      setIsAndroid(isAndroidDevice)
      
      console.log("[DEBUG] AppDownloadButton - Device detection:", {
        userAgent,
        isIOS: isIOSDevice,
        isAndroid: isAndroidDevice
      })
    }
  }, [])

  // Render a consistent skeleton during SSR to prevent hydration mismatch
  // This ensures the server and initial client render match exactly
  if (!isClient) {
    return (
      <div className={`app-download-section ${className}`} style={style}>
        <h3>Download Our App for a Better Experience</h3>
        <div className="app-store-row">
          {/* Render both buttons in a hidden state during SSR to match DOM structure */}
          <div style={{ visibility: "hidden" }}>
            <a className="store-button">
              <div className="app-img-index gatsby-image-wrapper"></div>
            </a>
            <a className="store-button">
              <div className="app-img-index gatsby-image-wrapper"></div>
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Client-side render with platform detection
  return (
    <div className={`app-download-section ${className}`} style={style}>
      <h3>Download Our App for a Better Experience</h3>
      <div className="app-store-row">
        {/* If we can't determine the platform or it's Android, show Play Store */}
        {(isAndroid || (!isIOS && !isAndroid)) && (
          <a href="https://play.google.com/store/apps/details?id=com.fyncom.robocash" onClick={handleAndroidClick} className="store-button">
            <GatsbyImage className="app-img-index" image={googlePlayBadge} alt="Get KarmaCall on Google Play" />
          </a>
        )}

        {/* If we can't determine the platform or it's iOS, show App Store */}
        {(isIOS || (!isIOS && !isAndroid)) && (
          <a href="https://apps.apple.com/us/app/karmacall/id1574524278" onClick={handleIOSClick} className="store-button">
            <GatsbyImage className="app-img-index" image={appStoreBadge} alt="Download KarmaCall on the App Store" />
          </a>
        )}
      </div>
    </div>
  )
}

export default AppDownloadButton
