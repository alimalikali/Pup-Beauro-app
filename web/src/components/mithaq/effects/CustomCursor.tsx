import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("button, a, [role='button']"));
    };
    window.addEventListener("mousemove", onMove);
    let raf = 0;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[300] hidden md:block rounded-full transition-[width,height,opacity] duration-200 mix-blend-multiply"
      style={{
        width: hovering ? 40 : 12,
        height: hovering ? 40 : 12,
        background: "linear-gradient(135deg, hsl(var(--pink-hot)), hsl(var(--pink-rose)))",
        opacity: hovering ? 0.3 : 0.7,
      }}
    />
  );
};

export default CustomCursor;
