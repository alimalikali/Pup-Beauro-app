---
name: add-query-hook
description: Add a TanStack Query hook in admin/src/hooks/ for data fetching with shared QueryClient. Use when the user asks to "add data hook", "new query", "fetch data in admin".
argument-hint: [resource-name]
allowed-tools: Read, Write, Edit
paths: admin/**
---

# Add TanStack Query hook: $ARGUMENTS

## 1. Hook file

Create `admin/src/hooks/use$ARGUMENTS.ts`:

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface $ARGUMENTSResponse {
  // shape from backend
}

export function use$ARGUMENTS(id?: string) {
  return useQuery<$ARGUMENTSResponse>({
    queryKey: ['$ARGUMENTS', id],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/$ARGUMENTS/${id}`);
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    },
    enabled: !!id,
  });
}
```

## 2. Mutation hook (if writes needed)

```ts
export function useUpdate$ARGUMENTS() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; data: Partial<$ARGUMENTSResponse> }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/$ARGUMENTS/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['$ARGUMENTS', vars.id] });
      queryClient.invalidateQueries({ queryKey: ['$ARGUMENTS-list'] });
    },
  });
}
```

## Rules

- **Single `QueryClient` at root** (in `App.tsx`) — never construct new ones per page/hook
- **Query keys**: array form, scoped (`['$ARGUMENTS', id]`, `['$ARGUMENTS-list', filter]`). Keep consistent across hooks so invalidation works.
- **Mutations invalidate by key** on success — don't manually `setQueryData` unless optimistic updates are needed
- **No global `staleTime` override** — default works for the current landing/admin data
- **Return the whole query object** (`{ data, isLoading, error, ... }`) — let the consumer destructure
- **`enabled`** guard for queries that need a param — prevents fetch with `undefined` id
- **VITE_API_URL** in `.env` (not hardcoded) — falls back if missing must be added at the call site

## Consumer pattern

```tsx
const { data, isLoading, error } = use$ARGUMENTS(id);
if (isLoading) return <Skeleton />;
if (error) return <Alert variant="destructive">{error.message}</Alert>;
return <div>{data.name}</div>;
```

## Verify

- Mount a component using the hook — verify network request fires in DevTools
- Trigger a mutation — confirm dependent queries refetch after success
- Disconnect the backend — confirm `error` state populates with the right message
- React Query DevTools (if installed) — confirm query keys are well-scoped, no overlapping caches
