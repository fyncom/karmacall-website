/**
 * Utility functions for formatting time values
 */

// Time constants for better readability and maintainability
const TIME_CONSTANTS = {
  SECONDS_PER_MINUTE: 60,
  SECONDS_PER_HOUR: 3600, // 60 * 60
  SECONDS_PER_DAY: 86400, // 60 * 60 * 24
  SECONDS_PER_WEEK: 604800, // 60 * 60 * 24 * 7
  
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_WEEK: 7,
  DAYS_PER_MONTH: 30, // Approximate
  DAYS_PER_YEAR: 365, // Approximate
  WEEKS_PER_MONTH: 4, // Approximate
  MONTHS_PER_YEAR: 12,
}

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
    if (diffInSeconds < TIME_CONSTANTS.SECONDS_PER_MINUTE) {
      return "Just now"
    }

    // Minutes
    const diffInMinutes = Math.floor(diffInSeconds / TIME_CONSTANTS.SECONDS_PER_MINUTE)
    if (diffInMinutes < TIME_CONSTANTS.MINUTES_PER_HOUR) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
    }

    // Hours
    const diffInHours = Math.floor(diffInMinutes / TIME_CONSTANTS.MINUTES_PER_HOUR)
    if (diffInHours < TIME_CONSTANTS.HOURS_PER_DAY) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    }

    // Days
    const diffInDays = Math.floor(diffInHours / TIME_CONSTANTS.HOURS_PER_DAY)
    if (diffInDays < TIME_CONSTANTS.DAYS_PER_WEEK) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
    }

    // Weeks
    const diffInWeeks = Math.floor(diffInDays / TIME_CONSTANTS.DAYS_PER_WEEK)
    if (diffInWeeks < TIME_CONSTANTS.WEEKS_PER_MONTH) {
      return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`
    }

    // Months
    const diffInMonths = Math.floor(diffInDays / TIME_CONSTANTS.DAYS_PER_MONTH)
    if (diffInMonths < TIME_CONSTANTS.MONTHS_PER_YEAR) {
      return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
    }

    // Years
    const diffInYears = Math.floor(diffInDays / TIME_CONSTANTS.DAYS_PER_YEAR)
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
    if (diffInSeconds < TIME_CONSTANTS.SECONDS_PER_MINUTE) {
      return "now"
    }

    // Minutes
    const diffInMinutes = Math.floor(diffInSeconds / TIME_CONSTANTS.SECONDS_PER_MINUTE)
    if (diffInMinutes < TIME_CONSTANTS.MINUTES_PER_HOUR) {
      return `${diffInMinutes}m`
    }

    // Hours
    const diffInHours = Math.floor(diffInMinutes / TIME_CONSTANTS.MINUTES_PER_HOUR)
    if (diffInHours < TIME_CONSTANTS.HOURS_PER_DAY) {
      return `${diffInHours}h`
    }

    // Days
    const diffInDays = Math.floor(diffInHours / TIME_CONSTANTS.HOURS_PER_DAY)
    if (diffInDays < TIME_CONSTANTS.DAYS_PER_WEEK) {
      return `${diffInDays}d`
    }

    // Weeks
    const diffInWeeks = Math.floor(diffInDays / TIME_CONSTANTS.DAYS_PER_WEEK)
    if (diffInWeeks < TIME_CONSTANTS.WEEKS_PER_MONTH) {
      return `${diffInWeeks}w`
    }

    // Months
    const diffInMonths = Math.floor(diffInDays / TIME_CONSTANTS.DAYS_PER_MONTH)
    if (diffInMonths < TIME_CONSTANTS.MONTHS_PER_YEAR) {
      return `${diffInMonths}mo`
    }

    // Years
    const diffInYears = Math.floor(diffInDays / TIME_CONSTANTS.DAYS_PER_YEAR)
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
