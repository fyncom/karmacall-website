import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const RelatedArticlesMDX = ({ currentArticleSlug, currentKeywords = [], maxArticles = 3, className, style }) => {
  console.log("🔍 RelatedArticlesMDX Debug:", { currentArticleSlug, currentKeywords, maxArticles })

  // Static blog articles database (same as in blog index)
  const staticBlogArticles = [
    {
      id: "shifting-frontlines-spam-2025",
      title: "The Shifting Frontlines of Spam: Interactive Report Reveals Global Crisis",
      description:
        "Our comprehensive interactive analysis reveals the staggering scale of global spam escalation. With over 137 million unwanted calls daily and $1.03 trillion in losses, discover the regional hotspots, AI-driven tactics, and strategic solutions in this data-rich report.",
      author: "KarmaCall Team",
      date: "2025-01-17",
      slug: "/blog/shifting-frontlines-spam-2025/",
      featuredImage: "../../images/blog/attention-economy-multi-screens.jpg",
      keywords: ["spam", "interactive", "report", "global", "crisis", "data"],
    },
    {
      id: "future-of-spam-blocking",
      title: "Get Cash Back for Blocking Spam, with KarmaCall Version 4.0",
      description:
        "KarmaCall 4.0 is a revolutionary new app that pays you to block spam calls. With its fresh new UI and infinitely long call blocking capability.",
      author: "KarmaCall Team",
      date: "2024-03-11",
      slug: "/blog/future-of-spam-blocking/",
      featuredImage: "../../images/blog/interactive-rewards-blog-social-graphic.jpg",
      keywords: ["karmacall", "spam", "blocking", "cash", "app", "4.0"],
    },
    {
      id: "job-scam-texts-surge-2024",
      title: "Job Scam Texts Cost Americans $470M in 2024 - Here's the Economic Solution",
      description:
        "Job scam texts were the #2 most common hoax in 2024, costing Americans nearly half a billion dollars. Discover how FynCom's refundable deposit technology makes mass scamming economically impossible.",
      author: "KarmaCall Team",
      date: "2024-06-07",
      slug: "/blog/job-scam-texts-surge-2024/",
      featuredImage: "../../images/illustrations/inbox-money.png",
      keywords: ["job scam", "texts", "economic", "solution", "fyncom", "deposit"],
    },
    {
      id: "keyboard-navigation-system",
      title: "Building an Accessible Keyboard Navigation System for Web Applications",
      description: "Learn how to implement a comprehensive keyboard navigation system that enhances accessibility and user experience for all users.",
      author: "KarmaCall Team",
      date: "2024-12-15",
      slug: "/blog/keyboard-navigation-system/",
      featuredImage: "../../images/blog/interactive-rewards-blog-social-graphic.jpg",
      keywords: ["accessibility", "keyboard", "navigation", "web", "development"],
    },
  ]

  // Query all blog posts and images
  const data = useStaticQuery(graphql`
    query RelatedArticlesMDX {
      allMdx(filter: { fields: { slug: { regex: "/^/blog/" } } }, sort: { frontmatter: { date: DESC } }) {
        nodes {
          id
          frontmatter {
            title
            description
            author
            date(formatString: "MMMM DD, YYYY")
            featuredImage
            keywords
          }
          fields {
            slug
          }
          excerpt(pruneLength: 120)
        }
      }
      allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { regex: "/^(blog|illustrations)$/" } }) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED, formats: [AUTO, WEBP])
          }
        }
      }
    }
  `)

  // Extract filename from the src path and get Gatsby image
  const getImageFromSrc = srcPath => {
    if (!srcPath) return null

    // Extract the relative path from various possible formats
    let relativePath = srcPath
    if (srcPath.includes("../../images/")) {
      relativePath = srcPath.replace("../../images/", "")
    } else if (srcPath.includes("../images/")) {
      relativePath = srcPath.replace("../images/", "")
    } else if (srcPath.includes("images/")) {
      relativePath = srcPath.replace(/.*images\//, "")
    }

    // Find the matching image in our query results
    const imageNode = data.allFile.nodes.find(node => node.relativePath === relativePath)

    if (imageNode?.childImageSharp) {
      return getImage(imageNode.childImageSharp.gatsbyImageData)
    }

    return null
  }

  // Calculate similarity between articles
  const calculateSimilarity = (article1, article2) => {
    let score = 0
    const weights = {
      keywordMatch: 30,
      titleMatch: 20,
      authorMatch: 10,
      descriptionMatch: 15,
      recentness: 25,
    }

    // Keyword overlap
    const keywords1 = article1.keywords || []
    const keywords2 = article2.keywords || []
    const keywordOverlap = keywords1.filter(k => keywords2.includes(k))
    if (keywordOverlap.length > 0) {
      score += weights.keywordMatch * (keywordOverlap.length / Math.max(keywords1.length, keywords2.length))
    }

    // Title word overlap
    const title1Words = article1.title.toLowerCase().split(/\s+/)
    const title2Words = article2.title.toLowerCase().split(/\s+/)
    const titleOverlap = title1Words.filter(word => word.length > 3 && title2Words.includes(word))
    if (titleOverlap.length > 0) {
      score += weights.titleMatch * (titleOverlap.length / Math.max(title1Words.length, title2Words.length))
    }

    // Same author bonus
    if (article1.author === article2.author) {
      score += weights.authorMatch
    }

    // Description similarity
    const desc1Words = (article1.description || "").toLowerCase().split(/\s+/)
    const desc2Words = (article2.description || "").toLowerCase().split(/\s+/)
    const descOverlap = desc1Words.filter(word => word.length > 4 && desc2Words.includes(word))
    if (descOverlap.length > 0) {
      score += weights.descriptionMatch * (descOverlap.length / Math.max(desc1Words.length, desc2Words.length))
    }

    // Recentness factor (more recent articles get slightly higher scores)
    const date1 = new Date(article1.date)
    const date2 = new Date(article2.date)
    const daysDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24)
    const recentnessScore = Math.max(0, weights.recentness * (1 - daysDiff / 365))
    score += recentnessScore

    return Math.min(100, Math.round(score))
  }

  // Find related articles
  const findRelatedArticles = () => {
    // Combine MDX articles and static articles
    const allArticles = [
      ...data.allMdx.nodes.map(node => ({
        ...node,
        type: "mdx",
        title: node.frontmatter.title,
        description: node.frontmatter.description,
        author: node.frontmatter.author,
        date: node.frontmatter.date,
        keywords: node.frontmatter.keywords || [],
        slug: node.fields.slug,
        featuredImage: node.frontmatter.featuredImage,
        excerpt: node.excerpt,
      })),
      ...staticBlogArticles.map(article => ({
        ...article,
        type: "static",
        frontmatter: {
          title: article.title,
          description: article.description,
          author: article.author,
          date: article.date,
          featuredImage: article.featuredImage,
          keywords: article.keywords,
        },
        fields: { slug: article.slug },
        excerpt: article.description.substring(0, 120) + "...",
      })),
    ]

    // Find the current article
    const currentArticle = allArticles.find(article => article.slug === currentArticleSlug)

    if (!currentArticle) {
      console.warn(`Current article not found: ${currentArticleSlug}`)
      // Return most recent articles as fallback
      return allArticles.filter(article => article.slug !== currentArticleSlug).slice(0, maxArticles)
    }

    // Transform current article to match expected format
    const currentArticleData = {
      title: currentArticle.title,
      description: currentArticle.description,
      author: currentArticle.author,
      date: currentArticle.date,
      keywords: currentArticle.keywords || currentKeywords,
    }

    // Calculate similarity scores for all other articles
    const candidateArticles = allArticles
      .filter(article => article.slug !== currentArticleSlug)
      .map(article => ({
        ...article,
        similarityScore: calculateSimilarity(currentArticleData, {
          title: article.title,
          description: article.description,
          author: article.author,
          date: article.date,
          keywords: article.keywords || [],
        }),
      }))
      .filter(article => article.similarityScore >= 10)
      .sort((a, b) => b.similarityScore - a.similarityScore)

    console.log(`🔍 Found ${candidateArticles.length} related articles for "${currentArticle.title}":`)
    candidateArticles.slice(0, maxArticles).forEach(article => {
      console.log(`  - ${article.title} (similarity: ${article.similarityScore}%)`)
    })

    return candidateArticles.slice(0, maxArticles)
  }

  const relatedArticles = findRelatedArticles()

  console.log("🔍 RelatedArticlesMDX Results:", {
    totalArticles: data.allMdx.nodes.length + staticBlogArticles.length,
    mdxArticles: data.allMdx.nodes.length,
    staticArticles: staticBlogArticles.length,
    foundRelated: relatedArticles.length,
    articles: relatedArticles.map(a => ({ title: a.title, score: a.similarityScore })),
  })

  if (relatedArticles.length === 0) {
    console.log("🔍 No related articles found, returning null")
    return null
  }

  return (
    <section className={className} style={style}>
      <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "2px solid var(--border-color, #eee)" }}>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1.5rem",
            color: "var(--color-text, #333)",
          }}
        >
          Related Articles
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {relatedArticles.map(article => {
            const image = getImageFromSrc(article.frontmatter.featuredImage)

            return (
              <Link
                key={article.id}
                to={article.fields.slug}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  background: "var(--color-background, #fff)",
                  border: "1px solid var(--border-color, #eee)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                {/* Image */}
                {image && (
                  <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                    <GatsbyImage image={image} alt={article.frontmatter.title} style={{ width: "100%", height: "100%" }} />
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: "1rem" }}>
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      lineHeight: "1.3",
                      color: "var(--color-text, #333)",
                    }}
                  >
                    {article.frontmatter.title}
                  </h4>

                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-text-secondary, #666)",
                      marginBottom: "0.75rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {article.frontmatter.description || article.excerpt}
                  </p>

                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-muted, #888)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{article.frontmatter.author}</span>
                    <span>{article.frontmatter.date}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RelatedArticlesMDX
