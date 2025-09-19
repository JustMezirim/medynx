import Header from "@/components/home/Header"
import Footer from "@/components/home/Footer"
import { HeroSection } from "@/components/video-consultation/hero-section"
import { FeaturesSection } from "@/components/video-consultation/features-section"
import { HowItWorksSection } from "@/components/video-consultation/how-it-works-section"
import { TechnologySection } from "@/components/video-consultation/technology-section"
import { CTASection } from "@/components/video-consultation/cta-section"

export default function VideoConsultationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechnologySection />
      <CTASection />
      <Footer />
    </div>
  )
}