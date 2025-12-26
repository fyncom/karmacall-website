import { useState, useEffect } from "react"

/**
 * Custom hook for detecting user's platform and device
 * Returns detailed platform information including OS, device type, and browser
 *
 * @returns {Object} Platform detection object with boolean flags
 */
export const usePlatformDetection = () => {
  const [platform, setPlatform] = useState({
    isIOS: false,           // iPhone, iPad, iPod only
    isMac: false,           // macOS/Macintosh
    isApple: false,         // iOS + Mac combined (for hiding Android-specific content)
    isAndroid: false,       // Android devices
    isWindows: false,       // Windows OS
    isLinux: false,         // Linux OS
    browser: null,          // Browser name (Chrome, Firefox, Safari, Edge, Opera, etc.)
    isClient: false,        // Whether code is running client-side (not SSR)
  })

  useEffect(() => {
    // Ensure this only runs in browser
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()

      // Detect iOS devices (iPhone, iPad, iPod)
      const isIOSDevice = /iphone|ipod|ipad/i.test(userAgent) && !window.MSStream

      // Detect macOS/Macintosh
      const isMacDevice = /macintosh|macintel|macppc|mac68k/i.test(userAgent) && !window.MSStream

      // Detect Android devices
      const isAndroidDevice = /android/i.test(userAgent)

      // Detect Windows OS
      const isWindowsDevice = /windows|win32|win64/i.test(userAgent)

      // Detect Linux OS (excluding Android)
      const isLinuxDevice = /linux/i.test(userAgent) && !isAndroidDevice

      // Detect browser
      let detectedBrowser = null
      if (userAgent.includes("firefox/")) {
        detectedBrowser = "Firefox"
      } else if (userAgent.includes("edg/")) {
        detectedBrowser = "Edge"
      } else if (userAgent.includes("chrome/") && !userAgent.includes("edg/")) {
        detectedBrowser = "Chrome"
      } else if (userAgent.includes("safari/") && !userAgent.includes("chrome/")) {
        detectedBrowser = "Safari"
      } else if (userAgent.includes("opr/") || userAgent.includes("opera/")) {
        detectedBrowser = "Opera"
      } else if (userAgent.includes("brave/")) {
        detectedBrowser = "Brave"
      }

      setPlatform({
        isIOS: isIOSDevice,
        isMac: isMacDevice,
        isApple: isIOSDevice || isMacDevice,
        isAndroid: isAndroidDevice,
        isWindows: isWindowsDevice,
        isLinux: isLinuxDevice,
        browser: detectedBrowser,
        isClient: true,
      })
    }
  }, [])

  return platform
}

/**
 * Non-hook version for use in non-React contexts
 * Returns the same platform detection object but as a one-time calculation
 */
export const getPlatformInfo = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isIOS: false,
      isMac: false,
      isApple: false,
      isAndroid: false,
      isWindows: false,
      isLinux: false,
      browser: null,
      isClient: false,
    }
  }

  const userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()

  const isIOSDevice = /iphone|ipod|ipad/i.test(userAgent) && !window.MSStream
  const isMacDevice = /macintosh|macintel|macppc|mac68k/i.test(userAgent) && !window.MSStream
  const isAndroidDevice = /android/i.test(userAgent)
  const isWindowsDevice = /windows|win32|win64/i.test(userAgent)
  const isLinuxDevice = /linux/i.test(userAgent) && !isAndroidDevice

  let detectedBrowser = null
  if (userAgent.includes("firefox/")) {
    detectedBrowser = "Firefox"
  } else if (userAgent.includes("edg/")) {
    detectedBrowser = "Edge"
  } else if (userAgent.includes("chrome/") && !userAgent.includes("edg/")) {
    detectedBrowser = "Chrome"
  } else if (userAgent.includes("safari/") && !userAgent.includes("chrome/")) {
    detectedBrowser = "Safari"
  } else if (userAgent.includes("opr/") || userAgent.includes("opera/")) {
    detectedBrowser = "Opera"
  } else if (userAgent.includes("brave/")) {
    detectedBrowser = "Brave"
  }

  return {
    isIOS: isIOSDevice,
    isMac: isMacDevice,
    isApple: isIOSDevice || isMacDevice,
    isAndroid: isAndroidDevice,
    isWindows: isWindowsDevice,
    isLinux: isLinuxDevice,
    browser: detectedBrowser,
    isClient: true,
  }
}
