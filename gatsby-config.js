/** https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/ */
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
/** @type {import('gatsby').GatsbyConfig} */
module.exports = {
  siteMetadata: {
    title: `Block Spam, Get Cash. A Scam call Blocker App with Cash Back! Download today | KarmaCall`,
    titleTemplate: `%s | KarmaCall`,
    description: `Tired of scam calls? Get paid to block them! KarmaCall auto-blocks spam calls for you and pays you each time. Cash out to gift cards at $1.00 or withdraw anytime.`,
    image: "/images/karmacall-social-card.jpg",
    twitterUsername: "@GetKarmaCall",
    author: `@adrianegraphene`,
    siteUrl: `https://www.karmacall.com`,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://www.karmacall.com",
        sitemap: "https://www.karmacall.com/sitemap-index.xml",
        policy: [
          {
            userAgent: "*",
            allow: "/",
            disallow: ["/login?*", "/login/?*"]
          }
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: "/",
        excludes: ["/login?*", "/login/?*"],
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolveSiteUrl: () => "https://www.karmacall.com",
        resolvePages: ({ allSitePage: { nodes: allPages } }) => {
          return allPages.filter(page => {
            // Exclude login pages with query parameters
            if (page.path.includes("login") && page.path.includes("?")) {
              return false
            }
            // Exclude any page with referral codes
            if (page.path.includes("_referralCode")) {
              return false
            }
            return true
          })
        },
        serialize: ({ path }) => {
          return {
            url: path,
            changefreq: "daily",
            priority: path === "/" ? 1.0 : 0.7,
          }
        },
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
      resolve: "gatsby-plugin-sharp",
      options: {
        defaults: {
          formats: ["auto", "webp"],
          placeholder: "dominantColor",
          quality: 70,
          breakpoints: [360, 640, 768, 1024, 1366, 1600],
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `KarmaCall | Get Paid to Block Spam Calls`,
        short_name: `KarmaCall`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#008080`,
        display: `standalone`,
        icon: `src/images/karmacall-favicon.png`,
        icon_options: {
          purpose: `any maskable`,
        },
      },
    },
    `gatsby-plugin-offline`,
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
          head: false,
          respectDNT: true,
          // Consent will be managed by our CookieConsentEEA component
        },
      },
    },
    {
      resolve: `gatsby-plugin-facebook-pixel`,
      options: {
        pixelId: process.env.GATSBY_FACEBOOK_PIXEL,
        // Facebook Pixel will be managed by our consent management
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
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: `100`,
              icon: false,
              className: `heading-anchor`,
              maintainCase: false,
              removeAccents: true,
              isIconAfterHeader: false,
              elements: [`h1`, `h2`, `h3`, `h4`, `h5`, `h6`],
            },
          },
          // other plugins here
        ],
      },
    },
  ],
}
