import React, { useCallback, useEffect, useState } from "react"
import ClientOnly from "./ClientOnly"
import { applyConsentPreferences, setConsentDefaults } from "../utils/analyticsLoader"
import "./cookie-consent.css"

const STORAGE_KEY = "karmacall_cookie_preferences"
const CONSENT_VERSION = 1

const defaultPreferences = {
  essential: true,
  functional: false,
  performance: false,
  marketing: false,
}

const normalizePreferences = preferences => {
  if (!preferences || typeof preferences !== "object") {
    return { ...defaultPreferences }
  }

  return {
    essential: true,
    functional: Boolean(preferences.functional),
    performance: Boolean(preferences.performance),
    marketing: Boolean(preferences.marketing),
  }
}

const readStoredPreferences = () => {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    const preferences = parsed.preferences || parsed
    return normalizePreferences(preferences)
  } catch (error) {
    return null
  }
}

const saveStoredPreferences = preferences => {
  if (typeof window === "undefined") return
  const payload = {
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
    preferences: normalizePreferences(preferences),
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const CookieConsentManager = () => {
  const [isBannerOpen, setIsBannerOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [preferences, setPreferences] = useState(defaultPreferences)
  const [draftPreferences, setDraftPreferences] = useState(defaultPreferences)
  const [hasStoredPreferences, setHasStoredPreferences] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    setConsentDefaults()

    const storedPreferences = readStoredPreferences()
    if (storedPreferences) {
      setPreferences(storedPreferences)
      setDraftPreferences(storedPreferences)
      setHasStoredPreferences(true)
      applyConsentPreferences(storedPreferences)
    } else {
      setHasStoredPreferences(false)
      setIsBannerOpen(true)
    }
  }, [])

  const openModal = useCallback(() => {
    setDraftPreferences(preferences)
    setIsModalOpen(true)
    setIsBannerOpen(false)
  }, [preferences])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    if (!hasStoredPreferences) {
      setIsBannerOpen(true)
    }
  }, [hasStoredPreferences])

  useEffect(() => {
    if (typeof window === "undefined") return
    const handleOpen = () => openModal()
    window.addEventListener("open-cookie-preferences", handleOpen)
    window.__openCookiePreferences = handleOpen

    return () => {
      window.removeEventListener("open-cookie-preferences", handleOpen)
      if (window.__openCookiePreferences === handleOpen) {
        delete window.__openCookiePreferences
      }
    }
  }, [openModal])

  useEffect(() => {
    if (!isModalOpen || typeof document === "undefined") return
    const handleKeydown = event => {
      if (event.key === "Escape") {
        setIsModalOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeydown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeydown)
      document.body.style.overflow = previousOverflow
    }
  }, [isModalOpen])

  const applyAndPersist = nextPreferences => {
    const normalized = normalizePreferences(nextPreferences)
    setPreferences(normalized)
    setDraftPreferences(normalized)
    saveStoredPreferences(normalized)
    setHasStoredPreferences(true)
    applyConsentPreferences(normalized)
    setIsBannerOpen(false)
    setIsModalOpen(false)
  }

  const handleAcceptAll = () => {
    applyAndPersist({
      ...defaultPreferences,
      functional: true,
      performance: true,
      marketing: true,
    })
  }

  const handleRejectAll = () => {
    applyAndPersist({
      ...defaultPreferences,
      functional: false,
      performance: false,
      marketing: false,
    })
  }

  const handleSavePreferences = () => {
    applyAndPersist(draftPreferences)
  }

  const handleToggle = key => {
    setDraftPreferences(current => ({
      ...current,
      [key]: !current[key],
    }))
  }

  if (!isBannerOpen && !isModalOpen) {
    return null
  }

  return (
    <ClientOnly>
      <div className="cookie-consent-root">
        {isBannerOpen && (
          <div className="cc-banner" role="dialog" aria-label="Cookie preferences">
            <div className="cc-banner-text">
              <h2>Cookie preferences</h2>
              <p>
                We use essential cookies to run the site and optional cookies for performance, marketing, and account
                convenience. Choose what you want to allow.
              </p>
              <p className="cc-banner-links">
                <a href="/privacy-policy">Privacy policy</a>
              </p>
            </div>
            <div className="cc-banner-actions">
              <button type="button" className="cc-button cc-button-ghost" onClick={handleRejectAll}>
                Reject non-essential
              </button>
              <button type="button" className="cc-button cc-button-secondary" onClick={openModal}>
                Customize
              </button>
              <button type="button" className="cc-button cc-button-primary" onClick={handleAcceptAll}>
                Accept all
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="cc-modal-backdrop" role="presentation" onClick={closeModal}>
            <div
              className="cc-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cc-modal-title"
              onClick={event => event.stopPropagation()}
            >
              <div className="cc-modal-header">
                <div>
                  <p className="cc-modal-eyebrow">Your choices</p>
                  <h2 id="cc-modal-title">Cookie preferences</h2>
                </div>
                <button type="button" className="cc-icon-button" onClick={closeModal} aria-label="Close preferences">
                  <span aria-hidden="true">x</span>
                </button>
              </div>
              <p className="cc-modal-intro">
                Choose which cookies we can use. You can update these settings any time from the footer.
              </p>

              <div className="cc-category-list">
                <div className="cc-category cc-category-essential">
                  <div>
                    <h3>Essential</h3>
                    <p>Required for core site functions like security, load balancing, and form submissions.</p>
                  </div>
                  <div className="cc-toggle">
                    <input type="checkbox" checked readOnly disabled />
                    <span className="cc-toggle-slider" aria-hidden="true" />
                    <span className="cc-toggle-state">Always on</span>
                  </div>
                </div>

                <div className="cc-category">
                  <div>
                    <h3>Functional</h3>
                    <p>Remember login convenience and saved preferences for your account.</p>
                  </div>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={draftPreferences.functional}
                      onChange={() => handleToggle("functional")}
                    />
                    <span className="cc-toggle-slider" aria-hidden="true" />
                    <span className="cc-sr-only">Toggle functional cookies</span>
                  </label>
                </div>

                <div className="cc-category">
                  <div>
                    <h3>Performance</h3>
                    <p>Help us improve the site with analytics and session replay (Google Analytics + PostHog).</p>
                  </div>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={draftPreferences.performance}
                      onChange={() => handleToggle("performance")}
                    />
                    <span className="cc-toggle-slider" aria-hidden="true" />
                    <span className="cc-sr-only">Toggle performance cookies</span>
                  </label>
                </div>

                <div className="cc-category">
                  <div>
                    <h3>Marketing</h3>
                    <p>Measure campaigns and audiences (Facebook Pixel).</p>
                  </div>
                  <label className="cc-toggle">
                    <input
                      type="checkbox"
                      checked={draftPreferences.marketing}
                      onChange={() => handleToggle("marketing")}
                    />
                    <span className="cc-toggle-slider" aria-hidden="true" />
                    <span className="cc-sr-only">Toggle marketing cookies</span>
                  </label>
                </div>
              </div>

              <div className="cc-modal-actions">
                <button type="button" className="cc-button cc-button-ghost" onClick={handleRejectAll}>
                  Reject non-essential
                </button>
                <button type="button" className="cc-button cc-button-secondary" onClick={handleSavePreferences}>
                  Save preferences
                </button>
                <button type="button" className="cc-button cc-button-primary" onClick={handleAcceptAll}>
                  Accept all
                </button>
              </div>
              <p className="cc-modal-footer">
                Read our <a href="/privacy-policy">privacy policy</a> for details.
              </p>
            </div>
          </div>
        )}
      </div>
    </ClientOnly>
  )
}

export default CookieConsentManager
