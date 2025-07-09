import React from "react"

const FeaturedImage = ({ src, alt, title, imageDescription, imageCredit }) => {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  // Check if src is empty, a placeholder, or invalid
  const isValidImageSrc = src && src !== "../../images/blog/your-image-filename.jpg" && !src.includes("your-image-filename") && !imageError

  // Always render the container, even without an image
  return (
    <div className="featured-image-container">
      <div className="featured-image-wrapper">
        {isValidImageSrc ? (
          // Render actual image if src is valid
          <>
            <img
              src={src}
              alt={alt || title || "Featured image"}
              className="featured-image"
              style={{
                opacity: imageLoaded ? 1 : 0, // Fade in when loaded
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy" // Optimize loading performance
            />

            {/* Show loading placeholder while image loads */}
            {!imageLoaded && (
              <div className="featured-image-loading">
                <div className="featured-image-placeholder-content">
                  <div className="featured-image-placeholder-icon">📖</div>
                  <div className="featured-image-placeholder-title">Featured Image</div>
                  <div className="featured-image-placeholder-subtitle">Loading...</div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Render placeholder/loading state when no valid image
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
