import React from "react"
import "../../components/help-center.css"
import { Link } from "gatsby"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"

// Static articles database - update this when adding new articles
const blogArticles = [
  {
    id: "future-of-spam-blocking",
    title: "Get Cash Back for Blocking Spam, with KarmaCall Version 4.0",
    description:
      "KarmaCall 4.0 is a revolutionary new app that pays you to block spam calls. With its fresh new UI and infinitely long call blocking capability.",
    author: "KarmaCall Team",
    date: "2024-03-11",
    slug: "/blog/future-of-spam-blocking",
    featuredImage: "../../images/blog/interactive-rewards-blog-social-graphic.jpg",
  },
  {
    id: "job-scam-texts-surge-2024",
    title: "Job Scam Texts Cost Americans $470M in 2024 - Here's the Economic Solution",
    description:
      "Job scam texts were the #2 most common hoax in 2024, costing Americans nearly half a billion dollars. Discover how FynCom's refundable deposit technology makes mass scamming economically impossible.",
    author: "KarmaCall Team",
    date: "2024-06-07",
    slug: "/blog/job-scam-texts-surge-2024",
    featuredImage: "../../images/illustrations/inbox-money.png",
  },
]

export default function BlogIndex() {
  const seo = {
    title: "KarmaCall Blog",
    description: "Stay updated on the latest in KarmaCall technology.",
  }

  const formatDate = dateString => {
    if (!dateString) return "Date not available"

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString // Return original string if parsing fails
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Sort articles by date (newest first)
  const sortedArticles = [...blogArticles].sort((a, b) => new Date(b.date) - new Date(a.date))

  const remainder = sortedArticles.length % 4
  const placeholdersNeeded = remainder === 0 ? 0 : 4 - remainder

  return (
    <Wrapper seo={seo}>
      <div className="blog-grid">
        {sortedArticles.map(article => (
          <div className="blog-card" key={article.id}>
            <Link to={`${article.slug}`} className="blog-link">
              <div className="blog-image-container">
                {article.featuredImage && (
                  <img
                    className="blog-image"
                    src={article.featuredImage}
                    alt={article.title}
                    loading="lazy"
                    onLoad={e => {
                      e.target.style.opacity = "1"
                      e.target.style.transform = "scale(1)"
                    }}
                    style={{
                      opacity: "0",
                      transform: "scale(1.05)",
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                  />
                )}
              </div>
              <div className="blog-content">
                <h3 className="blog-title">{article.title}</h3>
                <div className="blog-meta">
                  <span className="blog-author">{article.author || "KarmaCall Team"}</span>
                  <span className="blog-date">{formatDate(article.date)}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
        {Array.from({ length: placeholdersNeeded }, (_, index) => (
          <div className="blog-placeholder" key={`placeholder-${index}`}></div>
        ))}
      </div>
    </Wrapper>
  )
}
