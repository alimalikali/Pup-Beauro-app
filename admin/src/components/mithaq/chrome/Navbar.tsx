import { motion, useScroll, useTransform } from "framer-motion";
import { CrescentIcon } from "../icons";

const Navbar = () => {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0.55, 0.85]);
  const blur = useTransform(scrollY, [0, 80], [16, 28]);

  return (
    <motion.nav
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `hsla(0, 0%, 100%, ${v})`),
        backdropFilter: useTransform(blur, (v) => `blur(${v}px) saturate(180%)`),
      }}
      className="fixed top-0 inset-x-0 z-[100] h-[68px] border-b border-white/60"
    >
      <div className="mx-auto h-full max-w-7xl flex items-center justify-between px-6 md:px-12">
        <a href="#" className="flex items-center gap-2.5">
          <CrescentIcon className="w-7 h-7" />
          <div className="leading-none">
            <div className="text-[22px] font-extrabold text-mithaq-ink tracking-tight">Mithaq</div>
            <div className="font-arabic text-[13px] text-mithaq-hot mt-0.5">مِيثَاق</div>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-mithaq-mid2">
          {["How it Works", "Features", "Our Promise", "Sign In"].map((l) => (
            <a key={l} href="#" className="relative group transition-colors hover:text-mithaq-hot">
              {l}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-mithaq-hot transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex glass rounded-full px-3 py-1.5 text-[12px] font-medium text-mithaq-mid2 hover:text-mithaq-hot transition-colors">
            EN <span className="opacity-40 mx-1">|</span> <span className="font-arabic">اردو</span>
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="bg-gradient-pink text-white text-[14px] font-bold rounded-xl px-5 py-2.5 shadow-pink"
          >
            Join Mithaq
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
