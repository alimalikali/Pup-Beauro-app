---
name: extend-theme
description: Add a new color, spacing, radius, shadow, gradient, or shared component to the mobile theme constants in app/src/constants/ and components/. Use when the user asks to "add color", "new gradient", "extend theme", "new shared component" in the mobile app.
argument-hint: [token-type] [token-name]
allowed-tools: Read, Edit, Write
paths: app/**
---

# Extend mobile theme: $ARGUMENTS

## Where each token type lives

| Token | File |
|-------|------|
| Spacing values | `app/src/constants/theme.ts` → `Spacing` |
| Border radius | `app/src/constants/theme.ts` → `Radius` |
| Font sizes | `app/src/constants/theme.ts` → `FontSize` |
| Shadows | `app/src/constants/theme.ts` → `Shadows` |
| Colors | `app/src/constants/theme.ts` → `Colors` (or sibling `colors.ts`) |
| Gradients | `app/src/constants/gradients.ts` |
| Shared component | `app/src/components/<Name>.tsx` |

## Rules

- **Add to constants, then consume** — never inline magic numbers in `StyleSheet.create` for any of the above
- **Naming**: PascalCase for top-level objects (`Spacing`), camelCase for keys (`Spacing.xs`, `Spacing.md`)
- **Don't break existing keys** — additive only. Renaming a token cascades through every screen.
- **Gradients**: arrays of color strings, consumed by `expo-linear-gradient`
- **Shared components**: prop API matching existing primitives like `GlassCard`, `GradientButton`, `AvatarCircle`. Export named, not default, for tree-shaking.

## Component example

```tsx
// app/src/components/$ARGUMENTS[1].tsx
import { View, ViewProps } from 'react-native';
import { Radius, Spacing, Colors } from '@/constants/theme';

interface Props extends ViewProps {
  intent?: 'primary' | 'secondary';
}

export function $ARGUMENTS[1]({ intent = 'primary', style, ...rest }: Props) {
  return (
    <View
      style={[
        {
          borderRadius: Radius.md,
          padding: Spacing.md,
          backgroundColor: intent === 'primary' ? Colors.primary : Colors.surface,
        },
        style,
      ]}
      {...rest}
    />
  );
}
```

## Verify

- Reload the app — any screen using the existing token must still render correctly (regression check)
- Try the new token in one screen — confirm it appears as expected
- Run `cd app && pnpm exec tsc --noEmit` — no type errors from the constants module
