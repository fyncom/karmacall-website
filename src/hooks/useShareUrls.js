import { useState, useEffect } from "react"
import { createShortUrl } from "../utils/urlShortener"

export function useShareUrls(articleMeta) {
  const [shareUrls, setShareUrls] = useState({})

  useEffect(() => {
    if (!articleMeta) return
    const currentUrl = typeof window !== "undefined" ? window.location.href.split("?")[0] : ""
    setShareUrls({
      copy: createShortUrl(currentUrl, "copy_link", articleMeta),
      email: `mailto:?subject=${encodeURIComponent(articleMeta.title)}&body=${encodeURIComponent(createShortUrl(currentUrl, "email", articleMeta))}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(createShortUrl(currentUrl, "facebook", articleMeta))}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(createShortUrl(currentUrl, "twitter", articleMeta))}&text=${encodeURIComponent(
        articleMeta.title
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(createShortUrl(currentUrl, "linkedin", articleMeta))}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(createShortUrl(currentUrl, "reddit", articleMeta))}&title=${encodeURIComponent(
        articleMeta.title
      )}`,
      bluesky: `https://bsky.app/intent/compose?text=${encodeURIComponent(articleMeta.title + ": " + createShortUrl(currentUrl, "bluesky", articleMeta))}`,
    })
  }, [articleMeta])

  return shareUrls
}
