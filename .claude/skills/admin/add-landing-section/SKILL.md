---
name: add-landing-section
description: Add a new full-width landing page section to admin/src/components/mithaq/ — wrapped <section>, Framer Motion variants, separated *.data.ts file. Use when the user asks to "add landing section", "new hero block", "extend marketing page".
argument-hint: [section-name]
allowed-tools: Read, Write, Edit
paths: admin/**
---

# Add landing section: $ARGUMENTS

## 1. Section component

Create `admin/src/components/mithaq/$ARGUMENTS.tsx`:

```tsx
import { motion } from 'framer-motion';
import { fadeUp, stagger } from './shared/motion';
import { $ARGUMENTSData } from './$ARGUMENTS.data';

export function $ARGUMENTS() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-4xl md:text-5xl text-mithaq-ink"
          >
            {$ARGUMENTSData.headline}
          </motion.h2>

          {/* content */}
        </motion.div>
      </div>
    </section>
  );
}
```

## 2. Data file (separate)

Create `admin/src/components/mithaq/$ARGUMENTS.data.ts`. Static content lives here, JSX stays clean:

```ts
export const $ARGUMENTSData = {
  headline: '...',
  items: [
    { id: 1, title: '...', body: '...' },
    // ...
  ],
};
```

## 3. Mount in the page

Edit `admin/src/pages/Index.tsx`. Add `<$ARGUMENTS />` in narrative order between the existing sections.

## Rules

- **Section wrapper**: `<section className="py-24 md:py-32">` + inner container `mx-auto max-w-7xl px-6`
- **Motion variants**: reuse `fadeUp`, `stagger` from `mithaq/shared/motion.ts`. Don't define one-off variants inline.
- **whileInView + viewport once**: `viewport={{ once: true, amount: 0.3 }}` — animations should NOT re-trigger on scroll-by
- **Mithaq palette**: text color `text-mithaq-ink`, accent `text-mithaq-hot`, etc. Never raw hex.
- **Typography**: `font-display` for headlines (Fraunces), `font-sans` (default Inter) for body, `font-arabic` for Urdu/Arabic strings
- **Data separation**: every static string/list lives in `<Section>.data.ts`. No large inline literals in JSX.
- **Custom utilities**: `.glass`, `.glass-strong`, `.text-gradient-pink`, `.bg-gradient-pink`, `.shadow-pink` are defined in `index.css` — reuse, don't redefine

## Verify

- Open `http://localhost:8080` — section appears in the right position
- Scroll past it — animation triggers once and stays
- Resize to mobile width — layout responds (test `sm` and `md` breakpoints)
- Check Arabic font if section has Urdu text — should render with Noto Naskh, not fall back to system
