import type { SVGProps } from "react";

export const CrescentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <defs>
      <linearGradient id="cres" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="hsl(var(--pink-hot))" />
        <stop offset="1" stopColor="hsl(var(--pink-rose))" />
      </linearGradient>
    </defs>
    <path
      d="M32 8a16 16 0 100 32 13 13 0 010-32 12 12 0 011.5.1A16 16 0 0032 8z"
      fill="url(#cres)"
    />
  </svg>
);

export const ScalesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="url(#sc)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <defs>
      <linearGradient id="sc" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="hsl(var(--pink-hot))" />
        <stop offset="1" stopColor="hsl(var(--pink-rose))" />
      </linearGradient>
    </defs>
    <path d="M24 8v32M10 40h28M10 18h28" />
    <path d="M10 18l-6 10a6 6 0 0012 0l-6-10zM38 18l-6 10a6 6 0 0012 0l-6-10z" fill="hsl(var(--pink-blush))" />
  </svg>
);

export const ShieldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <defs>
      <linearGradient id="sh" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="hsl(var(--pink-hot))" />
        <stop offset="1" stopColor="hsl(var(--pink-rose))" />
      </linearGradient>
    </defs>
    <path d="M24 4l16 6v12c0 10-7 18-16 22-9-4-16-12-16-22V10l16-6z" fill="url(#sh)" opacity="0.95" />
    <path d="M16 24l6 6 11-12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const RingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <defs>
      <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="hsl(var(--pink-hot))" />
        <stop offset="1" stopColor="hsl(var(--pink-rose))" />
      </linearGradient>
    </defs>
    <circle cx="18" cy="26" r="11" stroke="url(#rg)" strokeWidth="3" fill="none" />
    <circle cx="30" cy="26" r="11" stroke="hsl(var(--pink-soft))" strokeWidth="3" fill="none" />
  </svg>
);

export const SparkleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
  </svg>
);

export const StarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="url(#st)" {...props}>
    <defs>
      <linearGradient id="st" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="hsl(var(--pink-hot))" />
        <stop offset="1" stopColor="hsl(var(--pink-rose))" />
      </linearGradient>
    </defs>
    <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
  </svg>
);

export const ArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);
