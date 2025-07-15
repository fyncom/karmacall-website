import React from "react"
import { createShortUrl } from "../../utils/urlShortener"
import { incrementShareCount, getShareCount, formatShareCount } from "../../utils/shareCounter"

const ShareButton = ({ platform, onClick, children }) => {
  return (
    <button className={`share-button share-${platform}`} onClick={onClick} aria-label={`Share on ${platform}`}>
      {children}
    </button>
  )
}

export default ShareButton