---
name: add-api-call
description: Add a new endpoint to the shared axios instance in app/src/services/api.ts and wire it into a screen with the project's no-thunk dispatch pattern. Use when the user asks to "add API call", "new endpoint in mobile", "wire backend call".
argument-hint: [factory-name] [method-name]
allowed-tools: Read, Edit
paths: app/**
---

# Add API call: $ARGUMENTS

## 1. Add the endpoint to the right factory

Edit `app/src/services/api.ts`. Add a method to one of the existing factories (`authApi`, `profileApi`, `matchApi`, `chatApi`, `verificationApi`) or create a new factory if the domain is genuinely new.

```ts
export const $ARGUMENTS[0]Api = {
  // ...existing
  $ARGUMENTS[1]: (params: { /* ... */ }) => api.post<ResponseShape>('/$endpoint', params),
  // GET with query: api.get<R>(`/path/${id}`)
  // multipart: api.post<R>('/path', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
};
```

**Always reuse the shared `api` axios instance.** Never create a new axios instance — you'd lose the Bearer-token interceptor and the `.data` unwrap.

## 2. Type the response

If the response shape is new, add it to `app/src/types/`. Match the backend DTO field-by-field (no shared types package — manual sync).

## 3. Call site pattern (NO thunks)

In the screen:

```ts
const dispatch = useAppDispatch();

const handleSubmit = async () => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const res = await $ARGUMENTS[0]Api.$ARGUMENTS[1](payload);
    dispatch(setSomething(res));
  } catch (e: any) {
    dispatch(setError(e.message ?? 'Something went wrong'));
  } finally {
    dispatch(setLoading(false));
  }
};
```

**Do NOT introduce `createAsyncThunk`** — the project pattern is inline. The response interceptor already unwraps `.data`, so `res` is the payload directly.

## 4. Error format

The response interceptor rejects with `err.response?.data ?? err`. The backend throws Nest exceptions, so `e` is typically `{ statusCode, message, error }`. Use `e.message`.

## Verify

- Run `cd app && pnpm start` — open the screen, trigger the call
- Check the request in the Expo dev tools network panel (or `adb logcat` for Android)
- Confirm the JWT header is attached (interceptor working)
- Confirm `dispatch(setError(...))` shows the right message on failure (try with backend off)
