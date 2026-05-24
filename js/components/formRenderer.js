/**
 * Form renderer — renders form fields, sections, header, footer from data.
 */

import { createElement } from "../utils/dom.js";

const SHIELD_ICON = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L4 6v6c0 5.25 3.4 10.15 8 11.35C16.6 22.15 20 17.25 20 12V6l-8-4z" fill="currentColor"/></svg>`;
const USER_ICON = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor"/></svg>`;
const CHEVRON_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const SAVE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2"/></svg>`;
const TRASH_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const EYE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>`;
const INFO_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
const EXTERNAL_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

function renderRequiredLabel(labelText, fieldId) {
  const label = createElement("label", {
    html: `${labelText} <span class="required" aria-hidden="true">*</span><span class="visually-hidden"> (required)</span>`,
  });
  label.setAttribute("for", fieldId);
  return label;
}

function renderTextField(field, value) {
  const errorId = `${field.id}-error`;
  const group = createElement("div", { className: "form-group" });

  group.appendChild(renderRequiredLabel(field.label, field.id));

  const input = createElement("input", {
    attrs: {
      type: field.type,
      id: field.id,
      name: field.name,
      value: value ?? "",
      required: field.required ? "" : undefined,
      autocomplete: field.autocomplete,
      "aria-required": field.required ? "true" : undefined,
      minlength: field.minlength,
    },
  });

  if (field.hasToggle) {
    const wrapper = createElement("div", { className: "password-wrapper" });
    wrapper.appendChild(input);
    wrapper.appendChild(
      createElement("button", {
        className: "password-toggle",
        id: "password-toggle",
        attrs: {
          type: "button",
          "aria-pressed": "false",
          "aria-controls": field.id,
          "aria-label": "Show password",
        },
        html: `<span class="toggle-icon" aria-hidden="true">${EYE_ICON}</span><span class="toggle-text">Show</span>`,
      })
    );
    group.appendChild(wrapper);
    group.appendChild(
      createElement("p", {
        id: "password-toggle-hint",
        className: "visually-hidden",
        text: "Password visibility can be toggled with the Show button.",
      })
    );
  } else {
    group.appendChild(input);
  }

  group.appendChild(
    createElement("p", {
      id: errorId,
      className: "field-error",
      attrs: { role: "alert", hidden: "" },
    })
  );

  return group;
}

export function renderHeader(data) {
  const { siteConfig, navigationLinks, userMenu } = data;

  const navItems = navigationLinks.map((link) =>
    createElement("li", {
      children: [
        createElement("a", {
          text: link.label,
          attrs: { href: link.href, "data-nav-id": link.id },
        }),
      ],
    })
  );

  const menuItems = userMenu.items.map((item) =>
    createElement("li", {
      children: [
        createElement("a", {
          text: item.label,
          attrs: {
            href: item.href,
            ...(item.action ? { "data-action": item.action } : {}),
          },
        }),
      ],
    })
  );

  return createElement("header", {
    className: "site-header",
    children: [
      createElement("div", {
        className: "header-inner",
        children: [
          createElement("a", {
            className: "logo",
            attrs: { href: siteConfig.logoHref, "aria-label": `${siteConfig.name} home` },
            children: [
              createElement("span", { className: "logo-icon", html: SHIELD_ICON }),
              createElement("span", { className: "logo-text", text: siteConfig.name }),
            ],
          }),
          createElement("nav", {
            className: "main-nav",
            attrs: { "aria-label": "Main navigation" },
            children: [createElement("ul", { className: "nav-list", children: navItems })],
          }),
          createElement("div", {
            className: "user-menu",
            children: [
              createElement("button", {
                className: "user-menu-trigger",
                id: "user-menu-button",
                attrs: {
                  type: "button",
                  "aria-expanded": "false",
                  "aria-haspopup": "true",
                  "aria-controls": "user-menu-dropdown",
                },
                html: `<span class="user-avatar" aria-hidden="true">${USER_ICON}</span><span class="user-name">${userMenu.name}</span><span class="chevron" aria-hidden="true">${CHEVRON_ICON}</span>`,
              }),
              createElement("ul", {
                className: "user-menu-dropdown",
                id: "user-menu-dropdown",
                attrs: { hidden: "" },
                children: menuItems,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

export function renderFooter(data) {
  const { siteConfig, footerLinks } = data;
  const linkNodes = [];

  footerLinks.forEach((link, index) => {
    linkNodes.push(
      createElement("li", {
        children: [createElement("a", { text: link.label, attrs: { href: link.href } })],
      })
    );
    if (index < footerLinks.length - 1) {
      linkNodes.push(
        createElement("li", {
          children: [
            createElement("span", { className: "footer-separator", attrs: { "aria-hidden": "true" }, text: "|" }),
          ],
        })
      );
    }
  });

  return createElement("footer", {
    className: "site-footer",
    children: [
      createElement("div", {
        className: "footer-inner",
        children: [
          createElement("p", { text: siteConfig.copyright }),
          createElement("nav", {
            attrs: { "aria-label": "Footer" },
            children: [createElement("ul", { className: "footer-links", children: linkNodes })],
          }),
        ],
      }),
    ],
  });
}

export function renderHelpSidebar(helpContent) {
  return createElement("aside", {
    className: "help-sidebar",
    attrs: { "aria-labelledby": "help-heading" },
    children: [
      createElement("div", {
        className: "help-box",
        children: [
          createElement("span", { className: "help-icon", html: INFO_ICON }),
          createElement("h2", { id: "help-heading", text: helpContent.title }),
          createElement("p", { text: helpContent.description }),
          createElement("a", {
            className: "help-link",
            attrs: { href: helpContent.linkHref },
            html: `${helpContent.linkLabel} <span class="external-icon" aria-hidden="true">${EXTERNAL_ICON}</span>`,
          }),
        ],
      }),
    ],
  });
}

export function renderHelpSection(helpSectionContent) {
  const topics = helpSectionContent.topics.map((topic) =>
    createElement("article", {
      className: "help-topic",
      children: [
        createElement("h3", { text: topic.question }),
        createElement("p", { text: topic.answer }),
      ],
    })
  );

  const contact = createElement("p", {});
  contact.appendChild(document.createTextNode("Contact us at "));
  contact.appendChild(
    createElement("a", {
      text: helpSectionContent.contactEmail,
      attrs: { href: `mailto:${helpSectionContent.contactEmail}` },
    })
  );

  return createElement("section", {
    id: "help",
    className: "help-section section-anchor",
    attrs: { "aria-labelledby": "help-section-heading" },
    children: [
      createElement("h2", { id: "help-section-heading", text: helpSectionContent.title }),
      ...topics,
      contact,
    ],
  });
}

export function renderProfileForm(data, profileState) {
  const { pageContent, formFields, notificationPreferences, buttonLabels } = data;

  const form = createElement("form", {
    id: "profile-form",
    className: "profile-form",
    attrs: { novalidate: "" },
  });

  form.appendChild(
    createElement("section", {
      id: "home",
      className: "home-section section-anchor",
      attrs: { "aria-labelledby": "home-heading" },
      children: [
        createElement("h2", { id: "home-heading", text: pageContent.home.title }),
        createElement("p", { text: pageContent.home.description }),
      ],
    })
  );

  form.appendChild(
    createElement("section", {
      id: "profile",
      className: "form-section section-anchor",
      attrs: { "aria-labelledby": "profile-section-heading" },
      children: [
        createElement("h2", { id: "profile-section-heading", text: pageContent.sections.profile.title }),
        createElement("p", { className: "form-section-desc", text: pageContent.sections.profile.description }),
        ...formFields.profile.map((field) => renderTextField(field, profileState[field.name])),
      ],
    })
  );

  form.appendChild(
    createElement("section", {
      id: "security",
      className: "form-section section-anchor",
      attrs: { "aria-labelledby": "security-section-heading" },
      children: [
        createElement("h2", { id: "security-section-heading", text: pageContent.sections.security.title }),
        createElement("p", { className: "form-section-desc", text: pageContent.sections.security.description }),
        ...formFields.security.map((field) => renderTextField(field, profileState[field.name])),
      ],
    })
  );

  form.appendChild(
    createElement("section", {
      id: "notifications",
      className: "form-section section-anchor",
      attrs: { "aria-labelledby": "notifications-section-heading" },
      children: [
        createElement("h2", { id: "notifications-section-heading", text: pageContent.sections.notifications.title }),
        createElement("p", { className: "form-section-desc", text: pageContent.sections.notifications.description }),
        createElement("fieldset", {
          className: "notification-fieldset",
          children: [
            createElement("legend", { text: notificationPreferences.legend }),
            createElement("div", {
              className: "checkbox-group",
              children: [
                createElement("input", {
                  attrs: {
                    type: "checkbox",
                    id: notificationPreferences.checkbox.id,
                    name: notificationPreferences.checkbox.name,
                    ...(profileState.emailNotifications ? { checked: "" } : {}),
                  },
                }),
                createElement("label", {
                  attrs: { for: notificationPreferences.checkbox.id },
                  html: `${notificationPreferences.checkbox.label}<span class="checkbox-hint">${notificationPreferences.checkbox.hint}</span>`,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  form.appendChild(
    createElement("div", {
      className: "form-actions",
      children: [
        createElement("div", {
          className: "form-actions-primary",
          children: [
            createElement("button", {
              className: "btn btn-primary",
              attrs: { type: "submit" },
              html: `<span class="btn-icon" aria-hidden="true">${SAVE_ICON}</span> ${buttonLabels.save}`,
            }),
            createElement("button", {
              className: "btn btn-secondary",
              attrs: { type: "reset" },
              text: buttonLabels.cancel,
            }),
          ],
        }),
        createElement("button", {
          className: "btn btn-danger-outline",
          id: "delete-account-btn",
          attrs: { type: "button" },
          html: `<span class="btn-icon" aria-hidden="true">${TRASH_ICON}</span> ${buttonLabels.deleteAccount}`,
        }),
      ],
    })
  );

  return form;
}

export function renderMainContent(data, profileState) {
  const profileSection = createElement("section", {
    className: "profile-section",
    attrs: { "aria-labelledby": "profile-heading" },
    children: [
      createElement("header", {
        className: "page-header",
        children: [
          createElement("h1", { id: "profile-heading", text: data.pageContent.heading }),
          createElement("p", { className: "page-subtitle", text: data.pageContent.subtitle }),
        ],
      }),
      renderProfileForm(data, profileState),
    ],
  });

  const grid = createElement("div", {
    className: "content-grid",
    children: [profileSection, renderHelpSidebar(data.helpContent)],
  });

  const main = createElement("main", {
    id: "main-content",
    className: "main-content",
  });

  main.appendChild(grid);
  main.appendChild(renderHelpSection(data.helpSectionContent));
  return main;
}
