import { motion } from "framer-motion";
import { fadeUp } from "../shared/motion";
import { heroAvatars } from "./heroData";

const HeroSocialProof = () => (
  <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-3">
    <div className="flex">
      {heroAvatars.map((a, i) => (
        <div
          key={a.i}
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.from} ${a.to} ring-2 ring-white text-white text-[10px] font-bold flex items-center justify-center`}
          style={{ marginLeft: i === 0 ? 0 : -10 }}
        >
          {a.i}
        </div>
      ))}
    </div>
    <p className="text-[13px] text-mithaq-soft2">
      Join <span className="font-semibold text-mithaq-mid2">2,400+</span> Muslims already on Mithaq
    </p>
  </motion.div>
);

export default HeroSocialProof;
