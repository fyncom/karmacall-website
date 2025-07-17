# Analytics Setup Guide

This project uses dual analytics tracking with both Google Analytics 4 and PostHog to provide comprehensive insights across both platforms.

## Environment Variables Required

Add these to your `.env.development` and `.env.production` files:

```bash
# Google Analytics
GATSBY_GOOGLE_TAG_ID=G-XXXXXXXXXX

# PostHog
GATSBY_POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GATSBY_POSTHOG_HOST=https://us.posthog.com
```

## Analytics Platforms

### Google Analytics 4 (GA4)
- **Purpose**: Standard web analytics, audience insights, conversion tracking
- **Events Tracked**: Page views, shares, comments, engagement metrics
- **Benefits**: Industry standard, excellent reporting, integrates with Google Ads

### PostHog
- **Purpose**: Product analytics, feature flags, user behavior analysis
- **Events Tracked**: Same events as GA4 plus detailed user journeys
- **Benefits**: Self-hosted option, detailed user sessions, A/B testing capabilities

## Events Tracked

All events are sent to both platforms automatically:

### Core Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `page_view` / `blog_post_viewed` | User views a blog post | article_path, article_title, article_author |
| `share` / `blog_post_shared` | User shares content | platform, article_path, article_title |
| `link_copied` | User copies article link | article_path, article_title |
| `comment_interaction` | User posts comment/reply | action, article_path, article_title |

### Social Sharing Events

Tracked for each platform:
- Facebook
- Twitter/X  
- LinkedIn
- Reddit
- Bluesky
- Email
- Copy Link

## Implementation

### Unified Tracking Function

```javascript
import { trackEvent, trackShare, trackComment } from '../utils/analytics'

// Track any event to both platforms
trackEvent('custom_event', {
  category: 'engagement',
  value: 1,
  custom_property: 'value'
})

// Track social sharing
trackShare('facebook', '/blog/article-slug', 'Article Title')

// Track comments
trackComment('posted', '/blog/article-slug', 'Article Title')
```

### Platform-Specific Events

**Google Analytics receives:**
- Standard GA4 event format
- Ecommerce events (if applicable)
- Conversion tracking
- Audience data

**PostHog receives:**
- Detailed user properties
- Custom event properties
- Session recordings (if enabled)
- Feature flag data

## Privacy & Consent

The system automatically respects user consent:

- **EEA Users**: Must explicitly consent before tracking starts
- **Non-EEA Users**: Tracking enabled by default with opt-out option
- **Consent Changes**: Both platforms updated automatically when user changes preferences

## Debugging

### Check if Analytics are Working

Open browser console and look for:
```
📊 GA Event: share {platform: "facebook", ...}
📈 PostHog Event: blog_post_shared {platform: "facebook", ...}
```

### Verify Setup

1. **Google Analytics**: Check Real-time reports in GA4 dashboard
2. **PostHog**: Check Live events in PostHog dashboard
3. **Console**: Look for tracking confirmations in browser dev tools

## Data Analysis

### Google Analytics 4
- Use Exploration reports for detailed analysis
- Set up custom conversions for blog engagement
- Create audiences based on content consumption

### PostHog
- Use Funnels to track user journeys
- Set up Cohorts for user behavior analysis
- Use Session recordings to understand user interactions

## Migration Notes

This setup replaces the previous utilities:
- ❌ `urlShortener.js` - URLs now tracked via both platforms
- ❌ `shareCounter.js` - Share counts available in both analytics dashboards  
- ❌ `utmWiper.js` - UTM tracking handled automatically by both platforms

## Troubleshooting

### Common Issues

1. **Events not appearing in GA4**
   - Check `GATSBY_GOOGLE_TAG_ID` is correct
   - Verify consent is granted for analytics_storage
   - Check browser ad blockers

2. **Events not appearing in PostHog**
   - Verify `GATSBY_POSTHOG_API_KEY` and `GATSBY_POSTHOG_HOST`
   - Check network tab for blocked requests
   - Ensure PostHog script loads successfully

3. **Consent issues**
   - Clear localStorage and cookies to reset consent
   - Check geolocation API is working for EEA detection
   - Verify consent modal appears for EEA users

### Testing

```javascript
// Test in browser console
window.gtag('event', 'test_event', {test: true})
window.posthog.capture('test_event', {test: true})
```

## Best Practices

1. **Event Naming**: Use consistent, descriptive names across platforms
2. **Properties**: Include relevant context (article_title, platform, etc.)
3. **Privacy**: Always respect user consent and data minimization
4. **Testing**: Test events in development before deploying
5. **Documentation**: Update this file when adding new events