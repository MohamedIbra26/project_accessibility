/**
 * DOM utility helpers — single responsibility: DOM creation and queries.
 */

export function createElement(tag, options = {}) {
  const el = document.createElement(tag);

  if (options.className) el.className = options.className;
  if (options.id) el.id = options.id;
  if (options.text) el.textContent = options.text;
  if (options.html) el.innerHTML = options.html;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        el.setAttribute(key, String(value));
      }
    });
  }

  if (options.children) {
    options.children.forEach((child) => {
      if (child) el.append(child);
    });
  }

  return el;
}

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function on(element, event, handler) {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

export function svgIcon(pathD, size = 24) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);
  return svg;
}
