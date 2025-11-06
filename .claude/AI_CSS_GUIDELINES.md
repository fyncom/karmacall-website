# AI Agent CSS Guidelines for KarmaCall Website

## Purpose
This document provides CSS best practices and guidelines for AI coding assistants (Claude, Cursor, GitHub Copilot, etc.) working on the KarmaCall website. Following these guidelines will keep the codebase maintainable, consistent, and easier to work with.

---

## Core Principle: Avoid Inline CSS

**ALWAYS prefer CSS classes over inline styles.**

### ❌ Bad Practice
```jsx
<div style={{
  marginTop: "40px",
  borderTop: "1px solid #ddd",
  paddingTop: "20px",
  backgroundColor: "#f5f5f5"
}}>
  Content here
</div>
```

### ✅ Good Practice
```jsx
// In CSS file
.section-divider {
  margin-top: 40px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
  background-color: #f5f5f5;
}

// In JSX
<div className="section-divider">
  Content here
</div>
```

---

## When Inline Styles Are Acceptable

Use inline styles **ONLY** in these specific cases:

1. **Dynamic values based on runtime data**
   ```jsx
   // ✅ Acceptable - value comes from API/state
   <div style={{ width: `${percentage}%` }}>
   ```

2. **Values computed from user input**
   ```jsx
   // ✅ Acceptable - position based on user interaction
   <div style={{ top: mouseY, left: mouseX }}>
   ```

3. **Animations with dynamically calculated values**
   ```jsx
   // ✅ Acceptable - animation properties from calculations
   <div style={{ transform: `translateX(${offset}px)` }}>
   ```

**If the value is static or based on application state (not user input), use CSS classes.**

---

## CSS Organization Strategy

### 1. Use Page-Specific CSS Files

For pages with unique styling needs, create a dedicated CSS file:

```
src/pages/
  ├── cash-out.js
  └── cash-out.css       ← Page-specific styles
```

Import it at the top of your component:
```jsx
import "./cash-out.css"
```

### 2. Global vs. Page-Specific Styles

- **Global CSS** (`src/components/*.css`): Shared components, layout, typography
- **Page-specific CSS**: Unique page sections, specialized components

### 3. CSS File Structure

Organize your CSS file with clear sections:

```css
/* Page Title - Brief Description */

/* Utility Classes */
.margin-bottom-16 { margin-bottom: 16px; }
.text-small { font-size: 13px; }

/* Section: Component Name */
.component-name {
  /* styles */
}

.component-name.modifier {
  /* variant styles */
}

/* Section: Another Component */
/* ... */
```

---

## Handling Conditional Styling

### ❌ Bad Practice
```jsx
<button
  style={{
    background: isActive
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "white",
    color: isActive ? "white" : "#3730a3",
    boxShadow: isActive ? "0 6px 12px -4px rgba(102, 126, 234, 0.55)" : "none"
  }}
>
  Click me
</button>
```

### ✅ Good Practice
```css
/* In CSS file */
.toggle-btn {
  background: white;
  color: #3730a3;
  box-shadow: none;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 6px 12px -4px rgba(102, 126, 234, 0.55);
}
```

```jsx
// In JSX - use conditional className
<button className={`toggle-btn ${isActive ? 'active' : ''}`}>
  Click me
</button>
```

---

## CSS Naming Conventions

### 1. Use Semantic, Descriptive Names

- **Component-based**: `.plan-card`, `.info-box`, `.modal-overlay`
- **State-based**: `.active`, `.disabled`, `.error`, `.success`
- **Content-based**: `.referral-section`, `.subscription-plans-grid`

### 2. BEM-Style Modifiers (Optional)

```css
.plan-card { }
.plan-card.premium { }
.plan-card.supreme { }
```

Or:

```css
.plan-card { }
.plan-card--premium { }
.plan-card--supreme { }
```

### 3. Avoid Generic Names

- ❌ `.box`, `.container`, `.wrapper`
- ✅ `.info-box`, `.subscription-container`, `.modal-wrapper`

---

## Color and Theme Variables

Use CSS custom properties for colors that may change with themes:

```css
.element {
  background-color: var(--color-background-alt, #f5f5f5);
  color: var(--color-text, #1e293b);
  border: 1px solid var(--border-color, #ddd);
}
```

This ensures dark mode / theme compatibility.

---

## Reusable Utility Classes

