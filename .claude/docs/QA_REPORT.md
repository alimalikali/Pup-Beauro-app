# Mithaq App — QA Report
**Date:** 2026-04-30  
**Tested on:** Expo Web (localhost:8081) · Viewport: 390×844 (iPhone 14 equivalent)  
**API:** http://192.168.0.107:5000/api  
**Tester:** Claude Code + MCP Playwright

---

## Summary

| Category | Count |
|---|---|
| Fixed during session | 1 |
| Functional bugs | 4 |
| Unimplemented stubs | 7 |
| Navigation issues | 2 |
| Harmless warnings | 3 |
| Screens working correctly | 8 |

---

## Fixed During This Session

### ✅ `expo-secure-store` Web Compatibility
**Affected files:** `App.tsx`, `src/services/api.ts`, `src/screens/auth/LoginScreen.tsx`, `src/screens/auth/RegisterScreen.tsx`, `src/screens/main/ProfileScreen.tsx`

`expo-secure-store`'s web module is `export default {}` — none of the native methods (`getValueWithKeyAsync`, `setValueWithKeyAsync`, `deleteValueWithKeyAsync`) exist on web. Every SecureStore call threw `TypeError: ExpoSecureStore.default.Xxx is not a function`.

**Fix:** Created `src/utils/secureStorage.ts` — thin wrapper that uses `localStorage` on `Platform.OS === 'web'` and `SecureStore` on native. All 4 call sites updated.

---

## Functional Bugs

### 🐛 BUG-01 — Onboarding Skipped After Registration
**Severity:** High  
**Screen:** Register → (expected PurposeSetup) → (actual) Discover

`RegisterScreen` dispatches `loginSuccess` then calls `navigation.replace(Routes.PurposeSetup)`. But `loginSuccess` flips `isAuthenticated = true`, which causes `AppNavigator` to unmount `AuthNavigator` and mount `MainNavigator` immediately. The `navigation.replace` targets `PurposeSetup` inside the now-destroyed `AuthNavigator` stack — it silently fails and user lands on Discover.

**Impact:** Every new user bypasses onboarding (purpose statement + verification). Profile completeness stuck at 45%.

**Fix:** Either:
- Dispatch `loginSuccess` **after** onboarding completes, or
- Add a separate `OnboardingNavigator` that sits between auth and main, or
- Add `isOnboarded: boolean` to Redux auth state and gate `MainNavigator` rendering on it

---

### 🐛 BUG-02 — Verification Screen Unreachable from MainNavigator
**Severity:** High  
**Screen:** Purpose tab → Save & Continue  
**Console error:** `The action 'NAVIGATE' with payload {"name":"Verification"} was not handled by any navigator.`

`PurposeSetupScreen` calls `navigation.navigate(Routes.Verification)` after save. `VerificationScreen` is registered only in `AuthNavigator`. Once authenticated, user is in `MainNavigator` where `Verification` does not exist.

**Impact:** Users can never complete identity verification. Profile stays "Pending verification" forever.

**Fix:** Add `VerificationScreen` to `MainNavigator` (as a modal or stack screen), or solve via BUG-01's navigator restructure.

---

### 🐛 BUG-03 — Priority Sliders Not Interactive on Web
**Severity:** Medium (web only)  
**Screen:** Purpose tab → "What matters most?" section

The 5 priority bars (Deen, Education, Career, Family, Location) render as visual bars only. No `slider` role appears in the accessibility tree. Likely implemented with `PanResponder` or gesture-based touch. Cannot be adjusted on web.

**Impact:** Web users cannot set their match priorities. Values stay at defaults.

**Fix:** Wrap gesture handler with a fallback `<input type="range">` on `Platform.OS === 'web'`, or use `@react-native-community/slider` which has web support.

---

### 🐛 BUG-04 — Sign Out Alert Auto-Dismissed on Web
**Severity:** Low (web only)  
**Screen:** Profile → Sign Out

`ProfileScreen` uses `Alert.alert('Sign out', 'Are you sure?', [...])`. React Native Web maps `Alert.alert` to `window.confirm()`. Playwright (and some browser environments) auto-dismiss `window.confirm()` as cancel. On native devices this works correctly.

**Impact:** Sign out flow untestable in browser automation. On real devices: works fine.

