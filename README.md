# LB Response Web

[![CI](https://github.com/the-coll-org/lbresponse-web/actions/workflows/ci.yml/badge.svg)](https://github.com/the-coll-org/lbresponse-web/actions/workflows/ci.yml)
[![CodeQL](https://github.com/the-coll-org/lbresponse-web/actions/workflows/codeql.yml/badge.svg)](https://github.com/the-coll-org/lbresponse-web/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Frontend for the Lebanon Crisis Response Platform. Built with React, TypeScript, and Vite.

## Features

- Theme support (light/dark) with CSS variables and localStorage persistence
- i18n with English and Arabic (RTL) support via react-i18next
- Type-aware ESLint + Prettier with pre-commit hooks (husky + lint-staged)
- Conventional Commits enforced via commitlint
- Dead code detection via knip
- GitHub Actions CI + CodeQL security scanning

## Prerequisites

- Node.js 20+
- npm 9+

## Getting Started

```bash
# Clone the repository
git clone https://github.com/the-coll-org/lbresponse-web.git
cd lbresponse-web

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

| Script                 | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start Vite dev server              |
| `npm run build`        | Type check + production build      |
| `npm run lint`         | Run ESLint                         |
| `npm run format`       | Format code with Prettier          |
| `npm run format:check` | Check formatting without writing   |
| `npm run type-check`   | Run TypeScript type checking       |
| `npm run knip`         | Check for unused code/dependencies |
| `npm run preview`      | Preview production build locally   |

## Project Structure

```
src/
  components/     # Reusable UI components
  context/        # React context providers (Theme)
  hooks/          # Custom hooks (useTheme)
  i18n/           # i18n config and locale files
    locales/
      en.json     # English translations
      ar.json     # Arabic translations
  pages/          # Page-level components
  styles/         # Global styles and theme CSS variables
  utils/          # Utility functions
```

## Theming

Themes are managed via CSS custom properties defined in `src/styles/themes.css`. The `ThemeProvider` context applies `data-theme="light"` or `data-theme="dark"` on the root element.

Available variables: `--color-bg`, `--color-bg-secondary`, `--color-text`, `--color-text-secondary`, `--color-primary`, `--color-primary-hover`, `--color-border`, `--color-surface`.

## Internationalization

Uses `react-i18next` with browser language detection. Switching to Arabic automatically sets `dir="rtl"` on the document.

Translation files are in `src/i18n/locales/`. To add a new language, create a new JSON file following the same key structure and register it in `src/i18n/index.ts`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
