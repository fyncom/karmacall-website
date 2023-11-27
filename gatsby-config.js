/** https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/ */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
/** @type {import('gatsby').GatsbyConfig} */
module.exports = {
  siteMetadata: {
    title: `Free Scam Call Blocker | Download today | KarmaCall`,
    description: `Get more conversations by instantly rewarding prospects when they respond to emails or book meetings.
      Break sales funnel bottlenecks with automated rewards. Get FynCom set up in minutes & enhance your tech stack.
      Improve customer experience & max your chances of gaining & retaining customers.`,
    author: `@adrianegraphene`,
    siteUrl: `https://www.karmcall.com`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-web-font-loader`,
      options: {
        custom: {
          families: [
            `Barlow: 100,200,300,400,500,600,700,800,900,italic,bold,bolditalic`,
            `Barlow SemiCondensed: 100,200,300,400,500,600,700,800,900,italic,bold,bolditalic`,
          ],
          urls: [`/Barlow-AllFonts_Includes_SemiCondensed.css`],
        },
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/karmacall-favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: [process.env.GATSBY_GOOGLE_TAG_ID],
        pluginConfig: {
          head: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-hotjar`,
      options: {
        includeInDevelopment: true,
        id: process.env.GATSBY_HOTJAR_ID,
        sv: 6,
      },
    },
    {
      resolve: "gatsby-plugin-clearbit",
      options: {
        publishableKey: process.env.GATSBY_CLEARBIT_ID,
        enableOnDevMode: true,
      },
    },
    {
      resolve: `gatsby-plugin-facebook-pixel`,
      options: {
        pixelId: process.env.GATSBY_FACEBOOK_PIXEL,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blogs`,
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // to see where this pops up.
              maxWidth: 593, // Example option for gatsby-remark-images
            },
          },
          // other plugins here
        ],
      },
    },
  ],
}
