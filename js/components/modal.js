/**
 * Modal component — accessible dialog with focus trap and keyboard support.
 */

import { createElement } from "../utils/dom.js";
import { createFocusTrap, restoreFocus, moveFocusTo } from "../utils/focusTrap.js";

export function createModal(config) {
  let overlay = null;
  let dialog = null;
  let lastFocused = null;
  let focusTrap = null;
  let onConfirmCallback = null;

  function render(root) {
    overlay = createElement("div", {
      className: "modal-overlay",
      id: "modal-overlay",
      attrs: { hidden: "" },
    });

    dialog = createElement("div", {
      className: "modal",
      id: config.id,
      attrs: {
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "modal-title",
        "aria-describedby": "modal-description",
        tabindex: "-1",
      },
      children: [
        createElement("header", {
          className: "modal-header",
          children: [
            createElement("h2", { id: "modal-title", text: config.title }),
            createElement("button", {
              className: "modal-close",
              id: "modal-close",
              attrs: { type: "button", "aria-label": config.closeLabel },
              html: `<span aria-hidden="true">&times;</span>`,
            }),
          ],
        }),
        createElement("div", {
          className: "modal-body",
          children: [
            createElement("p", { id: "modal-description", text: config.description }),
          ],
        }),
        createElement("footer", {
          className: "modal-footer",
          children: [
            createElement("button", {
              className: "btn btn-secondary",
              id: "modal-cancel",
              attrs: { type: "button" },
              text: config.cancelLabel,
            }),
            createElement("button", {
              className: "btn btn-danger",
              id: "modal-confirm",
              attrs: { type: "button" },
              text: config.confirmLabel,
            }),
          ],
        }),
      ],
    });

    overlay.appendChild(dialog);
    root.appendChild(overlay);

    focusTrap = createFocusTrap(dialog);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });

    dialog.querySelector("#modal-close").addEventListener("click", close);
    dialog.querySelector("#modal-cancel").addEventListener("click", close);
    dialog.querySelector("#modal-confirm").addEventListener("click", () => {
      if (onConfirmCallback) onConfirmCallback();
      close();
    });

    document.addEventListener("keydown", handleEscape);
  }

  function handleEscape(event) {
    if (event.key === "Escape" && overlay && !overlay.hidden) {
      event.preventDefault();
      close();
    }
  }

  function open(triggerElement) {
    lastFocused = triggerElement || document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("modal-open");
    moveFocusTo(dialog);
    focusTrap.activate();
  }

  function close() {
    overlay.hidden = true;
    document.body.classList.remove("modal-open");
    focusTrap.deactivate();
    restoreFocus(lastFocused);
  }

  function onConfirm(callback) {
    onConfirmCallback = callback;
  }

  function destroy() {
    document.removeEventListener("keydown", handleEscape);
    focusTrap?.deactivate();
  }

  return { render, open, close, onConfirm, destroy };
}
