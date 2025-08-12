// Unified Analytics Tracking Utility
// Sends events to both Google Analytics (gtag) and PostHog

/**
 * Track events to both Google Analytics and PostHog
 * @param {string} eventName - Name of the event
 * @param {object} properties - Event properties
 * @param {object} options - Platform-specific options
 */
export const trackEvent = (eventName, properties = {}, options = {}) => {
  if (typeof window === "undefined") return

  // Track with Google Analytics (gtag)
  if (window.gtag && !options.skipGA) {
    // Convert PostHog-style event names to GA-friendly format
    const gaEventName = convertEventNameForGA(eventName)
    
    // Prepare GA-compatible parameters
    const gaParams = {
      event_category: properties.category || 'engagement',
      event_label: properties.label || properties.article_title || properties.platform,
      value: properties.value || 1,
      ...properties
    }

    // Remove PostHog-specific properties that GA doesn't need
    delete gaParams.article_path
    delete gaParams.article_title
    delete gaParams.platform
    
    window.gtag('event', gaEventName, gaParams)
    console.log(`📊 GA Event: ${gaEventName}`, gaParams)
  }
}

/**
 * Convert PostHog event names to Google Analytics friendly format
 * @param {string} eventName - PostHog event name
 * @returns {string} GA-friendly event name
 */
const convertEventNameForGA = (eventName) => {
  const eventMap = {
    'blog_post_viewed': 'page_view',
    'blog_post_shared': 'share',
    'comment_posted': 'comment',
    'link_copied': 'share'
  }
  
  return eventMap[eventName] || eventName.replace(/_/g, '_')
}

/**
 * Track page views to both platforms
 * @param {string} path - Page path
 * @param {string} title - Page title
 * @param {object} additionalProps - Additional properties
 */
export const trackPageView = (path, title, additionalProps = {}) => {
  if (typeof window === "undefined") return

  // Google Analytics pageview (handled in gatsby-browser.js via ReactGA)
  // But we can send additional custom events for blog posts
  if (path.startsWith('/blog/') && window.gtag) {
    window.gtag('event', 'blog_view', {
      event_category: 'blog',
      event_label: title,
      page_path: path,
      ...additionalProps
    })
  }
}

/**
 * Track social sharing events
 * @param {string} platform - Social platform (facebook, twitter, etc.)
 * @param {string} articlePath - Article path
 * @param {string} articleTitle - Article title
 */
export const trackShare = (platform, articlePath, articleTitle) => {
  trackEvent('blog_post_shared', {
    platform: platform,
    article_path: articlePath,
    article_title: articleTitle,
    category: 'social',
    label: `${platform}_share`
  })

  // Additional GA-specific share event
  if (window.gtag) {
    window.gtag('event', 'share', {
      method: platform,
      content_type: 'blog_post',
      item_id: articlePath,
      content_id: articlePath,
      event_category: 'social_sharing',
      event_label: articleTitle
    })
  }
}

/**
 * Track comment interactions
 * @param {string} action - Comment action (posted, liked, etc.)
 * @param {string} articlePath - Article path
 * @param {string} articleTitle - Article title
 */
export const trackComment = (action, articlePath, articleTitle) => {
  trackEvent('comment_interaction', {
    action: action,
    article_path: articlePath,
    article_title: articleTitle,
    category: 'engagement',
    label: `comment_${action}`
  })
}

/**
 * Track link copying
 * @param {string} articlePath - Article path
 * @param {string} articleTitle - Article title
 */
export const trackLinkCopy = (articlePath, articleTitle) => {
  trackEvent('link_copied', {
    article_path: articlePath,
    article_title: articleTitle,
    platform: 'copy_link',
    category: 'social',
    label: 'link_copy'
  })
}

/**
 * Track email shares
 * @param {string} articlePath - Article path
 * @param {string} articleTitle - Article title
 */
export const trackEmailShare = (articlePath, articleTitle) => {
  trackEvent('blog_post_shared', {
    platform: 'email',
    article_path: articlePath,
    article_title: articleTitle,
    category: 'social',
    label: 'email_share'
  })
}

/**
 * Track user engagement events
 * @param {string} engagementType - Type of engagement (scroll, time_on_page, etc.)
 * @param {object} properties - Engagement properties
 */
export const trackEngagement = (engagementType, properties = {}) => {
  trackEvent('user_engagement', {
    engagement_type: engagementType,
    category: 'engagement',
    ...properties
  })
}

/**
 * Initialize tracking consent for both platforms
 * @param {boolean} hasConsent - Whether user has given consent
 */
export const setTrackingConsent = (hasConsent) => {
  if (typeof window === "undefined") return

  // Google Analytics consent
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: hasConsent ? 'granted' : 'denied',
      ad_storage: hasConsent ? 'granted' : 'denied'
    })
  }
}

export default {
  trackEvent,
  trackPageView,
  trackShare,
  trackComment,
  trackLinkCopy,
  trackEmailShare,
  trackEngagement,
  setTrackingConsent
}
