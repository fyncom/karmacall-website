import React from "react"
import "../../components/help-center.css"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"

export default function BlogIndex({ data }) {
  const { allMdx, allFile } = data
  const blogPosts = allMdx.nodes

  // Enhanced image finder with better matching logic
  const getImageFromSrc = srcPath => {
    if (!srcPath) return null

    // Handle different input types
    let pathString = srcPath
    
    // If srcPath is an object (GraphQL node), extract the publicURL
    if (typeof srcPath === 'object' && srcPath.publicURL) {
      pathString = srcPath.publicURL
    } else if (typeof srcPath === 'object' && srcPath.childImageSharp) {
      // If it's already a GraphQL image node, return the image directly
      return getImage(srcPath.childImageSharp.gatsbyImageData)
    } else if (typeof srcPath !== 'string') {
      // If it's not a string or expected object, return null
      return null
    }

    // Extract the relative path from various possible formats
    let relativePath = pathString
    if (pathString.includes("../../images/")) {
      relativePath = pathString.replace("../../images/", "")
    } else if (pathString.includes("../images/")) {
      relativePath = pathString.replace("../images/", "")
    } else if (pathString.includes("images/")) {
      relativePath = pathString.replace(/.*images\//, "")
    }

    // Try exact match first
    let imageNode = allFile.nodes.find(node => node.relativePath === relativePath)

    // If exact match fails, try filename matching (for cases where path might differ)
    if (!imageNode) {
      const filename = relativePath.split("/").pop().split(".")[0] // Get filename without extension
      imageNode = allFile.nodes.find(node => node.name === filename)
    }

    // Debug logging for development
    if (process.env.NODE_ENV === "development") {
      console.log(`Looking for image: ${pathString}`)
      console.log(`Relative path: ${relativePath}`)
      console.log(`Found node:`, imageNode)
      if (!imageNode) {
        console.log(
          "Available images:",
          allFile.nodes.map(n => n.relativePath)
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

  // blogPosts are already sorted by GraphQL query
  const remainder = blogPosts.length % 4
  const placeholdersNeeded = remainder === 0 ? 0 : 4 - remainder

  return (
    <Wrapper seo={seo}>
      <div className="blog-grid">
        {blogPosts.map(post => {
          const article = {
            id: post.id,
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            author: post.frontmatter.author,
            date: post.frontmatter.date,
            slug: post.fields.slug,
            featuredImage: post.frontmatter.featuredImagePath || post.frontmatter.featuredImage,
          }
          const gatsbyImage = getImageFromSrc(article.featuredImage)

          return (
            <div className="blog-card" key={post.id}>
              <Link to={article.slug} className="blog-link">
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

// GraphQL query for blog posts and images
export const query = graphql`
  query BlogIndexQuery {
    allMdx(
      filter: { fields: { slug: { regex: "/^\/blog\//" } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        fields {
          slug
        }
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
          featuredImagePath
          keywords
          imageDescription
          imageCredit
          draft
        }
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
`
