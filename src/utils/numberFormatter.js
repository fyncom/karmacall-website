/**
 * Format numbers for display with abbreviations (k, m, b)
 * This utility can be used for share counts, vote scores, and other numeric displays
 */

/**
 * Format number for display with abbreviations
 * @param {number} num - The number to format
 * @param {boolean} showSign - Whether to show + sign for positive numbers (useful for vote scores)
 * @param {number} minThreshold - Minimum number to display (below this returns null)
 * @returns {string|null} Formatted number string or null if below threshold
 */
export const formatNumber = (num, showSign = false, minThreshold = 0) => {
  if (Math.abs(num) < minThreshold) return null

  const sign = showSign && num > 0 ? "+" : ""
  const absNum = Math.abs(num)

  if (absNum < 1000) {
    return `${sign}${num}`
  }

  if (absNum < 10000) {
    // 1k - 9.9k
    const thousands = absNum / 1000
    const formatted = thousands % 1 === 0 ? `${Math.floor(thousands)}k` : `${thousands.toFixed(1)}k`
    return `${num < 0 ? "-" : sign}${formatted}`
  }

  if (absNum < 1000000) {
    // 10k - 999k
    const formatted = `${Math.floor(absNum / 1000)}k`
    return `${num < 0 ? "-" : sign}${formatted}`
  }

  if (absNum < 10000000) {
    // 1m - 9.9m
    const millions = absNum / 1000000
    const formatted = millions % 1 === 0 ? `${Math.floor(millions)}m` : `${millions.toFixed(1)}m`
    return `${num < 0 ? "-" : sign}${formatted}`
  }

  if (absNum < 1000000000) {
    // 10m - 999m
    const formatted = `${Math.floor(absNum / 1000000)}m`
    return `${num < 0 ? "-" : sign}${formatted}`
  }

  if (absNum < 10000000000) {
    // 1b - 9.9b
    const billions = absNum / 1000000000
    const formatted = billions % 1 === 0 ? `${Math.floor(billions)}b` : `${billions.toFixed(1)}b`
    return `${num < 0 ? "-" : sign}${formatted}`
  }

  // 10b+
  const formatted = `${Math.floor(absNum / 1000000000)}b`
  return `${num < 0 ? "-" : sign}${formatted}`
}

/**
 * Format share count for display (legacy function for backward compatibility)
 * @param {number} count - The share count to format
 * @returns {string|null} Formatted share count or null if below 100
 */
export const formatShareCount = count => {
  return formatNumber(count, false, 100)
}

/**
 * Format vote score for display
 * @param {number} score - The vote score to format (can be negative)
 * @returns {string} Formatted vote score with + sign for positive numbers
 */
export const formatVoteScore = score => {
  return formatNumber(score, true, 0) || "0"
}

/**
 * Recursively counts total comments including all nested replies
 * @param {Array} comments - Array of comment objects
 * @returns {number} Total count of comments and replies
 */
export const getTotalCommentCount = (comments) => {
  if (!comments || !Array.isArray(comments)) {
    return 0
  }
  
  let total = comments.length
  
  comments.forEach(comment => {
    if (comment.replies && Array.isArray(comment.replies)) {
      total += getTotalCommentCount(comment.replies)
    }
  })
  
  return total
}

/**
 * Formats comment count for display (like share count formatting)
 * @param {number} count - The comment count
 * @returns {string|null} Formatted count or null if 0
 */
export const formatCommentCount = (count) => {
  if (!count || count === 0) {
    return null
  }
  return formatNumber(count)
}
