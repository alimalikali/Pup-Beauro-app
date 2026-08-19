import { motion } from "framer-motion";
import HowItWorksHeading from "../how-it-works/HowItWorksHeading";
import TimelineItem from "../how-it-works/TimelineItem";
import { howItWorksItems } from "../how-it-works/howItWorksData";
import SectionFootnote from "../shared/SectionFootnote";

const HowItWorks = () => (
  <section id="how" className="relative z-10 py-28 md:py-36 px-6 overflow-hidden">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-1/3 -left-32 w-[28rem] h-[28rem] rounded-full bg-mithaq-hot/10 blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-[32rem] h-[32rem] rounded-full bg-mithaq-rose/10 blur-3xl" />
    </div>

    <div className="relative mx-auto max-w-6xl">
      <HowItWorksHeading />

      <div className="relative">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-mithaq-hot/30 to-transparent" />
        </div>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.18 }}
          className="space-y-14 md:space-y-24"
        >
          {howItWorksItems.map((item, idx) => (
            <TimelineItem key={item.title} item={item} index={idx} />
          ))}
        </motion.ol>
      </div>

      <div className="mt-16">
        <SectionFootnote>And then — barakah</SectionFootnote>
      </div>
    </div>
  </section>
);

export default HowItWorks;
