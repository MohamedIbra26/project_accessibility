# Profile Settings — Accessible Frontend Exercise

A production-style **Profile Settings** application built with native HTML, CSS, and vanilla JavaScript (ES6 modules). It demonstrates accessibility fundamentals, modular frontend architecture, and real-world UI patterns.

## Features

- Semantic, accessible HTML rendered from JavaScript data
- Form validation with `aria-invalid` and `aria-describedby`
- Keyboard-accessible modal dialog with focus trapping
- Password show/hide toggle with `aria-pressed`
- Success announcements via live regions
- Lighthouse accessibility target: 90+

## Project structure

```
├── index.html              # App shell
├── privacy.html            # Privacy Policy page
├── terms.html              # Terms of Service page
├── styles/                 # CSS (main, layout, components, utilities)
├── js/                     # ES6 modules (app, data, components, services, utils)
├── netlify.toml            # Netlify deploy config
└── ACCESSIBILITY_NOTES.md  # Accessibility & architecture documentation
```

## Run locally

ES modules require a local HTTP server:

```bash
npx --yes serve .
```

Then open `http://localhost:3000`.

## Deploy to Netlify

### Option A — Connect GitHub (recommended)

1. Push this repo to GitHub (see below).
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **Add new site** → **Import an existing project**.
4. Choose **GitHub** and select this repository.
5. Netlify reads `netlify.toml` automatically:
   - **Build command:** (none / echo only)
   - **Publish directory:** `.` (project root)
6. Click **Deploy site**.

Every push to your default branch will trigger a new deploy.

### Option B — Manual deploy

1. Install Netlify CLI: `npm install -g netlify-cli`
2. From the project root: `netlify deploy --prod --dir=.`

## Push to GitHub

```bash
# Already initialized? Skip git init.
git init
git add .
git commit -m "Initial commit: accessible Profile Settings app"

# Create a new repo on GitHub, then:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub details.

## Documentation

See [ACCESSIBILITY_NOTES.md](./ACCESSIBILITY_NOTES.md) for semantic HTML decisions, ARIA usage, focus management, architecture patterns, and testing guidance.

## License

MIT — use freely for learning and teaching.
