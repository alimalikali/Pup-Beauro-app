import { motion } from "framer-motion";
import MatchNotification from "../overlay/MatchNotification";
import HeroEyebrow from "../hero/HeroEyebrow";
import HeroHeadline from "../hero/HeroHeadline";
import HeroCtas from "../hero/HeroCtas";
import HeroSocialProof from "../hero/HeroSocialProof";
import { stagger } from "../shared/motion";

const Hero = () => (
  <section className="relative z-10 pt-[140px] pb-24 px-6">
    <div className="mx-auto max-w-7xl relative">
      <MatchNotification />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-[760px] text-center"
      >
        <HeroEyebrow />
        <HeroHeadline />
        <HeroCtas />
        <HeroSocialProof />
      </motion.div>
    </div>
  </section>
);

export default Hero;
