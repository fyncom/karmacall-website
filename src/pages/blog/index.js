import React from "react"
import "../../components/help-center.css"
import { graphql, Link } from "gatsby"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"

export default function BlogIndex({ data }) {
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

  const blogPosts = data.allMdx.nodes
  const remainder = blogPosts.length % 4
  const placeholdersNeeded = remainder === 0 ? 0 : 4 - remainder

  return (
    <Wrapper seo={seo}>
      <div className="blog-grid">
        {blogPosts.map(({ id, frontmatter, fields }) => (
          <div className="blog-card" key={id}>
            <Link to={`${fields.slug}`} className="blog-link">
              <div className="blog-image-container">
                {frontmatter.featuredImage && (
                  <img
                    className="blog-image"
                    src={frontmatter.featuredImage}
                    alt={frontmatter.title}
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
                <h3 className="blog-title">{frontmatter.title}</h3>
                <div className="blog-meta">
                  <span className="blog-author">{frontmatter.author || "KarmaCall Team"}</span>
                  <span className="blog-date">{formatDate(frontmatter.date)}</span>
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

export const pageQuery = graphql`
  query {
    allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { fields: { slug: { regex: "/^(?!/blog/_).*$/" } }, internal: { contentFilePath: { regex: "/^((?!README).)*$/" } } }
    ) {
      nodes {
        id
        frontmatter {
          title
          date
          author
          featuredImage
        }
        fields {
          slug
        }
      }
    }
  }
`
