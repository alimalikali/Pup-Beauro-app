---
name: wire-onboarding-gate
description: Modify the onboarding flow in app/ — add/remove an onboarding step, change the gate logic, or adjust when the user transitions to MainNavigator. Use when the user asks to "add onboarding step", "change onboarding flow", "modify signup flow".
allowed-tools: Read, Edit
paths: app/**
---

# Wire onboarding gate

## How the gate works today

`App.tsx` mounts `AppNavigator` which reads two Redux flags:
- `auth.isAuthenticated` — set true after login/register
- `auth.needsOnboarding` — set true on register, flipped false via `completeOnboarding()` after profile publish

The navigator picks based on the combination:

| isAuthenticated | needsOnboarding | Active navigator |
|---|---|---|
| false | — | `AuthNavigator` (Splash → Login → Register) |
| true | true | `OnboardingNavigator` (PurposeSetup → Verification) |
| true | false | `MainNavigator` (bottom tabs) |

The transition happens automatically when the Redux state changes — **never manually call `navigation.reset()` to switch flows**. Flip the state.

## To add an onboarding step

1. Create the screen (use `add-screen-with-slice` skill).
2. Insert it into `OnboardingNavigator` BEFORE the publish step (the one that dispatches `completeOnboarding`).
3. If the new step needs to gate further progression, add a sub-flag to `authSlice` state (`needsExtraStep: boolean`) and extend `AppNavigator`'s decision logic.

## To change when MainNavigator unlocks

Edit `app/src/store/authSlice.ts`. The `completeOnboarding` reducer flips `needsOnboarding: false`. Whoever calls it decides when — currently the final onboarding screen dispatches it after a successful `profileApi.publish()` call.

## Rules

- **Never reset navigation manually** to skip the gate. Always flip Redux state.
- **Don't bypass `needsOnboarding`** for "just this user" cases — handle it via a real profile state, not a hardcoded user check.
- **Order matters** in the OnboardingNavigator stack — the user progresses linearly through registered screens. Insert the new step at the right position.
- **Session restore**: if you add state that needs to survive app restart, persist it via `secureStorage` (token-like) or document that it's intentionally ephemeral. Redux is NOT persisted today.

## Verify

- Register a fresh account — confirm OnboardingNavigator activates
- Walk through every step — confirm the new step appears in the right position
- Complete the flow — confirm MainNavigator activates and bottom tabs are reachable
- Logout (dispatch `logout`) — confirm AuthNavigator activates and onboarding state is reset on next register
