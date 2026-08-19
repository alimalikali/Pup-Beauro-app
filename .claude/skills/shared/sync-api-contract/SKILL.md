---
name: sync-api-contract
description: After a backend route or DTO in api/ changes, propagate the contract to app/src/services/api.ts, app/src/types/, and admin/src/hooks/. Use when a backend change just landed or is about to land, and consumers need to mirror it.
argument-hint: [route-or-dto-name]
allowed-tools: Read, Edit, Grep, Glob
---

# Sync API contract: $ARGUMENTS

There is **no shared types package** in this monorepo. Backend DTOs are duplicated manually across consumers. This skill walks the mirror process.

## 1. Identify the source change

Source of truth: `api/src/<feature>/dto/*.dto.ts` (class-validator decorated) and the controller route definition.

Look at what changed:
- Route path → mobile + admin
- DTO field added → both, additive (safe)
- DTO field renamed → both, breaking (coordinate)
- DTO field removed → both, breaking (coordinate)
- Response shape changed → both

## 2. Mobile mirror

Edit `app/src/services/api.ts`:
- Update the factory method signature (`profileApi`, `matchApi`, etc.) to match new params + response type

Edit `app/src/types/`:
- Update the TypeScript interface for the affected resource

Search for call sites:
```
grep -rn "profileApi\.<method>" app/src
```
List them in your report — do NOT modify call sites yourself (that's `mobile-agent`'s scope).

## 3. Admin mirror

Edit `admin/src/hooks/use<Resource>.ts` (if a TanStack Query hook consumes the route):
- Update the response interface
- Update the URL if the route path changed
- Update mutation `mutationFn` body shape

Search for consumers:
```
grep -rn "use<Resource>" admin/src
```

## Rules

- **Stay in the seam**: only edit `api.ts`, `socket.ts`, `app/src/types/`, `admin/src/hooks/`. Do not modify feature implementations (screens, components, services beyond the seam).
- **Report breaking changes**: if a field that's still referenced got removed, flag it — do not silently delete usages.
- **Do not touch backend** — you receive backend changes as input, not as something to author.
- **Never invent fields** — every field added to the mirror must come from the backend diff.

## Output format

```
## Backend change
- <route or DTO>: <what changed>

## Mobile mirror
- app/src/services/api.ts:L — updated <method>
- app/src/types/<file>.ts:L — updated <type>
- Call sites still using old shape: <list>

## Admin mirror
- admin/src/hooks/use<R>.ts:L — updated <hook>
- Consumers: <list>

## Breaking change risks
- <field renamed but still referenced in app/src/screens/X.tsx:L>
```
