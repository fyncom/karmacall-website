import React from "react"

const FeaturedImage = ({ src, alt, title, imageDescription, imageCredit }) => {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  // Check if src is empty, a placeholder, or invalid
  const isValidImageSrc = src && src !== "../../images/blog/your-image-filename.jpg" && !src.includes("your-image-filename") && !imageError

  // Always render the container, even without an image
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3", // Force 4:3 aspect ratio
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          backgroundColor: "var(--color-background-alt, #f9f9f9)", // Fallback background
        }}
      >
        {isValidImageSrc ? (
          // Render actual image if src is valid
          <>
            <img
              src={src}
              alt={alt || title || "Featured image"}
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                objectFit: "cover", // Crop to fill the 4:3 container
                objectPosition: "center", // Center the crop
                transition: "transform 0.3s ease",
                opacity: imageLoaded ? 1 : 0, // Fade in when loaded
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              onMouseEnter={e => {
                if (imageLoaded) {
                  e.target.style.transform = "scale(1.02)" // Subtle zoom on hover
                }
              }}
              onMouseLeave={e => {
                if (imageLoaded) {
                  e.target.style.transform = "scale(1)"
                }
              }}
              loading="lazy" // Optimize loading performance
            />

            {/* Show loading placeholder while image loads */}
            {!imageLoaded && (
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--color-background-alt, #f9f9f9)",
                  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-secondary, #666)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "3rem",
                      marginBottom: "0.5rem",
                      opacity: "0.6",
                    }}
                  >
                    📖
                  </div>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Featured Image
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      opacity: "0.8",
                    }}
                  >
                    Loading...
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Render placeholder/loading state when no valid image
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--color-background-alt, #f9f9f9)",
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "var(--color-text-secondary, #666)",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "0.5rem",
                  opacity: "0.6",
                }}
              >
                📖
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "0.25rem",
                }}
              >
                Featured Image
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  opacity: "0.8",
                }}
              >
                {imageError ? "Failed to load" : "Coming soon..."}
              </div>
            </div>
          </div>
        )}

        {/* Optional overlay for better text readability if needed */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            background: "linear-gradient(transparent, rgba(0, 0, 0, 0.1))",
            height: "30%",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Image description and credits - only show if provided */}
      {(imageDescription || imageCredit) && (
        <div
          style={{
            marginTop: "1rem",
            marginBottom: "1.5rem",
            padding: "0.75rem",
            backgroundColor: "var(--color-background-alt, #f9f9f9)",
            borderRadius: "4px",
            border: "1px solid var(--border-color, #eee)",
          }}
        >
          {imageDescription && (
            <p
              style={{
                margin: imageCredit ? "0 0 0.5rem 0" : "0",
                fontSize: "0.9rem",
                lineHeight: "1.4",
                color: "var(--color-text, #333)",
              }}
            >
              <strong>Image description:</strong> {imageDescription}
            </p>
          )}
          {imageCredit && (
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "var(--color-text-secondary, #666)",
                fontStyle: "italic",
              }}
            >
              <strong>Credits:</strong> {imageCredit}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default FeaturedImage
