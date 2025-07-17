/**
 * Simplified Keyboard Navigation Utility
 * Essential accessibility functions only
 */

/**
 * Create keyboard-accessible click handlers
 * @param {Function} onClick - The click handler function
 * @param {Object} options - Additional options
 * @returns {Object} Object with onClick and onKeyDown handlers
 */
export const createKeyboardClickHandlers = (onClick, options = {}) => ({
  onClick,
  onKeyDown: event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick(event)
    }
  },
  tabIndex: 0,
  role: options.role || "button",
})

/**
 * Handle escape key to close modals, dropdowns, etc.
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Function} onEscape - Callback when escape is pressed
 */
export const handleEscapeKey = (event, onEscape) => {
  if (event.key === "Escape") {
    event.preventDefault()
    onEscape(event)
  }
}

/**
 * Handle keyboard navigation for lists (up/down arrow keys)
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Array} items - Array of items or elements
 * @param {number} currentIndex - Current selected index
 * @param {Function} onIndexChange - Callback when index changes
 */
export const handleListNavigation = (event, items, currentIndex, onIndexChange) => {
  let newIndex = currentIndex

  switch (event.key) {
    case "ArrowDown":
      newIndex = currentIndex + 1 >= items.length ? 0 : currentIndex + 1
      break
    case "ArrowUp":
      newIndex = currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1
      break
    case "Home":
      newIndex = 0
      break
    case "End":
      newIndex = items.length - 1
      break
    default:
      return
  }

  event.preventDefault()
  onIndexChange(newIndex)
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Focus the first focusable element within a container
   * @param {HTMLElement} container - The container element
   */
  focusFirst: container => {
    const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    if (focusable.length > 0) {
      focusable[0].focus()
    }
  }
}