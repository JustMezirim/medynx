import Header from "@/components/home/Header"
import Footer from "@/components/home/Footer"
import { HeroSection } from "@/components/contact/hero-section"
import { ContactInfoSection } from "@/components/contact/contact-info-section"
import { ContactFormSection } from "@/components/contact/contact-form-section"
import { FAQSection } from "@/components/contact/faq-section"

export default function ContactPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <HeroSection />
      <ContactInfoSection />
      <ContactFormSection />
      <FAQSection />
      <Footer />
    </div>
  )
}