// URL Shortener Utility for KarmaCall
// Uses 8-character Base32 slugs with hash table mapping

// Base32 character set (no confusing characters like 0/O or 1/l)
const BASE32_CHARS = "ABCDEFGHJKMNPQRSTVWXYZ23456789"

// Generate a random 8-character Base32 slug
const generateBase32Slug = () => {
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += BASE32_CHARS[Math.floor(Math.random() * BASE32_CHARS.length)]
  }
  return result
}

// Hash table to store slug -> full URL mappings
// In production, this would be stored in a database
const URL_HASH_TABLE = new Map()

// Predefined slugs for existing articles (for consistency)
const PREDEFINED_SLUGS = {
  "/blog/template": {
    copy_link: "KX9PCX23",
    email: "M7NQFM45",
    facebook: "R3VKQZ67",
    twitter: "B8JTWR89",
    linkedin: "C9KXBT12",
    reddit: "D4MYJK34",
    bluesky: "F6PZNP56",
  },
  "/blog/future-of-spam-blocking": {
    copy_link: "G7QACX78",
    email: "H8RBFM90",
    facebook: "J9SCQZ12",
    twitter: "K2TDWR34",
    linkedin: "L3UEBT56",
    reddit: "M4VFJK78",
    bluesky: "N5WGNP90",
  },
  "/blog/job-scam-texts-surge-2024": {
    copy_link: "P6XHCX12",
    email: "Q7YIFM34",
    facebook: "R8ZJQZ56",
    twitter: "S9AKWR78",
    linkedin: "T2BLBT90",
    reddit: "V3CMJK12",
    bluesky: "W4DNNP34",
  },
}

// Initialize hash table with predefined slugs
const initializeHashTable = () => {
  if (typeof window === "undefined") {
    console.log("Debug: Skipping hash table init - no window object")
    return
  }

  console.log("Debug: Starting hash table initialization...")
  console.log("Debug: Current domain:", window.location.hostname)

  let addedCount = 0
  Object.entries(PREDEFINED_SLUGS).forEach(([path, sources]) => {
    console.log("Debug: Processing path:", path)
    Object.entries(sources).forEach(([source, slug]) => {
      const currentDomain = window.location.hostname === "localhost" ? "http://localhost:8000" : "https://karmacall.com"
      const fullUrl = `${currentDomain}${path}?utm_source=${source}&utm_medium=${source === "email" ? "email" : "social"}&utm_campaign=blog_share`

      // Only add if not already present
      if (!URL_HASH_TABLE.has(slug)) {
        URL_HASH_TABLE.set(slug, fullUrl)
        addedCount++
        console.log(`Debug: Added mapping: ${slug} -> ${fullUrl}`)
      } else {
        console.log(`Debug: Slug ${slug} already exists, skipping`)
      }
    })
  })

  console.log(`Debug: Hash table initialization complete. Added ${addedCount} new mappings. Total size: ${URL_HASH_TABLE.size}`)
}

// Get or create a slug for a specific URL + source combination
const getOrCreateSlug = (url, source) => {
  let urlPath = url.replace(/^https?:\/\/[^\/]+/, "") // Remove domain, keep path

  // Normalize path by removing trailing slash (except for root)
  if (urlPath.length > 1 && urlPath.endsWith("/")) {
    urlPath = urlPath.slice(0, -1)
  }

  console.log("Debug: Original URL:", url)
  console.log("Debug: Normalized path:", urlPath, "source:", source)
  console.log("Debug: Available predefined paths:", Object.keys(PREDEFINED_SLUGS))

  // Check if we have a predefined slug for this combination
  if (PREDEFINED_SLUGS[urlPath] && PREDEFINED_SLUGS[urlPath][source]) {
    const slug = PREDEFINED_SLUGS[urlPath][source]
    console.log("Debug: ✅ Using predefined slug:", slug, "for", urlPath, "+", source)
    return slug
  } else {
    console.log("Debug: ❌ No predefined slug found for:", urlPath, "+", source)
  }

  // Generate a new unique slug
  let slug
  let attempts = 0
  do {
    slug = generateBase32Slug()
    attempts++
    if (attempts > 100) {
      console.error("Failed to generate unique slug after 100 attempts")
      break
    }
  } while (URL_HASH_TABLE.has(slug))

  // Store the mapping
  const currentDomain = window.location.hostname === "localhost" ? "http://localhost:8000" : "https://karmacall.com"
  const fullUrl = `${currentDomain}${urlPath}?utm_source=${source}&utm_medium=${source === "email" ? "email" : "social"}&utm_campaign=blog_share`
  URL_HASH_TABLE.set(slug, fullUrl)

  console.log("Debug: Generated new slug:", slug, "for", urlPath, "+", source)
  console.log("Debug: Maps to:", fullUrl)

  return slug
}

