import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { AboutSection } from "@/components/landing/about-section"
import { ProgramsSection } from "@/components/landing/programs-section"
import { TrainersSection } from "@/components/landing/trainers-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

import { ContactForm } from "@/components/landing/contact-form"

import { TestimonialsSection } from "@/components/landing/testimonials-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ProgramsSection />
      <TrainersSection />
      <CTASection />
      <ContactForm />
      <Footer />
    </main>
  )
}
