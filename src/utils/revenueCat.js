import { Purchases } from "@revenuecat/purchases-js"

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
export const configureRevenueCat = (userId = null) => {
  try {
    if (isConfigured) {
      console.log("revenuecat already configured")
      return
    }
    const apiKey = process.env.GATSBY_REVENUECAT_API_KEY
    if (userId) {
      // Configure with specific user ID
      console.log("configuring revenuecat with user id:", String(userId))
      Purchases.configure({
        apiKey: apiKey,
        appUserId: String(userId),
      })
    } else {
      // Configure without user ID - RevenueCat will generate anonymous ID
      console.log("configuring revenuecat without user id (anonymous)")
      Purchases.configure({
        apiKey: apiKey,
      })
    }

    isConfigured = true
  } catch (error) {
    console.error("failed to configure revenuecat:", error)
    console.error("purchases object:", Purchases)
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
      configureRevenueCat(userId)
      if (!isConfigured) {
        throw new Error("revenuecat configuration failed")
      }

      // Store in localStorage that RevenueCat user is set IMMEDIATELY for referral safety
      if (typeof window !== "undefined") {
        localStorage.setItem("revenuecat_user_set", "true")
      }

      // Get customer info to verify setup (non-blocking for referrals)
      try {
        const purchasesInstance = Purchases.getSharedInstance()
        const customerInfo = await purchasesInstance.getCustomerInfo()
        // nice way to show product entitlements for this user
        /*         console.log("revenuecat user configured successfully:", {
          userId: String(userId),
          hasCustomerInfo: !!customerInfo,
          entitlements: customerInfo?.entitlements ? Object.keys(customerInfo.entitlements.active) : [],
        }) */
        return customerInfo
      } catch (customerInfoError) {
        console.warn("revenuecat configured but customer info fetch failed:", customerInfoError)
        console.log("revenuecat user id is set, proceeding with referrals")
        // Return a minimal object so referrals can proceed
        return { userId: String(userId) }
      }
    }

    if (!userId) {
      console.error("no user id provided for revenuecat login")
      return
    }

    // Ensure userId is a string (RevenueCat requires string user IDs)
    const userIdString = String(userId)
    const purchasesInstance = Purchases.getSharedInstance()
    const customerInfo = await purchasesInstance.changeUser(userIdString)

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

/** * Get current customer info from RevenueCat */
export const getCustomerInfo = async () => {
  try {
    if (!isConfigured) {
      console.log("revenuecat not configured")
      return null
    }
    const purchasesInstance = Purchases.getSharedInstance()
    const customerInfo = await purchasesInstance.getCustomerInfo()
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
    const purchasesInstance = Purchases.getSharedInstance()

    // RevenueCat Web SDK doesn't have a logOut method like mobile SDKs
    // Instead, we'll change to a new anonymous user
    const customerInfo = await purchasesInstance.changeUser(null)

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
