// Share counter utility for tracking and displaying share counts

/**
 * Format share count for display (max 3 digits)
 * 100-999: exact number
 * 1000-9999: 1k, 1.1k, 9.9k
 * 10000-999999: 10k, 11k, 999k
 * 1000000-9999999: 1m, 1.1m, 9.9m
 * 10000000-999999999: 10m, 11m, 999m
 * 1000000000+: 1b, 1.1b, 9.9b, 10b, etc.
 */
export const formatShareCount = count => {
  if (count < 100) return null // Don't show count below 100
  if (count < 1000) return count.toString()

  if (count < 10000) {
    // 1k - 9.9k
    const thousands = count / 1000
    return thousands % 1 === 0 ? `${Math.floor(thousands)}k` : `${thousands.toFixed(1)}k`
  }

  if (count < 1000000) {
    // 10k - 999k
    return `${Math.floor(count / 1000)}k`
  }

  if (count < 10000000) {
    // 1m - 9.9m
    const millions = count / 1000000
    return millions % 1 === 0 ? `${Math.floor(millions)}m` : `${millions.toFixed(1)}m`
  }

  if (count < 1000000000) {
    // 10m - 999m
    return `${Math.floor(count / 1000000)}m`
  }

  if (count < 10000000000) {
    // 1b - 9.9b
    const billions = count / 1000000000
    return billions % 1 === 0 ? `${Math.floor(billions)}b` : `${billions.toFixed(1)}b`
  }

  // 10b+
  return `${Math.floor(count / 1000000000)}b`
}

/**
 * Get share count for a specific article from localStorage (temporary storage)
 * In production, this would be replaced with an API call to Google Analytics
 */
export const getShareCount = articlePath => {
  if (typeof window === "undefined") return 0

  const shareData = localStorage.getItem("article_share_counts")
  if (!shareData) return 0

  try {
    const counts = JSON.parse(shareData)
    return counts[articlePath] || 0
  } catch (e) {
    console.error("Error parsing share counts:", e)
    return 0
  }
}

/**
 * Increment share count for an article (temporary local storage)
 * In production, this would trigger an API call to update the backend
 */
export const incrementShareCount = articlePath => {
  if (typeof window === "undefined") return 0

  const shareData = localStorage.getItem("article_share_counts")
  let counts = {}

  if (shareData) {
    try {
      counts = JSON.parse(shareData)
    } catch (e) {
      console.error("Error parsing share counts:", e)
    }
  }

  counts[articlePath] = (counts[articlePath] || 0) + 1
  localStorage.setItem("article_share_counts", JSON.stringify(counts))

  return counts[articlePath]
}

/**
 * Mock function to simulate different share counts for testing
 * Remove this in production
 */
export const setMockShareCount = (articlePath, count) => {
  if (typeof window === "undefined") return

  const shareData = localStorage.getItem("article_share_counts")
  let counts = {}

  if (shareData) {
    try {
      counts = JSON.parse(shareData)
    } catch (e) {
      console.error("Error parsing share counts:", e)
    }
  }

  counts[articlePath] = count
  localStorage.setItem("article_share_counts", JSON.stringify(counts))
  console.log(`Mock: Set share count for ${articlePath} to ${count}`)
}

/**
 * Debug function to view all share counts
 */
export const debugShareCounts = () => {
  if (typeof window === "undefined") return {}

  const shareData = localStorage.getItem("article_share_counts")
  if (!shareData) return {}

  try {
    const counts = JSON.parse(shareData)
    console.log("Current share counts:", counts)
    return counts
  } catch (e) {
    console.error("Error parsing share counts:", e)
    return {}
  }
}
