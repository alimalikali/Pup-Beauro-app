# Mithaq Components

Modular landing-page architecture for the Mithaq marriage platform. Every section is split into small, focused pieces and grouped by feature.

## Folder Structure

```
src/components/mithaq/
├── index.ts                  # Barrel — single import surface
├── icons.tsx                 # Shared SVG icons (Crescent, Scales, Shield, Rings, Star, ArrowRight…)
│
├── sections/                 # High-level page sections (composed from feature folders)
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── StoryGallery.tsx
│   ├── Stats.tsx
│   ├── Testimonials.tsx
│   └── CtaBanner.tsx
│
├── chrome/                   # Site frame
│   ├── Navbar.tsx
│   └── Footer.tsx
│
├── hero/                     # Hero sub-components + data
│   ├── HeroEyebrow.tsx
│   ├── HeroHeadline.tsx
│   ├── HeroCtas.tsx
│   ├── HeroSocialProof.tsx
│   └── heroData.ts
│
├── how-it-works/
│   ├── HowItWorksHeading.tsx
│   ├── TimelineItem.tsx
│   └── howItWorksData.ts
│
├── story-gallery/
│   ├── StoryGalleryHeading.tsx
│   ├── StoryCard.tsx
│   ├── ProgressRail.tsx
│   └── storyData.ts
│
├── stats/
│   ├── StatsHeading.tsx
│   ├── StatCard.tsx
│   ├── Counter.tsx
│   └── statsData.ts
│
├── shared/                   # Cross-section primitives
│   ├── SectionEyebrow.tsx
│   ├── SectionFootnote.tsx
│   └── motion.ts             # Framer Motion variants + easings
│
├── background/               # Decorative layers behind everything
│   ├── LeavesBackground.tsx
│   ├── MeshBackground.tsx
│   └── ThreeHero.tsx
│
├── effects/                  # Global UI effects
│   ├── ScrollProgress.tsx
│   └── CustomCursor.tsx
│
└── overlay/                  # Floating UI on top of sections
    └── MatchNotification.tsx
```

## Naming Conventions

- **Components**: `PascalCase.tsx`, one component per file, default export.
- **Data files**: `<feature>Data.ts`, named exports only. Types co-located (`Story`, `Stat`, `HowItWorksItem`).
- **Sub-components**: prefixed with the feature name (e.g. `HeroEyebrow`, `StatCard`) so they're greppable.
- **Folders**: `kebab-case` (`how-it-works`, `story-gallery`).
- **Shared utilities**: live in `shared/` and use camelCase filenames (e.g. `motion.ts`).

## Where Things Live

| Section        | Section file                   | Sub-components folder | Data file                          |
| -------------- | ------------------------------ | --------------------- | ---------------------------------- |
| Hero           | `sections/Hero.tsx`            | `hero/`               | `hero/heroData.ts`                 |
| How It Works   | `sections/HowItWorks.tsx`      | `how-it-works/`       | `how-it-works/howItWorksData.ts`   |
| Story Gallery  | `sections/StoryGallery.tsx`    | `story-gallery/`      | `story-gallery/storyData.ts`       |
| Stats          | `sections/Stats.tsx`           | `stats/`              | `stats/statsData.ts`               |
| Testimonials   | `sections/Testimonials.tsx`    | — (inline data)       | inline                             |
| CTA Banner     | `sections/CtaBanner.tsx`       | — (single file)       | —                                  |

## Import Pattern

Always import through the barrel:

```ts
import { Hero, HowItWorks, StoryGallery, Stats, Navbar, Footer } from "@/components/mithaq";
```

Internal cross-folder imports use relative paths (`../shared/motion`, `../hero/heroData`).

## Adding a New Section

1. Create a feature folder: `src/components/mithaq/<feature>/`.
2. Add sub-components (`<Feature>Heading.tsx`, etc.) and `<feature>Data.ts`.
3. Compose them in `sections/<Feature>.tsx`.
4. Export from `index.ts`.
5. Drop into `src/pages/Index.tsx`.

## Shared Motion

Reuse the presets in `shared/motion.ts` (`fadeUp`, `fadeUpLarge`, `stagger`, `easeOutQuint`, `easeOutExpo`) so animation timing stays consistent across sections.
