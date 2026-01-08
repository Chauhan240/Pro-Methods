import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/dynamic-gym-workout-with-dramatic-orange-lighting.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-background/90" />

          <div className="relative z-10 py-16 px-8 sm:py-24 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-balance">
              READY TO START YOUR <span className="text-primary">TRANSFORMATION?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
              Join Pro Methods today and get access to personalized workouts, expert trainers, nutrition planning, and
              progress tracking — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/dashboard/workouts">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
