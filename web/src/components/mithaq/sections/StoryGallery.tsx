import { useScroll } from "framer-motion";
import { useRef } from "react";
import StoryCard from "../story-gallery/StoryCard";
import ProgressRail from "../story-gallery/ProgressRail";
import StoryGalleryHeading from "../story-gallery/StoryGalleryHeading";
import { stories } from "../story-gallery/storyData";

const StoryGallery = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      id="stories"
      className="relative z-10"
      style={{ height: `${stories.length * 160 + 60}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <StoryGalleryHeading />

        <div className="relative flex-1">
          {stories.map((s, i) => (
            <StoryCard
              key={s.eyebrow}
              story={s}
              index={i}
              total={stories.length}
              progress={scrollYProgress}
            />
          ))}
          <ProgressRail progress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
};

export default StoryGallery;
