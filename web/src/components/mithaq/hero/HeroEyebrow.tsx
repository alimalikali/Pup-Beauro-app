import { motion } from "framer-motion";
import { SparkleIcon } from "../icons";
import { fadeUp } from "../shared/motion";

const HeroEyebrow = () => (
  <motion.div
    variants={fadeUp}
    className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 border border-mithaq-hot/20"
  >
    <motion.span
      animate={{ y: [0, -3, 0], rotate: [0, 10, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="text-mithaq-hot"
    >
      <SparkleIcon className="w-3.5 h-3.5" />
    </motion.span>
    <span className="text-[12px] font-semibold tracking-[0.08em] text-mithaq-hot">
      VERIFIED · PURPOSE-DRIVEN · HALAL
    </span>
  </motion.div>
);

export default HeroEyebrow;