**Fix for web testing:** Replace `Alert.alert` with a custom modal component on web, or use `Platform.OS === 'web' ? window.confirm() : Alert.alert(...)` pattern and handle the result.

---

## Unimplemented Stubs

| # | Location | Element | Expected | Actual |
|---|---|---|---|---|
| ST-01 | Profile → Settings | 🔔 Notifications | Notification prefs screen/modal | No action |
| ST-02 | Profile → Settings | 🛡️ Privacy | Privacy settings screen | No action |
| ST-03 | Profile → Settings | 👤 Wali / Guardian email | Set guardian email (exists in API) | No action |
| ST-04 | Discover header | ✦ AI-scored badge | Explanation of AI matching | Label only |
| ST-05 | Discover header | Avatar circle (T) | Navigate to profile | No action |
| ST-06 | Profile → About Me | Photo/avatar upload | Upload profile photo | Not present |
| ST-07 | Verification screen | Full UI | Document upload, selfie capture | Screen exists but unreachable (see BUG-02) |

> **Note ST-03:** Wali backend API exists (`POST /chat/conversations/:id/wali`). Only the Settings UI entry point is missing.

---

## Navigation Issues

### ⚠️ NAV-01 — Duplicate Screen Name "Discover"
**Console warning:** `Found screens with the same name nested inside one another. Check: Discover, Discover > Discover`

`MainNavigator` has a Tab named `Routes.Discover` containing `DiscoverStack`, which has a Stack.Screen also named `Routes.Discover`. Both use the same constant.

**Fix:** Rename inner stack screen — e.g. `Routes.DiscoverFeed` — or use a different name for the tab wrapper.

### ⚠️ NAV-02 — Onboarding Screens in Wrong Navigator
`PurposeSetupScreen` and `VerificationScreen` exist in `AuthNavigator` only. But `PurposeSetupScreen` is also mounted as a tab in `MainNavigator`. This creates two separate instances with different navigation contexts, causing BUG-01 and BUG-02.

**Fix:** Create a dedicated `OnboardingNavigator` or make the MainNavigator include a Verification screen.

---

## API Health (All Passing ✅)

| Method | Endpoint | Status |
|---|---|---|
| POST | `/auth/register` | 201 |
| GET | `/auth/me` | 200 |
| GET | `/matches/feed` | 200 |
| GET | `/chat/conversations` | 200 |
| GET | `/profile` | 200 |
| PUT | `/profile` | 200 |
| POST | `/profile/purpose` | 201 |
| POST | `/profile/priorities` | 201 |

---

## Screens Tested — Working Correctly

| Screen | Status | Notes |
|---|---|---|
| Splash | ✅ | Logo, tagline, CTA all render |
| Login | ✅ | Form validation, error display work |
| Register Step 1 (Account) | ✅ | Email/password/phone, step dots |
| Register Step 2 (About You) | ✅ | Name/city/gender picker |
| Discover (empty state) | ✅ | Stats bar, "No matches yet" message |
| Messages (empty state) | ✅ | "No conversations yet" message |
| Profile view | ✅ | Completeness ring, priorities, about me |
| Profile edit (About Me) | ✅ | Bio, profession, education save correctly |
| Purpose — text input | ✅ | Free-text entry works |
| Purpose — chips | ✅ | Selection toggles highlight correctly |
| Purpose — Save API | ✅ | Saves to server (201), priorities too |
| Bottom tab navigation | ✅ | All 4 tabs navigate correctly |

---

## Harmless Warnings (Web-Only, Native Not Affected)

| Warning | Cause | Action |
|---|---|---|
| `"shadow*" style props deprecated` | RN Web → use `boxShadow` | Low priority |
| `props.pointerEvents deprecated` | RN Web → use `style.pointerEvents` | Low priority |
| `useNativeDriver not supported` | Web has no native animation module | Low priority |

---

## Priority Fix Order

1. **BUG-01** — Fix onboarding navigation so new users complete PurposeSetup before seeing Discover
2. **BUG-02** — Make VerificationScreen reachable from MainNavigator
3. **ST-03** — Wire Wali email setting (API already exists)
4. **ST-06** — Add profile photo upload
5. **BUG-03** — Add web fallback for priority sliders
6. **NAV-01** — Rename duplicate "Discover" screen
7. **ST-01, ST-02** — Implement Notifications and Privacy settings