Create utility classes for frequently used patterns:

```css
/* Spacing utilities */
.margin-bottom-16 { margin-bottom: 16px; }
.margin-top-40 { margin-top: 40px; }
.padding-20 { padding: 20px; }

/* Text utilities */
.text-small { font-size: 13px; }
.text-center { text-align: center; }
.font-bold { font-weight: 600; }

/* Layout utilities */
.flex { display: flex; }
.grid { display: grid; }
```

**However:** Don't go overboard with utility classes. For complex components, use semantic component classes instead.

---

## Responsive Design

Use media queries in your CSS files, not inline:

```css
.subscription-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .subscription-plans-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Gradients and Complex Backgrounds

Move gradients to CSS classes:

```css
.gradient-purple {
  background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%);
}

.gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## Checklist for AI Agents

Before writing inline styles, ask:

1. ✅ **Is this value dynamic/computed at runtime?**
   - If NO → Use CSS class

2. ✅ **Does this style appear in multiple places?**
   - If YES → Use CSS class

3. ✅ **Is this a conditional style (active/inactive, error/success)?**
   - If YES → Use CSS classes with conditional className

4. ✅ **Could this style be reused on other pages?**
   - If YES → Consider global CSS or utility class

5. ✅ **Is this style specific to this page only?**
   - If YES → Use page-specific CSS file

---

## Migration Strategy

When refactoring existing code with inline styles:

1. **Identify patterns** - Group similar inline styles together
2. **Create semantic classes** - Name them based on purpose/component
3. **Extract to CSS file** - Move to page-specific or global CSS
4. **Replace inline styles** - Update JSX to use className
5. **Test thoroughly** - Verify visual appearance unchanged

---

## Example: Before and After

### Before (Inline Styles)
```jsx
<div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
  <h3 style={{ marginBottom: "16px" }}>Subscription Plans</h3>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
    <div style={{ border: "2px solid #dbeafe", borderRadius: "8px", padding: "16px", backgroundColor: "#eff6ff" }}>
      <h4 style={{ margin: "0 0 8px 0", color: "#1e40af" }}>Premium</h4>
      <button
        style={{
          width: "100%",
          background: isQrMode ? "#7c3aed" : "#3b82f6",
          color: "white",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Subscribe
      </button>
    </div>
  </div>
</div>
```

### After (CSS Classes)
```css
/* cash-out.css */
.section-divider {
  margin-top: 40px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.subscription-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.plan-card.premium {
  border: 2px solid #dbeafe;
  border-radius: 8px;
  padding: 16px;
  background-color: #eff6ff;
}

.plan-card h4 {
  margin: 0 0 8px 0;
  color: #1e40af;
}

.plan-card button {
  width: 100%;
  background: #3b82f6;
  color: white;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
}

.plan-card button.qr-mode {
  background: #7c3aed;
}
```

```jsx
{/* cash-out.js */}
<div className="section-divider">
  <h3 className="margin-bottom-16">Subscription Plans</h3>
  <div className="subscription-grid">
    <div className="plan-card premium">
      <h4>Premium</h4>
      <button className={isQrMode ? 'qr-mode' : ''}>
        Subscribe
      </button>
    </div>
  </div>
</div>
```

---

## Questions to Ask

When in doubt about whether to use inline styles or CSS classes, ask yourself:

1. **Would another developer need to search through JSX to find this styling?**
   - If YES → Use CSS class

2. **If I wanted to change this color/spacing site-wide, would I need to search through multiple JSX files?**
   - If YES → Use CSS class

3. **Is this styling making my JSX harder to read?**
   - If YES → Use CSS class

4. **Am I duplicating this style in multiple places?**
   - If YES → Use CSS class

---

## Summary

- **Default to CSS classes** for all styling
- Use **page-specific CSS files** for unique page styles
- Use **conditional classNames** instead of conditional inline styles
- Create **semantic, descriptive class names**
- Use **CSS custom properties** for theme-compatible colors
- Reserve **inline styles** only for truly dynamic, runtime-computed values

Following these guidelines will result in:
- ✅ Cleaner, more readable JSX
- ✅ Easier maintenance and debugging
- ✅ Better performance (styles cached by browser)
- ✅ Consistent styling across the application
- ✅ Easier theme/branding changes

---

**Remember: When in doubt, use a CSS class. Your future self (and other developers) will thank you!**
