/**
 * Implement Gatsby"s Node APIs in this file.
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */
/**
 * @type {import("gatsby").GatsbyNode["createPages"]}
 */
const path = require("path");
const axios = require("axios")
const { createFilePath } = require("gatsby-source-filesystem")

// Enhanced MDX schema for robust GraphQL frontmatter handling
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type Mdx implements Node {
      body: String
      frontmatter: Frontmatter
      fields: Fields
    }
    type Frontmatter {
      title: String!
      date: Date @dateformat
      draft: Boolean
      description: String
      author: String
      featuredImage: File @fileByRelativePath
      featuredImagePath: String
      keywords: [String]
      imageDescription: String
      imageCredit: String
      slug: String
    }
    type Fields {
      slug: String!
    }
  `)
}


exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "Mdx") {
    const slug = createFilePath({ node, getNode })
    const fileNode = getNode(node.parent)
    
    // Create blog-friendly slugs for blog posts
    let finalSlug = slug
    
    // Handle both old blog-posts directory and new src/pages/blog structure
    if (fileNode) {
      if (fileNode.sourceInstanceName === "blog-posts") {
        // Legacy blog-posts directory
        finalSlug = `/blog${slug}`
      } else if (fileNode.sourceInstanceName === "blogs" && fileNode.relativePath.includes("blog/")) {
        // New src/pages/blog structure - use the existing slug
        finalSlug = slug
      }
    }

    // Clean up slug if it ends with /index
    if (finalSlug.endsWith("/index")) {
      finalSlug = finalSlug.replace("/index", "")
    }
    
    // Ensure blog posts have /blog/ prefix
    if (finalSlug.includes("/blog/") && !finalSlug.startsWith("/blog/")) {
      finalSlug = finalSlug.replace(/.*\/blog\//, "/blog/")
    }

    // Debug logging for development
    if (process.env.NODE_ENV === "development") {
      console.log(`🐛 MDX Node: ${node.internal.contentFilePath}`)
      console.log(`🐛 Source Instance: ${fileNode?.sourceInstanceName}`)
      console.log(`🐛 Original slug: ${slug}`)
      console.log(`🐛 Final slug: ${finalSlug}`)
    }

    createNodeField({
      node,
      name: "slug",
      value: finalSlug,
    })
  }
}
const helpCenterTemplate = path.resolve("./src/templates/helpCenterTemplate.js")
const blogPostTemplate = path.resolve("./src/templates/blog-post.js")

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const { helpItems, helpItemsUser } = require("./static/help-items.js")

  // Helper function to create pages for help items
  async function createHelpPages(items, basePath) {
    for (const item of items) {
      if (!item.url || item.url === "filtering") {
        continue
      }
      const { topicUrl, url } = item
      const content = await axios
        .get(url)
        .then(res => {
          return res.data
        })
        .catch(error => {
          return "" // Return an empty string on error to avoid breaking the build.
        }) // Include the markdown content in the `context` so it"s available in the template
      createPage({
        path: `${basePath}/${topicUrl}`,
        component: helpCenterTemplate,
        context: {
          content, // Pass markdown content to context
          title: item.title, // Optional: Pass title to use in SEO component
          type: basePath.includes("user") ? "user" : "business", // Determine if it"s user or business help center
        },
      })
    }
  }

  // Create pages for business help center
  await createHelpPages(helpItems, "/help-center")
  // Create pages for user help center
  await createHelpPages(helpItemsUser, "/user-help-center")

  // Create blog post pages from MDX files with enhanced GraphQL queries
  const isProd = process.env.NODE_ENV === "production"
  const blogPostQuery = await graphql(`
    {
      allMdx(
        sort: { frontmatter: { date: DESC } }
        filter: { 
          fields: { slug: { regex: "/^\/blog\//" } }
        }
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
            draft
            date
            description
            author
            featuredImage {
              publicURL
              childImageSharp {
                gatsbyImageData(width: 1200, height: 630, layout: FIXED)
              }
            }
            featuredImagePath
            keywords
            imageDescription
            imageCredit
          }
        }
      }
    }
  `)

  if (blogPostQuery.errors) {
    reporter.panicOnBuild("Error loading MDX blog posts", blogPostQuery.errors)
    return
  }

  const allMdxNodes = blogPostQuery.data.allMdx.nodes

  // Filter blog posts - sorting is now handled by GraphQL
  const blogPosts = allMdxNodes
    .filter(post => {
      // Only include posts with blog slugs
      if (!post.fields?.slug?.startsWith("/blog/")) {
        return false
      }
      // Filter out drafts in production
      if (isProd && post.frontmatter?.draft === true) {
        return false
      }
      return true
    })

  // Create individual blog post pages
  blogPosts.forEach(post => {
    createPage({
      path: post.fields.slug,
      component: blogPostTemplate,
      context: {
        id: post.id,
      },
    })
  })

  console.log(`✅ Created ${blogPosts.length} blog post pages from MDX files`)
}

exports.onCreatePage = ({ page, actions }) => {
  const { deletePage } = actions

  // Delete template page in production
  if (process.env.NODE_ENV === "production" && page.path === "/blog/template/") {
    deletePage(page)
  }

  // Delete any template pages (files starting with underscore)
  if (page.path.includes("/_")) {
    deletePage(page)
  }

  // Delete README pages
  if (page.path.includes("/readme/") || page.path.includes("/README/")) {
    deletePage(page)
  }
}
