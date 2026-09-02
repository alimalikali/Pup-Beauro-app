import { motion } from "framer-motion";
import { fadeUp } from "../shared/motion";

const HeroHeadline = () => (
  <>
    <motion.h1
      variants={fadeUp}
      className="mt-7 font-display font-light text-mithaq-ink leading-[1.02] tracking-[-0.03em]"
    >
      <span className="block text-[44px] sm:text-[60px] md:text-[68px]">Find your</span>
      <span className="block text-[48px] sm:text-[64px] md:text-[80px] font-display-italic font-medium text-gradient-pink">
        covenant partner
      </span>
      <span className="block text-[36px] sm:text-[48px] md:text-[56px] font-display font-light text-mithaq-mid2">
        not just a match.
      </span>
    </motion.h1>

    <motion.p variants={fadeUp} className="mt-3 font-arabic italic text-[18px] text-mithaq-soft2">
      مِيثَاق — a solemn covenant
    </motion.p>

    <motion.p
      variants={fadeUp}
      className="mt-6 mx-auto max-w-[540px] text-[17px] md:text-[18px] leading-[1.8] text-mithaq-mid2"
    >
      Mithaq matches you on life direction, values, and purpose. For Muslims who take nikah seriously
      — not just a profile, a covenant.
    </motion.p>
  </>
);

export default HeroHeadline;
