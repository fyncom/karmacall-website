import React, { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";
import ClientOnly from "./ClientOnly";

// List of European Economic Area (EEA) country codes
const EEA_COUNTRIES = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE", 
];

// Function to initialize all tracking tools with full consent
const initializeTracking = () => {
  if (typeof window === "undefined") return;
  
  // Enable Google Consent Mode with all required signals
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){window.dataLayer.push(arguments);};
  
  // Update all consent signals to granted
  window.gtag('consent', 'update', {
    // Behavioral analytics consent signals
    'analytics_storage': 'granted',        // Enables storage (cookies) for analytics
    
    // Advertising consent signals
    'ad_storage': 'granted',               // Enables storage (cookies) for ads
    'ad_user_data': 'granted',             // Enables user data collection for ads
    'ad_personalization': 'granted',       // Enables ad personalization
    
    // Wait for update to ensure consent is processed before analytics runs
    'wait_for_update': 500
  });
  
  // Enable Facebook Pixel
  if (window.fbq) {
    window.fbq('consent', 'grant');
  }
};

// Function to disable tracking for users who reject consent
const disableTracking = () => {
  if (typeof window === "undefined") return;
  
  // Disable Google Analytics and all consent signals
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){window.dataLayer.push(arguments);};
  
  // Set all consent signals to denied
  window.gtag('consent', 'update', {
    // Behavioral analytics consent signals
    'analytics_storage': 'denied',        // Disables storage (cookies) for analytics
    
    // Advertising consent signals
    'ad_storage': 'denied',               // Disables storage (cookies) for ads
    'ad_user_data': 'denied',             // Disables user data collection for ads
    'ad_personalization': 'denied',       // Disables ad personalization
    
    // Wait for update to ensure consent is processed
    'wait_for_update': 500
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

    // Set up Google Analytics 4 Consent Mode properly
    // This must happen as early as possible, before any other GA4 calls
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    
    // Initialize Google consent mode v2 with region-specific defaults
    // The 'default' command sets consent state for all regions where consent isn't required
    window.gtag('consent', 'default', {
      // For non-EEA regions, we grant all consent by default
      'analytics_storage': 'granted',
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'wait_for_update': 500
    });
    
    // Setup region-specific consent for EEA countries
    // This explicitly sets a different default for users in regions requiring consent
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'wait_for_update': 500,
      'region': EEA_COUNTRIES  // Scope these defaults only to EEA countries
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
          
          // For EEA users, confirm that consent signals are denied by default
          // Even though we set region-specific defaults above, we confirm them here
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer.push(arguments);};
          
          // Explicitly update consent for this user, since we now know they're in EEA
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
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
        <span>
          This website uses cookies for analytics and personalized advertising. 
          We use these technologies to analyze traffic, personalize content and ads, 
          and provide social media features. By accepting, you consent to our use of cookies 
          for these purposes in accordance with our privacy policy.
        </span>
      </CookieConsent>
    </ClientOnly>
  );
};

export default CookieConsentEEA;
