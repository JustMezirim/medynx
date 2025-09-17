import Header from "@/components/home/Header"
import Footer from "@/components/home/Footer"
import { HeroSection } from "@/components/about/hero-section"
import { MissionSection } from "@/components/about/mission-section"
import { ValuesSection } from "@/components/about/values-section"
import { FeaturesSection } from "@/components/about/features-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}