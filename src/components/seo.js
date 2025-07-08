/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function Seo({ description, title, lang = "en", keywords = [], children, pathname = "", preload = [] }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const defaultKeywords = [
    "spam call blocker",
    "block spam calls",
    "get paid to block calls",
    "stop spam calls",
    "spam blocker",
    "KarmaCall",
    "scam call blocker",
    "robocall blocker",
  ]
  const metaKeywords = keywords.length > 0 ? keywords : defaultKeywords
  const canonical = pathname ? `${site.siteMetadata.siteUrl}${pathname}` : site.siteMetadata.siteUrl

  return (
    <Helmet htmlAttributes={{ lang }} title={title} titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}>
      <meta name="description" content={metaDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={metaKeywords.join(", ")} />
      <meta name="author" content={site.siteMetadata?.author || ``} />

      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content="https://www.karmacall.com/TwitterBanner-KarmaCall.jpg" />
      <meta property="og:site_name" content="KarmaCall" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content="https://www.karmacall.com/TwitterBanner-KarmaCall.jpg" />

      {/* Robots and canonical */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />
      
      {/* Preload key resources to improve CLS and LCP */}
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://static.hotjar.com" crossOrigin="anonymous" />
      
      {/* Add preload hints for critical resources */}
      {preload.map((resource, index) => (
        <link 
          key={`preload-${index}`}
          rel="preload" 
          href={resource.href}
          as={resource.as || 'script'} 
          type={resource.type || undefined}
          crossOrigin={resource.crossOrigin || 'anonymous'}
        />
      ))}
      
      {/* DNS prefetching for third-party domains */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://connect.facebook.net" />
      
      {/* Resource hints to improve page load performance */}
      <link rel="modulepreload" href="/webpack-runtime.js" />
      <link rel="modulepreload" href="/framework.js" />
      <link rel="modulepreload" href="/app.js" />

      {/* Additional SEO tags */}
      <meta name="application-name" content="KarmaCall" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="KarmaCall" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Core Web Vitals & Performance optimizations */}
      <meta name="theme-color" content="#008080" />
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      
      {/* Prioritize LCP image loading */}
      <link rel="preload" as="image" href="/TwitterBanner-KarmaCall.jpg" />
      
      {/* Defer non-critical JS */}
      <script type="text/javascript" dangerouslySetInnerHTML={{
        __html: `
          // Defer non-critical scripts loading
          function loadScript(src, async = true, defer = true) {
            const script = document.createElement('script');
            script.src = src;
            if (async) script.async = true;
            if (defer) script.defer = true;
            document.body.appendChild(script);
            return script;
          }
          
          // Use requestIdleCallback to schedule non-critical work
          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
              // Initialize non-critical scripts when browser is idle
              if (document.readyState === 'complete') {
                initNonCriticalScripts();
              } else {
                window.addEventListener('load', () => {
                  setTimeout(initNonCriticalScripts, 100);
                });
              }
            }, { timeout: 2000 });
          } else {
            // Fallback for browsers that don't support requestIdleCallback
            window.addEventListener('load', () => {
              setTimeout(initNonCriticalScripts, 1000);
            });
          }
          
          function initNonCriticalScripts() {
            // Load any third-party scripts that aren't critical for initial render
            // Facebook and other third-party scripts can be loaded here
          }
        `
      }} />

      {children}
    </Helmet>
  )
}

export default Seo
