import { motion } from "framer-motion";
import { fadeUpLarge } from "../shared/motion";
import type { HowItWorksItem } from "./howItWorksData";

type Props = {
  item: HowItWorksItem;
  index: number;
};

const TimelineNode = ({ accent }: { accent: string }) => (
  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10 w-5 h-5 items-center justify-center">
    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${accent} shadow-pink`} />
    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${accent} opacity-40 blur-md`} />
  </div>
);

const TimelineCard = ({ item }: { item: HowItWorksItem }) => {
  const { Icon, title, body, step, tag, badge, spin, accent } = item;
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative glass-strong rounded-[28px] p-7 md:p-9 overflow-hidden border border-white/60 shadow-pink hover:shadow-pink-lg transition-shadow"
    >
      <div className={`absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br ${accent} opacity-[0.10] blur-2xl`} />

      <div className="relative flex items-start justify-between gap-4 mb-6">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} shadow-pink`}>
          <Icon className={`w-7 h-7 text-white ${spin ? "animate-spin-slow" : ""}`} />
        </div>
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-mithaq-soft2">
          {tag}
        </span>
      </div>

      <div className="relative font-display font-light text-[72px] md:text-[88px] leading-none tracking-[-0.05em] text-gradient-pink opacity-90">
        {step}
      </div>

      <h3 className="relative mt-3 font-display text-[26px] md:text-[28px] font-medium text-mithaq-ink tracking-[-0.02em]">
        {title}
      </h3>
      <p className="relative mt-3 text-[15px] md:text-[16px] leading-[1.7] text-mithaq-mid2">
        {body}
      </p>

      {badge && (
        <div className="relative mt-5 inline-flex items-center gap-2 glass rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-mithaq-mid2 tracking-wide">{badge}</span>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r ${accent} group-hover:w-full transition-all duration-700 ease-out`} />
    </motion.div>
  );
};

const TimelineItem = ({ item, index }: Props) => {
  const isLeft = index % 2 === 0;
  return (
    <motion.li
      variants={fadeUpLarge}
      className="relative md:grid md:grid-cols-2 md:gap-16 items-center"
    >
      <TimelineNode accent={item.accent} />
      <div className={isLeft ? "md:col-start-1" : "md:col-start-2"}>
        <TimelineCard item={item} />
      </div>
    </motion.li>
  );
};

export default TimelineItem;
