import { Navbar } from "@/components/landing/navbar"
import { EmotiveHero } from "@/components/landing/emotive-hero"
import { PurposeManifesto } from "@/components/landing/purpose-manifesto"
// Update the import to use the default export if needed
import HowItWorks from "@/components/landing/how-it-works"
import { ValuesGrid } from "@/components/landing/values-grid"
import { JourneyTimeline } from "@/components/landing/journey-timeline"
import { VideoTestimonials } from "@/components/landing/video-testimonials"
import { LogoCarousel } from "@/components/landing/logo-carousel"
import { MasonryGallery } from "@/components/landing/masonry-gallery"
import { MatchmakingVisualizer } from "@/components/landing/matchmaking-visualizer"
import { SplitTestimonials } from "@/components/landing/split-testimonials"
import { FaqAccordion } from "@/components/landing/faq-accordion"
import { GlassmorphicCTA } from "@/components/landing/glassmorphic-cta"
import { PricingPlans } from "@/components/landing/pricing-plans"
import { EnhancedFooter } from "@/components/landing/enhanced-footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
        <EmotiveHero />
        <PurposeManifesto />
        <HowItWorks />
        <ValuesGrid />
        <JourneyTimeline />
        <VideoTestimonials />
        <LogoCarousel />
        <MasonryGallery />
        <MatchmakingVisualizer />
        <SplitTestimonials />
        <FaqAccordion />
        <GlassmorphicCTA />
        <PricingPlans />
        <EnhancedFooter />
    </main>
  )
}
