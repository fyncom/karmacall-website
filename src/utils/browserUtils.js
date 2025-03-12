export const getBrowserEnvironment = () => {
  const ua = navigator.userAgent
  let browser = ""
  let os = ""

  // Detect OS
  if (ua.includes("Windows")) {
    os = "Windows"
  } else if (ua.includes("Mac OS")) {
    os = "MacOS"
  } else if (ua.includes("Linux")) {
    os = "Linux"
  } else if (ua.includes("Android")) {
    os = "Android"
  } else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) {
  } else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) {
    os = "iOS"
  } else {
    os = "Unknown OS"
  }

  // Detect Browser
  if (ua.includes("Firefox/")) {
    browser = "Firefox"
  } else if (ua.includes("Chrome/") && !ua.includes("Edg/")) {
    browser = "Chrome"
  } else if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
    browser = "Safari"
  } else if (ua.includes("Edg/")) {
    browser = "Edge"
  } else if (ua.includes("OPR/") || ua.includes("Opera/")) {
    browser = "Opera"
  } else {
    browser = "Unknown Browser"
  }

  return `${os} / ${browser}`
}
