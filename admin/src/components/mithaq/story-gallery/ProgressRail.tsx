import { motion, MotionValue, useTransform } from "framer-motion";
import { stories, STORY_USABLE_PROGRESS } from "./storyData";

type Props = { progress: MotionValue<number> };

// One row of the right-side rail, kept in its own component so we
// can call hooks per-item without violating the rules of hooks.
const RailDot = ({
  progress,
  index,
  tag,
}: {
  progress: MotionValue<number>;
  index: number;
  tag: string;
}) => {
  const slot = STORY_USABLE_PROGRESS / stories.length;
  const active = useTransform(progress, (v) => {
    const idx = Math.min(stories.length - 1, Math.floor(v / slot));
    return idx === index ? 1 : 0;
  });
  const dotScale = useTransform(active, [0, 1], [1, 1.4]);
  const dotOpacity = useTransform(active, [0, 1], [0.35, 1]);

  return (
    <div className="flex items-center gap-3 justify-end">
      <motion.span
        style={{ opacity: dotOpacity }}
        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mithaq-ink"
      >
        {tag}
      </motion.span>
      <motion.span
        style={{ scale: dotScale, opacity: dotOpacity }}
        className="block w-2.5 h-2.5 rounded-full bg-gradient-pink shadow-pink"
      />
    </div>
  );
};

const ProgressRail = ({ progress }: Props) => (
  <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4">
    {stories.map((s, i) => (
      <RailDot key={s.eyebrow} progress={progress} index={i} tag={s.tag} />
    ))}
  </div>
);

export default ProgressRail;
