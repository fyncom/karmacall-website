import React from "react"
import { Wrapper } from "../../components/Markdown-Wrapper"
import "../../components/blog.css"
import { createShortUrl, preloadUrls } from "../../utils/urlShortener"
import { getShareCount, incrementShareCount, formatShareCount, setMockShareCount } from "../../utils/shareCounter"
import ShareButton from "../../components/ShareButton"
import TableOfContents from "../../components/TableOfContents"
import ArticleHeader from "../../components/ArticleHeader"
import ActionBar from "../../components/ActionBar"
import RelatedArticles from "../../components/RelatedArticles"
import FeaturedImage from "../../components/FeaturedImage"
import ScrollToTop from "../../components/ScrollToTop"

// ============================================================
// ARTICLE METADATA - EDIT THIS SECTION FOR EACH NEW ARTICLE
// ============================================================
const articleMetadata = {
  title: "JavaScript Blog Template Guide - How to Create Articles",
  description:
    "Complete guide for developers on how to use the JavaScript template system for creating KarmaCall blog articles. Includes metadata setup, content structure, and advanced features.",
  author: "Draven Grondona",
  date: "2025-06-07", // Format: YYYY-MM-DD
  featuredImage: "../../images/blog/your-image-filename.jpg", // Place image in src/images/blog/

  // 2 Core Topics (2-3), Audiance Tags (1-2), Article Type (1-2), Technical / Concept Tags (1-2), Trends Tag (1), Product Tag (1-2)  |  (any of these are optional)
  keywords: ["javascript", "blog", "template", "employee", "how to", "guide", "metadata", "comand line interface", "cli", "karmacall", "fyncom"], // Optional: for additional SEO targeting
  slug: "/blog/template", // Used for share tracking - update this to match your article's URL
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Template() {
  const [shareCount, setShareCount] = React.useState(0)

  // Preload URLs and load share count when component mounts
  React.useEffect(() => {
    preloadUrls()

    if (typeof window !== "undefined") {
      // Scroll to top when component mounts (for navigation from other articles)
      window.scrollTo({ top: 0, behavior: "instant" })

      // Add a small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        const currentPath = window.location.pathname

        // Capture and clean UTM parameters
        const urlParams = new URLSearchParams(window.location.search)
        const utmData = {
          source: urlParams.get("utm_source"),
          medium: urlParams.get("utm_medium"),
          campaign: urlParams.get("utm_campaign"),
          content: urlParams.get("utm_content"),
          term: urlParams.get("utm_term"),
        }

        console.log("Debug: Current URL:", window.location.href)
        console.log("Debug: URL search params:", window.location.search)
        console.log("Debug: Extracted UTM data:", utmData)

        // Store UTM data for analytics if any UTM parameters exist
        if (Object.values(utmData).some(value => value !== null)) {
          // Store in sessionStorage for this session
          sessionStorage.setItem("utm_data", JSON.stringify(utmData))

          console.log("Debug: Stored UTM data in sessionStorage")

          // Track with Google Analytics immediately
          if (window.gtag) {
            window.gtag("event", "page_view_with_utm", {
              utm_source: utmData.source,
              utm_medium: utmData.medium,
              utm_campaign: utmData.campaign,
              utm_content: utmData.content,
              utm_term: utmData.term,
              page_path: currentPath,
            })
            console.log("Debug: Sent UTM data to Google Analytics")
          }

          // Clean the URL by removing UTM parameters
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl)

          console.log(`📊 UTM data captured and URL cleaned:`, utmData)
          console.log(`📊 Clean URL: ${cleanUrl}`)
        } else {
          console.log("Debug: No UTM parameters found")
        }

        // Set mock data for testing (remove in production)
        setMockShareCount(articleMetadata.slug, 150) // Mock 150 shares for testing

        // Load current share count
        const currentCount = getShareCount(currentPath)
        setShareCount(currentCount)

        console.log(`📊 Share count for ${currentPath}: ${currentCount}`)

        // Add testing functions to window for easy testing
        window.setShareCount = count => {
          setMockShareCount(currentPath, count)
          setShareCount(count)
          console.log(`🧪 Test: Set share count to ${count}`)
          console.log(`📊 Formatted: ${formatShareCount(count) || "Hidden (< 100)"}`)
        }

        window.testShareCounts = () => {
          console.log("🧪 Testing different share count formats:")
          console.log("50:", formatShareCount(50) || "Hidden")
          console.log("99:", formatShareCount(99) || "Hidden")
          console.log("100:", formatShareCount(100))
          console.log("999:", formatShareCount(999))
          console.log("1000:", formatShareCount(1000))
          console.log("1100:", formatShareCount(1100))
          console.log("9999:", formatShareCount(9999))
          console.log("10000:", formatShareCount(10000))
          console.log("15500:", formatShareCount(15500))
          console.log("100000:", formatShareCount(100000))
          console.log("999999:", formatShareCount(999999))
          console.log("1000000:", formatShareCount(1000000))
          console.log("1100000:", formatShareCount(1100000))
          console.log("9900000:", formatShareCount(9900000))
          console.log("10000000:", formatShareCount(10000000))
          console.log("150000000:", formatShareCount(150000000))
          console.log("999000000:", formatShareCount(999000000))
          console.log("1000000000:", formatShareCount(1000000000))
          console.log("1100000000:", formatShareCount(1100000000))
          console.log("9900000000:", formatShareCount(9900000000))
          console.log("10000000000:", formatShareCount(10000000000))
          console.log("150000000000:", formatShareCount(150000000000))
        }

        // Add UTM testing function
        window.testUTM = () => {
          const storedUTM = sessionStorage.getItem("utm_data")
          if (storedUTM) {
            console.log("🔍 Stored UTM data:", JSON.parse(storedUTM))
          } else {
            console.log("🔍 No UTM data found in session")
          }
        }

        // Add URL shortener testing function
        window.testShortener = () => {
          console.log("🔗 Testing URL shortener...")
          const currentUrl = window.location.href.split("?")[0]
          const testUrl = createShortUrl(currentUrl, "copy_link")
          console.log("Created short URL:", testUrl)

          // Test the slug extraction and resolution
          const slug = testUrl.split("/s/")[1]
          console.log("Extracted slug:", slug)

          // Import and test resolution
          import("../../utils/urlShortener").then(({ resolveShortUrl }) => {
            const resolved = resolveShortUrl(slug)
            console.log("Resolved URL:", resolved)

            if (resolved) {
              console.log("✅ URL shortener working correctly")
            } else {
              console.log("❌ URL shortener resolution failed")
            }
          })
        }

        console.log("🧪 Test functions available:")
        console.log("- setShareCount(150) - Set share count to 150")
        console.log("- testShareCounts() - View all formatting examples")
        console.log("- testUTM() - View captured UTM data")
        console.log("- testShortener() - Test URL shortener functionality")
      }, 250) // Delay to ensure page is fully loaded

      return () => clearTimeout(timer)
    }
  }, [])

  // This page is completely removed in production builds via gatsby-node.js
  // This is just an extra safety check
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return <div>Page not found</div>
  }

  // SEO metadata using articleMetadata
  const seo = {
    title: articleMetadata.title,
    description: articleMetadata.description,
    keywords: articleMetadata.keywords,
  }

  return (
    <Wrapper seo={seo}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Article Header */}
        <ArticleHeader articleData={articleMetadata} />

        {/* Main content container with sidebar layout - starts at featured image level */}
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start", marginTop: "0.5rem", position: "relative" }}>
          {/* Main article content */}
          <div style={{ flex: "1", minWidth: "0" }}>
            {/* Action bar with share and comment buttons */}
            <ActionBar articleData={articleMetadata} shareCount={shareCount} onShareCountUpdate={setShareCount} />

            {/* Featured image */}
            <FeaturedImage
              src={articleMetadata.featuredImage}
              alt={articleMetadata.title}
              style={{
                marginBottom: "1rem",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              }}
            />

            {/* Image credits and description */}
            <div
              style={{
                marginBottom: "2rem",
                padding: "0.75rem",
                backgroundColor: "var(--color-background-alt, #f9f9f9)",
                borderRadius: "4px",
                border: "1px solid var(--border-color, #eee)",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "0.9rem",
                  lineHeight: "1.4",
                  color: "var(--color-text, #333)",
                }}
              >
                <strong>Image description:</strong> Brief description of what the image shows and its relevance to the article content.
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "var(--color-text-secondary, #666)",
                  fontStyle: "italic",
                }}
              >
                <strong>Credits:</strong> Image source, photographer, or attribution information goes here.
              </p>
            </div>

            {/* Guide content */}
            <div
              style={{
                lineHeight: "1.7",
                fontSize: "1.1rem",
                color: "var(--color-text, #333)",
              }}
            >
              <p style={{ marginBottom: "1.5rem" }}>
                <strong>Welcome to the JavaScript Blog Template System!</strong> This template provides a complete solution for creating KarmaCall blog articles
                using JavaScript instead of MDX. All metadata, SEO, and advanced features are centralized in the JavaScript file for easy management.
              </p>

              <div
                style={{
                  backgroundColor: "var(--color-background-alt, #f9f9f9)",
                  border: "1px solid var(--border-color, #eee)",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                  borderLeft: "4px solid #007acc",
                }}
              >
                <p style={{ margin: "0", fontWeight: "600", color: "#007acc" }}>
                  📝 <strong>Quick Start:</strong> Copy this `template.js` file, rename it to your article name (e.g., `my-article.js`), update the metadata at
                  the top, and replace this content with your article.
                </p>
              </div>

              <h2
                id="getting-started"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Getting Started
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                The JavaScript template system centralizes all article configuration in the `articleMetadata` object at the top of the file. This approach
                provides better maintainability and ensures consistent SEO handling across all articles.
              </p>

              <h3 id="copy-rename" style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}>
                Step 1: Copy and Rename
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>Copy `template.js` to your new article filename:</p>

              <div
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  overflow: "auto",
                }}
              >
                cp template.js my-awesome-article.js
              </div>

              <h3
                id="update-metadata"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Step 2: Update Article Metadata
              </h3>

              <p style={{ marginBottom: "1.5rem" }}>Edit the `articleMetadata` object at the top of your file:</p>

              <div
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  overflow: "auto",
                }}
              >
                {`const articleMetadata = {
  title: "Your Compelling Article Title",
  description: "SEO description 150-160 chars for search results",
  author: "Your Name",
  date: "2024-01-15", // YYYY-MM-DD format
  featuredImage: "../../images/blog/your-image.jpg",
  keywords: ["keyword1", "keyword2", "keyword3"],
  slug: "/blog/your-article-url", // Must match filename
}`}
              </div>

              <h2
                id="metadata-configuration"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Metadata Configuration
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>Each field in the metadata object serves a specific purpose:</p>

              <h3
                id="required-fields"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Required Fields
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>title:</strong> Appears in browser tab, search results, and social shares
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>description:</strong> SEO meta description (150-160 characters optimal)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>author:</strong> Displayed in article byline
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>date:</strong> Publication date in YYYY-MM-DD format
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>slug:</strong> URL path for share tracking (must match your filename)
                </li>
              </ul>

              <h3
                id="optional-fields"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Optional Fields
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>featuredImage:</strong> Path to hero image (place in `src/images/blog/`)
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>keywords:</strong> Array of SEO keywords for additional targeting
                </li>
              </ul>

              <h2
                id="content-structure"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Content Structure
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>Replace this guide content with your article. Use the following structure for consistency:</p>

              <h3
                id="heading-hierarchy"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Heading Hierarchy
              </h3>

              <div
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  padding: "1rem",
                  borderRadius: "6px",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  overflow: "auto",
                }}
              >
                {`<h2 id="section-id" style={{...}}>Main Section</h2>
<h3 id="subsection-id" style={{...}}>Subsection</h3>
<p style={{...}}>Paragraph content...</p>`}
              </div>

              <p style={{ marginBottom: "1.5rem" }}>
                Always include `id` attributes on H2 and H3 headings for table of contents navigation. The template automatically handles smooth scrolling.
              </p>

              <h3
                id="styling-guidelines"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Styling Guidelines
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Use CSS variables for colors: `var(--color-text, #333)`</li>
                <li style={{ marginBottom: "0.5rem" }}>Maintain consistent spacing: `marginBottom: "1.5rem"`</li>
                <li style={{ marginBottom: "0.5rem" }}>Keep line height readable: `lineHeight: "1.7"`</li>
                <li style={{ marginBottom: "0.5rem" }}>Use responsive font sizes: `fontSize: "1.1rem"`</li>
              </ul>

              <h2
                id="advanced-features"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Advanced Features
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>This template includes several advanced features that work automatically:</p>

              <h3
                id="share-system"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Share System
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Automatic URL shortening for all share platforms</li>
                <li style={{ marginBottom: "0.5rem" }}>Share count tracking and display</li>
                <li style={{ marginBottom: "0.5rem" }}>UTM parameter handling and Google Analytics integration</li>
                <li style={{ marginBottom: "0.5rem" }}>Support for 7 platforms: Copy Link, Email, Facebook, X, LinkedIn, Reddit, Bluesky</li>
              </ul>

              <h3
                id="table-of-contents"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Table of Contents
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Automatically generated from H2 and H3 headings</li>
                <li style={{ marginBottom: "0.5rem" }}>Smooth scrolling navigation</li>
                <li style={{ marginBottom: "0.5rem" }}>Collapsible sidebar design</li>
                <li style={{ marginBottom: "0.5rem" }}>Responsive mobile behavior</li>
              </ul>

              <h3
                id="seo-optimization"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                SEO Optimization
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Automatic meta tag generation from metadata</li>
                <li style={{ marginBottom: "0.5rem" }}>Open Graph and Twitter Card support</li>
                <li style={{ marginBottom: "0.5rem" }}>Structured data markup</li>
                <li style={{ marginBottom: "0.5rem" }}>Optimized for search engine indexing</li>
              </ul>

              <h2
                id="best-practices"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Best Practices
              </h2>

              <h3
                id="content-guidelines"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Content Guidelines
              </h3>

              <ul style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Write engaging headlines that include target keywords</li>
                <li style={{ marginBottom: "0.5rem" }}>Keep descriptions between 150-160 characters for optimal SEO</li>
                <li style={{ marginBottom: "0.5rem" }}>Use descriptive H2/H3 headings for better navigation</li>
                <li style={{ marginBottom: "0.5rem" }}>Include relevant internal and external links</li>
                <li style={{ marginBottom: "0.5rem" }}>Optimize images for web (1200x630px for social sharing)</li>
              </ul>

              <h3
                id="development-workflow"
                style={{ fontSize: "1.4rem", fontWeight: "600", marginTop: "2rem", marginBottom: "1rem", color: "var(--color-text, #333)" }}
              >
                Development Workflow
              </h3>

              <ol style={{ marginBottom: "1.5rem", paddingLeft: "2rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>Copy template.js to your article filename</li>
                <li style={{ marginBottom: "0.5rem" }}>Update articleMetadata with your content</li>
                <li style={{ marginBottom: "0.5rem" }}>Replace this guide content with your article</li>
                <li style={{ marginBottom: "0.5rem" }}>Add featured image to `src/images/blog/`</li>
                <li style={{ marginBottom: "0.5rem" }}>Test locally with `gatsby develop`</li>
                <li style={{ marginBottom: "0.5rem" }}>No need to manually update table of contents - it's automatic!</li>
                <li style={{ marginBottom: "0.5rem" }}>Commit and deploy</li>
              </ol>

              <div
                style={{
                  backgroundColor: "#f0f8ff",
                  border: "1px solid #b0d4f1",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                  borderLeft: "4px solid #007acc",
                }}
              >
                <p style={{ margin: "0", fontWeight: "600", color: "#007acc" }}>
                  💡 <strong>Pro Tip:</strong> This template is only visible in development mode. It's automatically excluded from production builds, so you can
                  safely keep it as a reference while developing new articles.
                </p>
              </div>

              <h2
                id="conclusion"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "600",
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--color-text, #333)",
                }}
              >
                Ready to Create Your Article?
              </h2>

              <p style={{ marginBottom: "1.5rem" }}>
                You now have everything you need to create professional blog articles using the JavaScript template system. The centralized metadata approach
                ensures consistent SEO, while the advanced features provide a rich reading experience for your audience.
              </p>

              <p style={{ marginBottom: "1.5rem" }}>
                Start by copying this file, updating the metadata, and replacing this content with your article. The template handles all the technical details,
                so you can focus on creating great content.
              </p>

              <div
                style={{
                  backgroundColor: "var(--color-background-alt, #f9f9f9)",
                  border: "2px solid #28a745",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0", fontWeight: "600", color: "#28a745", fontSize: "1.1rem" }}>
                  🚀 <strong>Happy Writing!</strong> Create engaging content that helps KarmaCall users and grows our community.
                </p>
              </div>
            </div>

            {/* Related Articles Section */}
            <RelatedArticles currentArticleSlug={articleMetadata.slug} />
          </div>

          {/* Table of Contents Sidebar */}
          <TableOfContents title={articleMetadata.title} />
        </div>

        {/* Scroll-to-top button */}
        <ScrollToTop />
      </div>
    </Wrapper>
  )
}
