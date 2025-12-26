const shouldEnableAnalytics = () => {
  return process.env.NODE_ENV === "production" || process.env.GATSBY_DEBUG_MODE === "true"
}

const ensureGtagBase = () => {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
  }
}

const loadScript = (id, src) => {
  if (typeof document === "undefined") return null
  const existing = document.getElementById(id)
  if (existing) return existing

  const script = document.createElement("script")
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
  return script
}

const initGoogleAnalytics = () => {
  const gaId = process.env.GATSBY_GOOGLE_TAG_ID
  if (!gaId) return

  ensureGtagBase()
  loadScript("ga-gtag", `https://www.googletagmanager.com/gtag/js?id=${gaId}`)

  window.gtag("js", new Date())
  window.gtag("config", gaId, {
    anonymize_ip: true,
    cookie_flags: "samesite=none;secure",
  })
}

const initFacebookPixel = () => {
  const pixelId = process.env.GATSBY_FACEBOOK_PIXEL
  if (!pixelId || typeof window === "undefined") return

  if (!window.fbq) {
    const fbq = function () {
      fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments)
    }
    fbq.queue = []
    fbq.version = "2.0"
    window.fbq = fbq
    window._fbq = fbq
    loadScript("fb-pixel", "https://connect.facebook.net/en_US/fbevents.js")
  }

  if (window.__fbConsent) {
    window.fbq("consent", window.__fbConsent)
  }

  window.fbq("init", pixelId)
  window.fbq("track", "PageView")
}

const initPosthog = async () => {
  const apiKey = process.env.GATSBY_POSTHOG_API_KEY
  if (!apiKey || typeof window === "undefined") return

  const { default: posthog } = await import("posthog-js")
  posthog.init(apiKey, {
    api_host: `${window.location.origin}/ph`,
    capture_exceptions: true,
    capture_pageview: "history_change",
    disable_session_recording: true,
    disable_surveys: true,
    disable_surveys_automatic_display: true,
    debug: process.env.NODE_ENV === "development",
  })
}

let analyticsLoadPromise = null

export const loadAnalytics = () => {
  if (!shouldEnableAnalytics() || typeof window === "undefined") return Promise.resolve(false)
  if (analyticsLoadPromise) return analyticsLoadPromise

  analyticsLoadPromise = Promise.resolve()
    .then(() => {
      initGoogleAnalytics()
      initFacebookPixel()
      return initPosthog()
    })
    .catch(() => false)

  return analyticsLoadPromise
}

export const scheduleAnalyticsLoad = () => {
  if (!shouldEnableAnalytics() || typeof window === "undefined") return
  if (window.__analyticsLoadScheduled) return
  window.__analyticsLoadScheduled = true

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => loadAnalytics(), { timeout: 3000 })
  } else {
    setTimeout(() => loadAnalytics(), 2000)
  }
}

export const trackPageView = path => {
  if (!shouldEnableAnalytics() || typeof window === "undefined") return
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path || window.location.pathname,
    })
  }
  if (window.fbq) {
    window.fbq("track", "PageView")
  }
}
