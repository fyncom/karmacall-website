import Purchases from "@revenuecat/purchases-js"

/**
 * RevenueCat Web SDK utility functions for KarmaCall
 * This integrates with the mobile app's RevenueCat setup
 *
 * Integration Flow:
 * 1. User logs in via login.js
 * 2. After successful user/register/full API call, we get userId
 * 3. We call loginRevenueCatUser(userId) to set up RevenueCat profile
 * 4. This mirrors the mobile app's revenueCatSet() function behavior
 * 5. User's entitlements are now accessible across web and mobile
 */

let isConfigured = false

/**
 * Configure RevenueCat with API key
 * Should be called once during app initialization
 */
export const configureRevenueCat = () => {
  try {
    if (isConfigured) {
      console.log("revenuecat already configured")
      return
    }

    const apiKey = process.env.GATSBY_REVENUECAT_API_KEY
    if (!apiKey) {
      console.error("revenuecat api key not found in environment variables")
      return
    }

    console.log("configuring revenuecat web sdk")
    Purchases.configure(apiKey)
    isConfigured = true
    console.log("revenuecat web sdk configured successfully")
  } catch (error) {
    console.error("failed to configure revenuecat:", error)
  }
}

/**
 * Log in user to RevenueCat
 * This mirrors the mobile app's revenueCatSet function
 * @param {string} userId - The user ID from your backend
 */
export const loginRevenueCatUser = async userId => {
  try {
    if (!isConfigured) {
      console.log("revenuecat not configured, attempting to configure")
      configureRevenueCat()
      if (!isConfigured) {
        throw new Error("revenuecat configuration failed")
      }
    }

    if (!userId) {
      console.error("no user id provided for revenuecat login")
      return
    }

    console.log(`logging in user ${userId} to revenuecat`)

    // Use the same user ID format as the mobile app
    // Mobile app uses user.value.id directly, so we'll use the userId from backend
    const customerInfo = await Purchases.logIn(userId.toString())

    console.log("revenuecat user logged in successfully:", {
      userId: userId,
      hasCustomerInfo: !!customerInfo,
      entitlements: customerInfo?.entitlements ? Object.keys(customerInfo.entitlements.active) : [],
    })

    // Store in localStorage that RevenueCat user is set (mirrors mobile app behavior)
    if (typeof window !== "undefined") {
      localStorage.setItem("revenuecat_user_set", "true")
    }

    return customerInfo
  } catch (error) {
    console.error("failed to login revenuecat user:", error)
    throw error
  }
}

/**
 * Get current customer info from RevenueCat
 */
export const getCustomerInfo = async () => {
  try {
    if (!isConfigured) {
      console.log("revenuecat not configured")
      return null
    }

    const customerInfo = await Purchases.getCustomerInfo()
    console.log("revenuecat customer info retrieved:", {
      hasCustomerInfo: !!customerInfo,
      entitlements: customerInfo?.entitlements ? Object.keys(customerInfo.entitlements.active) : [],
    })

    return customerInfo
  } catch (error) {
    console.error("failed to get revenuecat customer info:", error)
    return null
  }
}

/**
 * Logout user from RevenueCat
 * This should be called when user logs out
 */
export const logoutRevenueCatUser = async () => {
  try {
    if (!isConfigured) {
      console.log("revenuecat not configured")
      return
    }

    console.log("logging out revenuecat user")
    const customerInfo = await Purchases.logOut()

    // Clear localStorage flag
    if (typeof window !== "undefined") {
      localStorage.removeItem("revenuecat_user_set")
    }

    console.log("revenuecat user logged out successfully")
    return customerInfo
  } catch (error) {
    console.error("failed to logout revenuecat user:", error)
    throw error
  }
}

/**
 * Check if RevenueCat user is already set up
 * This mirrors the mobile app's logic for checking if user is set
 */
export const isRevenueCatUserSet = () => {
  if (typeof window === "undefined") {
    return false
  }

  return localStorage.getItem("revenuecat_user_set") === "true"
}
