import React, { useState, useEffect } from "react"
import "./pdf.css"
import { FaDownload, FaEye } from "react-icons/fa"

const PdfContent = ({ file }) => {
  const [prefersDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const setDarkModeFromMediaQuery = e => {
      setIsDarkMode(e.matches)
    }

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      setIsDarkMode(mediaQuery.matches)
      mediaQuery.addEventListener("change", setDarkModeFromMediaQuery)
      return () => mediaQuery.removeEventListener("change", setDarkModeFromMediaQuery)
    }
  }, [])

  const handleDownload = () => {
    let pageTitle = document.title || "Download"
    const h1Element = document.querySelector("h1")
    const h2Element = document.querySelector("h2")
    if (h1Element) {
      pageTitle = h1Element.textContent
    } else if (h2Element) {
      pageTitle = h2Element.textContent
    }
    const fileName = `${pageTitle.replace(/[/\\?%*:|"<>]/g, "-")}.pdf`
    const link = document.createElement("a")
    link.href = file
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleView = () => {
    window.open(file, "_blank")
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-container">
        <div className="pdf-placeholder">
          <div className="pdf-icon">📄</div>
          <h3>PDF Document</h3>
          <p>This document is available for download or viewing in a new tab.</p>
          <div className="pdf-actions">
            <button className="pdf-download" onClick={handleDownload}>
              <FaDownload /> Download PDF
            </button>
            <button className="pdf-view" onClick={handleView}>
              <FaEye /> View in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PdfContent
