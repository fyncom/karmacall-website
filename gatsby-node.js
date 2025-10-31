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

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  const config = {
    module: {
      rules: [
        {
          test: /\.node$/,
          use: ["node-loader"],
        },
      ],
    },
    // Faster repeated builds in CI by enabling persistent caching
    cache: {
      type: "filesystem",
    },
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer/"),
      },
      alias: {
        // Map node: protocol imports to regular module names for webpack
        "node:crypto": "crypto-browserify",
        "node:url": "url",
        "node:buffer": "buffer",
        "node:stream": "stream-browserify",
      },
    },
  }

  // Mark Solana and QRCode as external for SSR to prevent node:crypto/node:url errors
  if (stage === "build-html" || stage === "develop-html") {
    config.externals = ["@solana/web3.js", "qrcode"]
  }

  actions.setWebpackConfig(config)
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
};
const helpCenterTemplate = path.resolve("./src/templates/helpCenterTemplate.js");
exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const { helpItems, helpItemsUser } = require("./static/help-items.js");

  // Helper function to create pages for help items
  async function createHelpPages(items, basePath) {
    for (const item of items) {
      if (!item.url || item.url === "filtering") {
        continue;
      }
      const { topicUrl, url } = item;
      const content = await axios.get(url)
        .then(res => {
          return res.data;
        })
        .catch(error => {
          return ''; // Return an empty string on error to avoid breaking the build.
        });      // Include the markdown content in the `context` so it"s available in the template
      createPage({
        path: `${basePath}/${topicUrl}`,
        component: helpCenterTemplate,
        context: {
          content, // Pass markdown content to context
          title: item.title, // Optional: Pass title to use in SEO component
          type: basePath.includes("user") ? "user" : "business" // Determine if it"s user or business help center
        }
      });
    }
  }
  // Create pages for business help center
  await createHelpPages(helpItems, "/help-center");
  // Create pages for user help center
  await createHelpPages(helpItemsUser, "/user-help-center");
};
