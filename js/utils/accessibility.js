/**
 * Accessibility helpers — ARIA state management and live region utilities.
 */

export function setAriaInvalid(input, isInvalid) {
  input.setAttribute("aria-invalid", isInvalid ? "true" : "false");
}

export function setAriaDescribedBy(input, ids) {
  const filtered = ids.filter(Boolean);
  if (filtered.length) {
    input.setAttribute("aria-describedby", filtered.join(" "));
  } else {
    input.removeAttribute("aria-describedby");
  }
}

export function setExpanded(button, expanded) {
  button.setAttribute("aria-expanded", String(expanded));
}

export function setPressed(button, pressed) {
  button.setAttribute("aria-pressed", String(pressed));
}

export function updateNavCurrent(links, activeId) {
  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isActive = href.includes(`#${activeId}`) || (activeId === "home" && href.endsWith("#home"));
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

export function getHashSection() {
  const hash = window.location.hash.replace("#", "");
  return hash || "home";
}
