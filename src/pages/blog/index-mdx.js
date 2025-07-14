import React from "react"
import "../../components/help-center.css"
import { Link, useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"

export default function BlogIndexMDX() {
  // GraphQL query to get all blog posts from MDX files
  const data = useStaticQuery(graphql`
    query BlogIndexMDX {
      allMdx(filter: { fields: { slug: { regex: "/^/blog/" } } }, sort: { frontmatter: { date: DESC } }) {
        nodes {
          id
          frontmatter {
            title
            description
            author
            date(formatString: "YYYY-MM-DD")
            dateDisplay: date(formatString: "MMMM DD, YYYY")
            featuredImage
            keywords
          }
          fields {
            slug
          }
          excerpt(pruneLength: 200)
        }
      }
      allFile(
        filter: {
          sourceInstanceName: { eq: "images" }
          relativeDirectory: { regex: "/^(blog|illustrations)/" }
          extension: { regex: "/(jpg|jpeg|png|gif|webp)$/i" }
        }
      ) {
        nodes {
          relativePath
          name
          extension
          childImageSharp {
            gatsbyImageData(width: 400, height: 267, layout: FIXED, placeholder: BLURRED, formats: [AUTO, WEBP])
          }
        }
      }
    }
  `)

  // Enhanced image finder with better matching logic
  const getImageFromSrc = srcPath => {
    if (!srcPath) return null

    // Extract the relative path from various possible formats
    let relativePath
    if (srcPath.includes("../../images/")) {
      relativePath = srcPath.replace("../../images/", "")
    } else if (srcPath.includes("../images/")) {
      relativePath = srcPath.replace("../images/", "")
    } else if (srcPath.includes("images/")) {
      relativePath = srcPath.replace(/.*images\//, "")
    } else {
      relativePath = srcPath
    }

    // Try exact match first
    let imageNode = data.allFile.nodes.find(node => node.relativePath === relativePath)

    // If exact match fails, try filename matching (for cases where path might differ)
    if (!imageNode) {
      const filename = relativePath.split("/").pop().split(".")[0] // Get filename without extension
      imageNode = data.allFile.nodes.find(node => node.name === filename)
    }

    // Debug logging for development
    if (process.env.NODE_ENV === "development") {
      console.log(`Looking for image: ${srcPath}`)
      console.log(`Relative path: ${relativePath}`)
      console.log(`Found node:`, imageNode)
      if (!imageNode) {
        console.log(
          "Available images:",
          data.allFile.nodes.map(n => n.relativePath)
        )
      }
    }

    if (imageNode?.childImageSharp) {
      return getImage(imageNode.childImageSharp.gatsbyImageData)
    }

    return null
  }

  const seo = {
    title: "KarmaCall Blog",
    description: "Stay updated on the latest in KarmaCall technology, spam blocking innovations, and cybersecurity insights.",
    keywords: [
      "spam call blocker",
      "block spam calls",
      "get paid to block calls",
      "stop spam calls",
      "spam blocker",
      "KarmaCall",
      "scam call blocker",
      "robocall blocker",
      "blog",
    ],
  }

  const blogPosts = data.allMdx.nodes

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "var(--color-text, #333)",
              marginBottom: "1rem",
            }}
          >
            KarmaCall Blog
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "var(--color-text-secondary, #666)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Insights on spam blocking technology, cybersecurity, and the future of call protection.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {blogPosts.map(post => {
            const { frontmatter, fields, excerpt } = post
            const featuredImageData = getImageFromSrc(frontmatter.featuredImage)

            return (
              <article
                key={post.id}
                style={{
                  background: "var(--color-background, #fff)",
                  border: "1px solid var(--border-color, #eee)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"
                }}
                onMouseLeave={e => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"
                }}
              >
                <Link
                  to={fields.slug}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  {/* Featured Image */}
                  {featuredImageData && (
                    <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                      <GatsbyImage image={featuredImageData} alt={frontmatter.title} style={{ width: "100%", height: "100%" }} />
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ padding: "1.5rem" }}>
                    {/* Title */}
                    <h2
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "var(--color-text, #333)",
                        marginBottom: "0.75rem",
                        lineHeight: "1.3",
                      }}
                    >
                      {frontmatter.title}
                    </h2>

                    {/* Description */}
                    <p
                      style={{
                        color: "var(--color-text-secondary, #666)",
                        marginBottom: "1rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {frontmatter.description || excerpt}
                    </p>

                    {/* Meta */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.875rem",
                        color: "var(--color-text-muted, #888)",
                      }}
                    >
                      <span>{frontmatter.author}</span>
                      <span>{frontmatter.dateDisplay}</span>
                    </div>

                    {/* Keywords */}
                    {frontmatter.keywords && frontmatter.keywords.length > 0 && (
                      <div
                        style={{
                          marginTop: "1rem",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {frontmatter.keywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            style={{
                              background: "var(--color-primary-light, #e7f3ff)",
                              color: "var(--color-primary, #007acc)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            )
          })}
        </div>

        {/* Stats */}
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "var(--color-background-alt, #f9f9f9)",
            borderRadius: "12px",
          }}
        >
          <p style={{ color: "var(--color-text-secondary, #666)", margin: 0 }}>
            {blogPosts.length} {blogPosts.length === 1 ? "article" : "articles"} published
          </p>
        </div>
      </div>
    </Wrapper>
  )
}
