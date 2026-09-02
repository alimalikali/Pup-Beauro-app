import { LazyMotion, domAnimation } from "framer-motion";
import {
  Navbar,
  Hero,
  HowItWorks,
  StoryGallery,
  Stats,
  Testimonials,
  CtaBanner,
  Footer,
  ScrollProgress,
  CustomCursor,
  LeavesBackground,
} from "@/components/mithaq";

const Index = () => {
  return (
    <LazyMotion features={domAnimation}>
      <ScrollProgress />
      <CustomCursor />
      <LeavesBackground />
      <Navbar />
      <main className="relative">
        <Hero />
        <HowItWorks />
        <StoryGallery />
        <Stats />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </LazyMotion>
  );
};

export default Index;
