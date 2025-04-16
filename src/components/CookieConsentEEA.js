import React, { useEffect, useState } from "react";

const EEA_COUNTRIES = [
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE"
];


const CookieConsentEEA = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Check if consent already given
    if (localStorage.getItem("cookie_consent_eea")) return;

    // Fetch geolocation to determine if user is in EEA
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        if (data && data.country && EEA_COUNTRIES.includes(data.country)) {
          setShowBanner(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleConsent = (accepted) => {
    localStorage.setItem("cookie_consent_eea", accepted ? "accepted" : "rejected");
    setShowBanner(false);
    if (accepted) {
      // Enable Google Consent Mode
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(){window.dataLayer.push(arguments);};
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted'
        });
      }
    }
  };

  // Inject default denied consent mode for EEA before user consents
  useEffect(() => {
    if (showBanner && typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){window.dataLayer.push(arguments);};
      window.gtag('consent', 'default', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied'
      });
    }
  }, [showBanner]);

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
