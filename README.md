# Mithaq — purpose-led matchmaking

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

Mithaq (مِيثَاق) is a responsive matrimonial platform designed around a person's purpose, values, family expectations, lifestyle, and future direction—not an opaque “AI match.” The repository contains two independently deployable TypeScript applications:

```text
web/   Vite + React + Tailwind + shadcn/ui (landing, member experience, admin)
api/   NestJS + TypeORM + PostgreSQL (REST API, Socket.IO, business rules)
```

The former Expo/React Native application was removed. Its useful visual language and workflows were adapted to the responsive web client. The original landing experience remains in `web/src/components/mithaq`.

## Prerequisites

- Node.js 20.19 or newer
- pnpm 9 or newer for the API
- npm 10 or newer for the web client
- PostgreSQL 15 or newer

## Local setup

1. Start PostgreSQL (or use an existing PostgreSQL 15+ instance):
   ```bash
   docker compose up -d postgres
   ```
2. Configure the API:
   ```bash
   cp api/.env.example api/.env
   # Set DB_PASS=postgres when using compose.yaml.
   # Replace JWT_SECRET with a random value of at least 32 characters.
   cd api && pnpm install && pnpm build && pnpm migration:run
   ```
3. Configure the web client:
   ```bash
   cp web/.env.example web/.env
   cd web && npm install
   ```
4. Run each service in a separate terminal:
   ```bash
   cd api && pnpm start:dev
   cd web && npm run dev
   ```
5. Open `http://localhost:8080`. The API health endpoint is `http://localhost:5000/api/health`.

Never commit `.env` files. Production must use a unique JWT secret of at least 32 characters, explicit CORS origins, private document storage, TLS, and managed database backups.

To seed the first administrator, temporarily set `ADMIN_SEED_ENABLED=true`, provide a unique `ADMIN_EMAIL` and an `ADMIN_PASSWORD` of at least 16 characters, start the API once, and then disable the flag. There are no default administrator credentials.

## Architecture

The API follows Nest feature modules. Controllers validate HTTP contracts and delegate to services; services own persistence and business rules; TypeORM entities and migrations own database structure. JWT authentication populates a current user, while the separate admin guard enforces server-side roles. Passwords are hashed with bcrypt at cost 12. The browser has separate member and administrator session contexts and protected route layouts.

The web application uses React Router route groups, TanStack Query for server state, and reusable shadcn primitives. Public landing components, authenticated member pages, and admin pages remain visually consistent but are organized independently.

## Data design

Core records are `users`, `profiles`, `verification_docs`, `matches`, `conversations`, and `messages`. Purpose-oriented profile JSON sections capture partner preferences, values and beliefs, lifestyle, and long-term goals while the model evolves. Safety and engagement records include `favorites`, `blocks`, `reports`, and `notifications`. Pair records have uniqueness constraints, and the included migration creates safety indexes and foreign keys.

## Compatibility

Compatibility is calculated on the server. The current explainable baseline combines purpose-statement similarity (when an optional embedding provider is configured) with differences between the five declared priorities: deen, education, career, family, and location. The client cannot submit or override a score. Only published, active, opposite-gender profiles are considered. A future release should normalize structured answers further and return a per-factor explanation; embeddings should remain supplemental rather than authoritative.

## Commands

```bash
cd api && pnpm build          # API type/build check
cd api && pnpm lint           # API lint
cd api && pnpm test           # API DTO/unit tests
cd web && npm run build       # production web bundle
cd web && npm run lint        # web lint
cd web && npm test            # Vitest suite
```

From the repository root, `make install` installs locked dependencies and `make check` runs builds, tests, and lint checks for both applications.

## Open-source project files

- [Apache License 2.0](LICENSE) — permits use, modification, and distribution while retaining notices and providing an express patent license.
- [Contributing guide](CONTRIBUTING.md) — development workflow and pull-request expectations.
- [Security policy](SECURITY.md) — private vulnerability reporting guidance.
- [Code of Conduct](CODE_OF_CONDUCT.md) — community participation expectations.
- [Notice](NOTICE) — project attribution required by the license.

Before making the repository public, replace the placeholder security and conduct email addresses with monitored project mailboxes.

## Current limitations

- Email delivery, password recovery, refresh-token rotation, cloud media storage, and malware scanning require external providers and are not yet wired.
- Browser bearer tokens are currently persisted locally; production should migrate to rotating sessions in secure HttpOnly cookies with CSRF protection.
- Verification documents are supported by the legacy local upload adapter. Deployments must use private object storage and admin-only signed retrieval.
- Matching currently uses deterministic priority rules with an optional embedding supplement. Structured compatibility explanations and administrator-managed scoring weights remain follow-up work.
- Payments and guardian email delivery are not integrated.
