import React from "react"
import "../../components/help-center.css"
import { graphql, Link } from "gatsby"
import { Wrapper } from "../../components/Markdown-Wrapper"
import Img from "gatsby-image"
import "../../components/blog.css"

export default function BlogIndex({ data }) {
  const seo = {
    title: "KarmaCall Blog",
    description: "Stay updated on the latest in KarmaCall technology.",
  }

  return (
    <Wrapper seo={seo}>
      <div className="blog-grid">
        {data.allMdx.nodes.map(({ id, frontmatter, fields }) => (
          <div className="blog-card" key={id}>
            <Link to={`${fields.slug}`} className="blog-link">
              <div className="blog-image-container">
                {frontmatter.featuredImage?.childImageSharp ? (
                  <Img fluid={frontmatter.featuredImage.childImageSharp.fluid} className="blog-image" alt={frontmatter.title} />
                ) : (
                  <img className="blog-image" src={frontmatter.featuredImage?.publicURL} alt={frontmatter.title} />
                )}
              </div>
              <div className="blog-content">
                <h3 className="blog-title">{frontmatter.title}</h3>
                <div className="blog-meta">
                  <span className="blog-author">{frontmatter.author || "KarmaCall Team"}</span>
                  <span className="blog-date">{frontmatter.date}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </Wrapper>
  )
}

export const pageQuery = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          author
          featuredImage {
            publicURL
            childImageSharp {
              fluid(maxWidth: 400, maxHeight: 400) {
                ...GatsbyImageSharpFluid
              }
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
