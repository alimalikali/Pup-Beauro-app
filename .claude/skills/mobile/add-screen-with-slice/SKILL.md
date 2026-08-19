---
name: add-screen-with-slice
description: Add a new screen to app/ with optional Redux slice and navigator registration. Use when the user asks to "add screen", "new view", "wire a page", in the mobile app.
argument-hint: [screen-name] [flow: auth|onboarding|main]
allowed-tools: Read, Write, Edit, Bash(ls *)
paths: app/**
---

# Add screen: $ARGUMENTS

## 1. Screen file

Create `app/src/screens/$ARGUMENTS[1]/$ARGUMENTS[0]Screen.tsx`. Functional component. Use typed selectors/dispatch:

```tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Routes } from '@/constants/routes';

export default function $ARGUMENTS[0]Screen() {
  const dispatch = useAppDispatch();
  const x = useAppSelector(s => s.someSlice.x);
  // ...
}
```

Path alias `@/` (NEVER `../../`). Theme tokens from `@/constants/theme`.

## 2. (Optional) Redux slice

If genuinely new state domain (don't sub-slice existing ones), create `app/src/store/$ARGUMENTS[0]Slice.ts`:

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State { /* ... */ }
const initialState: State = { /* ... */ };

const slice = createSlice({
  name: '$ARGUMENTS[0]',
  initialState,
  reducers: {
    setX: (state, action: PayloadAction<X>) => { state.x = action.payload; }, // Immer direct mutation OK
    setError: (state, action: PayloadAction<string | null>) => { state.error = action.payload; },
    setLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload; },
  },
});

export const { setX, setError, setLoading } = slice.actions;
export default slice.reducer;
```

**No `createAsyncThunk`** — this project's pattern is inline dispatch (see `add-api-call`).

Register in `app/src/store/index.ts`:
```ts
import $ARGUMENTS[0]Reducer from './$ARGUMENTS[0]Slice';
// ...
reducer: { ..., $ARGUMENTS[0]: $ARGUMENTS[0]Reducer }
```

## 3. Route registration

Add the route name to `app/src/constants/routes.ts` (PascalCase constant). Then in the right navigator file:
- `auth` flow → `app/src/navigation/AuthNavigator.tsx`
- `onboarding` flow → `app/src/navigation/OnboardingNavigator.tsx`
- `main` flow → `app/src/navigation/MainNavigator.tsx` (pick which stack: Discover, Messages, or new tab)

```tsx
<Stack.Screen name={Routes.$ARGUMENTS[0]} component={$ARGUMENTS[0]Screen} />
```

## 4. Param types

If the screen takes route params, extend the navigator's `ParamList` type. Type props at the screen level:
```ts
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<MainStackParamList, typeof Routes.$ARGUMENTS[0]>;
```

## Do not

- Don't introduce `createAsyncThunk` — diverges from the project pattern
- Don't hardcode route name strings at call sites (`navigation.navigate('Login')`) — always `Routes.Login`
- Don't put inline magic colors/spacings — use `@/constants/theme`
- Don't re-enable `serializableCheck` in the store
