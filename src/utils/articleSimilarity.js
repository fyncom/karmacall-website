// Dynamic article similarity utility
// Works with GraphQL-sourced article data instead of static arrays

/**
 * Calculate similarity score between two articles based on various factors
 * @param {Object} currentArticle - The current article being viewed
 * @param {Object} candidateArticle - A potential related article
 * @returns {number} Similarity score (0-100, higher is more similar)
 */
export function calculateSimilarity(currentArticle, candidateArticle) {
  let score = 0
  const weights = {
    keywordOverlap: 60, // Most important factor
    sameAuthor: 15, // Articles by same author
    dateProximity: 10, // Articles published around the same time
    titleSimilarity: 10, // Similar words in titles
    sameBrand: 5, // Both mention same product (karmacall/fyncom)
  }

  // 1. Keyword overlap (most important)
  if (currentArticle.keywords && candidateArticle.keywords) {
    const currentKeywords = currentArticle.keywords.map(k => k.toLowerCase())
    const candidateKeywords = candidateArticle.keywords.map(k => k.toLowerCase())

    const intersection = currentKeywords.filter(keyword => candidateKeywords.includes(keyword))
    const union = [...new Set([...currentKeywords, ...candidateKeywords])]

    if (union.length > 0) {
      const overlapRatio = intersection.length / union.length
      score += overlapRatio * weights.keywordOverlap
    }
  }

  // 2. Same author
  if (currentArticle.author === candidateArticle.author) {
    score += weights.sameAuthor
  }

  // 3. Date proximity (articles published within 6 months get bonus points)
  if (currentArticle.date && candidateArticle.date) {
    const currentDate = new Date(currentArticle.date)
    const candidateDate = new Date(candidateArticle.date)
    const daysDiff = Math.abs(currentDate - candidateDate) / (1000 * 60 * 60 * 24)

    if (daysDiff <= 180) {
      // Within 6 months
      const proximityScore = Math.max(0, 1 - daysDiff / 180)
      score += proximityScore * weights.dateProximity
    }
  }

  // 4. Title similarity (simple word overlap)
  if (currentArticle.title && candidateArticle.title) {
    const currentWords = currentArticle.title
      .toLowerCase()
      .split(' ')
      .filter(word => word.trim().length > 3) // Only words longer than 3 chars
    const candidateWords = candidateArticle.title
      .toLowerCase()
      .split(' ')
      .filter(word => word.trim().length > 3)

    const titleIntersection = currentWords.filter(word => candidateWords.includes(word))

    if (currentWords.length > 0 && candidateWords.length > 0) {
      const titleSimilarity = titleIntersection.length / Math.max(currentWords.length, candidateWords.length)
      score += titleSimilarity * weights.titleSimilarity
    }
  }

  // 5. Same brand/product mentions
  const currentText = `${currentArticle.title} ${currentArticle.description}`.toLowerCase()
  const candidateText = `${candidateArticle.title} ${candidateArticle.description}`.toLowerCase()

  const brands = ["karmacall", "fyncom"]
  const currentBrands = brands.filter(brand => currentText.includes(brand))
  const candidateBrands = brands.filter(brand => candidateText.includes(brand))
  const brandOverlap = currentBrands.filter(brand => candidateBrands.includes(brand))

  if (brandOverlap.length > 0) {
    score += weights.sameBrand
  }

  return Math.min(100, Math.round(score))
}

/**
 * Find related articles for a given article using dynamic GraphQL data
 * @param {string} currentArticleSlug - Slug of the current article
 * @param {Array} allArticles - Array of all articles from GraphQL
 * @param {number} maxResults - Maximum number of related articles to return (default: 3)
 * @param {number} minSimilarity - Minimum similarity score to include (default: 10)
 * @returns {Array} Array of related articles sorted by similarity score
 */
export function findRelatedArticles(currentArticleSlug, allArticles, maxResults = 3, minSimilarity = 10) {
  // Find the current article
  const currentArticle = allArticles.find(article => article.slug === currentArticleSlug)

  if (!currentArticle) {
    console.warn(`Article not found: ${currentArticleSlug}`)
    // Return most recent articles as fallback
    return allArticles
      .filter(article => article.slug !== currentArticleSlug)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, maxResults)
  }

  // Calculate similarity scores for all other articles
  const candidateArticles = allArticles
    .filter(article => article.slug !== currentArticleSlug)
    .map(article => ({
      ...article,
      similarityScore: calculateSimilarity(currentArticle, article),
    }))
    .filter(article => article.similarityScore >= minSimilarity)
    .sort((a, b) => b.similarityScore - a.similarityScore)

  console.log(`🔍 Found ${candidateArticles.length} related articles for "${currentArticle.title}":`)
  candidateArticles.forEach(article => {
    console.log(`  - ${article.title} (similarity: ${article.similarityScore}%)`)
  })

  // If we don't have enough similar articles, fill with most recent
  if (candidateArticles.length < maxResults) {
    const recentArticles = allArticles
      .filter(article => article.slug !== currentArticleSlug && !candidateArticles.find(ca => ca.slug === article.slug))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, maxResults - candidateArticles.length)

    candidateArticles.push(...recentArticles)
    console.log(`📅 Added ${recentArticles.length} recent articles to fill results`)
  }

  return candidateArticles.slice(0, maxResults)
}

/**
 * Get article by slug from dynamic data
 * @param {string} slug - Article slug
 * @param {Array} allArticles - Array of all articles from GraphQL
 * @returns {Object|null} Article object or null if not found
 */
export function getArticleBySlug(slug, allArticles) {
  return allArticles.find(article => article.slug === slug) || null
}
