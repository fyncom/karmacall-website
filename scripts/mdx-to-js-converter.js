#!/usr/bin/env node

/**
 * MDX to JS Blog Converter
 *
 * This script converts MDX blog posts to the JavaScript format used in the KarmaCall blog system.
 * It parses frontmatter, converts MDX content to JSX, and generates the complete JS article file.
 *
 * Usage:
 *   node scripts/mdx-to-js-converter.js [input-file.mdx] [output-file.js]
 *   node scripts/mdx-to-js-converter.js --watch  (watch mode for all files)
 *   node scripts/mdx-to-js-converter.js --build   (convert all existing MDX files)
 */

const fs = require("fs-extra")
const path = require("path")
const matter = require("gray-matter")
const chokidar = require("chokidar")
const { marked } = require("marked")

// Configure marked for JSX-compatible output
marked.setOptions({
  gfm: true,
  breaks: false,
  sanitize: false,
})

// Custom renderer to convert markdown to JSX
const renderer = new marked.Renderer()

// Override heading renderer to add IDs and proper styling
renderer.heading = function (text, level) {
  const id = text
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const styles = {
    2: `
      fontSize: getFontSize("h2", textSize),
      fontWeight: "600",
      marginTop: "2.5rem",
      marginBottom: "1rem",
      color: "var(--color-text, #333)",
    `,
    3: `
      fontWeight: "600",
      marginTop: "2rem",
      marginBottom: "1rem",
      color: "var(--color-text, #333)",
    `,
  }

  const style = styles[level] || styles[3]

  return `
                <h${level}
                  id="${id}"
                  style={{
                    ${style}
                  }}
                >
                  ${text}
                </h${level}>`
}

// Override paragraph renderer
renderer.paragraph = function (text) {
  return `
                <p style={{ marginBottom: "1.5rem" }}>
                  ${text}
                </p>`
}

// Override code renderer
renderer.code = function (code, language) {
  return `
                <div
                  style={{
                    backgroundColor: "#1e1e1e",
                    color: "#d4d4d4",
                    padding: "1rem",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: getFontSize("code", textSize),
                    marginBottom: "1.5rem",
                    overflow: "auto",
                  }}
                >
                  {${code ? `\`${code.replace(/`/g, "\\`")}\`` : '""'}}
                </div>`
}

// Override list renderers
renderer.list = function (body, ordered) {
  const tag = ordered ? "ol" : "ul"
  const style = ordered ? 'paddingLeft: "2rem"' : 'marginBottom: "1.5rem", paddingLeft: "2rem"'

  return `
                <${tag} style={{ ${style} }}>
                  ${body}
                </${tag}>`
}

renderer.listitem = function (text) {
  return `
                  <li style={{ marginBottom: "0.5rem" }}>
                    ${text}
                  </li>`
}

// Override blockquote renderer for callout boxes
renderer.blockquote = function (quote) {
  // Check if it's a special callout (starts with an emoji and bold text)
  const calloutMatch = quote.match(/^\s*<p[^>]*>([📝💡⚠️🔥])\s*<strong>(.*?)<\/strong>(.*?)<\/p>/s)

  if (calloutMatch) {
    const [, emoji, title, content] = calloutMatch
    const backgroundColor = emoji === "⚠️" ? "#fff3cd" : "#f0f8ff"
    const borderColor = emoji === "⚠️" ? "#ffeaa7" : "#b0d4f1"
    const textColor = emoji === "⚠️" ? "#856404" : "#007acc"

    return `
                <div
                  style={{
                    backgroundColor: "${backgroundColor}",
                    border: "1px solid ${borderColor}",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                    borderLeft: "4px solid ${textColor}",
                  }}
                >
                  <p style={{ margin: "0", fontWeight: "600", color: "${textColor}" }}>
                    ${emoji} <strong>${title}</strong>${content}
                  </p>
                </div>`
  }

  // Regular blockquote
  return `
                <blockquote style={{ 
                  borderLeft: "4px solid #ddd", 
                  paddingLeft: "1rem", 
                  marginLeft: "0",
                  fontStyle: "italic",
                  color: "#666"
                }}>
                  ${quote}
                </blockquote>`
}

// Override link renderer
renderer.link = function (href, title, text) {
  const titleAttr = title ? ` title="${title}"` : ""
  return `
                    <a 
                      href="${href}"${titleAttr}
                      style={{ color: "#007acc", textDecoration: "underline" }}
                      target="${href.startsWith("http") ? "_blank" : "_self"}"
                      rel="${href.startsWith("http") ? "noopener noreferrer" : ""}"
                    >
                      ${text}
                    </a>`
}

// Override image renderer
renderer.image = function (href, title, text) {
  return `
                <FeaturedImage
                  src="${href}"
                  alt="${text || ""}"
                  imageDescription="${title || "Article image"}"
                  imageCredit=""
                />`
}

/**
 * Convert MDX content to JSX
 */
function convertMarkdownToJSX(content) {
  // Process the content with our custom renderer
  const html = marked(content, { renderer })

  // Clean up the HTML and convert to JSX-like format
  let jsx = html
    .replace(/^\s+/gm, "") // Remove leading whitespace from each line
    .replace(/\n\s*\n/g, "\n") // Reduce multiple newlines to single
    .trim()

  return jsx
}

/**
 * Generate the complete JS blog article from MDX frontmatter and content
 */
function generateJSArticle(frontmatter, content) {
  const { title, description, author, date, featuredImage, keywords = [], slug } = frontmatter

  // Convert content to JSX
  const jsxContent = convertMarkdownToJSX(content)

  return `import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import { getShareCount, setMockShareCount } from "../../utils/shareCounter"
