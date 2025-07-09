/**
 * Keyboard Navigation Utility
 * Provides reusable functions for accessible keyboard navigation
 */

import React from "react"

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

/**
 * Keyboard navigation detection and contextual help
 */
export const useKeyboardNavigationDetection = () => {
  const [isKeyboardUser, setIsKeyboardUser] = React.useState(false);
  const [showContextualHelp, setShowContextualHelp] = React.useState(false);

  React.useEffect(() => {
    let keyboardDetected = false;
    let mouseDetected = false;

    const handleKeyDown = (e) => {
      // Detect meaningful keyboard navigation
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        keyboardDetected = true;
        if (!mouseDetected) {
          setIsKeyboardUser(true);
        }
      }
    };

    const handleMouseDown = () => {
      mouseDetected = true;
      setIsKeyboardUser(false);
      setShowContextualHelp(false);
    };

    const handleFocus = (e) => {
      // If keyboard user focuses on certain elements, show contextual help
      if (keyboardDetected && !mouseDetected) {
        const element = e.target;
        const isInteractive = element.matches('button, a, [tabindex], input, select, textarea');
        
        if (isInteractive) {
          setShowContextualHelp(true);
          // Hide help after a delay
          setTimeout(() => setShowContextualHelp(false), 3000);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focusin', handleFocus);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focusin', handleFocus);
    };
  }, []);

  return { isKeyboardUser, showContextualHelp };
};

/**
 * Smart skip link component that only shows for keyboard users
 */
export const SmartSkipLink = ({ href, children, ...props }) => {
  const { isKeyboardUser } = useKeyboardNavigationDetection();

  if (!isKeyboardUser) {
    return null;
  }

  return (
    <a
      href={href}
      className="smart-skip-link"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '0',
        background: 'var(--color-background, #fff)',
        color: 'var(--color-text, #333)',
        padding: '8px 12px',
        textDecoration: 'none',
        border: '2px solid var(--color-primary, #007acc)',
        borderRadius: '4px',
        zIndex: 1000,
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'top 0.3s ease',
        ...props.style
      }}
      onFocus={(e) => {
        e.target.style.top = '0px';
      }}
      onBlur={(e) => {
        e.target.style.top = '-40px';
      }}
      {...props}
    >
      {children}
    </a>
  );
};

/**
 * Contextual navigation help component
 */
export const ContextualNavigationHelp = ({ children }) => {
  const { isKeyboardUser, showContextualHelp } = useKeyboardNavigationDetection();

  if (!isKeyboardUser || !showContextualHelp) {
    return null;
  }

  return (
    <div
      className="contextual-nav-help"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'var(--color-background, #fff)',
        color: 'var(--color-text, #333)',
        padding: '12px 16px',
        border: '2px solid var(--color-primary, #007acc)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        fontSize: '0.85rem',
        maxWidth: '250px',
        animation: 'slideIn 0.3s ease-out'
      }}
      role="status"
      aria-live="polite"
    >
      {children}
    </div>
  );
};

// Add CSS for the animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);
}
