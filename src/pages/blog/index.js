import React from "react"
import "../../components/help-center.css"
import { Link, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"

export default function BlogIndex() {
  // Query all MDX blog posts and images
  const data = useStaticQuery(graphql`
    query BlogIndexQuery {
      allMdx(filter: { fields: { slug: { regex: "/^/blog/" } } }, sort: { frontmatter: { date: DESC } }) {
        nodes {
          id
          frontmatter {
            title
            description
            author
            date
            featuredImage {
              publicURL
            }
          }
          fields {
            slug
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
  `)

  // Enhanced image finder with better matching logic
  const getImageFromSrc = srcPath => {
    if (!srcPath) return null
    let relativePath = srcPath
    if (srcPath.includes("../../images/")) {
      relativePath = srcPath.replace("../../images/", "")
    } else if (srcPath.includes("../images/")) {
      relativePath = srcPath.replace("../images/", "")
    } else if (srcPath.includes("images/")) {
      relativePath = srcPath.replace(/.*images\//, "")
    }
    let imageNode = data.allFile.nodes.find(node => node.relativePath === relativePath)
    if (!imageNode) {
      const filename = relativePath.split("/").pop().split(".")[0]
      imageNode = data.allFile.nodes.find(node => node.name === filename)
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
    if (isNaN(date.getTime())) {
      return dateString
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const posts = data.allMdx.nodes
  const remainder = posts.length % 4
  const placeholdersNeeded = remainder === 0 ? 0 : 4 - remainder

  return (
    <Wrapper seo={seo}>
      <div className="blog-grid">
        {posts.map(post => {
          const { id, frontmatter, fields } = post
          const gatsbyImage = getImageFromSrc(frontmatter.featuredImage?.publicURL)
          return (
            <div className="blog-card" key={id}>
              <Link to={fields.slug} className="blog-link">
                <div className="blog-image-container">
                  {gatsbyImage ? (
                    <GatsbyImage
                      image={gatsbyImage}
                      alt={frontmatter.title}
                      className="blog-image"
                      loading="lazy"
                      style={{ width: "100%", height: "100%" }}
                      imgStyle={{
                        objectFit: frontmatter.featuredImage?.publicURL?.includes("illustrations/") ? "contain" : "cover",
                        objectPosition: frontmatter.featuredImage?.publicURL?.includes("interactive-rewards-blog-social-graphic") ? "left center" : "center center",
                      }}
                    />
                  ) : frontmatter.featuredImage?.publicURL ? (
                    <img
                      className="blog-image"
                      src={frontmatter.featuredImage.publicURL}
                      alt={frontmatter.title}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: frontmatter.featuredImage?.publicURL?.includes("illustrations/") ? "contain" : "cover",
                        objectPosition: frontmatter.featuredImage?.publicURL?.includes("interactive-rewards-blog-social-graphic") ? "left center" : "center center",
                      }}
                      onLoad={e => {
                        e.target.style.opacity = "1"
                      }}
                      onError={() => {
                        if (process.env.NODE_ENV === "development") {
                          console.warn(`Failed to load image: ${frontmatter.featuredImage?.publicURL}`)
                        }
                      }}
                    />
                  ) : (
                    <div className="blog-image-placeholder">
                      <div className="blog-image-placeholder-icon" role="img" aria-label="Book icon">
                        📖
                      </div>
                    </div>
                  )}
                </div>
                <div className="blog-content">
                  <h3 className="blog-title">{frontmatter.title}</h3>
                  <div className="blog-meta">
                    <span className="blog-author">{frontmatter.author || "KarmaCall Team"}</span>
                    <span className="blog-date">{formatDate(frontmatter.date)}</span>
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
