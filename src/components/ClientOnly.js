import React, { useState, useEffect } from 'react';

// ClientOnly component to prevent hydration mismatches
// Solves React error #418 by only rendering client-side
const ClientOnly = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
};

export default ClientOnly;
