import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { findRelatedArticles, articlesDatabase } from "../../utils/articleSimilarity"

const RelatedArticles = ({ currentArticleSlug, maxArticles = 3, className, style }) => {
  // Query all blog images
  const data = useStaticQuery(graphql`
    query RelatedArticlesImages {
      allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { regex: "/^(blog|illustrations)$/" } }) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(width: 300, layout: CONSTRAINED, placeholder: BLURRED, formats: [AUTO, WEBP])
          }
        }
      }
    }
  `)

  // Extract filename from the src path and get Gatsby image
  const getImageFromSrc = srcPath => {
    if (!srcPath) return null
    let relativePath = srcPath
    if (srcPath.includes("../../images/")) {
      relativePath = srcPath.replace("../../images/", "")
    } else if (srcPath.includes("../images/")) {
      relativePath = srcPath.replace("../images/", "")
    } else if (srcPath.includes("images/")) {
      relativePath = srcPath.replace(/.*images\//, "")
    }
    const imageNode = data.allFile.nodes.find(node => node.relativePath === relativePath)
    return imageNode?.childImageSharp ? getImage(imageNode.childImageSharp.gatsbyImageData) : null
  }

  // Find related articles
  const related = findRelatedArticles(currentArticleSlug, maxArticles)

  return (
    <div className={className} style={style}>
      <h4>Related Articles</h4>
      <div className="related-articles-list">
        {related.map(article => {
          const gatsbyImage = getImageFromSrc(article.featuredImage)
          return (
            <a href={article.slug} className="related-article-link" key={article.slug}>
              <div className="related-article-card">
                {gatsbyImage ? (
                  <GatsbyImage image={gatsbyImage} alt={article.title} className="related-article-image" />
                ) : (
                  <div className="related-article-image-placeholder">📖</div>
                )}
                <div className="related-article-content">
                  <div className="related-article-title">{article.title}</div>
                  <div className="related-article-description">{article.description}</div>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default RelatedArticles
