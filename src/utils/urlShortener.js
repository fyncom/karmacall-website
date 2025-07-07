// URL Shortener Utility for KarmaCall
// Uses Base64-encoded IDs: 4 chars for articles + 2 chars for sources

// Base64 character set for encoding/decoding
const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

// Convert number to 4-character Base64 ID
const numberToBase64Id = (num, length) => {
  let result = ""
  for (let i = 0; i < length; i++) {
    result = BASE64_CHARS[num % 64] + result
    num = Math.floor(num / 64)
  }
  return result
}

// Convert Base64 ID back to number
const base64IdToNumber = id => {
  let result = 0
  for (let i = 0; i < id.length; i++) {
    result = result * 64 + BASE64_CHARS.indexOf(id[i])
  }
  return result
}

// Article ID mappings (4-char Base64 IDs that don't look like a pattern)
const ARTICLE_IDS = {
  "/blog/template": "Kx9P", // Random-looking ID
  "/blog/future-of-spam-blocking": "M7nQ", // Random-looking ID
  "/blog/job-scam-texts-surge-2024": "R3vK", // Random-looking ID
  // Add new articles with random-looking 4-char IDs
}

// Reverse lookup for article IDs
const ID_TO_ARTICLE = Object.fromEntries(Object.entries(ARTICLE_IDS).map(([path, id]) => [id, path]))

// Source ID mappings (2-char Base64 IDs)
const SOURCE_IDS = {
  copy_link: "Cx", // Random-looking
  email: "Fm", // Random-looking
  facebook: "Qz", // Random-looking
  twitter: "Wr", // Random-looking
  linkedin: "Bt", // Random-looking
  reddit: "Jk", // Random-looking
  bluesky: "Np", // Random-looking
}

// Reverse lookup for source IDs
const ID_TO_SOURCE = Object.fromEntries(Object.entries(SOURCE_IDS).map(([source, id]) => [id, source]))

// Generate a random-looking 4-character article ID
const generateArticleId = () => {
  // Generate a random number and convert to Base64
  const randomNum = Math.floor(Math.random() * 64 ** 4) // 0 to 16,777,215
  return numberToBase64Id(randomNum, 4)
}

// Generate a random-looking 2-character source ID
const generateSourceId = () => {
  const randomNum = Math.floor(Math.random() * 64 ** 2) // 0 to 4,095
  return numberToBase64Id(randomNum, 2)
}

// Get article ID from various sources (frontmatter, static mapping, etc.)
const getArticleId = (urlPath, articleMeta = null) => {
  // First, try to get from article metadata (for MDX files)
  if (articleMeta && articleMeta.articleId) {
    return articleMeta.articleId
  }

  // Fallback to static mapping
  return ARTICLE_IDS[urlPath] || null
}

// Encode URL path and source into a short code
const encodeUrl = (url, source, articleMeta = null) => {
  // Extract just the path from the URL
  const urlPath = url.replace(/^https?:\/\/[^\/]+/, "") // Remove domain, keep path

  console.log("Debug: Encoding path:", urlPath, "source:", source)

  // Look up IDs
  const articleId = getArticleId(urlPath, articleMeta)
  const sourceId = SOURCE_IDS[source]

  if (!articleId || !sourceId) {
    console.warn("Debug: Unknown article or source:", { urlPath, source, articleId, sourceId })
    console.warn("Debug: Available articles:", Object.keys(ARTICLE_IDS))
    console.warn("Debug: Available sources:", Object.keys(SOURCE_IDS))

    // Fallback: generate temporary IDs for unknown articles
    const tempArticleId = generateArticleId()
    const tempSourceId = sourceId || generateSourceId()
    console.warn("Debug: Using temporary IDs:", { tempArticleId, tempSourceId })
    return tempArticleId + tempSourceId
  }

  // Combine IDs: 4-char article + 2-char source = 6 chars total
  const shortCode = articleId + sourceId
  console.log("Debug: Generated short code:", shortCode)

  return shortCode
}

