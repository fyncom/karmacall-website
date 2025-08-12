import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const RelatedArticles = ({ currentArticleSlug, keywords = [], maxArticles = 3, className, style }) => {
  const data = useStaticQuery(graphql`
    query RelatedArticlesDynamicQuery {
      allMdx(sort: { frontmatter: { date: DESC } }) {
        nodes {
          fields {
            slug
          }
          frontmatter {
            title
            description
            author
            date(formatString: "MMMM DD, YYYY")
            keywords
            featuredImage {
              publicURL
              childImageSharp {
                gatsbyImageData(width: 600, layout: CONSTRAINED, placeholder: BLURRED)
              }
            }
          }
        }
      }
    }
  `)

  const normalize = arr => (Array.isArray(arr) ? arr.map(k => String(k).toLowerCase().trim()).filter(Boolean) : [])
  const currentKeywords = normalize(keywords)

  const normalizedCurrentSlug = (currentArticleSlug || "").replace(/\/?$/, "/")
  const candidates =
    data?.allMdx?.nodes?.filter(n => {
      const nodeSlug = (n?.fields?.slug || "").replace(/\/?$/, "/")
      return nodeSlug !== normalizedCurrentSlug
    }) || []

  const scoreArticle = (node, index) => {
    const nodeKeywords = normalize(node?.frontmatter?.keywords)
    const overlap = nodeKeywords.filter(k => currentKeywords.includes(k)).length
    const recencyBoost = Math.max(0, 10 - index) * 0.05
    return overlap + recencyBoost
  }

  const ranked = candidates
    .map((n, i) => ({ node: n, score: scoreArticle(n, i) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxArticles)
    .map(x => x.node)

  if (!ranked.length) return null

  return (
    <div className={className} style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "2px solid var(--border-color, #eee)", ...style }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "2rem", color: "var(--color-text, #333)", textAlign: "center" }}>Related Articles</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {ranked.map((article, index) => {
          const fm = article.frontmatter || {}
          const gImg = getImage(fm.featuredImage?.childImageSharp?.gatsbyImageData)
          return (
            <Link
              key={index}
              className={"blog-link"}
              to={`${article.fields.slug}?utm_source=blog_article&utm_medium=related_articles&utm_campaign=internal_linking`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                border: "1px solid var(--border-color, #eee)",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "all 0.2s ease",
                backgroundColor: "var(--color-background, white)",
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-4px)"
                e.target.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)"
                e.target.style.borderColor = "var(--color-primary, #007acc)"
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)"
                e.target.style.borderColor = "var(--border-color, #eee)"
              }}
            >
              <div style={{ position: "relative", width: "100%", paddingTop: "75%", backgroundColor: "var(--color-background-alt, #f9f9f9)" }}>
                {gImg ? (
                  <GatsbyImage
                    image={gImg}
                    alt={fm.title}
                    style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                    imgStyle={{ objectFit: "cover", objectPosition: "center" }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url('${fm.featuredImage?.publicURL || ""}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}
              </div>
              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", minHeight: "180px" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "var(--color-text, #333)",
                    lineHeight: "1.3",
                    wordBreak: "break-word",
                  }}
                >
                  {fm.title}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary, #666)", lineHeight: "1.4", margin: 0, wordBreak: "break-word", flex: 1 }}>
                  {fm.description}
                </p>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-text-secondary, #666)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.75rem",
                  }}
                >
                  <span style={{ textAlign: "left" }}>{fm.author || "KarmaCall Team"}</span>
                  <span style={{ textAlign: "right" }}>{fm.date}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default RelatedArticles
