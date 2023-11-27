import React from "react"

const GoogleDocsViewer = ({ fileID }) => {
  const embedUrl = `https://drive.google.com/file/d/${fileID}/preview`

  return (
    <iframe
      className="google-docs-iframe-container"
      src={embedUrl}
      width="100%"
      height="600" // Set height as desired
      allow="autoplay"
      frameBorder="0"
    ></iframe>
  )
}

export default GoogleDocsViewer
