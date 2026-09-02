import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { StarIcon } from "../icons";

const data = [
  {
    quote:
      "Every profile felt intentional. We connected over our mission, not our hobbies — and three months later we signed our nikah.",
    name: "Aisha & Bilal",
    place: "Lahore · Married through Mithaq ♡",
    initials: "AB",
  },
  {
    quote:
      "I was tired of swiping. Mithaq made me think before I matched. The questions alone changed how I see marriage.",
    name: "Yusuf R.",
    place: "Karachi · Engaged through Mithaq ♡",
    initials: "YR",
  },
  {
    quote:
      "The verification process gave my parents peace. The purpose-first matching gave me peace.",
    name: "Hira S.",
    place: "Islamabad · Married through Mithaq ♡",
    initials: "HS",
  },
];

const Testimonials = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % data.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative z-10 py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-display font-light text-[36px] md:text-[52px] tracking-[-0.03em] text-mithaq-ink leading-[1.05]"
        >
          Real covenants,
          <br />
          <span className="font-display-italic font-medium text-gradient-pink">real stories.</span>
        </motion.h2>

        <div className="relative mt-14 h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 glass-strong rounded-[28px] p-8 md:p-12"
            >
              <div className="font-display-italic text-[80px] leading-none text-gradient-pink opacity-40">“</div>
              <p className="-mt-4 font-display-italic font-light text-[19px] md:text-[22px] leading-[1.6] text-mithaq-ink">
                {data[i].quote}
              </p>
              <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mithaq-hot to-mithaq-rose text-white text-[12px] font-bold flex items-center justify-center">
                    {data[i].initials}
                  </div>
                  <div className="leading-tight">
                    <div className="text-[15px] font-bold text-mithaq-ink">{data[i].name}</div>
                    <div className="text-[12px] text-mithaq-soft2">{data[i].place}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, n) => (
                    <StarIcon key={n} className="w-4 h-4" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {data.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Show testimonial ${n + 1}`}
              className={`h-2 rounded-full transition-all ${
                n === i ? "w-8 bg-gradient-pink" : "w-2 bg-mithaq-blush"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
