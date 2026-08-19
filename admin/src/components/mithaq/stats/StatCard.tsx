import { motion } from "framer-motion";
import Counter from "./Counter";
import type { Stat } from "./statsData";
import { easeOutExpo } from "../shared/motion";

type Props = { stat: Stat; index: number };

const StatCard = ({ stat, index }: Props) => {
  const Icon = stat.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: easeOutExpo }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl glass-strong border border-white/60 p-7 md:p-8 shadow-pink transition-shadow hover:shadow-pink-lg"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${stat.accent} opacity-[0.08] blur-2xl`} />

      <div className={`relative inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.accent} shadow-pink mb-6`}>
        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
      </div>

      <div className="relative font-display font-medium leading-none tracking-[-0.04em] text-[56px] md:text-[68px] text-gradient-pink">
        <Counter to={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
      </div>

      <div className="relative mt-4 text-[15px] md:text-[16px] font-semibold text-mithaq-ink">
        {stat.label}
      </div>
      <p className="relative mt-1.5 text-[13px] md:text-[14px] leading-relaxed text-mithaq-mid2">
        {stat.sub}
      </p>

      <div className={`absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r ${stat.accent} group-hover:w-full transition-all duration-700 ease-out`} />
    </motion.article>
  );
};

export default StatCard;
