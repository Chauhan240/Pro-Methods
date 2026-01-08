import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ProgramsSection } from "@/components/landing/programs-section"
import { TrainersSection } from "@/components/landing/trainers-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

import { ContactForm } from "@/components/landing/contact-form"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ProgramsSection />
      <TrainersSection />
      <CTASection />
      <ContactForm />
      <Footer />
    </main>
  )
}
