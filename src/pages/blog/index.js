import React from "react"
import "../../components/help-center.css"
import { graphql, Link } from "gatsby"
import { Wrapper } from "../../components/Markdown-Wrapper"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import truncate from "lodash/truncate" // You may need to install lodash if not already installed
import "../../components/blog.css"

export default function BlogIndex({ data }) {
  const seo = {
    title: "KarmaCall Blog",
    description: "Stay updated on the latest in KarmaCall technology.",
  }
  // A function to truncate text to a specific length
  const shortenText = (text, length) => {
    return truncate(text, {
      length: length, // maximum length of the text
      separator: /,? +/, // truncates at the nearest space or comma
    })
  }
  return (
    <Wrapper seo={seo} hideArticleHeader hideTableOfContents hideRelatedArticles hideTextSizeControl>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {data.allMdx.nodes.map(({ id, excerpt, frontmatter, fields }) => {
          const image = frontmatter.featuredImage?.childImageSharp?.gatsbyImageData
            ? getImage(frontmatter.featuredImage.childImageSharp.gatsbyImageData)
            : null

          return (
            <div className="blog-card" key={id}>
              <Link className={"blog-link"} to={`${fields.slug}`}>
                {image && (
                  <div className="blog-image-container">
                    <GatsbyImage
                      image={image}
                      className={"blog-image"}
                      style={{ width: "100%", height: "100%" }}
                      alt={frontmatter.title}
                    />
                  </div>
                )}
                <div className="blog-content">
                  <h3 className="blog-title">{frontmatter.title}</h3>
                  <div className="blog-meta">
                    <span className="blog-author">{frontmatter.author || "KarmaCall Team"}</span>
                    <span className="blog-date">{frontmatter.date}</span>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </Wrapper>
  )
}
export const pageQuery = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        excerpt(pruneLength: 250)
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          description
          featuredImage {
            publicURL
            childImageSharp {
              gatsbyImageData(width: 800, layout: CONSTRAINED, placeholder: BLURRED)
            }
          }
        }
        fields {
          slug
        }
      }
    }
  }
`
