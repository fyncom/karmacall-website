/**
 * Implement Gatsby"s Node APIs in this file.
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */
/**
 * @type {import("gatsby").GatsbyNode["createPages"]}
 */
const path = require("path");
const axios = require("axios");
const { createFilePath } = require("gatsby-source-filesystem")

exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.node$/,
          use: ["node-loader"],
        },
      ],
    },
    resolve: {
      alias: {
        "object.assign/polyfill": require.resolve("object-assign/index.js"),
      },
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert/"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        buffer: require.resolve("buffer/"),
        util: require.resolve("util/"),
      },
    },
    plugins: [
      plugins.provide({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    // Faster repeated builds in CI by enabling persistent caching
    cache: {
      type: "filesystem",
    },
  })
}
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "Mdx") {
    const slug = createFilePath({ node, getNode })
    createNodeField({
      node,
      name: "slug",
      value: `${slug}`,
    })
  }
}
const helpCenterTemplate = path.resolve("./src/templates/helpCenterTemplate.js")
exports.createPages = async ({ actions }) => {
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
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path.match(/^\/mobile-sign/)) {
    page.matchPath = "/mobile-sign/*"
    createPage(page)
  }
}