import { preloadUrls } from "../../utils/urlShortener"
import { generateTextSizeStyles, getFontSize } from "../../components/blog_components/FontSizeSystem"
import ArticleHeader from "../../components/blog_components/ArticleHeader"
import ActionBar from "../../components/blog_components/ActionBar"
import TableOfContents from "../../components/blog_components/TableOfContents"
import RelatedArticles from "../../components/blog_components/RelatedArticles"
import FeaturedImage from "../../components/blog_components/FeaturedImage"
import ScrollToTop from "../../components/blog_components/ScrollToTop"
import TextSizeControl from "../../components/blog_components/TextSizeControl"
import CommentSection from "../../components/blog_components/CommentSection"

// ============================================================
// ARTICLE METADATA - AUTO-GENERATED FROM MDX FRONTMATTER
// ============================================================
const articleMetadata = {
  title: "${title}",
  description: "${description}",
  author: "${author}",
  date: "${date}", // Format: YYYY-MM-DD
  featuredImage: "${featuredImage || ""}",
  keywords: ${JSON.stringify(keywords)},
  slug: "${slug}",
}

// ============================================================
// MAIN COMPONENT - AUTO-GENERATED FROM MDX CONTENT
// ============================================================
export default function ${slug.replace(/[^a-zA-Z0-9]/g, "")}Article() {
  const [shareCount, setShareCount] = React.useState(0)
  const [commentCount, setCommentCount] = React.useState(0)
  const [textSize, setTextSize] = React.useState("medium")

  // Generate text size styles from centralized system
  const textSizeStyles = generateTextSizeStyles()

  const handleTextSizeChange = newSize => {
    setTextSize(newSize)
  }

  const handleCommentClick = () => {
    const commentsSection = document.getElementById("comments")
    if (commentsSection) {
      commentsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Share count handling and text size initialization
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Scroll to top when component mounts (for navigation from other articles)
      window.scrollTo({ top: 0, behavior: "instant" })

      // Load saved text size preference
      const savedTextSize = localStorage.getItem("textSize")
      if (savedTextSize && ["small", "medium", "large"].includes(savedTextSize)) {
        setTextSize(savedTextSize)
      }

      const currentPath = window.location.pathname

      // Load current share count
      const currentCount = getShareCount(currentPath)
      setShareCount(currentCount)

      // Preload share URLs for better performance
      preloadUrls(currentPath)
    }
  }, [])

  // SEO metadata using articleMetadata
  const seo = {
    title: articleMetadata.title,
    description: articleMetadata.description,
    keywords: articleMetadata.keywords,
    image: articleMetadata.featuredImage,
    pathname: articleMetadata.slug,
  }

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Article Header */}
        <ArticleHeader articleData={articleMetadata} />

        {/* Main content container with sidebar layout */}
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start", marginTop: "0.5rem", position: "relative" }}>
          {/* Main article content */}
          <div style={{ flex: "1", minWidth: "0" }}>
            {/* Action bar with share and comment buttons */}
            <ActionBar
              articleData={articleMetadata}
              shareCount={shareCount}
              onShareCountUpdate={setShareCount}
              commentCount={commentCount}
              onCommentClick={handleCommentClick}
            />

            {/* Featured image - only show if featuredImage is provided */}
            ${
              featuredImage
                ? `<FeaturedImage
              src={articleMetadata.featuredImage}
              alt={articleMetadata.title}
              imageDescription="Featured image for this article."
              imageCredit=""
            />`
                : ""
            }

            {/* Text Size Control */}
            <TextSizeControl currentSize={textSize} onSizeChange={handleTextSizeChange} />

            {/* Article content */}
            <div
              style={{
                ...textSizeStyles[textSize],
                color: "var(--color-text, #333)",
              }}
            >
              <style>
                {\`
                  .article-content-\${textSize} p,
                  .article-content-\${textSize} li,
                  .article-content-\${textSize} span,
                  .article-content-\${textSize} div {
                    font-size: \${textSizeStyles[textSize].fontSize} !important;
                    line-height: \${textSizeStyles[textSize].lineHeight} !important;
                  }
                  .article-content-\${textSize} h2 {
                    font-size: calc(\${textSizeStyles[textSize].fontSize} * 1.45) !important;
                  }
                  .article-content-\${textSize} h3 {
                    font-size: calc(\${textSizeStyles[textSize].fontSize} * 1.18) !important;
                  }
                \`}
              </style>
              <div className={\`article-content-\${textSize}\`}>
${jsxContent}
              </div>
            </div>

            {/* Related Articles */}
            <RelatedArticles currentArticleSlug={articleMetadata.slug} />

            {/* Comments Section */}
            <CommentSection />
          </div>

          {/* Table of Contents Sidebar */}
          <TableOfContents />
        </div>

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </Wrapper>
  )
}`
}

