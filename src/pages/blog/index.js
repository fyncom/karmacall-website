import React from "react"
import "../../components/help-center.css"
import { Link, useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"

export default function BlogIndex() {
  // Query all blog articles and images dynamically
  const data = useStaticQuery(graphql`
    query BlogIndexQuery {
      allMdx(
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          id
          frontmatter {
            title
            description
            author
            date
            featuredImage {
              publicURL
              childImageSharp {
                gatsbyImageData(width: 400, height: 267, layout: FIXED, placeholder: BLURRED, formats: [AUTO, WEBP])
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  `)


  const seo = {
    title: "KarmaCall Blog",
    description: "Stay updated on the latest in KarmaCall technology.",
  }

  const formatDate = dateString => {
    if (!dateString) return "Date not available"

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString // Return original string if parsing fails
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Convert GraphQL data to article format (already sorted by date DESC in query)
  const blogArticles = data.allMdx.nodes.map(node => ({
    id: node.id,
    title: node.frontmatter.title,
    description: node.frontmatter.description,
    author: node.frontmatter.author,
    date: node.frontmatter.date,
    slug: node.fields.slug,
    featuredImage: node.frontmatter.featuredImage?.publicURL || node.frontmatter.featuredImage,
    featuredImageSharp: node.frontmatter.featuredImage?.childImageSharp,
  }))

  const remainder = blogArticles.length % 4
  const placeholdersNeeded = remainder === 0 ? 0 : 4 - remainder

  return (
    <Wrapper seo={seo}>
      <div className="blog-grid">
        {blogArticles.map(article => {
          // Use the sharp image data from GraphQL
          const gatsbyImage = article.featuredImageSharp?.gatsbyImageData ? getImage(article.featuredImageSharp.gatsbyImageData) : null

          return (
            <div className="blog-card" key={article.id}>
              <Link to={`${article.slug}`} className="blog-link">
                <div className="blog-image-container">
                  {gatsbyImage ? (
                    // Always prefer GatsbyImage when available for optimization
                    <GatsbyImage
                      image={gatsbyImage}
                      alt={article.title}
                      className="blog-image"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      imgStyle={{
                        objectFit: article.featuredImage.includes("illustrations/") ? "contain" : "cover",
                        objectPosition: article.featuredImage.includes("interactive-rewards-blog-social-graphic") ? "left center" : "center center",
                      }}
                    />
                  ) : article.featuredImage ? (
                    // Fallback to regular img only if GatsbyImage processing failed
                    <img
                      className="blog-image"
                      src={article.featuredImage}
                      alt={article.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: article.featuredImage.includes("illustrations/") ? "contain" : "cover",
                        objectPosition: article.featuredImage.includes("interactive-rewards-blog-social-graphic") ? "left center" : "center center",
                      }}
                      onLoad={e => {
                        e.target.style.opacity = "1"
                      }}
                      onError={() => {
                        if (process.env.NODE_ENV === "development") {
                          console.warn(`Failed to load image: ${article.featuredImage}`)
                        }
                      }}
                    />
                  ) : (
                    // No image placeholder
                    <div className="blog-image-placeholder">
                      <div className="blog-image-placeholder-icon" role="img" aria-label="Book icon">📖</div>
                    </div>
                  )}
                </div>
                <div className="blog-content">
                  <h3 className="blog-title">{article.title}</h3>
                  <div className="blog-meta">
                    <span className="blog-author">{article.author || "KarmaCall Team"}</span>
                    <span className="blog-date">{formatDate(article.date)}</span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
        {Array.from({ length: placeholdersNeeded }, (_, index) => (
          <div className="blog-placeholder" key={`placeholder-${index}`}></div>
        ))}
      </div>
    </Wrapper>
  )
}
