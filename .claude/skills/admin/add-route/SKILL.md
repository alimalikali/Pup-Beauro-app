---
name: add-route
description: Add a new page route to the Vite admin SPA — page component under src/pages/ + Route registration in App.tsx before the catch-all. Use when the user asks to "add page", "new route", "new admin page".
argument-hint: [route-path] [page-name]
allowed-tools: Read, Write, Edit
paths: admin/**
---

# Add route: $ARGUMENTS

## 1. Page component

Create `admin/src/pages/$ARGUMENTS[1].tsx`. Default export, functional component:

```tsx
export default function $ARGUMENTS[1]() {
  return (
    <main className="min-h-screen">
      {/* content */}
    </main>
  );
}
```

## 2. Register the route

Edit `admin/src/App.tsx`. Add the `<Route>` BEFORE the catch-all `*`:

```tsx
import $ARGUMENTS[1] from './pages/$ARGUMENTS[1]';

<Routes>
  <Route path="/" element={<Index />} />
  {/* other routes */}
  <Route path="$ARGUMENTS[0]" element={<$ARGUMENTS[1] />} />
  <Route path="*" element={<NotFound />} />  {/* MUST be last */}
</Routes>
```

## 3. (Optional) data hook

If the page needs server data, create a `useQuery` hook (see `add-query-hook` skill) rather than fetching in `useEffect`.

## Rules

- **Catch-all stays last** — `*` route matches anything; placing it before another route makes the latter unreachable
- **Default export** for the page (matches existing pattern)
- **Route path style**: lowercase, hyphenated (`/admin-dashboard`, not `/AdminDashboard`)
- **No nested routers** — keep the routing tree flat unless the app grows beyond a landing + a handful of admin views
- **404 handling**: rely on the existing `NotFound` page. Don't add per-route fallbacks.
- **Page chrome**: `Navbar` + `Footer` are NOT mounted globally on landing — if the new page needs them, import explicitly. (Confirm by checking `Index.tsx` mounting pattern.)

## Verify

- `npm run dev` — navigate to `http://localhost:8080$ARGUMENTS[0]`, page renders
- Try a bogus path — `/asdf` should show NotFound
- Check that the route appears in the address bar after a programmatic `navigate('$ARGUMENTS[0]')` call
