# Kabilesh Ravichandran — Portfolio

A responsive portfolio presenting my full-stack engineering experience, selected projects, technical toolkit, and contact information.

## Highlights

- Responsive single-page experience
- Light and dark themes with saved preferences
- Keyboard navigation, visible focus states, and reduced-motion support
- Expandable professional timeline
- Project cards with honest live-site and source-code availability
- EmailJS contact form with direct-email fallback
- SEO and social-sharing metadata

## Built with

React, Sass, React Scroll, React Testing Library, and EmailJS. The site is currently built with Create React App and deployed as a static application.

## Run locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
cp .env.example .env
npm start
```

The development server opens at `http://localhost:3000`.

## Environment variables

The contact form needs an EmailJS service, template, and public key:

```text
REACT_APP_EMAILJS_SERVICE_ID=
REACT_APP_EMAILJS_TEMPLATE_ID=
REACT_APP_EMAILJS_PUBLIC_KEY=
```

Do not commit `.env`. If EmailJS is not configured, the interface directs visitors to email me directly.

Values with the `REACT_APP_` prefix are compiled into browser JavaScript and are public. The EmailJS service ID, template ID, and public key are intended for browser use; never put provider secrets or private API keys in these variables. In the EmailJS dashboard, restrict allowed origins to the portfolio domain, keep its rate limits enabled, and enable CAPTCHA protection.

`npm start` and `npm run build` run a check that rejects secret-looking client environment variable names and common credential formats in shipped source files. Production builds also get a Content Security Policy. `.env*`, Firebase local credentials, and common SSH private-key files are ignored by Git; `.env.example` remains tracked.

Firebase Hosting deployments also receive the policy and standard browser security headers from `firebase.json`. The current GitHub Pages deployment does not read Firebase's response-header settings, but uses the production policy embedded during build.

This is a static site and does not run an SSH server. SSH access is controlled by the GitHub or hosting account, outside this app. Keep deploy private keys out of the repository and secure the account with multifactor authentication. If a secret was ever committed, revoke or rotate it; deleting it from the latest version does not remove it from Git history.

## Quality checks

```bash
npm test -- --watchAll=false
npm run build
```

## Project structure

```text
src/
  components/  Page sections and shared UI
  data/        Portfolio content
  hooks/       Contact-form behavior
  styles/      Design tokens, mixins, and utilities
```

## Deployment

`npm run deploy` creates a production build and publishes the `build` directory to GitHub Pages. Firebase Hosting configuration is also present for deployments using Firebase.

## Contact

- [LinkedIn](https://www.linkedin.com/in/kabileshravi27/)
- [GitHub](https://github.com/Kabilesh020799)
- [Email](mailto:kabilesh020799@gmail.com)
