export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
} as const;

export const Radius = {
  sm: 10, md: 16, lg: 20, xl: 24, full: 999,
} as const;

export const FontSize = {
  xs: 10, sm: 11, md: 12, body: 13, base: 14, lg: 15, xl: 16,
  h3: 18, h2: 22, h1: 28, hero: 38,
} as const;

export const Shadow = {
  card: {
    shadowColor: '#f0134d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  button: {
    shadowColor: '#f0134d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;
