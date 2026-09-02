import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { easeOutExpo } from "../shared/motion";

type Props = { to: number; suffix?: string; prefix?: string };

// Animates from 0 → `to` once it scrolls into view.
const Counter = ({ to, suffix = "", prefix = "" }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const rounded = useTransform(
    mv,
    (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`
  );

  useEffect(() => {
    if (inView) animate(mv, to, { duration: 2.2, ease: easeOutExpo });
  }, [inView, mv, to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export default Counter;
