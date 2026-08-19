import { useEffect, useRef } from "react";

/**
 * LeavesBackground — full-screen 2D canvas of pink/rose botanical leaves
 * drifting downward with gentle sway and slow rotation.
 */
const PALETTE = [
  "#f472b6",
  "#ec4899",
  "#fbb6ce",
  "#fbcfe8",
  "#f9a8d4",
  "#be185d",
  "#fde8f0",
];

type Leaf = {
  x: number;
  y: number;
  length: number;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  color: string;
  vein: string;
  opacity: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// darken hex by mixing toward black
const darken = (hex: string, amt = 0.35) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const dr = Math.round(r * (1 - amt));
  const dg = Math.round(g * (1 - amt));
  const db = Math.round(b * (1 - amt));
  return `rgb(${dr}, ${dg}, ${db})`;
};

const makeLeaf = (width: number, height: number, atTop = false): Leaf => {
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const length = rand(10, 28);
  return {
    x: rand(0, width),
    y: atTop ? rand(-height * 0.4, -10) : rand(-height, height),
    length,
    rotation: rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.4, 0.4),
    fallSpeed: rand(12, 42),
    swayAmp: rand(8, 28),
    swayFreq: rand(0.4, 1.2),
    swayPhase: rand(0, Math.PI * 2),
    color,
    vein: darken(color, 0.4),
    opacity: rand(0.25, 0.65),
  };
};

const LeavesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const count = width < 768 ? 20 : 45;
    const leaves: Leaf[] = Array.from({ length: count }, () =>
      makeLeaf(width, height)
    );

    const onResize = () => setSize();
    window.addEventListener("resize", onResize);

    let raf = 0;
    let last = performance.now();

    const drawLeaf = (l: Leaf) => {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rotation);
      ctx.globalAlpha = l.opacity;

      const len = l.length;
      const w = len * 0.4;

      // botanical leaf: two bezier curves meeting at pointed tips
      ctx.beginPath();
      ctx.moveTo(0, -len / 2);
      ctx.bezierCurveTo(w, -len / 4, w, len / 4, 0, len / 2);
      ctx.bezierCurveTo(-w, len / 4, -w, -len / 4, 0, -len / 2);
      ctx.closePath();
      ctx.fillStyle = l.color;
      ctx.fill();

      // center vein
      ctx.globalAlpha = l.opacity * 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -len / 2);
      ctx.lineTo(0, len / 2);
      ctx.strokeStyle = l.vein;
      ctx.lineWidth = Math.max(0.5, len * 0.04);
      ctx.stroke();

      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);

      for (const l of leaves) {
        l.y += l.fallSpeed * dt;
        l.x += Math.sin(t * l.swayFreq + l.swayPhase) * l.swayAmp * dt;
        l.rotation += l.rotationSpeed * dt;

        if (l.y - l.length > height) {
          // recycle to top
          const fresh = makeLeaf(width, height, true);
          Object.assign(l, fresh);
        }
        if (l.x < -40) l.x = width + 20;
        if (l.x > width + 40) l.x = -20;

        drawLeaf(l);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* Soft pink/blush gradient base underneath the leaves */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--pink-cream)) 0%, hsl(var(--pink-light)) 50%, hsl(var(--pink-blush)) 100%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default LeavesBackground;
