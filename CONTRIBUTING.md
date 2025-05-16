# Contributing to AI Note Assistant

Thank you for your interest in contributing! To keep our workflow efficient and our codebase healthy, please follow these guidelines.

## Git Flow
- **Branches:**
  - Feature: `feature/<short-description>`
  - Bugfix: `fix/<short-description>`
  - Main development: `develop`
  - Production: `main`
- **Workflow:**
  1. Fork the repo and clone your fork.
  2. Create a feature or fix branch from `develop`.
  3. Commit and push your changes.
  4. Open a Pull Request (PR) to `develop`.
  5. After review, PRs are merged to `develop` and then to `main` for release.

## Commit Message Rules
- Use [Angular commit message convention](https://www.conventionalcommits.org/en/v1.0.0/):
  - `feat: add new feature`
  - `fix: correct a bug`
  - `docs: update documentation`
  - `test: add or fix tests`
  - `refactor: code refactoring`
  - `chore: tooling or maintenance`

## PR Checklist
- [ ] All tests pass (unit, integration, E2E)
- [ ] Code is linted and formatted
- [ ] Documentation is updated (README, API, etc.)
- [ ] Lighthouse CI web-vitals (Performance, Accessibility, Best Practices, SEO) ≥ 90
- [ ] CI checks are green
- [ ] No sensitive data or secrets in code or config

## Review Process
- PRs require at least one approval.
- Address all review comments before merging.
- Squash commits if possible for a clean history.

## Local Setup
- See `README.md` for setup instructions.
- Use `npm run lint` and `npm run test` in `frontend/`.
- Use `pytest` in `backend/`.

## Questions?
Open an issue or ask in the Discussions tab.
