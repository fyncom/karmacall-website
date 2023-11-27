import React, { useState, useEffect } from "react"
import "./pdf.css"
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/TextLayer.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PdfContent = ({ file }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1) // Set the initial page
  const [prefersDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const setDarkModeFromMediaQuery = e => {
      setIsDarkMode(e.matches)
    }

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      setIsDarkMode(mediaQuery.matches)
      mediaQuery.addEventListener("change", setDarkModeFromMediaQuery) // Add the event listener for changes
      return () =>
        mediaQuery.removeEventListener("change", setDarkModeFromMediaQuery) // Cleanup function to remove the event listener
    }
  }, [])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

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

  return (
    <div className="pdf-viewer">
      <div className="pdf-container">
        <div
          className="pdf-navigation previous"
          onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
        >
          <FaArrowCircleLeft />
        </div>
        <Document
          file={file}
          className={`pdf-document ${prefersDarkMode ? "dark-mode" : ""}`}
          onLoadSuccess={onDocumentLoadSuccess}
          onError={error =>
            console.error("PDF failed to load: ", error.message)
          }
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <div
          className="pdf-navigation next"
          onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages))}
        >
          <FaArrowCircleRight />
        </div>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button
          onClick={() =>
            setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1))
          }
          disabled={pageNumber === 1}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setPageNumber(prevPageNumber =>
              Math.min(prevPageNumber + 1, numPages)
            )
          }
          disabled={pageNumber === numPages}
        >
          Next
        </button>
        <button className="pdf-download" onClick={handleDownload}>
          Download PDF
        </button>
      </div>
    </div>
  )
}

export default PdfContent
