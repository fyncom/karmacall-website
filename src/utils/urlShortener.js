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

// Store for dynamically generated slugs (for export/persistence)
const DYNAMIC_SLUGS = {}

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

// Auto-detect blog articles and pre-generate slugs
const autoDetectAndGenerateSlugs = () => {
  if (typeof window === "undefined") return

  const currentPath = window.location.pathname
  
  // Only run on blog pages
  if (!currentPath.startsWith('/blog/')) return
  
  // Normalize the current path
  let normalizedPath = currentPath
  if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1)
  }
  
  // Check if this path already has predefined slugs
  if (PREDEFINED_SLUGS[normalizedPath]) {
    console.log(`Debug: Path ${normalizedPath} already has predefined slugs`)
    return
  }
  
  // Check if we've already generated dynamic slugs for this path
  if (DYNAMIC_SLUGS[normalizedPath]) {
    console.log(`Debug: Path ${normalizedPath} already has dynamic slugs`)
    return
  }
  
  // Auto-generate slugs for this new article
  console.log(`Debug: 🆕 Auto-generating slugs for new article: ${normalizedPath}`)
  
  const sources = ["copy_link", "email", "facebook", "twitter", "linkedin", "reddit", "bluesky"]
  DYNAMIC_SLUGS[normalizedPath] = {}
  
  sources.forEach(source => {
    // Generate unique slug
    let slug
    let attempts = 0
    do {
      slug = generateBase32Slug()
      attempts++
      if (attempts > 100) {
        console.error("Failed to generate unique slug after 100 attempts")
        break
      }
    } while (
      URL_HASH_TABLE.has(slug) || 
      Object.values(PREDEFINED_SLUGS).some(article => Object.values(article).includes(slug)) ||
      Object.values(DYNAMIC_SLUGS).some(article => Object.values(article).includes(slug))
    )
    
    // Store the slug
    DYNAMIC_SLUGS[normalizedPath][source] = slug
    
    // Add to hash table
    const currentDomain = window.location.hostname === "localhost" ? "http://localhost:8000" : "https://karmacall.com"
    const fullUrl = `${currentDomain}${normalizedPath}?utm_source=${source}&utm_medium=${source === "email" ? "email" : "social"}&utm_campaign=blog_share`
    URL_HASH_TABLE.set(slug, fullUrl)
    
    console.log(`Debug: Generated ${source}: ${slug}`)
  })
  
  console.log(`Debug: ✅ Auto-generated all slugs for ${normalizedPath}`)
  console.log("Debug: 💡 Tip: Use exportDynamicSlugs() to make these permanent")
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

  // Auto-detect and generate slugs for current article if needed
  autoDetectAndGenerateSlugs()
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
  }

  // Check if we have a dynamically generated slug for this combination
  if (DYNAMIC_SLUGS[urlPath] && DYNAMIC_SLUGS[urlPath][source]) {
    const slug = DYNAMIC_SLUGS[urlPath][source]
    console.log("Debug: ✅ Using auto-generated slug:", slug, "for", urlPath, "+", source)
    return slug
  }

  console.log("Debug: ❌ No existing slug found for:", urlPath, "+", source)

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
  } while (URL_HASH_TABLE.has(slug) || Object.values(PREDEFINED_SLUGS).some(article => Object.values(article).includes(slug)))

  // Store the mapping in hash table
  const currentDomain = window.location.hostname === "localhost" ? "http://localhost:8000" : "https://karmacall.com"
  const fullUrl = `${currentDomain}${urlPath}?utm_source=${source}&utm_medium=${source === "email" ? "email" : "social"}&utm_campaign=blog_share`
  URL_HASH_TABLE.set(slug, fullUrl)

  // Store in dynamic slugs for export
  if (!DYNAMIC_SLUGS[urlPath]) {
    DYNAMIC_SLUGS[urlPath] = {}
  }
  DYNAMIC_SLUGS[urlPath][source] = slug

  console.log("Debug: 🆕 Generated new slug:", slug, "for", urlPath, "+", source)
  console.log("Debug: Maps to:", fullUrl)
  console.log("Debug: Added to dynamic slugs for export")

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

// Export dynamically generated slugs for permanent storage
export const exportDynamicSlugs = () => {
  if (Object.keys(DYNAMIC_SLUGS).length === 0) {
    console.log("No dynamic slugs to export")
    return null
  }

  console.log("=== Dynamically Generated Slugs ===")
  console.log("Add these to PREDEFINED_SLUGS in urlShortener.js:")
  console.log("")

  Object.entries(DYNAMIC_SLUGS).forEach(([path, sources]) => {
    console.log(`'${path}': {`)
    Object.entries(sources).forEach(([source, slug]) => {
      console.log(`  '${source}': '${slug}',`)
    })
    console.log("},")
  })

  console.log("")
  console.log("Copy the above and add to PREDEFINED_SLUGS, then clear dynamic slugs with clearDynamicSlugs()")

  return DYNAMIC_SLUGS
}

// Clear dynamic slugs after they've been moved to predefined
export const clearDynamicSlugs = () => {
  const count = Object.keys(DYNAMIC_SLUGS).length
  Object.keys(DYNAMIC_SLUGS).forEach(key => delete DYNAMIC_SLUGS[key])
  console.log(`Cleared ${count} dynamic slug entries`)
}

// Show current dynamic slugs
export const showDynamicSlugs = () => {
  console.log("=== Current Dynamic Slugs ===")
  if (Object.keys(DYNAMIC_SLUGS).length === 0) {
    console.log("No dynamic slugs generated yet")
  } else {
    console.log(JSON.stringify(DYNAMIC_SLUGS, null, 2))
  }
  return DYNAMIC_SLUGS
}

// Auto-generate slugs for a specific article path
export const autoGenerateSlugsForPath = articlePath => {
  const sources = ["copy_link", "email", "facebook", "twitter", "linkedin", "reddit", "bluesky"]
  const generatedSlugs = {}

  console.log(`Auto-generating slugs for: ${articlePath}`)

  sources.forEach(source => {
    // This will automatically generate and store the slug
    const dummyUrl = `http://localhost:8000${articlePath}`
    const shortUrl = createShortUrl(dummyUrl, source)
    const slug = shortUrl.split("/s/")[1]
    generatedSlugs[source] = slug
  })

  console.log("Generated slugs:", generatedSlugs)
  console.log("Use exportDynamicSlugs() to get the code to add to PREDEFINED_SLUGS")

  return generatedSlugs
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
