# api/ — NestJS backend

Auto-loaded when work touches `api/`. Backend-specific patterns and gotchas live here so the root CLAUDE.md stays slim.

## Stack

NestJS 11, TypeORM 0.3, PostgreSQL, Socket.io, Passport JWT, class-validator, Multer, Google Gemini (`text-embedding-004`). Package manager: **pnpm**.

## Commands

```bash
cd api
pnpm install
cp .env.example .env        # fill DB_*, JWT_SECRET, GEMINI_API_KEY
pnpm start:dev              # watch — http://localhost:5000/api
pnpm build && pnpm start    # production
pnpm lint                   # eslint --fix
```

First-time Postgres setup:
```bash
sudo apt install postgresql-16-pgvector
sudo -u postgres psql -c "CREATE DATABASE mithaq;"
sudo -u postgres psql -d mithaq -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

## Modules (8)

`auth`, `users`, `profiles`, `matching`, `chat`, `verification`, `embedding`, `admin`.

Each feature folder layout:
```
src/<feature>/
├── <feature>.module.ts
├── <feature>.service.ts
├── <feature>.controller.ts
├── <feature>.gateway.ts   # only if WebSocket
├── entities/
└── dto/
```

Auth-specific: `auth/guards/`, `auth/strategies/`, `auth/decorators/`.

## Auth flow

- Register: bcrypt hash (salt 12) → create User + Profile atomically → sign JWT (7d) with `{ sub, email }`
- Login: compare bcrypt → sign JWT
- `JwtStrategy.validate` populates `req.user` from token
- `JwtGuard` chains `AuthGuard('jwt')`. `AdminGuard` checks `UserRole.ADMIN`
- `@CurrentUser()` decorator extracts `req.user`

Every protected route: `@UseGuards(JwtGuard)` + `@CurrentUser()`. Role-gated: `@UseGuards(JwtGuard, AdminGuard)` — JwtGuard first to populate `req.user`.

## Entities

- **User**: id (UUID), email (unique), phone, password (hashed), role (enum), gender (enum), isVerified, isActive, timestamps. 1:1 Profile, 1:N VerificationDoc.
- **Profile**: userId (FK), displayName, age, city, sect, education, profession, familyType, bio, purposeStatement, **purposeEmbeddingRaw** (text column, JSON-stringified 768-dim float array from Gemini), lifeTags (simple-array), 5 priority fields (0-100), isPublished, profileViews, waliEmail, avatarUrl. Computed `completeness`.
- **Match**: id, userAId, userBId (sorted UUIDs as composite unique key — prevents duplicate pairs), status (pending|mutual|rejected), compatScore (float), initiatedBy.
- **Conversation**: matchId (1:1 FK), waliEmail, isActive. Relations: Match, Messages (1:N).
- **Message**: conversationId (FK), senderId (FK), content (text), isRead, createdAt.
- **VerificationDoc**: userId (FK), cnicFront/cnicBack (file paths), status (pending|approved|rejected), adminNote, reviewedBy, reviewedAt.

## Matching

`ProfilesService.computeScore` does **in-memory cosine similarity** + priority-weight scoring across published profiles. NOT a pgvector query (pgvector still required by schema — keep the extension installed).

Profile must `isPublished = true` to appear in feed.

## ChatGateway (`/chat` namespace)

- `handleConnection`: extract token from `handshake.auth`, verify JWT, store `socket.data.userId`, track in `userSockets: Map<userId, Socket>`
- `handleDisconnect`: clean Map

Events:
| Direction | Event | Payload |
|---|---|---|
| C→S | `join_conversation` | `{ conversationId }` |
| C→S | `send_message` | `{ conversationId, content }` |
| C→S | `typing` / `stop_typing` | `{ conversationId }` |
| S→C | `new_message` | `Message` |
| S→C | `user_typing` / `user_stop_typing` | `{ userId }` |
| S→C | `match_notification` | `Match` (direct emit to user) |

Always verify `socket.data.userId` on event handlers; throw `WsException('Unauthorized')` if absent.

## Embedding

`EmbeddingService` wraps Gemini `text-embedding-004` (768-dim). On-demand from profile purpose updates. **Fails silently** if `GEMINI_API_KEY` missing — profile saves without embedding (degraded matching).

## DTOs & validation

- class-validator decorators only. `@IsString`, `@IsEmail`, `@MinLength`, `@IsEnum`, `@IsOptional`, `@Min`, `@Max`, `@IsNumber`
- `ValidationPipe` global with `{ whitelist: true, transform: true }` — unknown fields silently dropped
- All optional fields explicit with `@IsOptional()`

## Errors

Throw Nest exceptions only: `NotFoundException`, `ConflictException`, `UnauthorizedException`, `ForbiddenException`, `BadRequestException`. WS errors: `WsException`. Never plain `Error`.

External services (Gemini) wrapped in try/catch — degraded mode, never propagate to user-facing request.

## File uploads

Pattern from `verification.controller.ts`:
- `FileFieldsInterceptor` + `diskStorage`
- Path: `./uploads/<feature>/`
- Filename: `${Date.now()}-${file.originalname}`
- Cap: 5MB unless feature justifies more
- Static served from `/uploads/*` (wired in `main.ts`)
- No automatic cleanup today

## DB

- `synchronize` is disabled by default. Run checked-in migrations for every environment; `DB_SYNCHRONIZE=true` is only for disposable experiments.
- Always load relations explicitly: `repo.find({ where, relations: ['profile'] })`. No `eager: true` on entities (hides N+1).
- pgvector extension required by schema even though current matching is in-memory.

## Conventions

- Files: `kebab-case.<role>.ts` — `auth.service.ts`, `register.dto.ts`, `jwt.strategy.ts`
- Classes: PascalCase, suffix matches role
- Enums: `*.enum.ts`, members `UPPER_SNAKE_CASE`
- Secrets via `ConfigService.get()` with fallback only for non-secret URLs — never for credentials
- Async service methods; try/catch only at external boundaries

## Skills

Use these via the Skill tool when the corresponding work is requested:
- `add-nestjs-module`, `add-typeorm-entity`, `add-socket-event`, `add-auth-guard`, `add-file-upload`

## Don't regress

- `Match` composite unique key (sorted UUIDs)
- In-memory cosine (NOT pgvector query)
- Global `ValidationPipe` with `whitelist + transform`
- `EmbeddingService` failing silently when `GEMINI_API_KEY` absent
- File uploads under `./uploads/<feature>/` only
