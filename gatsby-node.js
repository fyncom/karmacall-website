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

exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })
}



exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "Mdx") {
    const slug = createFilePath({ node, getNode })

    // Create blog-friendly slugs for blog posts
    let finalSlug = slug

    // Check if this MDX file is from the blog-posts directory
    const fileNode = getNode(node.parent)
    if (fileNode && fileNode.sourceInstanceName === "blog-posts") {
      // Force all blog posts to have /blog/ prefix
      finalSlug = `/blog${slug}`
    }

    // Debug logging
    console.log(`🐛 MDX Node: ${node.internal.contentFilePath}`)
    console.log(`🐛 Source Instance: ${fileNode?.sourceInstanceName}`)
    console.log(`🐛 Original slug: ${slug}`)
    console.log(`🐛 Final slug: ${finalSlug}`)

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

  // Create blog post pages from MDX files
  const blogPostQuery = await graphql(`
    {
      allMdx(filter: { fields: { slug: { regex: "/^/blog/" } } }, sort: { frontmatter: { date: DESC } }) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  `)

  if (blogPostQuery.errors) {
    reporter.panicOnBuild("Error loading MDX blog posts", blogPostQuery.errors)
    return
  }

  const blogPosts = blogPostQuery.data.allMdx.nodes

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
