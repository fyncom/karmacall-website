/**
 * Rate Limit Admin Utilities
 * Tools for managing and debugging rate limits
 */

import { resetRateLimit, getRateLimitStatus } from "./rateLimiter"

/**
 * Gets all rate limit entries from localStorage
 * @returns {Array} Array of rate limit entries
 */
export const getAllRateLimitEntries = () => {
  if (typeof window === "undefined") return []

  const entries = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith("rateLimit_")) {
      try {
        const value = localStorage.getItem(key)
        const data = JSON.parse(value)

        // Parse the key to extract action and identifier
        const keyParts = key.split("_")
        const action = keyParts[1]
        const identifier = keyParts.slice(2).join("_")

        entries.push({
          key,
          action,
          identifier,
          data,
          attempts: data.attempts || [],
          blockedUntil: data.blockedUntil,
          isBlocked: data.blockedUntil && Date.now() < data.blockedUntil,
        })
      } catch (error) {
        console.error("Error parsing rate limit entry:", key, error)
      }
    }
  }

  return entries.sort((a, b) => a.key.localeCompare(b.key))
}

/**
 * Clears all rate limit entries
 */
export const clearAllRateLimits = () => {
  if (typeof window === "undefined") return

  const keysToRemove = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith("rateLimit_")) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key))

  console.log(`Cleared ${keysToRemove.length} rate limit entries`)
}

/**
 * Clears all rate limits for a specific action
 * @param {string} action - The action to clear (e.g., 'comments', 'login')
 */
export const clearRateLimitsForAction = action => {
  if (typeof window === "undefined") return

  const keysToRemove = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(`rateLimit_${action}_`)) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key))

  console.log(`Cleared ${keysToRemove.length} rate limit entries for action: ${action}`)
}

/**
 * Gets rate limit statistics
 * @returns {Object} Statistics about rate limits
 */
export const getRateLimitStats = () => {
  const entries = getAllRateLimitEntries()
  const currentTime = Date.now()

  const stats = {
    totalEntries: entries.length,
    blockedEntries: 0,
    actionStats: {},
    recentActivity: [],
  }

  entries.forEach(entry => {
    const { action, isBlocked, data } = entry

    // Count blocked entries
    if (isBlocked) {
      stats.blockedEntries++
    }

    // Action statistics
    if (!stats.actionStats[action]) {
      stats.actionStats[action] = {
        total: 0,
        blocked: 0,
        recentAttempts: 0,
      }
    }

    stats.actionStats[action].total++
    if (isBlocked) {
      stats.actionStats[action].blocked++
    }

    // Count recent attempts (last 5 minutes)
    const recentAttempts = (data.attempts || []).filter(timestamp => currentTime - timestamp < 5 * 60 * 1000)
    stats.actionStats[action].recentAttempts += recentAttempts.length

    // Add to recent activity
    recentAttempts.forEach(timestamp => {
      stats.recentActivity.push({
        action,
        identifier: entry.identifier,
        timestamp,
        timeAgo: Math.floor((currentTime - timestamp) / 1000),
      })
    })
  })

  // Sort recent activity by timestamp (most recent first)
  stats.recentActivity.sort((a, b) => b.timestamp - a.timestamp)

  return stats
}

/**
 * Logs rate limit information to console
 */
export const logRateLimitInfo = () => {
  const entries = getAllRateLimitEntries()
  const stats = getRateLimitStats()

  console.group("Rate Limit Information")
  console.log("Statistics:", stats)
  console.log("All Entries:", entries)
  console.groupEnd()
}

/**
 * Simulates rate limit testing
 * @param {string} action - The action to test
 * @param {string} identifier - The identifier to test
 * @param {number} attempts - Number of attempts to simulate
 */
export const simulateRateLimit = (action, identifier, attempts = 5) => {
  if (typeof window === "undefined") return

  console.log(`Simulating ${attempts} attempts for ${action}:${identifier}`)

  for (let i = 0; i < attempts; i++) {
    const status = getRateLimitStatus(action, identifier)
    console.log(`Attempt ${i + 1}:`, status)

    if (status.allowed) {
      // Record attempt would normally be called by the actual action
      const key = `rateLimit_${action}_${identifier}`
      const stored = localStorage.getItem(key)
      let data = { attempts: [], blockedUntil: null }

      if (stored) {
        data = JSON.parse(stored)
      }

      data.attempts.push(Date.now())
      localStorage.setItem(key, JSON.stringify(data))
    } else {
      console.log("Rate limited - stopping simulation")
      break
    }
  }
}

/**
 * Exports rate limit data for backup/analysis
 * @returns {string} JSON string of all rate limit data
 */
export const exportRateLimitData = () => {
  const entries = getAllRateLimitEntries()
  const exportData = {
    timestamp: new Date().toISOString(),
    entries,
    stats: getRateLimitStats(),
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Imports rate limit data from backup
 * @param {string} jsonData - JSON string of rate limit data
 */
export const importRateLimitData = jsonData => {
  if (typeof window === "undefined") return

  try {
    const data = JSON.parse(jsonData)

    if (!data.entries || !Array.isArray(data.entries)) {
      throw new Error("Invalid data format")
    }

    // Clear existing rate limits
    clearAllRateLimits()

    // Import new data
    data.entries.forEach(entry => {
      localStorage.setItem(entry.key, JSON.stringify(entry.data))
    })

    console.log(`Imported ${data.entries.length} rate limit entries`)
  } catch (error) {
    console.error("Error importing rate limit data:", error)
  }
}

// Development helper - add to window for easy access in dev tools
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.rateLimitAdmin = {
    getAllRateLimitEntries,
    clearAllRateLimits,
    clearRateLimitsForAction,
    getRateLimitStats,
    logRateLimitInfo,
    simulateRateLimit,
    exportRateLimitData,
    importRateLimitData,
  }
}
