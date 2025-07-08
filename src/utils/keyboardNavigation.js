/**
 * Keyboard Navigation Utility
 * Provides reusable functions for accessible keyboard navigation
 */

/**
 * Handle keyboard events for clickable elements
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Function} callback - The function to call when Enter or Space is pressed
 * @param {Object} options - Additional options
 * @param {boolean} options.preventDefault - Whether to prevent default behavior
 * @param {boolean} options.stopPropagation - Whether to stop event propagation
 */
export const handleKeyboardClick = (event, callback, options = {}) => {
  const { preventDefault = true, stopPropagation = false } = options

  // Only handle Enter and Space keys
  if (event.key === "Enter" || event.key === " ") {
    if (preventDefault) {
      event.preventDefault()
    }
    if (stopPropagation) {
      event.stopPropagation()
    }
    callback(event)
  }
}

/**
 * Create keyboard-accessible click handlers
 * @param {Function} onClick - The click handler function
 * @param {Object} options - Additional options
 * @returns {Object} Object with onClick and onKeyDown handlers
 */
export const createKeyboardClickHandlers = (onClick, options = {}) => {
  return {
    onClick,
    onKeyDown: event => handleKeyboardClick(event, onClick, options),
    tabIndex: 0,
    role: options.role || "button",
  }
}

/**
 * Handle keyboard navigation for lists (up/down arrow keys)
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Array} items - Array of items or elements
 * @param {number} currentIndex - Current selected index
 * @param {Function} onIndexChange - Callback when index changes
 * @param {Object} options - Additional options
 */
export const handleListNavigation = (event, items, currentIndex, onIndexChange, options = {}) => {
  const { wrap = true, preventDefault = true } = options

  let newIndex = currentIndex

  switch (event.key) {
    case "ArrowDown":
      newIndex = currentIndex + 1
      if (newIndex >= items.length) {
        newIndex = wrap ? 0 : items.length - 1
      }
      break
    case "ArrowUp":
      newIndex = currentIndex - 1
      if (newIndex < 0) {
        newIndex = wrap ? items.length - 1 : 0
      }
      break
    case "Home":
      newIndex = 0
      break
    case "End":
      newIndex = items.length - 1
      break
    default:
      return // Don't handle other keys
  }

  if (preventDefault) {
    event.preventDefault()
  }

  onIndexChange(newIndex)
}

/**
 * Handle keyboard navigation for tab-like interfaces
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Array} tabs - Array of tab items
 * @param {number} currentIndex - Current selected tab index
 * @param {Function} onTabChange - Callback when tab changes
 * @param {Object} options - Additional options
 */
export const handleTabNavigation = (event, tabs, currentIndex, onTabChange, options = {}) => {
  const { wrap = true, preventDefault = true } = options

  let newIndex = currentIndex

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      newIndex = currentIndex + 1
      if (newIndex >= tabs.length) {
        newIndex = wrap ? 0 : tabs.length - 1
      }
      break
    case "ArrowLeft":
    case "ArrowUp":
      newIndex = currentIndex - 1
      if (newIndex < 0) {
        newIndex = wrap ? tabs.length - 1 : 0
      }
      break
    case "Home":
      newIndex = 0
      break
    case "End":
      newIndex = tabs.length - 1
      break
    default:
      return // Don't handle other keys
  }

  if (preventDefault) {
    event.preventDefault()
  }

  onTabChange(newIndex)
}

/**
 * Handle escape key to close modals, dropdowns, etc.
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Function} onEscape - Callback when escape is pressed
 * @param {Object} options - Additional options
 */
export const handleEscapeKey = (event, onEscape, options = {}) => {
  const { preventDefault = true, stopPropagation = true } = options

  if (event.key === "Escape") {
    if (preventDefault) {
      event.preventDefault()
    }
    if (stopPropagation) {
      event.stopPropagation()
    }
    onEscape(event)
  }
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
  },

  /**
   * Focus the last focusable element within a container
   * @param {HTMLElement} container - The container element
   */
  focusLast: container => {
    const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus()
    }
  },

  /**
   * Trap focus within a container (useful for modals)
   * @param {HTMLElement} container - The container element
   * @param {KeyboardEvent} event - The keyboard event
   */
  trapFocus: (container, event) => {
    if (event.key !== "Tab") return

    const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')

    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    } else {
      // Tab
      if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  },
}

/**
 * ARIA utilities for better accessibility
 */
export const ariaUtils = {
  /**
   * Announce text to screen readers
   * @param {string} message - The message to announce
   * @param {string} priority - The priority level ('polite' or 'assertive')
   */
  announce: (message, priority = "polite") => {
    const announcer = document.createElement("div")
    announcer.setAttribute("aria-live", priority)
    announcer.setAttribute("aria-atomic", "true")
    announcer.className = "sr-only"
    announcer.textContent = message

    document.body.appendChild(announcer)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  },

  /**
   * Set expanded state for collapsible elements
   * @param {HTMLElement} trigger - The trigger element
   * @param {HTMLElement} content - The content element
   * @param {boolean} expanded - Whether the content is expanded
   */
  setExpanded: (trigger, content, expanded) => {
    trigger.setAttribute("aria-expanded", expanded.toString())
    content.setAttribute("aria-hidden", (!expanded).toString())
  },
}

/**
 * React hook for keyboard navigation
 * @param {Object} options - Configuration options
 * @returns {Object} Keyboard navigation handlers
 */
export const useKeyboardNavigation = (options = {}) => {
  const { onEnter, onSpace, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, preventDefault = true } = options

  const handleKeyDown = event => {
    let handled = false

    switch (event.key) {
      case "Enter":
        if (onEnter) {
          onEnter(event)
          handled = true
        }
        break
      case " ":
        if (onSpace) {
          onSpace(event)
          handled = true
        }
        break
      case "Escape":
        if (onEscape) {
          onEscape(event)
          handled = true
        }
        break
      case "ArrowUp":
        if (onArrowUp) {
          onArrowUp(event)
          handled = true
        }
        break
      case "ArrowDown":
        if (onArrowDown) {
          onArrowDown(event)
          handled = true
        }
        break
      case "ArrowLeft":
        if (onArrowLeft) {
          onArrowLeft(event)
          handled = true
        }
        break
      case "ArrowRight":
        if (onArrowRight) {
          onArrowRight(event)
          handled = true
        }
        break
      default:
        // No action needed for other keys
        break
    }

    if (handled && preventDefault) {
      event.preventDefault()
    }
  }

  return {
    onKeyDown: handleKeyDown,
    tabIndex: 0,
  }
}
