/**
 * Utility functions for formatting time values
 */

/**
 * Converts a timestamp to a relative time string (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} timestamp - The timestamp to convert
 * @returns {string} Relative time string
 */
export const getRelativeTime = timestamp => {
  if (!timestamp) return "Unknown time"

  try {
    const now = new Date()
    const time = new Date(timestamp)

    // Handle invalid dates
    if (isNaN(time.getTime())) {
      return "Invalid date"
    }

    const diffInSeconds = Math.floor((now - time) / 1000)

    // Future times
    if (diffInSeconds < 0) {
      return "Just now"
    }

    // Less than a minute
    if (diffInSeconds < 60) {
      return "Just now"
    }

    // Minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
    }

    // Hours
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    }

    // Days
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
    }

    // Weeks
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`
    }

    // Months
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
    }

    // Years
    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`
  } catch (error) {
    console.warn("Error parsing timestamp:", timestamp, error)
    return "Unknown time"
  }
}

/**
 * Converts a timestamp to a short relative time string (e.g., "2h", "3d")
 * @param {string|Date} timestamp - The timestamp to convert
 * @returns {string} Short relative time string
 */
export const getShortRelativeTime = timestamp => {
  if (!timestamp) return "?"

  try {
    const now = new Date()
    const time = new Date(timestamp)

    // Handle invalid dates
    if (isNaN(time.getTime())) {
      return "?"
    }

    const diffInSeconds = Math.floor((now - time) / 1000)

    // Future times or very recent
    if (diffInSeconds < 60) {
      return "now"
    }

    // Minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`
    }

    // Hours
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours}h`
    }

    // Days
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return `${diffInDays}d`
    }

    // Weeks
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`
    }

    // Months
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths}mo`
    }

    // Years
    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears}y`
  } catch (error) {
    console.warn("Error parsing timestamp:", timestamp, error)
    return "?"
  }
}

/**
 * Formats a timestamp to a readable date string
 * @param {string|Date} timestamp - The timestamp to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.includeTime - Whether to include time
 * @param {boolean} options.short - Whether to use short format
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp, { includeTime = false, short = false } = {}) => {
  if (!timestamp) return "Unknown date"

  try {
    const date = new Date(timestamp)

    // Handle invalid dates
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    const options = {
      year: short ? "2-digit" : "numeric",
      month: short ? "short" : "long",
      day: "numeric",
    }

    if (includeTime) {
      options.hour = "numeric"
      options.minute = "2-digit"
      options.hour12 = true
    }

    return date.toLocaleDateString("en-US", options)
  } catch (error) {
    console.warn("Error formatting date:", timestamp, error)
    return "Unknown date"
  }
}

/**
 * Gets a full timestamp with both relative time and absolute date
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {Object} Object with relative and absolute time
 */
export const getFullTimeInfo = timestamp => {
  return {
    relative: getRelativeTime(timestamp),
    absolute: formatDate(timestamp, { includeTime: true }),
    short: getShortRelativeTime(timestamp),
  }
}
