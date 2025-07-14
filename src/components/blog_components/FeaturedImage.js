import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const FeaturedImage = ({ src, alt, title, imageDescription, imageCredit }) => {
  const [imageError, setImageError] = React.useState(false)

  // Query all blog images
  const data = useStaticQuery(graphql`
    query BlogFeaturedImages {
      allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { regex: "/^(blog|illustrations)$/" } }) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(width: 1200, layout: CONSTRAINED, placeholder: BLURRED, formats: [AUTO, WEBP], quality: 90)
          }
        }
      }
    }
  `)

  // Extract filename from the src path (e.g., "../../images/blog/image.jpg" -> "blog/image.jpg")
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

    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 FeaturedImage debug:", {
        originalSrc: srcPath,
        relativePath,
        availableImages: data.allFile.nodes.map(n => n.relativePath),
      })
    }

    // Find the matching image in our query results
    const imageNode = data.allFile.nodes.find(node => node.relativePath === relativePath)

    if (imageNode?.childImageSharp) {
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Found Gatsby image for:", relativePath)
      }
      return getImage(imageNode.childImageSharp.gatsbyImageData)
    }

    if (process.env.NODE_ENV === "development") {
      console.log("❌ No Gatsby image found for:", relativePath)
    }
    return null
  }

  // Check if src is empty, a placeholder, or invalid
  const isValidImageSrc = src && src !== "../../images/blog/your-image-filename.jpg" && !src.includes("your-image-filename")
  const gatsbyImage = getImageFromSrc(src)

  // Always render the container, even without an image
  return (
    <div className="featured-image-container">
      <div className="featured-image-wrapper">
        {isValidImageSrc && gatsbyImage && !imageError ? (
          // Render Gatsby optimized image if available
          <GatsbyImage
            image={gatsbyImage}
            alt={alt || title || "Featured image"}
            className="featured-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : isValidImageSrc ? (
          // Fallback to regular img tag if Gatsby image not found
          <img src={src} alt={alt || title || "Featured image"} className="featured-image" onError={() => setImageError(true)} loading="lazy" />
        ) : (
          // Render placeholder when no valid image
          <div className="featured-image-placeholder">
            <div className="featured-image-placeholder-content">
              <div className="featured-image-placeholder-icon">📖</div>
              <div className="featured-image-placeholder-title">Featured Image</div>
              <div className="featured-image-placeholder-subtitle">{imageError ? "Failed to load" : "Coming soon..."}</div>
            </div>
          </div>
        )}

        {/* Optional overlay for better text readability if needed */}
        <div className="featured-image-overlay" />
      </div>

      {/* Image description and credits - only show if provided */}
      {(imageDescription || imageCredit) && (
        <div className="featured-image-description">
          {imageDescription && (
            <p style={{ margin: imageCredit ? "0 0 0.5rem 0" : "0" }}>
              <strong>Image description:</strong> {imageDescription}
            </p>
          )}
          {imageCredit && (
            <p className="featured-image-credit">
              <strong>Credits:</strong> {imageCredit}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default FeaturedImage
