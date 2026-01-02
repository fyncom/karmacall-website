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
  if (!gaId) return false

  ensureGtagBase()
  loadScript("ga-gtag", `https://www.googletagmanager.com/gtag/js?id=${gaId}`)

  window.gtag("js", new Date())
  window.gtag("config", gaId, {
    anonymize_ip: true,
    cookie_flags: "samesite=none;secure",
  })
  return true
}

const initFacebookPixel = () => {
  const pixelId = process.env.GATSBY_FACEBOOK_PIXEL
  if (!pixelId || typeof window === "undefined") return false

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
  return true
}

let posthogInstance = null
let posthogReplayEnabled = false

const initPosthog = async ({ enableSessionReplay } = {}) => {
  const apiKey = process.env.GATSBY_POSTHOG_API_KEY
  if (!apiKey || typeof window === "undefined") return null

  const { default: posthog } = await import("posthog-js")
  posthog.init(apiKey, {
    api_host: `${window.location.origin}/ph`,
    capture_exceptions: true,
    capture_pageview: "history_change",
    disable_session_recording: !enableSessionReplay,
    disable_surveys: true,
    disable_surveys_automatic_display: true,
    debug: process.env.NODE_ENV === "development",
  })
  posthogInstance = posthog
  posthogReplayEnabled = Boolean(enableSessionReplay)
  if (!enableSessionReplay && posthog.stopSessionRecording) {
    posthog.stopSessionRecording()
  }
  return posthog
}

let gaLoadPromise = null
let fbLoadPromise = null
let posthogLoadPromise = null

const loadGoogleAnalytics = () => {
  if (gaLoadPromise) return gaLoadPromise
  gaLoadPromise = Promise.resolve()
    .then(() => initGoogleAnalytics())
    .catch(() => false)
  return gaLoadPromise
}

const loadFacebookPixel = () => {
  if (fbLoadPromise) return fbLoadPromise
  fbLoadPromise = Promise.resolve()
    .then(() => initFacebookPixel())
    .catch(() => false)
  return fbLoadPromise
}

const updatePosthogSessionReplay = enableSessionReplay => {
  if (!posthogInstance || typeof enableSessionReplay !== "boolean") return
  if (enableSessionReplay && posthogInstance.startSessionRecording) {
    posthogInstance.startSessionRecording()
  }
  if (!enableSessionReplay && posthogInstance.stopSessionRecording) {
    posthogInstance.stopSessionRecording()
  }
  posthogReplayEnabled = enableSessionReplay
}

const loadPosthog = ({ enableSessionReplay } = {}) => {
  if (posthogLoadPromise) {
    if (typeof enableSessionReplay === "boolean" && enableSessionReplay !== posthogReplayEnabled) {
      updatePosthogSessionReplay(enableSessionReplay)
    }
    return posthogLoadPromise
  }
  posthogLoadPromise = Promise.resolve(initPosthog({ enableSessionReplay })).catch(() => null)
  return posthogLoadPromise
}

export const loadAnalytics = ({ performance = false, marketing = false, enableSessionReplay = false } = {}) => {
  if (!shouldEnableAnalytics() || typeof window === "undefined") return Promise.resolve(false)
  const loads = []
  if (performance) {
    loads.push(loadGoogleAnalytics())
    loads.push(loadPosthog({ enableSessionReplay }))
  }
  if (marketing) {
    loads.push(loadFacebookPixel())
  }
  if (!loads.length) return Promise.resolve(false)
  return Promise.all(loads)
    .then(() => true)
    .catch(() => false)
}

export const scheduleAnalyticsLoad = ({ performance = false, marketing = false, enableSessionReplay = false } = {}) => {
  if (!shouldEnableAnalytics() || typeof window === "undefined") return
  const triggerLoad = () => loadAnalytics({ performance, marketing, enableSessionReplay })

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => triggerLoad(), { timeout: 3000 })
  } else {
    setTimeout(() => triggerLoad(), 2000)
  }
}

export const setConsentDefaults = () => {
  if (typeof window === "undefined") return
  if (window.__consentDefaultsSet) return
  ensureGtagBase()
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  })
  window.__fbConsent = "revoke"
  window.__consentDefaultsSet = true
}

const updateGoogleConsent = ({ performance, marketing, functional }) => {
  if (typeof window === "undefined") return
  ensureGtagBase()
  window.gtag("consent", "update", {
    analytics_storage: performance ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
    functionality_storage: functional ? "granted" : "denied",
    security_storage: "granted",
    wait_for_update: 500,
  })
}

const updateFacebookConsent = marketing => {
  if (typeof window === "undefined") return
  window.__fbConsent = marketing ? "grant" : "revoke"
  if (window.fbq) {
    window.fbq("consent", window.__fbConsent)
  }
}

const updatePosthogConsent = (performance, enableSessionReplay) => {
  const instance = posthogInstance || (typeof window !== "undefined" ? window.posthog : null)
  if (!instance || !instance.opt_in_capturing || !instance.opt_out_capturing) return
  if (performance) {
    instance.opt_in_capturing()
    updatePosthogSessionReplay(Boolean(enableSessionReplay))
  } else {
    instance.opt_out_capturing()
    if (instance.stopSessionRecording) {
      instance.stopSessionRecording()
    }
  }
}

export const applyConsentPreferences = ({ performance, marketing, functional }) => {
  updateGoogleConsent({ performance, marketing, functional })
  updateFacebookConsent(marketing)
  updatePosthogConsent(performance, performance)
  scheduleAnalyticsLoad({
    performance,
    marketing,
    enableSessionReplay: performance,
  })
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
