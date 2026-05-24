# Accessibility Notes — Profile Settings Application

This document explains the accessibility decisions, architecture patterns, and testing approach for the Profile Settings application.

---

## Overview

This is a **native HTML / CSS / vanilla JavaScript** application that demonstrates real-world accessibility patterns inside a modular frontend architecture. The UI is **data-driven** — content is defined in `js/data/profileData.js` and rendered at runtime by `js/components/formRenderer.js`.

**Important:** ES modules require a local HTTP server. The page shell in `index.html` is minimal; JavaScript must run for the interface to appear. Once rendered, all interactive elements use semantic HTML — not custom `<div onclick>` controls.

---

## 1. Semantic HTML Decisions

The application renders native HTML landmarks and elements:

| Element | Purpose |
|---------|---------|
| `<header>` | Site branding and top navigation |
| `<nav>` | Main and footer navigation (`aria-label` where needed) |
| `<main>` | Primary page content (`id="main-content"`, skip link target) |
| `<section>` | Home, Profile, Security, Notifications, and Help regions |
| `<form>` | Profile data entry with native submit and reset |
| `<fieldset>` / `<legend>` | Notification preferences group |
| `<label>` | Visible, programmatically linked labels |
| `<button>` | All actions (submit, reset, delete, modal, password toggle, menu) |
| `<aside>` | Supplementary help sidebar |
| `<footer>` | Copyright and legal links |
| `<article>` | Individual help topics |

### Page sections and navigation targets

Each nav link scrolls to a real in-page section:

| Section ID | Content |
|------------|---------|
| `#home` | Welcome overview |
| `#profile` | Full name and email fields |
| `#security` | Password field with show/hide toggle |
| `#notifications` | Email notification checkbox |
| `#help` | Full Help Center with FAQ topics |

**Why native elements matter:** Screen readers expose roles, states, and keyboard behavior automatically. Landmarks let users jump between regions without custom ARIA on `<div>` wrappers.

---

## 2. Why Labels Matter

Every input is rendered with a visible `<label>` connected via `for` / `id` in `formRenderer.js`:

```html
<label for="email">
  Email Address
  <span class="required" aria-hidden="true">*</span>
  <span class="visually-hidden"> (required)</span>
</label>
<input type="email" id="email" name="email" aria-required="true">
```

Design choices:

- **Visible labels** — never replaced by placeholders
- **Required indicator** — asterisk is `aria-hidden`; screen readers get “(required)” via visually hidden text
- **`aria-required="true"`** — reinforces the HTML `required` attribute
- **Checkbox hint** — helper text is inside the `<label>` so it is read with the control

---

## 3. Validation Accessibility

Validation rules live in `js/data/profileData.js` (`validationMessages`) and are enforced by `js/components/validation.js`.

| Field | Rules |
|-------|-------|
| Full Name | Required, non-empty after trim |
| Email | Required, must match `user@domain.tld` pattern |
| Password | Required, minimum 8 characters |

### Techniques used

| Technique | Purpose |
|-----------|---------|
| `aria-invalid="true"` | Announces invalid state to assistive technology |
| `aria-describedby` | Links inputs to error message element IDs |
| `role="alert"` on error `<p>` | Prioritizes error announcement |
| Red border + background + icon + text | Multiple cues — not color alone |
| `novalidate` on `<form>` | Custom accessible messages replace browser defaults |

### Validation timing

- **On blur** — field validated when user leaves it
- **On input** — re-validates while field is already invalid
- **On submit** — all fields validated; focus moves to first invalid field
- **Demo state** — email and password start invalid (matching mockup) via `applyDemoValidationState()` in `app.js`

---

## 4. Password Show/Hide Toggle

Implemented as a real `<button type="button">` in `formRenderer.js`, behavior bound in `app.js`:

| Requirement | Implementation |
|-------------|----------------|
| Native button | `<button type="button">` — not a clickable `<div>` |
| Toggle state | `aria-pressed="true"` / `"false"` |
| Accessible name | `aria-label` switches between “Show password” and “Hide password” |
| Association | `aria-controls="password"` links button to input |
| Extra context | Visually hidden hint referenced via `aria-describedby` |

Keyboard users activate the toggle with **Enter** or **Space** like any button.

---

## 5. Checkbox Group (Notification Preferences)

The notifications section uses proper grouping semantics:

