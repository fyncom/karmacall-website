/**
 * Simplified Number Formatter
 * Essential formatting functions only
 */

/**
 * Format number for display with abbreviations (k, m, b)
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (!num || num < 1000) return num?.toString() || "0"
  
  if (num < 1000000) {
    const thousands = num / 1000
    return thousands % 1 === 0 ? `${Math.floor(thousands)}k` : `${(Math.floor(thousands * 10) / 10)}k`
  }
  
  if (num < 1000000000) {
    const millions = num / 1000000
    return millions % 1 === 0 ? `${Math.floor(millions)}m` : `${(Math.floor(millions * 10) / 10)}m`
  }

  const billions = num / 1000000000
  return billions % 1 === 0 ? `${Math.floor(billions)}b` : `${(Math.floor(billions * 10) / 10)}b`
}

/**
 * Format vote score for display with + sign for positive numbers
 * @param {number} score - The vote score to format (can be negative)
 * @returns {string} Formatted vote score
 */
export const formatVoteScore = (score) => {
  if (!score) return "0"
  const formatted = formatNumber(Math.abs(score))
  const sign = score > 0 ? "+" : score < 0 ? "-" : ""
  return `${sign}${formatted}`
}

/**
 * Format comment count for display
 * @param {number} count - The comment count
 * @returns {string|null} Formatted count or null if 0
 */
export const formatCommentCount = (count) => {
  return count ? formatNumber(count) : null
}

/**
 * Recursively counts total comments including all nested replies
 * @param {Array} comments - Array of comment objects
 * @returns {number} Total count of comments and replies
 */
export const getTotalCommentCount = (comments) => {
  if (!Array.isArray(comments)) return 0
  
  return comments.reduce((total, comment) => {
    const repliesCount = getTotalCommentCount(comment.replies || [])
    return total + 1 + repliesCount
  }, 0)
}