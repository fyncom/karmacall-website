import React, { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import ClientOnly from "./ClientOnly";

const EEA_COUNTRIES = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE", 
];

// Function to initialize all tracking tools
const initializeTracking = () => {
  if (typeof window === "undefined") return;
  
  // Enable Google Consent Mode
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){window.dataLayer.push(arguments);};
  window.gtag('consent', 'update', {
    'ad_storage': 'granted',
    'analytics_storage': 'granted'
  });
  
  // Enable Facebook Pixel
  if (window.fbq) {
    window.fbq('consent', 'grant');
  }
};

// Function to disable tracking for users who reject consent
const disableTracking = () => {
  if (typeof window === "undefined") return;
  
  // Disable Google Analytics
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){window.dataLayer.push(arguments);};
  window.gtag('consent', 'update', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied'
  });
  
  // Disable Hotjar recording if it exists
  if (window._hjSettings && window.hj) {
    window.hj('config', window._hjSettings.hjid, { session_recording: false });
  }
  
  // Disable Facebook Pixel
  if (window.fbq) {
    window.fbq('consent', 'revoke');
  }
};

const CookieConsentEEA = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEEA, setIsEEA] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Set default consent mode for Google Analytics
    // This will be overridden based on user location and consent
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    window.gtag('consent', 'default', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied',
      'wait_for_update': 500
    });

    // Initialize Hotjar immediately for all users
    // This ensures we capture user interactions from the start
    if (window._hjSettings) {
      window.hj = window.hj || function(){(window.hj.q = window.hj.q || []).push(arguments)};
      window.hj('config', window._hjSettings.hjid, { session_recording: true });
    }

    // Check if consent already given
    const consentStatus = localStorage.getItem("cookie_consent_eea");
    
    if (consentStatus) {
      // If consent was previously given, enable tracking accordingly
      if (consentStatus === "accepted" || consentStatus === "non_eea_user") {
        initializeTracking();
      } else if (consentStatus === "rejected") {
        // If previously rejected, disable all tracking including Hotjar recording
        disableTracking();
      }
      setLoading(false);
      return;
    }

    // Fetch geolocation to determine if user is in EEA
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data && data.country && EEA_COUNTRIES.includes(data.country)) {
          setIsEEA(true);
          setShowBanner(true);
          // For EEA users, we keep Hotjar recording but disable other tracking until consent
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer.push(arguments);};
          window.gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied'
          });
          
          // Disable Facebook Pixel if it exists
          if (window.fbq) {
            window.fbq('consent', 'revoke');
          }
        } else {
          // For non-EEA users, initialize all tracking without asking for consent
          initializeTracking();
          // Store that we've checked this user and they're non-EEA
          localStorage.setItem("cookie_consent_eea", "non_eea_user");
        }
      })
      .catch(() => {
        // On error, default to not showing banner and enabling tracking
        // This is a fallback in case geolocation fails
        initializeTracking();
        localStorage.setItem("cookie_consent_eea", "non_eea_user");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem("cookie_consent_eea", "accepted");
    initializeTracking();
  };

  const handleCookieDecline = () => {
    localStorage.setItem("cookie_consent_eea", "rejected");
    disableTracking();
  };

  if (!showBanner || loading) return null;

  return (
    <ClientOnly>
      <CookieConsent
        enableDeclineButton
        flipButtons
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        cookieName="karmacall-marketing-consent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ background: "#4e9815", color: "#fff", fontSize: "13px" }}
        declineButtonStyle={{ background: "#c12f2f", color: "#fff", fontSize: "13px" }}
        expires={150}
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      >
        This website uses cookies to enhance the user experience and analyze site traffic.
      </CookieConsent>
    </ClientOnly>
  );
};

export default CookieConsentEEA;
