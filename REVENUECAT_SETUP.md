# RevenueCat Web Integration Setup

This guide explains how to set up RevenueCat integration for the KarmaCall website to ensure users have their RevenueCat profiles created before accessing the mobile app.

## Overview

The RevenueCat Web SDK integration allows users who log in through the website to have their RevenueCat customer profiles automatically created and configured. When they later access the mobile app, their subscription entitlements and customer data will already be available.

## Integration Flow

1. User logs in via `/login` page
2. After successful user registration (`user/register/full` API call), we get the `userId`
3. We call `loginRevenueCatUser(userId)` to set up the RevenueCat profile
4. This mirrors the mobile app's `revenueCatSet()` function behavior
5. User's entitlements are now accessible across web and mobile platforms

## Environment Variables

Add the following environment variable to your `.env` file:

```bash
# RevenueCat Web SDK API Key
GATSBY_REVENUECAT_API_KEY=your_revenuecat_web_api_key_here
```

### Getting Your RevenueCat API Key

1. Log into your RevenueCat dashboard
2. Go to Settings > API Keys
3. Create a new "Public" API key for Web platform
4. Copy the key and add it to your environment variables

**Important:** Use the **public/web** API key, not the secret API key.

## Files Modified

### New Files

- `src/utils/revenueCat.js` - RevenueCat utility functions
- `REVENUECAT_SETUP.md` - This documentation file

### Modified Files

- `src/pages/login.js` - Added RevenueCat user setup during login
- `package.json` - Added `@revenuecat/purchases-js` dependency

## Functions Added

### `configureRevenueCat()`

Initializes the RevenueCat Web SDK with your API key. Called once on page load.

### `loginRevenueCatUser(userId)`

Creates/logs in a user to RevenueCat using their backend user ID. This ensures the same user ID is used across web and mobile platforms.

### `isRevenueCatUserSet()`

Checks if RevenueCat user has already been set up to avoid duplicate API calls.

### `getCustomerInfo()` & `logoutRevenueCatUser()`

Additional utility functions for getting customer info and logging out users.

## Testing the Integration

1. Set up your environment variable with a valid RevenueCat API key
2. Start your development server: `npm run develop`
3. Navigate to `/login` and complete the login process
4. Check browser console for RevenueCat-related debug messages:
   - `"configuring revenuecat web sdk"`
   - `"revenuecat web sdk configured successfully"`
   - `"setting up revenuecat user profile for user XXXX"`
   - `"revenuecat user profile set up successfully"`

## Mobile App Compatibility

The web integration uses the same user ID (`userId` from your backend) that the mobile app uses when calling:

```kotlin
Purchases.sharedInstance.logIn(userId)
```

This ensures perfect synchronization between web and mobile RevenueCat profiles.

## Error Handling

- If RevenueCat configuration fails, the error is logged but doesn't block the login process
- If RevenueCat user setup fails, the error is logged but login continues normally
- This ensures the core login functionality remains unaffected by RevenueCat issues

## Deployment Notes

- Make sure to add `GATSBY_REVENUECAT_API_KEY` to your production environment variables
- The RevenueCat Web SDK will only work in browser environments (client-side)
- Test thoroughly in your staging environment before deploying to production

## Support

For RevenueCat-specific issues, consult:

- [RevenueCat Web SDK Documentation](https://docs.revenuecat.com/docs/web)
- [RevenueCat React Integration Guide](https://docs.revenuecat.com/docs/react)

For issues with this specific integration, check the browser console logs for detailed error messages.
