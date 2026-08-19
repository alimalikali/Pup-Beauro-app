---
name: add-auth-guard
description: Add a custom NestJS auth/permission guard in api/. Mirrors AdminGuard pattern. Use when the user asks to "add guard", "new permission check", "protect route with role".
argument-hint: [guard-name]
allowed-tools: Read, Write, Edit
paths: api/**
---

# Add auth guard: $ARGUMENTS

Create at `api/src/auth/guards/$ARGUMENTS.guard.ts`. Mirror the pattern of `JwtGuard` and `AdminGuard`.

## Template

```typescript
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class $ARGUMENTSGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user; // populated by JwtStrategy.validate

    if (!user) throw new ForbiddenException('Authentication required');

    // permission logic
    if (!/* condition on user */) {
      throw new ForbiddenException('Specific reason here');
    }

    return true;
  }
}
```

## Rules

- **Always after `JwtGuard`** in `@UseGuards(JwtGuard, $ARGUMENTSGuard)` — JwtGuard populates `req.user` first
- **Throw specific exception** with a human message — never silent `return false` (caller sees a generic 403 without context)
- **Read-only**: guards check, they don't mutate state
- **No DB call inside guard** if avoidable — keep it fast (the request handler can re-fetch)

## Apply to routes

In the controller:
```typescript
@UseGuards(JwtGuard, $ARGUMENTSGuard)
@Get('protected')
async route(@CurrentUser() user: User) { ... }
```

## Register

Guards don't need module registration if `@Injectable()` and imported where used. If you create a new role-storage service the guard depends on, add it to the appropriate module's `providers`.

## Verify

- Hit the protected route with a token lacking the role — expect 403 with your specific message
- Hit it with a valid role — expect 200
- Hit it without a token — expect 401 from `JwtGuard` (not 403 from your guard, confirming order)
