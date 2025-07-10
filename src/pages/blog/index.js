import React from "react"
import "../../components/help-center.css"
import { Link, useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"

// Static articles database - update this when adding new articles
const blogArticles = [
  {
    id: "shifting-frontlines-spam-2025",
    title: "The Shifting Frontlines of Spam: Interactive Report Reveals Global Crisis",
    description:
      "Our comprehensive interactive analysis reveals the staggering scale of global spam escalation. With over 137 million unwanted calls daily and $1.03 trillion in losses, discover the regional hotspots, AI-driven tactics, and strategic solutions in this data-rich report.",
    author: "KarmaCall Team",
    date: "2025-01-17",
    slug: "/blog/shifting-frontlines-spam-2025",
    featuredImage: "../../images/blog/attention-economy-multi-screens.jpg",
  },
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
  // Query all blog images
  const data = useStaticQuery(graphql`
    query BlogIndexImages {
      allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { regex: "/^(blog|illustrations)$/" } }) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(width: 400, layout: CONSTRAINED, placeholder: BLURRED, formats: [AUTO, WEBP])
          }
        }
      }
    }
  `)

  // Extract filename from the src path and get Gatsby image
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
        {sortedArticles.map(article => {
          const gatsbyImage = getImageFromSrc(article.featuredImage)

          return (
            <div className="blog-card" key={article.id}>
              <Link to={`${article.slug}`} className="blog-link">
                <div className="blog-image-container">
                  {article.featuredImage && gatsbyImage ? (
                    <GatsbyImage image={gatsbyImage} alt={article.title} className="blog-image" loading="lazy" />
                  ) : article.featuredImage ? (
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
                  ) : null}
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
          )
        })}
        {Array.from({ length: placeholdersNeeded }, (_, index) => (
          <div className="blog-placeholder" key={`placeholder-${index}`}></div>
        ))}
      </div>
    </Wrapper>
  )
}