// Decode a short code back to path and source
const decodeUrl = code => {
  console.log("Debug: Attempting to decode code:", code)

  if (code.length !== 6) {
    console.log("Debug: Invalid code length:", code.length, "expected 6")
    return null
  }

  // Split into article ID (first 4 chars) and source ID (last 2 chars)
  const articleId = code.substring(0, 4)
  const sourceId = code.substring(4, 6)

  console.log("Debug: Parsed IDs - article:", articleId, "source:", sourceId)

  const path = ID_TO_ARTICLE[articleId]
  const source = ID_TO_SOURCE[sourceId]

  if (path && source) {
    console.log("Debug: Successfully decoded - path:", path, "source:", source)
    return { path, source }
  } else {
    console.log("Debug: Unknown IDs:", { articleId, sourceId, path, source })
    console.log("Debug: Available article IDs:", Object.keys(ID_TO_ARTICLE))
    console.log("Debug: Available source IDs:", Object.keys(ID_TO_SOURCE))
    return null
  }
}

// Generate short URL (no storage needed!)
export const createShortUrl = (originalUrl, source, articleMeta = null) => {
  if (typeof window === "undefined") return originalUrl

  const shortCode = encodeUrl(originalUrl, source, articleMeta)

  // Use localhost for development, karmacall.com for production
  const baseUrl = window.location.hostname === "localhost" ? `http://localhost:8000` : `https://karmacall.com`

  const shortUrl = `${baseUrl}/s/${shortCode}`
  console.log("Debug: Created short URL:", shortUrl)

  return shortUrl
}

// Resolve short code back to original URL (no storage lookup needed!)
export const resolveShortUrl = shortCode => {
  if (typeof window === "undefined") return null

  console.log("Debug: Decoding short code:", shortCode)

  const decoded = decodeUrl(shortCode)
  if (!decoded) {
    console.log("Debug: Could not decode short code")
    return null
  }

  const { path, source } = decoded

  // Reconstruct the full URL
  const currentDomain = window.location.hostname === "localhost" ? "http://localhost:8000" : "https://karmacall.com"
  const fullUrl = `${currentDomain}${path}?utm_source=${source}&utm_medium=${source === "email" ? "email" : "social"}&utm_campaign=blog_share`

  console.log("Debug: Reconstructed URL:", fullUrl)
  return fullUrl
}

// Preload URLs (now just generates codes without storing)
export const preloadUrls = (articleMeta = null) => {
  if (typeof window === "undefined") return

  const currentUrl = window.location.href.split("?")[0] // Remove existing params
  const sources = ["copy_link", "email", "facebook", "twitter", "linkedin", "reddit", "bluesky"]

  console.log("Debug: Preloading URLs for:", currentUrl)
  sources.forEach(source => {
    const shortUrl = createShortUrl(currentUrl, source, articleMeta)
    console.log(`Debug: ${source} -> ${shortUrl}`)
  })
}

// Get all possible mappings for current page (for debugging)
export const getAllMappings = (articleMeta = null) => {
  if (typeof window === "undefined") return {}

  const currentUrl = window.location.href.split("?")[0]
  const sources = ["copy_link", "email", "facebook", "twitter", "linkedin", "reddit", "bluesky"]
  const mappings = {}

  sources.forEach(source => {
    const code = encodeUrl(currentUrl, source, articleMeta)
    const fullUrl = `${currentUrl}?utm_source=${source}&utm_medium=${source === "email" ? "email" : "social"}&utm_campaign=blog_share`
    mappings[code] = fullUrl
  })

  return mappings
}

// Helper functions for managing article IDs
export const generateNewArticleId = () => {
  let newId
  do {
    newId = generateArticleId()
  } while (Object.values(ARTICLE_IDS).includes(newId)) // Ensure uniqueness

  console.log("Generated new article ID:", newId)
  return newId
}

export const addArticleId = (path, id = null) => {
  const articleId = id || generateNewArticleId()
  console.log(`Add this to ARTICLE_IDS in urlShortener.js:`)
  console.log(`'${path}': '${articleId}',`)
  console.log(`\nOR better, add this to your MDX frontmatter:`)
  console.log(`articleId: "${articleId}"`)
  return articleId
}

// Utility to generate article IDs for existing posts
export const generateIdsForExistingPosts = () => {
  console.log("=== Article ID Generation ===")
  console.log("Add these to your MDX frontmatter:")
  console.log("")

  const posts = ["/blog/future-of-spam-blocking", "/blog/job-scam-texts-surge-2024"]

  posts.forEach(path => {
    const existingId = ARTICLE_IDS[path]
    console.log(`${path}:`)
    console.log(`articleId: "${existingId}"`)
    console.log("")
  })

  console.log("For the template page, the ID is already set: Kx9P")
}
