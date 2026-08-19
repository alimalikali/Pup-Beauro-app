# app/ — Expo React Native client

Auto-loaded when work touches `app/`. Mobile-specific patterns and the project's many environmental traps live here.

## Stack

Expo SDK 54, React Native 0.81, React 19, Redux Toolkit 2.2, React Navigation 6 (native-stack + bottom-tabs), axios 1.6, socket.io-client 4.7, expo-secure-store, expo-image-picker, react-native-reanimated 4. Package manager: **pnpm**.

## Commands

```bash
cd app
nvm use 20                  # REQUIRED — Node 24 breaks Expo SDK 54 ESM resolution
pnpm install
# create .env:
#   EXPO_PUBLIC_API_URL=http://<LAN_IP>:5000/api
#   EXPO_PUBLIC_SOCKET_URL=http://<LAN_IP>:5000
pnpm start                  # or: pnpm exec expo start --clear
pnpm android / pnpm ios
```

Both env URLs must use the host LAN IP for device testing — `localhost` does not reach a physical phone.

## DO NOT REGRESS — environmental traps

These have all broken the app before. Re-verify any time you touch package.json or app.json:

- **Node 20.x required.** Node 24 breaks Expo SDK 54 ESM resolution.
- `app/.npmrc` must contain `node-linker=hoisted` (Expo needs flat node_modules).
- `app/package.json` `main` field MUST be `node_modules/expo/AppEntry.js`, NOT `expo-router/entry`.
- `app/app.json` plugins list must NOT contain `expo-blur` (no config plugin — adding crashes startup).
- `app/package.json` `pnpm.neverBuiltDependencies` must include `react-native-screens` (postinstall hangs otherwise).
- `EXPO_PUBLIC_*` env vars are baked at bundle time — Metro restart required after change.

## Path alias

`@` → `./src` via `babel-plugin-module-resolver` (`.ts, .tsx, .js, .jsx, .json`).

Always use `@/...`. Never `../../` past two levels.

## Entry chain

`App.tsx` → Redux Provider + SafeAreaProvider → `AppNavigator`.

AppNavigator gate:

| isAuthenticated | needsOnboarding | Active |
|---|---|---|
| false | — | `AuthNavigator` (Splash → Login → Register) |
| true | true | `OnboardingNavigator` (PurposeSetup → Verification) |
| true | false | `MainNavigator` (bottom tabs) |

Tab nav: Discover, Messages, Profile, Purpose. Chat screen is shared by Discover and Messages stacks.

**Never** call `navigation.reset()` to switch flows — flip Redux state instead, AppNavigator re-renders.

## State (Redux Toolkit)

Slices: `authSlice`, `profileSlice`, `matchSlice`, `chatSlice`.

`configureStore` middleware: default except **`serializableCheck: false`** (token objects). NON-NEGOTIABLE — don't re-enable.

**NO `createAsyncThunk`.** Project pattern is inline dispatch:
```ts
try {
  dispatch(setLoading(true));
  const res = await api.call();
  dispatch(setSuccess(res));
} catch (e) {
  dispatch(setError(e.message));
} finally {
  dispatch(setLoading(false));
}
```

Direct mutation is fine (Immer): `state.feed = state.feed.filter(...)`. No manual spreads.

Tokens stored via `expo-secure-store` (not Redux). No persistence wired today.

## API & Sockets

`src/services/api.ts`:
- Shared axios instance — **always reuse**, never construct a new one (loses interceptors)
- Request interceptor: `Authorization: Bearer <token>` from secure storage
- Response interceptor: unwraps `.data`, rejects with `err.response?.data ?? err`
- Factories: `authApi`, `profileApi`, `matchApi`, `chatApi`, `verificationApi`

`src/services/socket.ts`:
- URL: `EXPO_PUBLIC_SOCKET_URL`, namespace `/chat`
- Token in handshake, websocket transport only, 5 reconnect attempts
- Helpers: `connectSocket(token)`, `disconnectSocket()`, `getSocket()`, `joinConversation()`, `sendSocketMessage()`, `emitTyping()`, `emitStopTyping()`
- Listeners: `new_message`, `user_typing`, `user_stop_typing` — wired in ChatScreen

Socket lifecycle: connect once on auth, disconnect on logout. Per-screen `useEffect` only attaches/detaches event listeners — **always cleanup** in the return.

## Secure storage

`src/utils/secureStorage.ts` — platform wrapper (`SecureStore` native, `localStorage` web). Always use this wrapper. Never call `SecureStore` directly (breaks the web build).

## Theme

Constants in `src/constants/`:
- `theme.ts`: `Spacing`, `Radius`, `FontSize`, `Shadows`
- `gradients.ts`: gradient color arrays for `expo-linear-gradient`

Use constants. No magic numbers for spacing/radius/colors in `StyleSheet.create`.

## Navigation conventions

- Route names: PascalCase constants in `src/constants/routes.ts`. Never hardcoded strings at call sites.
- Stack params typed via `<NavigatorName>ParamList` + `RouteProp` / `NavigationProp` generics.
- `FlatList` `keyExtractor` must use stable unique id (entity uuid), never index.

## Skills

Use these via the Skill tool when the corresponding work is requested:
- `add-screen-with-slice`, `add-api-call`, `add-socket-handler`, `extend-theme`, `wire-onboarding-gate`

## Screens

- `screens/auth/` — Splash, Login, Register
- `screens/onboarding/` — PurposeSetup, Verification
- `screens/main/` — Discover, MatchDetail, MessagesList, Chat, Profile

## Common pitfalls

- Mock data fallbacks in DiscoverScreen and ChatScreen on API failure — degrades gracefully. Don't remove without coordinating UX.
- Fonts loaded eagerly in App.tsx before nav/auth check to prevent splash flash.
- Socket events are case-sensitive strings. Backend rename → mirror in `socket.ts` + screen listeners in the same PR (or dispatch `sync-socket-event` skill).
