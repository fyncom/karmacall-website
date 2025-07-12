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
            gatsbyImageData(width: 800, layout: CONSTRAINED, placeholder: BLURRED, formats: [AUTO, WEBP])
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

    // Find the matching image in our query results
    const imageNode = data.allFile.nodes.find(node => node.relativePath === relativePath)

    if (imageNode?.childImageSharp) {
      return getImage(imageNode.childImageSharp.gatsbyImageData)
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
              <div className="featured-image-placeholder-subtitle">Image not configured</div>
              <div className="featured-image-placeholder-path">{src || "No image path provided"}</div>
            </div>
          </div>
        )}
      </div>

      {/* Image description and credit */}
      {(imageDescription || imageCredit) && (
        <div className="featured-image-meta">
          {imageDescription && <div className="featured-image-description">{imageDescription}</div>}
          {imageCredit && <div className="featured-image-credit">Credit: {imageCredit}</div>}
        </div>
      )}
    </div>
  )
}

export default FeaturedImage
