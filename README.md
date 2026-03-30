# LB Response Web

[![CI](https://github.com/the-coll-org/lbresponse-web/actions/workflows/ci.yml/badge.svg)](https://github.com/the-coll-org/lbresponse-web/actions/workflows/ci.yml)
[![CodeQL](https://github.com/the-coll-org/lbresponse-web/actions/workflows/codeql.yml/badge.svg)](https://github.com/the-coll-org/lbresponse-web/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Frontend for the **Lebanon Crisis Response Platform**. Built with **React**, **TypeScript**, and **Vite**.

---

## What Does This Project Do?

This is the web interface for the LB Response platform. It talks to the [lbresponse-api](https://github.com/the-coll-org/lbresponse-api) backend and displays crisis-response data. It supports **English and Arabic** (with right-to-left layout) and has a **light/dark theme** toggle.

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

| Tool    | Version | How to check     | Install guide       |
| ------- | ------- | ---------------- | ------------------- |
| Node.js | 20+     | `node --version` | https://nodejs.org  |
| npm     | 9+      | `npm --version`  | Comes with Node.js  |
| Git     | any     | `git --version`  | https://git-scm.com |

> **Tip:** If you use [nvm](https://github.com/nvm-sh/nvm), run `nvm use 20` to switch to Node 20.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/the-coll-org/lbresponse-web.git
cd lbresponse-web
```

### 2. Install dependencies

```bash
npm install
```

This also sets up [Husky](https://typicode.github.io/husky/) pre-commit hooks automatically.

### 3. Set up your environment

```bash
cp .env.example .env
```

The `.env` file contains:

| Variable       | What it does                                 | Default                 |
| -------------- | -------------------------------------------- | ----------------------- |
| `VITE_API_URL` | URL of the backend API (proxied in dev mode) | `http://localhost:3000` |

### 4. Start the dev server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser. The app will hot-reload when you save files.

> **Note:** For full functionality, start the [lbresponse-api](https://github.com/the-coll-org/lbresponse-api) backend at the same time. The Vite dev server proxies `/api` and `/health` requests to `http://localhost:3000` automatically.

---

## All Available Scripts

Run these from the project root:

| Command                 | What it does                                            |
| ----------------------- | ------------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server with hot reload               |
| `npm run build`         | Type-check and create a production build in `dist/`     |
| `npm run preview`       | Serve the production build locally for testing          |
| `npm run lint`          | Check code for errors with ESLint                       |
| `npm run format`        | Auto-format all source files with Prettier              |
| `npm run format:check`  | Check if files are formatted (no changes, just reports) |
| `npm run type-check`    | Run TypeScript compiler to catch type errors            |
| `npm run test`          | Run unit and integration tests once                     |
| `npm run test:watch`    | Run tests in watch mode (re-runs on file changes)       |
| `npm run test:coverage` | Run tests and generate a coverage report                |
| `npm run test:e2e`      | Run end-to-end tests with Playwright                    |
| `npm run test:e2e:ui`   | Run e2e tests with the Playwright UI (visual mode)      |
| `npm run knip`          | Find unused code, exports, and dependencies             |

---

## Project Structure

```
lbresponse-web/
├── public/                  # Static files (favicon, icons)
├── e2e/                     # End-to-end tests (Playwright)
│   └── app.spec.ts
├── src/
│   ├── __tests__/           # Integration tests
│   │   └── App.test.tsx
│   ├── assets/              # Images and SVGs
│   ├── components/          # Reusable UI components
│   ├── context/             # React context providers
│   │   ├── ThemeContext.tsx  #   Theme provider (light/dark)
│   │   └── themeContextValue.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useTheme.ts      #   Hook to access theme
│   │   └── __tests__/       #   Unit tests for hooks
│   ├── i18n/                # Internationalization
│   │   ├── index.ts         #   i18n setup and config
│   │   └── locales/
│   │       ├── en.json      #   English translations
│   │       └── ar.json      #   Arabic translations
│   ├── pages/               # Page-level components
│   ├── styles/
│   │   └── themes.css       # CSS variables for light/dark themes
│   ├── utils/               # Utility/helper functions
│   ├── test/
│   │   └── setup.ts         # Test setup (jest-dom matchers)
│   ├── App.tsx              # Main app component
│   ├── App.css              # App-level styles
│   ├── index.css            # Global styles
│   └── main.tsx             # Entry point
├── .github/
│   ├── workflows/
│   │   ├── ci.yml           # CI: lint, format, type-check, test, build
│   │   └── codeql.yml       # Security scanning
│   ├── ISSUE_TEMPLATE/      # Bug report and feature request forms
│   └── pull_request_template.md
├── eslint.config.js         # ESLint configuration
├── vitest.config.ts         # Vitest test runner configuration
├── playwright.config.ts     # Playwright e2e configuration
├── vite.config.ts           # Vite bundler configuration
├── tsconfig.json            # TypeScript configuration (root)
├── tsconfig.app.json        # TypeScript configuration (app source)
├── tsconfig.node.json       # TypeScript configuration (node/config files)
├── commitlint.config.js     # Commit message rules
└── package.json
```

---

## Theming (Light / Dark Mode)

The app supports light and dark themes. The theme is stored in `localStorage` so it persists across sessions.

**How it works:**

1. `ThemeContext` manages the current theme state
2. It sets `data-theme="light"` or `data-theme="dark"` on the `<html>` element
3. CSS variables in `src/styles/themes.css` change based on this attribute

**Available CSS variables** (use these in your styles):

| Variable                 | What it controls          |
| ------------------------ | ------------------------- |
| `--color-bg`             | Page background           |
| `--color-bg-secondary`   | Secondary/card background |
| `--color-text`           | Primary text color        |
| `--color-text-secondary` | Muted/secondary text      |
| `--color-primary`        | Accent/brand color        |
| `--color-primary-hover`  | Accent color on hover     |
| `--color-border`         | Border color              |
| `--color-surface`        | Surface/card background   |

**To use the theme in a component:**

```tsx
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
```

---

## Internationalization (i18n)

The app supports **English** and **Arabic** with automatic right-to-left (RTL) layout switching.

**How it works:**

1. Uses [react-i18next](https://react.i18next.com/) for translations
2. When the user switches to Arabic, `dir="rtl"` and `lang="ar"` are set on `<html>`
3. Translation files live in `src/i18n/locales/`

**To add a new translation key:**

1. Add the key to `src/i18n/locales/en.json`
2. Add the Arabic translation to `src/i18n/locales/ar.json`
3. Use it in your component:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('app.title')}</h1>;
}
```

**To add a new language:**

1. Create a new file, e.g. `src/i18n/locales/fr.json`, with the same key structure
2. Import and register it in `src/i18n/index.ts`

---

## Testing

### Unit & Integration Tests (Vitest)

Tests live alongside the code in `__tests__/` directories. They use [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

```bash
# Run all tests once
npm run test

# Run in watch mode (re-runs when files change — great for development)
npm run test:watch

# Run with coverage report
npm run test:coverage
```

### End-to-End Tests (Playwright)

E2E tests live in the `e2e/` directory. They use [Playwright](https://playwright.dev/) to test the app in a real browser.

```bash
# Run e2e tests (headless)
npm run test:e2e

# Run with the visual UI (easier to debug)
npm run test:e2e:ui
```

> **First time?** Playwright needs browser binaries. Run `npx playwright install chromium` if the tests fail with a browser error.

---

## Code Quality

This project enforces quality at multiple levels:

| When               | What runs                                       | Tool                |
| ------------------ | ----------------------------------------------- | ------------------- |
| You save a file    | Nothing automatic — run `npm run lint` manually | ESLint              |
| You stage a commit | Lint + format on staged files                   | husky + lint-staged |
| You write a commit | Commit message format is validated              | commitlint          |
| You push / open PR | Full CI: lint, format, types, test, build       | GitHub Actions      |
| Weekly + on push   | Security vulnerability scanning                 | CodeQL              |

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/). Your commit messages must follow this pattern:

```
type: short description
```

**Common types:**

| Type       | When to use                          | Example                              |
| ---------- | ------------------------------------ | ------------------------------------ |
| `feat`     | New feature                          | `feat: add user profile page`        |
| `fix`      | Bug fix                              | `fix: resolve RTL layout in sidebar` |
| `docs`     | Documentation only                   | `docs: update setup instructions`    |
| `style`    | Formatting, no logic change          | `style: fix indentation in App.tsx`  |
| `refactor` | Code change that isn't a fix or feat | `refactor: extract theme hook`       |
| `test`     | Adding or fixing tests               | `test: add useTheme unit tests`      |
| `chore`    | Tooling, deps, config                | `chore: upgrade vite to v8`          |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

**Quick version:**

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run checks: `npm run lint && npm run test && npm run build`
5. Commit with a conventional message
6. Open a Pull Request

## Security

See [SECURITY.md](SECURITY.md) for how to report vulnerabilities.

## License

MIT License. See [LICENSE](LICENSE) for details.