```html
<fieldset class="notification-fieldset">
  <legend>Email Notifications</legend>
  <input type="checkbox" id="email-notifications" name="emailNotifications">
  <label for="email-notifications">
    Receive email notifications
    <span class="checkbox-hint">We'll send you important updates via email.</span>
  </label>
</fieldset>
```

`<fieldset>` and `<legend>` tell screen readers these controls belong together.

---

## 6. Keyboard Accessibility

The entire application works without a mouse:

| Action | Key |
|--------|-----|
| Move focus forward | `Tab` |
| Move focus backward | `Shift + Tab` |
| Activate buttons / links | `Enter` or `Space` |
| Submit form | `Enter` while focused in a field |
| Close modal or user menu | `Escape` |

Navigation links use real `href` values (`index.html#profile`, etc.) so they work with keyboard activation, browser history, and scroll-into-view.

Focus order follows visual order: skip link → header → main form sections → sidebar → help section → footer.

---

## 7. Focus Management

### Visible focus

Interactive elements use `:focus-visible` with a 3px outline defined in CSS variables (`--focus-ring`). Outlines are **never** globally removed with `outline: none` without a replacement.

Invalid fields use a distinct danger focus ring (`--focus-ring-danger`).

### Modal (`js/components/modal.js`)

When Delete Account is clicked:

1. Trigger button focus is stored
2. Overlay opens; `body.modal-open` prevents background scroll
3. Focus moves to the dialog container (`tabindex="-1"`)
4. Tab cycles only inside the modal (`js/utils/focusTrap.js`)
5. **Escape** or Cancel/Close closes the modal
6. Focus returns to the Delete Account button

### Success message (`js/components/notifications.js`)

After a successful save, focus moves to the dismiss button so keyboard users can close the banner immediately.

### User menu

The header user menu uses `aria-expanded` and closes on **Escape**, returning focus to the trigger button.

---

## 8. Modal Accessibility

The delete confirmation follows the [WAI-ARIA Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/):

```html
<div role="dialog" aria-modal="true"
     aria-labelledby="modal-title"
     aria-describedby="modal-description">
```

| Requirement | Implementation |
|-------------|----------------|
| Dialog role | `role="dialog"` |
| Modal state | `aria-modal="true"` |
| Accessible name | `aria-labelledby` → `#modal-title` |
| Description | `aria-describedby` → `#modal-description` |
| Focus trap | Tab / Shift+Tab cycle within dialog |
| Dismiss | Escape, Cancel, Close button, overlay click |
| Actions | Real `<button>` elements — not styled `<div>` elements |

Modal copy is sourced from `modalContent` in `profileData.js`.

---

## 9. ARIA Usage

ARIA supplements semantics — it does not replace them.

### Used appropriately

| Attribute | Where | Why |
|-----------|-------|-----|
| `aria-current="true"` | Active nav link | Indicates current page section |
| `aria-expanded` | User menu button | Dropdown open/closed state |
| `aria-haspopup` | User menu button | Indicates a popup menu exists |
| `aria-controls` | Menu button, password toggle | Links control to target element |
| `aria-pressed` | Password show/hide | Toggle button state |
| `aria-invalid` | Invalid inputs | Validation state |
| `aria-describedby` | Inputs with errors or hints | Connects extra descriptions |
| `aria-required` | Required fields | Reinforces HTML `required` |
| `aria-live="polite"` + `role="status"` | Success banner | Non-intrusive save confirmation |
| `aria-label` | Icon-only buttons (close, dismiss) | Accessible name when no visible text |
| `aria-hidden="true"` | Decorative SVG icons | Removed from accessibility tree |

### Avoided

- `role="button"` on `<div>` elements — use `<button>` instead
- Redundant `role="form"` on `<form>`
- `aria-label` duplicating visible link or button text
- Placeholder-only labeling

---

## 10. Live Regions

### Success banner

```html
<div role="status" aria-live="polite" id="success-message">
  <p class="success-title">Profile updated successfully!</p>
  <p class="success-text">Your changes have been saved.</p>
</div>
```

- **`role="status"`** — implicit live region for status messages
- **`aria-live="polite"`** — waits for a pause before announcing

### Error messages

Error paragraphs use `role="alert"` for more urgent feedback when validation fails. They are toggled with the `hidden` attribute so they are removed from the accessibility tree when not shown.

