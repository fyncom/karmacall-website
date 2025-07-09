import React from "react"

/**
 * UTM Parameter Wiping Utility
 * Removes UTM parameters from the URL after analytics tracking is complete
 * This provides a cleaner user experience while preserving tracking data
 */

// List of UTM parameters to remove
const UTM_PARAMETERS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
]

// Additional tracking parameters that should be cleaned
const TRACKING_PARAMETERS = [
  "fbclid", // Facebook Click ID
  "gclid", // Google Click ID
  "msclkid", // Microsoft Click ID
  "twclid", // Twitter Click ID
  "li_fat_id", // LinkedIn First Party Ad Tracking
  "mc_eid", // Mailchimp Email ID
  "_hsenc", // HubSpot Encoded
  "_hsmi", // HubSpot Marketing
  "vero_conv", // Vero Conversion
  "vero_id", // Vero ID
  "wickedid", // Wicked Reports
  "yclid", // Yandex Click ID
  "ttclid", // TikTok Click ID
  "rdt_cid", // Reddit Click ID
  "srsltid", // Google Shopping Click ID
]

/**
 * Checks if the current URL contains UTM or tracking parameters
 * @returns {boolean} True if UTM/tracking parameters are present
 */
export const hasTrackingParameters = () => {
  if (typeof window === "undefined") return false

  const urlParams = new URLSearchParams(window.location.search)
  const allTrackingParams = [...UTM_PARAMETERS, ...TRACKING_PARAMETERS]

  return allTrackingParams.some(param => urlParams.has(param))
}

/**
 * Extracts UTM and tracking parameters from the current URL
 * @returns {object} Object containing all tracking parameters and their values
 */
export const extractTrackingParameters = () => {
  if (typeof window === "undefined") return {}

  const urlParams = new URLSearchParams(window.location.search)
  const trackingData = {}
  const allTrackingParams = [...UTM_PARAMETERS, ...TRACKING_PARAMETERS]

  allTrackingParams.forEach(param => {
    if (urlParams.has(param)) {
      trackingData[param] = urlParams.get(param)
    }
  })

  return trackingData
}

/**
 * Removes UTM and tracking parameters from the URL
 * @param {object} options - Configuration options
 * @param {boolean} options.preserveOtherParams - Whether to preserve non-tracking parameters
 * @param {boolean} options.updateHistory - Whether to update browser history
 * @param {function} options.onComplete - Callback function after URL is cleaned
 */
export const wipeTrackingParameters = (options = {}) => {
  if (typeof window === "undefined") return

  const { preserveOtherParams = true, updateHistory = true, onComplete = null } = options

  // Check if we have tracking parameters to remove
  if (!hasTrackingParameters()) {
    console.log("UTM Wiper: No tracking parameters found to remove")
    if (onComplete) onComplete(false)
    return
  }

  // Extract tracking data before removal (for potential use)
  const trackingData = extractTrackingParameters()
  console.log("UTM Wiper: Extracted tracking data:", trackingData)

  // Build clean URL
  const currentUrl = new URL(window.location.href)
  const cleanParams = new URLSearchParams()

  if (preserveOtherParams) {
    // Keep non-tracking parameters
    const allTrackingParams = [...UTM_PARAMETERS, ...TRACKING_PARAMETERS]
    currentUrl.searchParams.forEach((value, key) => {
      if (!allTrackingParams.includes(key)) {
        cleanParams.append(key, value)
      }
    })
  }

  // Construct clean URL
  const cleanUrl = `${currentUrl.origin}${currentUrl.pathname}${cleanParams.toString() ? "?" + cleanParams.toString() : ""}${currentUrl.hash}`

  console.log("UTM Wiper: Cleaning URL from:", window.location.href)
  console.log("UTM Wiper: Cleaning URL to:", cleanUrl)

  // Update the URL without reloading the page
  if (updateHistory) {
    try {
      window.history.replaceState({ ...window.history.state, utmWiped: true }, document.title, cleanUrl)
      console.log("UTM Wiper: URL successfully cleaned")
    } catch (error) {
      console.error("UTM Wiper: Error updating URL:", error)
    }
  }

  // Call completion callback
  if (onComplete) onComplete(true, trackingData)
}

