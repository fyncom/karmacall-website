# Blog Article Template System

## Quick Start

1. **Copy the template**: Duplicate `_TEMPLATE.mdx` and rename it to your article filename
2. **Update frontmatter**: Fill in title, date, author, and description
3. **Add featured image**: Place image in `src/images/blog/` directory
4. **Write content**: Replace template content with your article
5. **Test locally**: Run the development server to preview

## Template File

- **Location**: `_TEMPLATE.mdx`
- **Purpose**: Developer-only template (excluded from builds due to underscore prefix)
- **Usage**: Copy and modify for new articles

## File Naming Convention

- Use kebab-case: `my-article-title.mdx`
- Be descriptive but concise
- Avoid special characters and spaces

## Frontmatter Requirements

```yaml
---
title: "Clear, engaging title"
date: "YYYY-MM-DD"
author: "Author Name"
featuredImage: "../../images/blog/image-filename.jpg"
description: "SEO description (150-160 characters)"
---
```

## Image Guidelines

- **Size**: 1200x630px for optimal social sharing
- **Location**: `src/images/blog/`
- **Format**: JPG or PNG
- **Naming**: Use hyphens, no spaces (e.g., `spam-blocking-trends.jpg`)

## Content Structure

The template includes:
- Header with SEO meta tags
- Structured sections with proper headings
- Table formatting for data
- Call-to-action buttons
- Developer notes and checklist

## Available Components

- `<Wrapper seo={meta}>`: SEO wrapper component
- Button styles: `.learn-more-btn.cash.centered`
- Table styles: Inline styles for dark mode compatibility

## Development Workflow

1. Copy `_TEMPLATE.mdx` → `your-article.mdx`
2. Update all placeholder content
3. Add images to `src/images/blog/`
4. Test locally with `gatsby develop`
5. Remove developer comment section before publishing
6. Commit and deploy

## Notes

- Template file (`_TEMPLATE.mdx`) is excluded from production builds
- All articles automatically appear in the blog grid
- SEO meta tags are handled by the Wrapper component
- Tables use CSS variables for theme compatibility 