---

## 11. Visual Accessibility

CSS is organized in `styles/` with design tokens in `main.css`:

| Concern | Approach |
|---------|----------|
| Color contrast | Text and controls meet WCAG AA targets |
| Focus visibility | `:focus-visible` outlines on all interactive elements |
| Error states | Border + background + icon + text (not color alone) |
| Spacing | Consistent `--space-*` variables for readable layout |
| Typography | System font stack, clear heading hierarchy |
| Motion | `prefers-reduced-motion` disables transitions and smooth scroll |
| Responsive | Grid collapses on smaller screens; buttons stack on mobile |

### CSS file responsibilities

| File | Purpose |
|------|---------|
| `styles/main.css` | Design tokens, reset, imports |
| `styles/layout.css` | Header, main grid, footer, legal pages |
| `styles/components.css` | Forms, buttons, modal, nav, alerts |
| `styles/utilities.css` | Skip link, visually-hidden, helpers |

---

## 12. Screen Reader Considerations

- **Skip link** — “Skip to main content” appears on keyboard focus
- **Page title** — set from `siteConfig.title` at runtime
- **`lang="en"`** — correct language on `<html>`
- **Heading hierarchy** — one `<h1>`, section `<h2>`s, help topic `<h3>`s
- **Destructive actions** — clear labels: “Delete Account”, “Yes, Delete My Account”
- **Legal pages** — `privacy.html` and `terms.html` use the same accessible patterns

**Recommended testing tools:** NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android).

---

## 13. Lighthouse Accessibility Testing

1. Serve the project locally:

   ```bash
   npx --yes serve .
   ```

2. Open the URL shown (e.g. `http://localhost:3000`) in Chrome
3. DevTools → **Lighthouse** → select **Accessibility** only → Run audit
4. Target score: **90+**

### Manual checks Lighthouse cannot replace

- [ ] Tab through the entire page in logical order
- [ ] Submit with invalid data — hear/see errors, focus on first error
- [ ] Fix all fields and save — hear success status announcement
- [ ] Toggle password visibility — verify `aria-pressed` updates
- [ ] Open delete modal — trap focus, press Escape, verify focus returns
- [ ] Open user menu — press Escape, verify focus returns to trigger
- [ ] Click each nav link — verify section scrolls into view
- [ ] Open Privacy Policy and Terms pages — verify back links work

---

## Architecture Decisions

### Full project structure

```
project_accessibility/
├── index.html                  # Minimal shell + skip link
├── privacy.html                # Privacy Policy page
├── terms.html                  # Terms of Service page
├── ACCESSIBILITY_NOTES.md      # This file
├── styles/
│   ├── main.css                # Tokens, reset, imports
│   ├── layout.css              # Page structure
│   ├── components.css          # UI components
│   └── utilities.css           # Helpers
└── js/
    ├── app.js                  # Orchestrator
    ├── data/
    │   └── profileData.js      # All mock content & config
    ├── services/
    │   └── profileService.js   # Profile state (save/reset)
    ├── components/
    │   ├── formRenderer.js     # Dynamic DOM rendering
    │   ├── modal.js            # Delete confirmation dialog
    │   ├── validation.js       # Validation rules & error UI
    │   └── notifications.js    # Success live region
    └── utils/
        ├── dom.js              # DOM creation helpers
        ├── focusTrap.js        # Modal focus trapping
        └── accessibility.js    # ARIA & nav helpers
```

### Separation of concerns

| Layer | Responsibility | Files |
|-------|----------------|-------|
| **Data** | Content, labels, validation messages, nav config | `profileData.js` |
| **State** | Profile values, save/reset snapshots | `profileService.js` |
| **Rendering** | Build semantic DOM from data | `formRenderer.js` |
| **Behavior** | Validation, modal, notifications, events | `validation.js`, `modal.js`, `notifications.js`, `app.js` |
| **Utilities** | DOM helpers, focus trap, ARIA helpers | `dom.js`, `focusTrap.js`, `accessibility.js` |
| **Orchestration** | Wire rendering + behavior on init | `app.js` |

### Design patterns used

