# MDX Blog System Guide

This guide explains how to use the new MDX-powered blog system that automatically converts Markdown/MDX posts to your existing JavaScript blog format.

## 🎯 Key Benefits

- **Better Social Sharing**: Featured images display properly on social platforms
- **Easy Writing**: Use familiar Markdown syntax instead of JSX
- **Automatic Conversion**: Seamlessly integrates with existing blog infrastructure
- **Preserved Features**: All existing blog features (table of contents, related articles, etc.) work automatically

## 🚀 Quick Start

### 1. Create an MDX File

Create a new file in the `blog-posts/` directory:

```bash
# Create your article
touch blog-posts/my-awesome-article.mdx
```

### 2. Add Frontmatter

Every MDX article must start with frontmatter:

```yaml
---
title: "Your Article Title"
description: "SEO-friendly description (150-160 characters optimal)"
author: "Your Name"
date: "2025-01-12"
featuredImage: "../../images/blog/your-image.jpg"
keywords: ["keyword1", "keyword2", "keyword3"]
slug: "/blog/your-article-url"
---
```

### 3. Write Your Content

Write in standard Markdown below the frontmatter:

```markdown
# Your content here

Use **bold**, *italic*, [links](https://example.com), and all standard Markdown features.

## Headings create automatic table of contents

### Subheadings work too

- Lists are preserved
- With proper styling
- Automatically applied
```

### 4. Convert to JavaScript

Convert your MDX to the JavaScript blog format:

```bash
# Single file conversion
npm run blog:convert blog-posts/my-article.mdx src/pages/blog/my-article.js

# Convert all MDX files at once
npm run blog:build

# Watch for changes (recommended during development)
npm run blog:watch
```

## 📝 Writing Guide

### Required Frontmatter Fields

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Article title (appears in browser tab, social shares) | `"How to Block Spam Calls"` |
| `description` | SEO meta description (150-160 chars) | `"Learn effective strategies..."` |
| `author` | Author name | `"KarmaCall Team"` |
| `date` | Publication date (YYYY-MM-DD) | `"2025-01-12"` |
| `slug` | URL path (must start with `/blog/`) | `"/blog/spam-blocking-guide"` |

### Optional Fields

| Field | Description | Example |
|-------|-------------|---------|
| `featuredImage` | Hero image path (for social sharing) | `"../../images/blog/hero.jpg"` |
| `keywords` | Array of SEO keywords | `["spam", "blocking", "calls"]` |

### Special Markdown Features

#### Callout Boxes

Create styled callout boxes using blockquotes with emojis:

```markdown
> 📝 **Quick Tip:** This becomes a blue info box

> 💡 **Pro Tip:** This becomes a blue tip box  

> ⚠️ **Warning:** This becomes a yellow warning box
```

#### Code Blocks

```markdown
```javascript
// Code blocks are automatically styled
const example = "with syntax highlighting";
```
```

#### Images

```markdown
![Alt text](../../images/blog/image.jpg "Image caption")
```

Images automatically become `FeaturedImage` components with proper styling.

## 🔄 Conversion Process

When you run the converter, it:

1. **Parses Frontmatter**: Extracts metadata for the article
2. **Converts Markdown**: Transforms content to JSX with proper styling
3. **Generates JavaScript**: Creates a complete JS article file
4. **Updates Databases**: Automatically updates blog index and article similarity database
5. **Preserves Features**: Maintains all existing blog functionality

### What Gets Generated

From `blog-posts/my-article.mdx`, the converter creates:

- `src/pages/blog/my-article.js` - Complete JavaScript article
- Updates `src/pages/blog/index.js` - Adds to article list
- Updates `src/utils/articleSimilarity.js` - Adds to recommendation system

## 🛠️ Development Workflow

### Recommended Process

1. **Start Watch Mode**: `npm run blog:watch`
2. **Create MDX File**: Write your article in `blog-posts/`
3. **Auto-Convert**: Files convert automatically when saved
4. **Test**: Run `gatsby develop` to preview
5. **Deploy**: Commit both MDX source and generated JS files

### File Organization

```
karmacall-website/
├── blog-posts/              # MDX source files
│   ├── my-article.mdx
│   └── another-post.mdx
├── src/pages/blog/          # Generated JS articles
│   ├── my-article.js
│   └── another-post.js
└── scripts/
    └── mdx-to-js-converter.js
```

## 🔧 Commands Reference

```bash
# Watch for MDX changes (recommended during development)
npm run blog:watch

# Convert all existing MDX files
npm run blog:build

# Convert a specific file
npm run blog:convert blog-posts/article.mdx src/pages/blog/article.js

# Start Gatsby development server
gatsby develop
```

## ✅ Best Practices

### Content Writing

- **Engaging Headlines**: Include target keywords in titles
- **Optimal Descriptions**: 150-160 characters for best SEO
- **Clear Structure**: Use H2/H3 headings for auto-generated table of contents
- **Image Optimization**: Use optimized images (1200x630px for social sharing)
- **Internal Links**: Link to other blog posts and pages

### Technical Guidelines

- **Unique Slugs**: Ensure each article has a unique slug
- **Consistent Dating**: Use YYYY-MM-DD format for dates
- **Image Paths**: Use relative paths from `src/images/blog/`
- **Keywords**: Include 5-10 relevant keywords for SEO and recommendations

### Social Sharing Optimization

- **Featured Images**: Always include a `featuredImage` for better social previews
- **Compelling Descriptions**: Write descriptions that work well as social media snippets
- **Proper Meta Tags**: The converter automatically generates Open Graph and Twitter Card tags

## 🚨 Troubleshooting

### Common Issues

**Conversion Fails**
- Check frontmatter syntax (YAML must be valid)
- Ensure all required fields are present
- Verify file permissions on blog-posts directory

**Missing Images in Social Shares**
- Confirm `featuredImage` path is correct
- Image should be in `src/images/blog/` directory
- Use absolute paths from site root in production

**Duplicate Articles**
- Ensure `slug` field is unique
- Check that no manual JS file exists with same name
- Restart watch mode if files seem stuck

### Getting Help

- Check console output for specific error messages
- Verify MDX syntax using online validators
- Test individual file conversion before batch operations

## 🎉 Migration from Existing Articles

To migrate existing JavaScript articles to MDX:

1. **Extract Metadata**: Copy `articleMetadata` to frontmatter
2. **Convert JSX to Markdown**: Transform JSX content back to Markdown
3. **Test Conversion**: Verify the round-trip conversion works correctly
4. **Keep Both**: Maintain both files during transition period

Happy writing! 🚀 