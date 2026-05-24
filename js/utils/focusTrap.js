/**
 * Focus trap utility — keeps keyboard focus inside a container (e.g. modal).
 */

import { qsa } from "./dom.js";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container) {
  return qsa(FOCUSABLE_SELECTOR, container).filter(
    (el) => el.offsetParent !== null && !el.hidden
  );
}

/**
 * Factory function that returns focus-trap handlers for a container.
 * @param {HTMLElement} container
 * @returns {{ activate: Function, deactivate: Function }}
 */
export function createFocusTrap(container) {
  let isActive = false;

  function handleKeydown(event) {
    if (!isActive || event.key !== "Tab") return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return {
    activate() {
      if (isActive) return;
      isActive = true;
      document.addEventListener("keydown", handleKeydown);
    },
    deactivate() {
      if (!isActive) return;
      isActive = false;
      document.removeEventListener("keydown", handleKeydown);
    },
  };
}

export function restoreFocus(element) {
  if (element && typeof element.focus === "function") {
    element.focus();
  }
}

export function moveFocusTo(element) {
  if (element) {
    element.focus();
  }
}