| Pattern | Implementation |
|---------|----------------|
| **Module Pattern** | ES6 `import` / `export` per file |
| **Factory Functions** | `createProfileService()`, `createModal()`, `createValidator()`, `createNotificationManager()`, `createFocusTrap()` |
| **Component Organization** | One file per UI concern |
| **Single Responsibility** | Each module has one clear job |
| **Separation of Concerns** | Data ≠ rendering ≠ behavior ≠ utilities |
| **Data-Driven UI** | Form fields, nav, and copy defined as config objects |

### Why modular architecture matters

- **Maintainability** — change validation without touching modal code
- **Testability** — each module can be reviewed independently
- **Scalability** — add a form field by extending `formFields` in data + renderer
- **Team clarity** — file names map directly to features
- **Accessibility consistency** — rendering logic centralizes semantic patterns

### Working navigation

All links have real destinations — no `href="#"` placeholders:

| Link | Target |
|------|--------|
| Home | `index.html#home` |
| Profile | `index.html#profile` |
| Security | `index.html#security` |
| Notifications | `index.html#notifications` |
| Help | `index.html#help` |
| Privacy Policy | `privacy.html` |
| Terms of Service | `terms.html` |
| Account (user menu) | `index.html#profile` |

---

## Accessibility Feature Map

Quick reference linking features to source files:

| Feature | File(s) |
|---------|---------|
| Semantic DOM rendering | `js/components/formRenderer.js` |
| Form validation | `js/components/validation.js` |
| Error ARIA state | `js/components/validation.js` → `applyFieldError()` |
| Password toggle | `formRenderer.js` (markup), `app.js` (behavior) |
| Delete modal | `js/components/modal.js` |
| Focus trap | `js/utils/focusTrap.js` |
| Success announcement | `js/components/notifications.js` |
| Nav current section | `js/utils/accessibility.js` → `updateNavCurrent()` |
| Profile state | `js/services/profileService.js` |
| Focus styles | `styles/components.css`, `styles/main.css` |
| Skip link | `index.html`, `styles/utilities.css` |

---

## Why Native HTML Is Preferred

Custom interactive `<div onclick>` elements:

- Are not in the tab order by default
- Do not respond to Space/Enter without extra JavaScript
- May not be announced as buttons by screen readers
- Lack native `disabled` state, form association, and autofill

Native `<button>`, `<input>`, `<label>`, and `<a href>` provide behavior, keyboard support, and roles for free. JavaScript in this project **enhances** the experience (validation, modal, dynamic rendering) — it does not replace baseline interaction semantics.

---

## Why Accessibility Starts With Semantic HTML

1. **Correctness** — Assistive technology understands `<button>` before `role="button"`
2. **Less ARIA to maintain** — fewer chances for incorrect or conflicting attributes
3. **Keyboard support for free** — native elements handle Tab, Enter, and Space
4. **Future-proof** — standards-based elements are supported by new AT first
5. **Lower cost** — fixing semantics early is cheaper than retrofitting

> **ARIA’s first rule:** If you can use a native HTML element with the semantics and behavior you need, use that instead of ARIA.

Even with JavaScript-rendered UI, the renderer's job is to output the **same semantic HTML** you would write by hand — not `<div>` shortcuts.

---

## Running the Application

ES modules require a local HTTP server (browser CORS restriction on `file://`):

```bash
# From the project root
npx --yes serve .
```

Then open the URL shown (typically `http://localhost:3000`).

**Alternatives:**

```bash
# Python
python -m http.server 8080

# VS Code
# Use the "Live Server" extension
```

Open the app through the server URL — not directly as a `file://` path.

---

## File Reference

| File | Role |
|------|------|
| `index.html` | Page shell, skip link, mount points for JS rendering |
| `privacy.html` / `terms.html` | Standalone legal pages with back navigation |
| `styles/main.css` | Entry point for all styles |
| `js/app.js` | Application entry — renders UI and binds all events |
| `js/data/profileData.js` | Single source of truth for content and config |
| `js/services/profileService.js` | Profile data state management |
| `js/components/formRenderer.js` | Builds accessible DOM from data |
| `js/components/modal.js` | Accessible delete confirmation dialog |
| `js/components/validation.js` | Validation logic and error display |
| `js/components/notifications.js` | Success status live region |
| `js/utils/focusTrap.js` | Reusable modal focus trapping |
| `js/utils/accessibility.js` | ARIA and navigation helpers |
| `js/utils/dom.js` | DOM element factory utilities |
| `ACCESSIBILITY_NOTES.md` | This documentation |
