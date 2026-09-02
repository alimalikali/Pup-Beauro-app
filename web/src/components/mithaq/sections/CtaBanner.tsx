import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";
import { ArrowRight } from "../icons";
import { Link } from "react-router-dom";

const CtaBanner = () => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 15 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative z-10 py-28 px-6">
      <div className="mx-auto max-w-4xl" style={{ perspective: 1200 }}>
        <motion.div
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="glass-strong rounded-[40px] px-8 py-16 md:px-16 md:py-20 text-center relative overflow-hidden shadow-pink-lg"
        >
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none animate-spin-slow"
          >
            <span
              className="font-arabic font-bold select-none"
              style={{ fontSize: 240, color: "hsla(345, 87%, 51%, 0.05)" }}
            >
              مِيثَاق
            </span>
          </div>

          <div className="relative">
            <h2 className="font-display font-light text-[40px] md:text-[58px] tracking-[-0.03em] leading-[1.02] text-gradient-pink">
              Begin your <span className="font-display-italic font-medium">covenant</span> today.
            </h2>
            <p className="mt-5 mx-auto max-w-[540px] text-[17px] md:text-[18px] text-mithaq-mid2 leading-relaxed">
              Join thousands of Muslims finding purposeful, halal connections built on mutual direction.
            </p>

            <motion.div
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 22px 60px hsla(345, 87%, 51%, 0.5)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="mt-10 bg-gradient-pink text-white font-bold text-[18px] rounded-2xl px-12 py-5 shadow-pink-lg inline-flex items-center gap-2"
            ><Link to="/register" className="inline-flex items-center gap-2">Begin Your Covenant<ArrowRight className="w-5 h-5" /></Link></motion.div>

            <p className="mt-5 text-[13px] text-mithaq-soft2">
              Free to join · No credit card · Verified within 24 hours
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaBanner;
