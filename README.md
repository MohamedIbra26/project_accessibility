# Profile Settings — Accessible Frontend Exercise

A production-style **Profile Settings** application built with **native HTML**, **CSS**, and **vanilla JavaScript (ES6 modules)**. It teaches accessibility fundamentals, scalable frontend architecture, and maintainable UI patterns — without React, Angular, Vue, Tailwind, Bootstrap, jQuery, or external libraries.

**Repository:** [github.com/MohamedIbra26/project_accessibility](https://github.com/MohamedIbra26/project_accessibility)

---

## About the Project

This app simulates a real account settings page where users can update their profile, change their password, manage notification preferences, and delete their account. All UI content is **data-driven** — labels, navigation, form values, and modal copy are defined in JavaScript objects and rendered at runtime.

The goal is to show that accessibility and clean architecture go together: semantic HTML first, targeted ARIA second, and JavaScript that enhances — never replaces — native browser behavior.

### What you will learn

- Semantic HTML landmarks and form structure
- Accessible validation with screen reader support
- Keyboard navigation and focus management
- Accessible modal dialogs and live regions
- Modular ES6 architecture with separation of concerns
- Data-driven UI rendering from mock API-style data

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | Native HTML5 (rendered via JavaScript) |
| Styles | Plain CSS with custom properties, Flexbox, Grid |
| Logic | Vanilla JavaScript — ES6 modules, no build step |
| Dependencies | None |

---

## Features

### Application

- **Profile form** — Full name, email, password, email notification checkbox
- **Section-based layout** — Home, Profile, Security, Notifications, Help
- **Working navigation** — Real links that scroll to page sections (`#profile`, `#security`, etc.)
- **Legal pages** — `privacy.html` and `terms.html` with back navigation
- **User menu** — Expandable dropdown with keyboard support
- **Delete account flow** — Confirmation modal with destructive action pattern

### Accessibility

- Lighthouse accessibility target: **90+**
- Full keyboard usability (Tab, Shift+Tab, Enter, Space, Escape)
- Visible `:focus-visible` outlines on all interactive elements
- Form labels connected with `for` / `id` — no placeholder-only labels
- Validation via `aria-invalid`, `aria-describedby`, and `role="alert"`
- Password toggle as a real `<button>` with `aria-pressed`
- Success message announced with `role="status"` and `aria-live="polite"`
- Modal with `role="dialog"`, `aria-modal="true"`, focus trap, and focus restore
- Skip link to main content
- Checkbox group wrapped in `<fieldset>` / `<legend>`

---

## Project Structure

```
project_accessibility/
│
├── index.html                  # Minimal app shell + skip link
├── privacy.html                # Privacy Policy page
├── terms.html                  # Terms of Service page
├── README.md                   # This file
├── ACCESSIBILITY_NOTES.md      # Detailed a11y & architecture docs
│
├── styles/
│   ├── main.css                # Design tokens, reset, imports
│   ├── layout.css              # Header, grid, footer, responsive layout
│   ├── components.css          # Forms, buttons, modal, nav, alerts
│   └── utilities.css           # Skip link, visually-hidden, helpers
│
└── js/
    ├── app.js                  # Entry point — orchestrates everything
    │
    ├── data/
    │   └── profileData.js      # Mock data: nav, form config, copy, validation messages
    │
    ├── services/
    │   └── profileService.js   # Profile state: get, update, save, reset
    │
    ├── components/
    │   ├── formRenderer.js     # Renders header, footer, form, help from data
    │   ├── validation.js       # Validation rules + error ARIA state
    │   ├── modal.js            # Accessible delete confirmation dialog
    │   └── notifications.js    # Success banner live region
    │
    └── utils/
        ├── dom.js              # DOM creation and query helpers
        ├── focusTrap.js        # Modal focus trapping
        └── accessibility.js    # ARIA helpers, nav current section
```

---

## File Guide

### HTML

| File | Role |
|------|------|
| `index.html` | Empty mount points (`#site-header`, `#main-root`, `#site-footer`, `#modal-root`). Loads `js/app.js` as an ES module. |
| `privacy.html` | Standalone Privacy Policy with semantic layout and footer links. |
| `terms.html` | Standalone Terms of Service with the same accessible patterns. |

### CSS

| File | Role |
|------|------|
| `styles/main.css` | CSS variables (colors, spacing, focus rings), reset, and `@import` of other stylesheets. |
| `styles/layout.css` | Page structure — sticky header, content grid, form sections, footer, legal pages. |
| `styles/components.css` | Reusable UI — buttons, form fields, password toggle, modal, nav, success banner. |
| `styles/utilities.css` | `.visually-hidden`, skip link, `.section-anchor` scroll offset. |

### JavaScript — Data Layer

| File | Role |
|------|------|
| `js/data/profileData.js` | Single source of truth for site config, navigation links, form field definitions, profile mock data, modal copy, validation messages, and help content. |

### JavaScript — Services

| File | Role |
|------|------|
| `js/services/profileService.js` | Factory (`createProfileService`) managing profile state — read, update, save snapshot, reset to last saved values. |

### JavaScript — Components

| File | Role |
|------|------|
| `js/components/formRenderer.js` | Builds semantic DOM from data — header, nav, form sections, help sidebar, footer. |
| `js/components/validation.js` | `createValidator()` for field rules; `applyFieldError()` sets `aria-invalid` and error text. |
| `js/components/modal.js` | `createModal()` — open/close, Escape key, overlay click, focus trap, focus restore. |
| `js/components/notifications.js` | `createNotificationManager()` — success banner with live region announcement. |

### JavaScript — Utilities

| File | Role |
|------|------|
| `js/utils/dom.js` | `createElement()`, `qs()`, `qsa()` — reusable DOM helpers. |
| `js/utils/focusTrap.js` | `createFocusTrap()` — keeps Tab focus inside the modal. |
| `js/utils/accessibility.js` | `setExpanded()`, `setPressed()`, `updateNavCurrent()` for ARIA and hash nav. |

### JavaScript — App Entry

| File | Role |
|------|------|
| `js/app.js` | Initializes services, renders UI, binds form validation, password toggle, modal, user menu, and navigation highlight. |

---

## How the Code Works

### 1. Boot sequence (`app.js`)

```
index.html loads → app.js runs → render header, main, footer, modal
                              → bind events (form, modal, menu, nav)
                              → apply initial validation demo state
```

### 2. Data-driven rendering

Content is **not** hardcoded in HTML. `formRenderer.js` reads objects from `profileData.js` and creates real semantic elements:

```js
// profileData.js defines fields
{ id: "email", name: "email", label: "Email Address", validate: "email" }

// formRenderer.js renders them as:
<label for="email">Email Address *</label>
<input type="email" id="email" name="email" aria-required="true">
<p id="email-error" class="field-error" role="alert" hidden></p>
```

### 3. Validation flow

1. User blurs a field or submits the form
2. `validation.js` runs the matching rule (`fullName`, `email`, `password`)
3. `applyFieldError()` sets `aria-invalid`, error text, and `aria-describedby`
4. On failed submit, focus moves to the first invalid field

### 4. Save flow

1. All fields pass validation
2. `profileService.save()` stores the current form snapshot
3. Success banner appears with `role="status"` — screen readers announce the update
4. Focus moves to the dismiss button

### 5. Modal flow

1. User clicks **Delete Account**
2. Modal opens, focus moves inside, Tab is trapped
3. Escape or Cancel closes modal and restores focus to the trigger button

### Design patterns used

| Pattern | Where |
|---------|-------|
| **ES6 Modules** | `import` / `export` across all JS files |
| **Factory Functions** | `createProfileService()`, `createModal()`, `createValidator()` |
| **Single Responsibility** | One concern per file (validation ≠ modal ≠ rendering) |
| **Separation of Concerns** | Data → Service → Renderer → Behavior |
| **Progressive enhancement** | Semantic HTML output even though UI is JS-rendered |

---

## Accessibility Overview

This project follows the principle: **accessibility starts with semantic HTML, ARIA fills the gaps.**

### Semantic structure

- `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>` landmarks
- Real `<form>`, `<label>`, `<button>`, `<fieldset>`, `<legend>` elements
- No clickable `<div>` or `<span>` pretending to be buttons

### Form accessibility

| Requirement | Implementation |
|-------------|----------------|
| Visible labels | Every input has a `<label for="...">` |
| Required fields | Asterisk + visually hidden “(required)” + `aria-required` |
| Error feedback | Text + icon + border — not color alone |
| Screen reader errors | `aria-invalid`, `aria-describedby`, `role="alert"` |

### Keyboard & focus

- Logical Tab order across header → form → sidebar → footer
- `:focus-visible` outlines on all interactive elements
- Modal focus trap with Escape to close
- User menu closes on Escape and returns focus

### ARIA (used only where needed)

| Attribute | Purpose |
|-----------|---------|
| `aria-current` | Active navigation link |
| `aria-expanded` | User menu open/closed |
| `aria-pressed` | Password show/hide toggle |
| `aria-invalid` | Field validation state |
| `aria-describedby` | Links inputs to errors and hints |
| `aria-live="polite"` | Success message announcement |
| `aria-modal="true"` | Delete confirmation dialog |

For the full accessibility write-up — including Lighthouse testing, screen reader tips, and anti-patterns to avoid — see **[ACCESSIBILITY_NOTES.md](./ACCESSIBILITY_NOTES.md)**.

---

## Run Locally

ES modules require a local HTTP server (browsers block `file://` module loading):

```bash
npx --yes serve .
```

Open `http://localhost:3000`.

**Alternative (Python):**

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: accessible Profile Settings app"
git branch -M main
git remote add origin https://github.com/MohamedIbra26/project_accessibility.git
git push -u origin main
```

---

## Manual Test Checklist

- [ ] Tab through the entire page without a mouse
- [ ] Submit with invalid email/password — errors appear, focus on first error
- [ ] Fix fields and save — success message is announced
- [ ] Toggle password visibility — `aria-pressed` updates
- [ ] Open delete modal — Tab stays inside, Escape closes and restores focus
- [ ] Click each nav link — correct section scrolls into view
- [ ] Open Privacy Policy and Terms pages
- [ ] Run Lighthouse accessibility audit (target 90+)

---

## License

MIT — use freely for learning and teaching.
