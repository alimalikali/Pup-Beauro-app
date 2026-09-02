# Contributing to Mithaq

Thank you for helping build safer, purpose-led matchmaking software.

## Before you start

1. Read the [Code of Conduct](CODE_OF_CONDUCT.md) and [Security Policy](SECURITY.md).
2. Search existing issues before opening a new one.
3. Discuss significant schema, authentication, privacy, or matching changes in an issue before implementation.
4. Never include real member information, identity documents, credentials, or production database exports in issues, fixtures, screenshots, or commits.

## Development workflow

1. Fork the repository and create a focused branch from the default branch.
2. Follow the setup instructions in [README.md](README.md).
3. Keep controllers thin and put business rules in services.
4. Add a migration for every database change; do not enable TypeORM synchronization.
5. Add or update tests for changed behavior.
6. Run `make check` before opening a pull request.
7. Explain security/privacy implications and external integration requirements in the pull request.

## Pull requests

- Use clear, imperative commit messages.
- Keep unrelated refactors out of feature changes.
- Include reproduction and verification steps for bug fixes.
- UI changes should include desktop and mobile-width screenshots without real user data.
- API changes should document request/response contract changes.

By contributing, you agree that your contributions are licensed under the repository's Apache License 2.0.
