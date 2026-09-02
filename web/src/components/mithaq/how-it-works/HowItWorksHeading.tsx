import { motion } from "framer-motion";
import { SparkleIcon } from "../icons";
import SectionEyebrow from "../shared/SectionEyebrow";
import { easeOutQuint } from "../shared/motion";

const HowItWorksHeading = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, ease: easeOutQuint }}
    className="text-center mb-20 md:mb-28"
  >
    <SectionEyebrow ornament={<SparkleIcon className="w-3 h-3" />}>
      The Mithaq way
    </SectionEyebrow>
    <h2 className="mt-5 font-display font-light text-[44px] md:text-[64px] leading-[1.0] tracking-[-0.035em] text-mithaq-ink">
      Your path to barakah
      <br />
      <span className="font-display-italic font-medium text-gradient-pink">starts here.</span>
    </h2>
    <p className="mt-6 mx-auto max-w-[520px] text-[17px] text-mithaq-mid2 leading-relaxed">
      Four intentional steps designed to surface real compatibility — not endless scrolling.
    </p>
  </motion.div>
);

export default HowItWorksHeading;