// Generate short URL using hash table approach
export const createShortUrl = (originalUrl, source, articleMeta = null) => {
  if (typeof window === "undefined") return originalUrl

  // Initialize hash table if not already done
  if (URL_HASH_TABLE.size === 0) {
    initializeHashTable()
  }

  const slug = getOrCreateSlug(originalUrl, source)

  // Use localhost for development, karmacall.com for production
  const baseUrl = window.location.hostname === "localhost" ? `http://localhost:8000` : `https://karmacall.com`

  const shortUrl = `${baseUrl}/s/${slug}`
  console.log("Debug: Created short URL:", shortUrl)

  return shortUrl
}

// Resolve short code back to original URL (hash table lookup)
export const resolveShortUrl = slug => {
  if (typeof window === "undefined") return null

  console.log("Debug: Looking up slug:", slug)
  console.log("Debug: Hash table size before init:", URL_HASH_TABLE.size)

  // Always initialize hash table to ensure it's populated
  initializeHashTable()

  console.log("Debug: Hash table size after init:", URL_HASH_TABLE.size)
  console.log("Debug: All available slugs:", Array.from(URL_HASH_TABLE.keys()))

  const fullUrl = URL_HASH_TABLE.get(slug)

  if (fullUrl) {
    console.log("Debug: SUCCESS - Found mapping:", slug, "->", fullUrl)
    return fullUrl
  } else {
    console.log("Debug: FAILED - No mapping found for slug:", slug)
    console.log("Debug: Checking if slug exists in any form...")

    // Check if the slug exists with different casing
    const lowerSlug = slug.toLowerCase()
    const upperSlug = slug.toUpperCase()

    for (const [key, value] of URL_HASH_TABLE.entries()) {
      if (key.toLowerCase() === lowerSlug) {
        console.log("Debug: Found case mismatch - stored:", key, "received:", slug)
        return value
      }
    }

    console.log("Debug: No case variations found either")
    return null
  }
}

// Preload URLs for current page
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

// Get all mappings for current page (for debugging)
export const getAllMappings = (articleMeta = null) => {
  if (typeof window === "undefined") return {}

  const currentUrl = window.location.href.split("?")[0]
  const sources = ["copy_link", "email", "facebook", "twitter", "linkedin", "reddit", "bluesky"]
  const mappings = {}

  sources.forEach(source => {
    const shortUrl = createShortUrl(currentUrl, source, articleMeta)
    const slug = shortUrl.split("/s/")[1]
    const fullUrl = URL_HASH_TABLE.get(slug)
    mappings[slug] = fullUrl
  })

  return mappings
}

// Generate slugs for a new article
export const generateSlugsForNewArticle = articlePath => {
  console.log(`=== Slugs for new article: ${articlePath} ===`)
  console.log("Add these to PREDEFINED_SLUGS in urlShortener.js:")
  console.log("")
  console.log(`'${articlePath}': {`)

  const sources = ["copy_link", "email", "facebook", "twitter", "linkedin", "reddit", "bluesky"]
  const slugs = {}

  sources.forEach(source => {
    let slug
    do {
      slug = generateBase32Slug()
    } while (Object.values(PREDEFINED_SLUGS).some(article => Object.values(article).includes(slug)))

    slugs[source] = slug
    console.log(`  '${source}': '${slug}',`)
  })

  console.log("},")
  console.log("")

  return slugs
}

// Utility to show all current mappings
export const showAllMappings = () => {
  if (typeof window === "undefined") return

  if (URL_HASH_TABLE.size === 0) {
    initializeHashTable()
  }

  console.log("=== All URL Mappings ===")
  URL_HASH_TABLE.forEach((url, slug) => {
    console.log(`${slug} -> ${url}`)
  })
}

// Test function to verify hash table functionality
export const testHashTable = () => {
  console.log("=== Hash Table Test ===")

  // Initialize
  initializeHashTable()

  // Test a known slug
  const testSlug = "KX9PCX23" // Template copy_link
  console.log(`Testing slug: ${testSlug}`)

  const result = resolveShortUrl(testSlug)
  console.log(`Result: ${result}`)

  if (result) {
    console.log("✅ Hash table lookup working correctly!")
  } else {
    console.log("❌ Hash table lookup failed!")
  }

  return result
}
