/**
 * Application entry point — orchestrates rendering, behavior, and accessibility.
 */

import {
  siteConfig,
  navigationLinks,
  userMenu,
  footerLinks,
  pageContent,
  formFields,
  notificationPreferences,
  buttonLabels,
  successMessage,
  modalContent,
  helpContent,
  helpSectionContent,
  validationMessages,
} from "./data/profileData.js";

import { createProfileService } from "./services/profileService.js";
import { createValidator, applyFieldError } from "./components/validation.js";
import { createModal } from "./components/modal.js";
import { createNotificationManager } from "./components/notifications.js";
import {
  renderHeader,
  renderFooter,
  renderMainContent,
} from "./components/formRenderer.js";
import { qs, qsa } from "./utils/dom.js";
import { getHashSection, updateNavCurrent, setExpanded, setPressed } from "./utils/accessibility.js";

const appData = {
  siteConfig,
  navigationLinks,
  userMenu,
  footerLinks,
  pageContent,
  formFields,
  notificationPreferences,
  buttonLabels,
  helpContent,
  helpSectionContent,
};

const profileService = createProfileService();
const validator = createValidator(validationMessages);
const modal = createModal(modalContent);

let notifications = null;

function getAllFieldConfigs() {
  return [...formFields.profile, ...formFields.security];
}

function getFieldElements() {
  return getAllFieldConfigs().map((field) => ({
    config: field,
    input: qs(`#${field.id}`),
    errorEl: qs(`#${field.id}-error`),
    extraDescribedBy: field.hasToggle ? ["password-toggle-hint"] : [],
  }));
}

function validateSingleField(fieldConfig, input, errorEl, extraDescribedBy) {
  const message = validator.validateField(fieldConfig.validate, input.value);
  return applyFieldError(input, errorEl, message, extraDescribedBy);
}

function validateFormFields() {
  const fields = getFieldElements();
  let isValid = true;
  let firstInvalid = null;

  fields.forEach(({ config, input, errorEl, extraDescribedBy }) => {
    const valid = validateSingleField(config, input, errorEl, extraDescribedBy);
    if (!valid) {
      isValid = false;
      if (!firstInvalid) firstInvalid = input;
    }
  });

  return { isValid, firstInvalid };
}

function applyDemoValidationState() {
  const emailField = qs("#email");
  const passwordField = qs("#password");
  const emailError = qs("#email-error");
  const passwordError = qs("#password-error");

  if (emailField && emailError) {
    applyFieldError(emailField, emailError, validationMessages.email.invalid);
  }
  if (passwordField && passwordError) {
    applyFieldError(passwordField, passwordError, validationMessages.password.minLength, [
      "password-toggle-hint",
    ]);
  }
}

function populateFormFromState(state) {
  qs("#full-name").value = state.fullName;
  qs("#email").value = state.email;
  qs("#password").value = state.password;
  qs("#email-notifications").checked = state.emailNotifications;
}

function bindPasswordToggle() {
  const toggle = qs("#password-toggle");
  const passwordInput = qs("#password");
  if (!toggle || !passwordInput) return;

  toggle.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    setPressed(toggle, isHidden);
    toggle.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    const textEl = toggle.querySelector(".toggle-text");
    if (textEl) textEl.textContent = isHidden ? "Hide" : "Show";
  });
}

function bindFormEvents() {
  const form = qs("#profile-form");
  if (!form) return;

  getFieldElements().forEach(({ config, input, errorEl, extraDescribedBy }) => {
    input.addEventListener("blur", () => {
      validateSingleField(config, input, errorEl, extraDescribedBy);
    });
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        validateSingleField(config, input, errorEl, extraDescribedBy);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    notifications.hide();

    const { isValid, firstInvalid } = validateFormFields();
    if (!isValid) {
      firstInvalid?.focus();
      return;
    }

    const formData = new FormData(form);
    profileService.updateFromFormData(formData);
    profileService.save();
    notifications.show();
  });

  form.addEventListener("reset", (event) => {
    event.preventDefault();
    notifications.hide();
    const state = profileService.reset();
    populateFormFromState(state);

    getFieldElements().forEach(({ input, errorEl, extraDescribedBy }) => {
      applyFieldError(input, errorEl, "", extraDescribedBy);
    });

    const passwordInput = qs("#password");
    const toggle = qs("#password-toggle");
    if (passwordInput?.type === "text" && toggle) {
      toggle.click();
    }
  });
}

function bindDeleteModal() {
  const deleteBtn = qs("#delete-account-btn");
  if (!deleteBtn) return;

  deleteBtn.addEventListener("click", () => modal.open(deleteBtn));

  modal.onConfirm(() => {
    window.alert("Account deletion is simulated for this exercise. No data was removed.");
  });
}

function bindUserMenu() {
  const trigger = qs("#user-menu-button");
  const dropdown = qs("#user-menu-dropdown");
  if (!trigger || !dropdown) return;

  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    setExpanded(trigger, !expanded);
    dropdown.hidden = expanded;
  });

  document.addEventListener("click", (event) => {
    if (!trigger.contains(event.target) && !dropdown.contains(event.target)) {
      setExpanded(trigger, false);
      dropdown.hidden = true;
    }
  });

  dropdown.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setExpanded(trigger, false);
      dropdown.hidden = true;
      trigger.focus();
    }
  });

  qsa('[data-action="sign-out"]', dropdown).forEach((link) => {
    link.addEventListener("click", () => {
      window.alert("You have been signed out (simulated).");
    });
  });
}

function bindNavigationHighlight() {
  const links = qsa(".main-nav a");

  function syncNav() {
    updateNavCurrent(links, getHashSection());
  }

  window.addEventListener("hashchange", syncNav);
  syncNav();
}

function renderApp() {
  document.title = siteConfig.title;

  const state = profileService.getState();
  const header = renderHeader(appData);
  const main = renderMainContent(appData, state);
  const footer = renderFooter(appData);

  const headerRoot = qs("#site-header");
  const mainRoot = qs("#main-root");
  const footerRoot = qs("#site-footer");
  const modalRoot = qs("#modal-root");

  headerRoot.replaceChildren(header);
  mainRoot.replaceChildren(main);
  footerRoot.replaceChildren(footer);

  modal.render(modalRoot);

  const profileSection = qs(".profile-section");
  notifications = createNotificationManager(profileSection, successMessage);
  notifications.render();

  bindPasswordToggle();
  bindFormEvents();
  bindDeleteModal();
  bindUserMenu();
  bindNavigationHighlight();
  applyDemoValidationState();
}

function init() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderApp);
  } else {
    renderApp();
  }
}

init();