/**
 * Process a single MDX file
 */
async function processMDXFile(inputPath, outputPath) {
  try {
    console.log(`Processing: ${inputPath} -> ${outputPath}`)

    // Read and parse the MDX file
    const mdxContent = await fs.readFile(inputPath, "utf8")
    const { data: frontmatter, content } = matter(mdxContent)

    // Validate required frontmatter
    const required = ["title", "description", "author", "date", "slug"]
    const missing = required.filter(field => !frontmatter[field])

    if (missing.length > 0) {
      throw new Error(`Missing required frontmatter fields: ${missing.join(", ")}`)
    }

    // Generate the JS article
    const jsArticle = generateJSArticle(frontmatter, content)

    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputPath))

    // Write the JS file
    await fs.writeFile(outputPath, jsArticle)

    console.log(`✅ Generated: ${outputPath}`)

    return frontmatter
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message)
    throw error
  }
}

/**
 * Update the blog index with new article
 */
async function updateBlogIndex(articleMetadata) {
  const indexPath = path.join(__dirname, "../src/pages/blog/index.js")

  try {
    let indexContent = await fs.readFile(indexPath, "utf8")

    // Create the article entry
    const articleEntry = `  {
    id: "${articleMetadata.slug.replace("/blog/", "")}",
    title: "${articleMetadata.title}",
    description: "${articleMetadata.description}",
    author: "${articleMetadata.author}",
    date: "${articleMetadata.date}",
    slug: "${articleMetadata.slug}",
    featuredImage: "${articleMetadata.featuredImage || ""}",
  },`

    // Find the blogArticles array and add the new entry at the beginning
    const arrayStart = indexContent.indexOf("const blogArticles = [")
    if (arrayStart !== -1) {
      const insertPoint = indexContent.indexOf("[", arrayStart) + 1
      indexContent = indexContent.slice(0, insertPoint) + "\n" + articleEntry + indexContent.slice(insertPoint)

      await fs.writeFile(indexPath, indexContent)
      console.log(`✅ Updated blog index`)
    }
  } catch (error) {
    console.error(`❌ Error updating blog index:`, error.message)
  }
}

/**
 * Update the article similarity database
 */
