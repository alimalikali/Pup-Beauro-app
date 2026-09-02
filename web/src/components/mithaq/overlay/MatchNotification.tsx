import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const Card = ({ accepted, onAction }: { accepted: boolean; onAction: (a: "accept" | "decline") => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: -10 }}
    animate={accepted ? { scale: [1, 1.06, 0.9], opacity: [1, 1, 0] } : { opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.35 } }}
    transition={{ duration: 0.5 }}
    className="glass-strong relative w-[260px] rounded-3xl p-4 shadow-pink-lg overflow-hidden"
  >
    <motion.div
      initial={{ width: "100%" }}
      animate={{ width: "0%" }}
      transition={{ duration: 8, ease: "linear" }}
      className="absolute top-0 left-0 h-1 bg-gradient-pink"
    />

    <div className="flex items-center gap-3 pt-2">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mithaq-hot to-mithaq-rose flex items-center justify-center text-white text-[13px] font-bold">
        FK
      </div>
      <div className="leading-tight">
        <div className="text-[14px] font-bold text-mithaq-ink">Fatima K.</div>
        <div className="text-[11px] text-mithaq-mid2">Lahore · 26</div>
      </div>
    </div>

    <div className="my-3 h-px bg-gradient-to-r from-transparent via-mithaq-blush to-transparent" />

    <div className="text-center text-[13px] font-semibold text-gradient-pink">94% purpose match</div>
    <div className="mt-2 h-1.5 w-full rounded-full bg-mithaq-light overflow-hidden">
      <div className="h-full w-[94%] bg-gradient-pink rounded-full" />
    </div>

    <div className="mt-4 flex gap-2">
      <button
        onClick={() => onAction("accept")}
        className="flex-1 bg-gradient-pink text-white text-[12px] font-bold rounded-xl py-2 shadow-pink"
      >
        Accept
      </button>
      <button
        onClick={() => onAction("decline")}
        className="flex-1 glass text-mithaq-mid2 text-[12px] font-semibold rounded-xl py-2"
      >
        Decline
      </button>
    </div>

    {accepted && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-emerald-300/30 rounded-3xl"
      />
    )}
  </motion.div>
);

const MatchNotification = () => {
  const [visible, setVisible] = useState(true);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (accepted) {
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
  }, [accepted]);

  return (
    <motion.div
      initial={{ x: 140, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 180, damping: 22 }}
      className="hidden lg:block absolute top-24 -right-2 xl:right-10"
    >
      <div className="relative">
        <AnimatePresence>
          {visible && (
            <motion.div
              key="stack"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.35 } }}
              className="absolute top-5 left-2 scale-[0.92] -z-10"
            >
              <div className="glass w-[260px] h-[200px] rounded-3xl shadow-pink" />
            </motion.div>
          )}

          {visible && (
            <Card
              key="card"
              accepted={accepted}
              onAction={(a) => (a === "accept" ? setAccepted(true) : setVisible(false))}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MatchNotification;