/**
 * Automatically wipes UTM parameters after analytics tracking is complete
 * @param {number} delay - Delay in milliseconds before wiping (default: 2000ms)
 * @param {object} options - Options to pass to wipeTrackingParameters
 */
export const autoWipeAfterTracking = (delay = 2000, options = {}) => {
  if (typeof window === "undefined") return

  // Only wipe if we have tracking parameters
  if (!hasTrackingParameters()) {
    console.log("UTM Wiper: No tracking parameters to auto-wipe")
    return
  }

  console.log(`UTM Wiper: Scheduling auto-wipe in ${delay}ms`)

  // Wait for analytics to process, then clean URL
  setTimeout(() => {
    wipeTrackingParameters({
      ...options,
      onComplete: (success, trackingData) => {
        if (success) {
          console.log("UTM Wiper: Auto-wipe completed successfully")

          // Dispatch custom event for other components to listen to
          window.dispatchEvent(
            new CustomEvent("utmParametersWiped", {
              detail: { trackingData },
            })
          )
        }

        // Call original completion callback if provided
        if (options.onComplete) {
          options.onComplete(success, trackingData)
        }
      },
    })
  }, delay)
}

/**
 * React hook for UTM parameter wiping
 * @param {object} options - Configuration options
 * @returns {object} Object with wiping functions and state
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
export const useUtmWiper = (options = {}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [hasParams, setHasParams] = React.useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isWiped, setIsWiped] = React.useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [trackingData, setTrackingData] = React.useState({})

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const hasTrackingParams = hasTrackingParameters()
    setHasParams(hasTrackingParams)

    if (hasTrackingParams) {
      const data = extractTrackingParameters()
      setTrackingData(data)

      // Auto-wipe if enabled
      if (options.autoWipe !== false) {
        autoWipeAfterTracking(options.delay || 2000, {
          ...options,
          onComplete: (success, data) => {
            if (success) {
              setIsWiped(true)
              setHasParams(false)
            }
            if (options.onComplete) {
              options.onComplete(success, data)
            }
          },
        })
      }
    }
  }, [])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const manualWipe = React.useCallback(() => {
    wipeTrackingParameters({
      ...options,
      onComplete: (success, data) => {
        if (success) {
          setIsWiped(true)
          setHasParams(false)
        }
        if (options.onComplete) {
          options.onComplete(success, data)
        }
      },
    })
  }, [options])

  return {
    hasTrackingParameters: hasParams,
    isWiped,
    trackingData,
    wipeNow: manualWipe,
  }
}

/**
 * Initialize UTM wiping for the current page
 * This should be called in gatsby-browser.js or similar entry point
 */
export const initializeUtmWiper = () => {
  if (typeof window === "undefined") return

  // Auto-wipe on page load
  autoWipeAfterTracking(2000)

  // Also wipe on route changes (for SPAs)
  const handleRouteChange = () => {
    // Small delay to allow new tracking to fire
    setTimeout(() => {
      autoWipeAfterTracking(1000)
    }, 100)
  }

  // Listen for route changes (Gatsby/React Router)
  window.addEventListener("popstate", handleRouteChange)

  // Listen for manual navigation
  const originalPushState = window.history.pushState
  const originalReplaceState = window.history.replaceState

  window.history.pushState = function (...args) {
    originalPushState.apply(window.history, args)
    handleRouteChange()
  }

  window.history.replaceState = function (...args) {
    originalReplaceState.apply(window.history, args)
    handleRouteChange()
  }

  console.log("UTM Wiper: Initialized for automatic parameter cleaning")
}

export default {
  hasTrackingParameters,
  extractTrackingParameters,
  wipeTrackingParameters,
  autoWipeAfterTracking,
  useUtmWiper,
  initializeUtmWiper,
}