async function updateArticleDatabase(articleMetadata) {
  const dbPath = path.join(__dirname, "../src/utils/articleSimilarity.js")

  try {
    let dbContent = await fs.readFile(dbPath, "utf8")

    // Create the article entry for the database
    const dbEntry = `  {
    slug: "${articleMetadata.slug}",
    title: "${articleMetadata.title}",
    description: "${articleMetadata.description}",
    date: "${articleMetadata.date}",
    author: "${articleMetadata.author}",
    image: "${articleMetadata.featuredImage || ""}",
    keywords: ${JSON.stringify(articleMetadata.keywords || [])},
  },`

    // Find the articlesDatabase array and add the new entry at the beginning
    const arrayStart = dbContent.indexOf("export const articlesDatabase = [")
    if (arrayStart !== -1) {
      const insertPoint = dbContent.indexOf("[", arrayStart) + 1
      dbContent = dbContent.slice(0, insertPoint) + "\n" + dbEntry + dbContent.slice(insertPoint)

      await fs.writeFile(dbPath, dbContent)
      console.log(`✅ Updated article database`)
    }
  } catch (error) {
    console.error(`❌ Error updating article database:`, error.message)
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === "--help") {
    console.log(`
MDX to JS Blog Converter

Usage:
  node scripts/mdx-to-js-converter.js [input-file.mdx] [output-file.js]
  node scripts/mdx-to-js-converter.js --watch    # Watch for changes
  node scripts/mdx-to-js-converter.js --build    # Convert all existing MDX files

Examples:
  node scripts/mdx-to-js-converter.js blog-posts/my-article.mdx src/pages/blog/my-article.js
  node scripts/mdx-to-js-converter.js --watch
`)
    return
  }

  const blogPostsDir = path.join(__dirname, "../blog-posts")
  const blogOutputDir = path.join(__dirname, "../src/pages/blog")

  if (args[0] === "--watch") {
    console.log("👀 Watching for MDX file changes...")

    // Ensure blog-posts directory exists
    await fs.ensureDir(blogPostsDir)

    const watcher = chokidar.watch(path.join(blogPostsDir, "*.mdx"), {
      ignored: /^\./,
      persistent: true,
    })

    watcher.on("change", async filePath => {
      const filename = path.basename(filePath, ".mdx")
      const outputPath = path.join(blogOutputDir, `${filename}.js`)

      try {
        const metadata = await processMDXFile(filePath, outputPath)
        await updateBlogIndex(metadata)
        await updateArticleDatabase(metadata)
      } catch (error) {
        console.error("Error in watch mode:", error.message)
      }
    })

    watcher.on("add", async filePath => {
      const filename = path.basename(filePath, ".mdx")
      const outputPath = path.join(blogOutputDir, `${filename}.js`)

      try {
        const metadata = await processMDXFile(filePath, outputPath)
        await updateBlogIndex(metadata)
        await updateArticleDatabase(metadata)
      } catch (error) {
        console.error("Error in watch mode:", error.message)
      }
    })

    console.log(`Watching: ${blogPostsDir}/*.mdx`)
  } else if (args[0] === "--build") {
    console.log("🔨 Converting all existing MDX files...")

    const mdxFiles = await fs.readdir(blogPostsDir)
    const mdxFilePaths = mdxFiles.filter(file => file.endsWith(".mdx")).map(file => path.join(blogPostsDir, file))

    for (const mdxPath of mdxFilePaths) {
      const filename = path.basename(mdxPath, ".mdx")
      const outputPath = path.join(blogOutputDir, `${filename}.js`)

      try {
        const metadata = await processMDXFile(mdxPath, outputPath)
        await updateBlogIndex(metadata)
        await updateArticleDatabase(metadata)
      } catch (error) {
        console.error("Error in build mode:", error.message)
      }
    }
  } else if (args.length === 2) {
    // Single file conversion
    const [inputPath, outputPath] = args

    try {
      const metadata = await processMDXFile(inputPath, outputPath)
      await updateBlogIndex(metadata)
      await updateArticleDatabase(metadata)
    } catch (error) {
      process.exit(1)
    }
  } else {
    console.error("Invalid arguments. Use --help for usage information.")
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
}

module.exports = {
  processMDXFile,
  updateBlogIndex,
  updateArticleDatabase,
  generateJSArticle,
  convertMarkdownToJSX,
}
