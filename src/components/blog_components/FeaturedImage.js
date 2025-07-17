import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const FeaturedImage = ({ src, alt, title, imageDescription, imageCredit, gatsbyImageData }) => {
  // Use the pre-processed Gatsby image data if available
  const gatsbyImage = gatsbyImageData ? getImage(gatsbyImageData) : null

  // Check if we have a valid image source
  const hasValidImage = gatsbyImage || (src && !src.includes("your-image-filename"))

  return (
    <div className="featured-image-container">
      <div className="featured-image-wrapper">
        {hasValidImage ? (
          gatsbyImage ? (
            // Use optimized Gatsby image when available
            <GatsbyImage
              image={gatsbyImage}
              alt={alt || title || "Featured image"}
              className="featured-image"
              loading="lazy"
            />
          ) : (
            // Fallback to regular img if no Gatsby processing
            <img 
              src={src} 
              alt={alt || title || "Featured image"} 
              className="featured-image" 
              loading="lazy" 
            />
          )
        ) : (
          // Placeholder when no image
          <div className="featured-image-placeholder">
            <div className="featured-image-placeholder-content">
              <div className="featured-image-placeholder-icon">📖</div>
              <div className="featured-image-placeholder-title">Featured Image</div>
              <div className="featured-image-placeholder-subtitle">Coming soon...</div>
            </div>
          </div>
        )}

        <div className="featured-image-overlay" />
      </div>

      {/* Image description and credits */}
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