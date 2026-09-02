import { motion, useTransform, MotionValue } from "framer-motion";
import { Story, STORY_USABLE_PROGRESS, storyTagStyles } from "./storyData";

type Props = {
  story: Story;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

const StoryCard = ({ story, index, total, progress }: Props) => {
  const slot = STORY_USABLE_PROGRESS / total;
  const start = index * slot;
  const end = (index + 1) * slot;
  const fadeIn = start + slot * 0.18;
  // Last card stays visible until the very end of the usable range.
  const fadeOut = index === total - 1 ? end : end - slot * 0.18;

  const opacity = useTransform(progress, [start, fadeIn, fadeOut, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, fadeIn, fadeOut, end], [60, 0, 0, -60]);
  const scale = useTransform(progress, [start, fadeIn, fadeOut, end], [0.94, 1, 1, 0.96]);
  const imgY = useTransform(progress, [start, end], [30, -30]);

  return (
    <motion.article
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex items-center justify-center px-4"
    >
      <div className="glass-strong rounded-[32px] shadow-pink-lg overflow-hidden grid grid-cols-1 md:grid-cols-[1.1fr_1fr] w-full max-w-5xl max-h-[78vh]">
        <div className="relative overflow-hidden bg-mithaq-blush/40 min-h-[260px] md:min-h-[520px]">
          <motion.img
            src={story.image}
            alt={story.alt}
            loading="lazy"
            width={1024}
            height={1280}
            style={{ y: imgY }}
            className="absolute inset-0 h-[110%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mithaq-hot/20 via-transparent to-transparent" />
          <span
            className={`absolute top-5 left-5 ${storyTagStyles[story.tag]} backdrop-blur-md rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em]`}
          >
            {story.tag}
          </span>
        </div>

        <div className="relative p-8 md:p-12 flex flex-col justify-center">
          <span className="font-display-italic absolute top-5 right-6 text-[14px] font-light text-mithaq-soft2">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-mithaq-hot mb-4">
            {story.eyebrow}
          </div>

          {story.arabic && (
            <div className="font-arabic text-[28px] md:text-[34px] text-mithaq-hot/80 mb-3 leading-none">
              {story.arabic}
            </div>
          )}

          <h3 className="font-display font-light text-[26px] md:text-[34px] leading-[1.1] tracking-[-0.02em] text-mithaq-ink">
            {story.title}
          </h3>

          <p className="mt-5 text-[15px] md:text-[16px] leading-[1.75] text-mithaq-mid2">
            {story.body}
          </p>

          {story.caption && (
            <p className="mt-6 text-[12px] uppercase tracking-[0.14em] font-semibold text-mithaq-soft2">
              {story.caption}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default StoryCard;
