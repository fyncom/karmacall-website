// Centralized Font Size System for Blog Articles
// This system provides consistent typography scaling across all articles

export const fontSizes = {
  // Base sizes (before text size control scaling)
  base: {
    body: "1rem", // Base paragraph text
    small: "0.875rem", // Small text, captions, credits
    large: "1.125rem", // Emphasized text, intro paragraphs
  },

  // Heading scale (relative to body text)
  headings: {
    h1: "2em", // Main article title (2x body)
    h2: "1.6em", // Section headings (1.6x body)
    h3: "1.3em", // Subsection headings (1.3x body)
    h4: "1.1em", // Minor headings (1.1x body)
  },

  // UI elements
  ui: {
    button: "0.9rem", // Button text
    caption: "0.8rem", // Image captions, credits
    code: "0.9em", // Code blocks (relative to container)
    meta: "0.875rem", // Author, date, metadata
  },
}

// Line height scale
export const lineHeights = {
  tight: 1.25, // Headings
  normal: 1.5, // UI elements
  relaxed: 1.0, // Body text (small)
  comfortable: 1.7, // Body text (medium)
  loose: 1.75, // Body text (large)
}

// Text size control multipliers
export const textSizeMultipliers = {
  small: 0.8, // 90% of base
  medium: 1.1, // 100% of base (default)
  large: 1.8, // 120% of base
}

// Generate text size styles for articles
export const generateTextSizeStyles = () => {
  const styles = {}

  Object.keys(textSizeMultipliers).forEach(size => {
    const multiplier = textSizeMultipliers[size]
    styles[size] = {
      fontSize: `${multiplier}rem`,
      lineHeight: lineHeights[size === "small" ? "relaxed" : size === "medium" ? "comfortable" : "loose"],
    }
  })

  return styles
}

// CSS custom properties for use in styled components
export const generateCSSVariables = (textSize = "medium") => {
  const multiplier = textSizeMultipliers[textSize]

  return {
    "--font-size-body": `${multiplier}rem`,
    "--font-size-small": `${parseFloat(fontSizes.base.small) * multiplier}rem`,
    "--font-size-large": `${parseFloat(fontSizes.base.large) * multiplier}rem`,
    "--font-size-h1": `calc(${multiplier}rem * 2)`,
    "--font-size-h2": `calc(${multiplier}rem * 1.6)`,
    "--font-size-h3": `calc(${multiplier}rem * 1.3)`,
    "--font-size-h4": `calc(${multiplier}rem * 1.1)`,
    "--font-size-code": `calc(${multiplier}rem * 0.9)`,
    "--font-size-caption": fontSizes.ui.caption,
    "--font-size-meta": fontSizes.ui.meta,
    "--line-height-tight": lineHeights.tight,
    "--line-height-normal": lineHeights.normal,
    "--line-height-body": lineHeights[textSize === "small" ? "relaxed" : textSize === "medium" ? "comfortable" : "loose"],
  }
}

// Utility function to get font size for specific elements
export const getFontSize = (element, textSize = "medium") => {
  const multiplier = textSizeMultipliers[textSize]

  switch (element) {
    case "body":
    case "p":
      return `${multiplier}rem`
    case "h1":
      return `${multiplier * 2}rem`
    case "h2":
      return `${multiplier * 1.6}rem`
    case "h3":
      return `${multiplier * 1.3}rem`
    case "h4":
      return `${multiplier * 1.1}rem`
    case "small":
      return `${parseFloat(fontSizes.base.small) * multiplier}rem`
    case "large":
      return `${parseFloat(fontSizes.base.large) * multiplier}rem`
    case "code":
      return `${multiplier * 0.9}rem`
    case "caption":
      return fontSizes.ui.caption
    case "meta":
      return fontSizes.ui.meta
    default:
      return `${multiplier}rem`
  }
}
