/** https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/ */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
/** @type {import('gatsby').GatsbyConfig} */
module.exports = {
  siteMetadata: {
    title: `Block Spam, Get Cash. A Scam call Blocker App with Cash Back! Download today | KarmaCall`,
    description: `Tired of scam calls? Get paid to block them! KarmaCall auto-blocks spam calls for you and pays you each time. Cash out to gift cards at $1.00 or withdraw anytime.`,
    author: `@adrianegraphene`,
    siteUrl: `https://www.karmacall.com`,
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://www.karmacall.com",
        sitemap: "https://www.karmacall.com/sitemap-index.xml",
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `KarmaCall - Get Paid to Block Spam Calls`,
        short_name: `KarmaCall`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#008080`,
        display: `standalone`,
        icon: `src/images/favicon.ico`,
        description: `Block spam calls and get paid for each one. KarmaCall makes blocking unwanted calls profitable.`,
        lang: `en`,
        localize: [
          {
            start_url: `/`,
            lang: `en`,
            name: `KarmaCall - Get Paid to Block Spam Calls`,
            short_name: `KarmaCall`,
            description: `Block spam calls and get paid for each one. KarmaCall makes blocking unwanted calls profitable.`,
          },
        ],
      },
    },
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
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: [process.env.GATSBY_GOOGLE_TAG_ID],
        gtagConfig: {
          optimize_id: "OPT_CONTAINER_ID",
          anonymize_ip: true,
          cookie_expires: 0,
        },
        pluginConfig: {
          head: true,
          respectDNT: true,
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
