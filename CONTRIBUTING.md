# Contributing to LB Response Web

Thank you for your interest in contributing to the Lebanon Crisis Response Platform.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/<your-username>/lbresponse-web.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feat/your-feature`
5. Start the dev server: `npm run dev`

## Development

### Prerequisites

- Node.js 20+
- npm 9+

### Scripts

- `npm run dev` — Start Vite dev server
- `npm run lint` — Run ESLint
- `npm run format` — Format code with Prettier
- `npm run type-check` — Run TypeScript type checking
- `npm run knip` — Check for unused code and dependencies
- `npm run build` — Production build

### Code Quality

This project enforces code quality through:

- **ESLint** with type-aware rules and Prettier integration
- **Pre-commit hooks** (husky + lint-staged) that lint and format staged files
- **Commitlint** enforcing [Conventional Commits](https://www.conventionalcommits.org/)
- **CI** runs lint, format check, type check, and build on every PR

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Examples:

```
feat: add user dashboard page
fix: resolve RTL layout issue in sidebar
docs: update setup instructions
chore: upgrade dependencies
```

## Submitting Changes

1. Make sure all checks pass: `npm run lint && npm run format:check && npm run type-check && npm run build`
2. Commit your changes following the conventional commit format
3. Push to your fork and open a Pull Request against `main`
4. Fill in the PR template and describe your changes

## Reporting Issues

- Use the GitHub issue templates
- Include steps to reproduce for bugs
- Include screenshots for UI issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
