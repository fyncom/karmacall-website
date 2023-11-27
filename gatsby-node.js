/**
 * Implement Gatsby"s Node APIs in this file.
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */
/**
 * @type {import("gatsby").GatsbyNode["createPages"]}
 */
const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
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
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.node$/,
          use: ["node-loader"],
        },
      ],
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
