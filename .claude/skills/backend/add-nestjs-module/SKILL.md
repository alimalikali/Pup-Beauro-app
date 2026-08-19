---
name: add-nestjs-module
description: Scaffold a new NestJS feature module in api/ with module/service/controller/entity/DTO. Use when the user asks to "add module", "create endpoint", "new feature in api", "scaffold module", or similar.
argument-hint: [module-name]
allowed-tools: Read, Write, Edit, Bash(mkdir *), Bash(ls *)
paths: api/**
---

# Add NestJS module: $ARGUMENTS

Scaffold a new feature module under `api/src/$ARGUMENTS/`, matching the conventions of the existing 8 modules (`auth`, `users`, `profiles`, `matching`, `chat`, `verification`, `embedding`, `admin`).

## Files to create

1. **`api/src/$ARGUMENTS/$ARGUMENTS.module.ts`**
   - Imports `TypeOrmModule.forFeature([<Entity>])`
   - Declares `controllers: [<Controller>]`, `providers: [<Service>]`
   - Exports `<Service>` if other modules need it

2. **`api/src/$ARGUMENTS/$ARGUMENTS.service.ts`**
   - Inject repository via `@InjectRepository(<Entity>)`
   - Throw `NotFoundException` / `ConflictException` / `ForbiddenException` (NEVER plain `Error`)
   - Always load relations explicitly (`relations: ['profile']`) — no eager loading

3. **`api/src/$ARGUMENTS/$ARGUMENTS.controller.ts`**
   - REST routes
   - `@UseGuards(JwtGuard)` by default on every route
   - Use `@CurrentUser()` decorator from `src/auth/decorators/` to inject the user
   - Throw exceptions on bad state; let global `ValidationPipe` handle DTO shape

4. **`api/src/$ARGUMENTS/dto/<action>.dto.ts`** (one per action that takes a body)
   - class-validator decorators only: `@IsString`, `@IsEmail`, `@MinLength`, `@IsEnum`, `@IsOptional`, `@Min`, `@Max`
   - All optional fields explicit with `@IsOptional()`
   - No inline shape validation in services

5. **`api/src/$ARGUMENTS/entities/<entity>.entity.ts`** (use `add-typeorm-entity` skill for this)

## Register the module

Edit `api/src/app.module.ts` — add `$ARGUMENTSModule` to the `imports` array. Match alphabetical or grouping convention of existing imports.

## Verify

- `cd api && pnpm build` — must compile
- Routes appear in NestJS bootstrap log (curl `/api/$ARGUMENTS/<route>` once dev server runs)

## Do not

- Add migration files (dev uses `synchronize: true`)
- Hardcode secrets — use `ConfigService.get()`
- Skip `@UseGuards(JwtGuard)` on a "temporary" public route — there is no such thing as temporary
