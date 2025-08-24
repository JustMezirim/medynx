"use client"

import Header from "./home/Header"
import HeroSection from "./home/HeroSection"
import FeaturesSection from "./home/FeaturesSection"
import HowItWorksSection from "./home/HowItWorksSection"
import ServicesSection from "./home/ServicesSection"
import TestimonialsSection from "./home/TestimonialsSection"
import StatsSection from "./home/StatsSection"
import CTASection from "./home/CTASection"
import Footer from "./home/Footer"

const EnhancedHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ServicesSection />
      <TestimonialsSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default EnhancedHomePage