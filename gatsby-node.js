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

// Using dynamic frontmatter - no static schema customization needed
// Gatsby will automatically infer the schema from the frontmatter in the MDX files


exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "Mdx") {
    const slug = createFilePath({ node, getNode })
    
    // For pages in src/pages/blog/, Gatsby automatically creates the correct routes
    // We still add the slug field for template compatibility
    createNodeField({
      node,
      name: "slug",
      value: slug,
    })
    
    console.log(`📝 Created MDX node with slug: ${slug}`)
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

  // Blog posts are now automatically created by Gatsby from src/pages/blog/*.mdx
  // No need to manually create pages - Gatsby handles this with file-based routing
  console.log(`✅ Blog posts will be automatically created from src/pages/blog/ directory`)
}

exports.onCreatePage = ({ page, actions }) => {
  const { deletePage } = actions

  // Delete template pages (files starting with underscore)
  if (page.path.includes("/_")) {
    deletePage(page)
  }

  // Delete README pages
  if (page.path.includes("/readme/") || page.path.includes("/README/")) {
    deletePage(page)
  }
  
  // Filter out draft pages in production
  if (process.env.NODE_ENV === "production" && page.context?.frontmatter?.draft === true) {
    deletePage(page)
  }
}
