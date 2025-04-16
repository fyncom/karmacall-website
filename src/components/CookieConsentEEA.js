import React, { useEffect, useState } from "react";

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
  
  // Clearbit is typically loaded via script tag and doesn't have a specific consent API
  // It will be loaded normally for all users
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
          
          // Note: Clearbit doesn't have a specific consent API to disable it
          // It will be loaded based on the consent status
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

  const handleConsent = (accepted) => {
    localStorage.setItem("cookie_consent_eea", accepted ? "accepted" : "rejected");
    setShowBanner(false);
    
    if (accepted) {
      initializeTracking();
    } else {
      // If rejected, disable all tracking including Hotjar recording
      disableTracking();
    }
  };

  // We don't need this useEffect anymore since we're handling
  // the consent in the initial useEffect and handleConsent functions
  // Hotjar will always be recording from the start

  if (!showBanner || loading) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      background: "#222",
      color: "#fff",
      padding: "16px 8px",
      zIndex: 9999,
      textAlign: "center",
      fontSize: "1rem"
    }}>
      We use cookies for analytics and improving your experience. Only enabled if you accept. <button style={{marginLeft:8,marginRight:8}} onClick={() => handleConsent(true)}>Accept</button>
      <button onClick={() => handleConsent(false)}>Reject</button>
    </div>
  );
};

export default CookieConsentEEA;
