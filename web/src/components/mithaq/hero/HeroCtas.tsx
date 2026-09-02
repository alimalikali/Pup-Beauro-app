import { motion } from "framer-motion";
import { ArrowRight } from "../icons";
import { fadeUp } from "../shared/motion";
import { Link } from "react-router-dom";

const HeroCtas = () => (
  <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -3,
        boxShadow: "0 18px 48px hsla(345, 87%, 51%, 0.45)",
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="bg-gradient-pink text-white font-bold text-[16px] rounded-2xl px-9 py-4 shadow-pink-lg inline-flex items-center gap-2"
    ><Link to="/register" className="inline-flex items-center gap-2">Begin Your Covenant<ArrowRight className="w-4 h-4" /></Link></motion.div>

    <motion.a
      href="#how"
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="glass border-[1.5px] border-mithaq-hot/25 text-mithaq-hot font-semibold text-[16px] rounded-2xl px-7 py-4 inline-flex items-center gap-2"
    >
      See how it works ↓
    </motion.a>
  </motion.div>
);

export default HeroCtas;
