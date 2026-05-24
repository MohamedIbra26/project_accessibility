/**
 * Notifications component — success/status announcements for screen readers.
 */

import { createElement } from "../utils/dom.js";

export function createNotificationManager(container, config) {
  let bannerEl = null;
  let dismissBtn = null;

  function render() {
    bannerEl = createElement("div", {
      className: "success-banner",
      id: "success-message",
      attrs: {
        role: "status",
        "aria-live": "polite",
        hidden: "",
      },
      children: [
        createElement("span", {
          className: "success-icon",
          attrs: { "aria-hidden": "true" },
          html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        }),
        createElement("div", {
          className: "success-content",
          children: [
            createElement("p", { className: "success-title", text: config.title }),
            createElement("p", { className: "success-text", text: config.text }),
          ],
        }),
      ],
    });

    dismissBtn = createElement("button", {
      className: "success-dismiss",
      id: "dismiss-success",
      attrs: { type: "button", "aria-label": config.dismissLabel },
      html: `<span aria-hidden="true">&times;</span>`,
    });

    bannerEl.appendChild(dismissBtn);
    container.appendChild(bannerEl);

    dismissBtn.addEventListener("click", hide);
  }

  function show() {
    if (!bannerEl) render();
    bannerEl.hidden = false;
    dismissBtn.focus();
  }

  function hide() {
    if (bannerEl) bannerEl.hidden = true;
  }

  return { show, hide, render };
}
