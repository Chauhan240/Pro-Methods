import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/dark-gym-interior-with-dramatic-lighting-and-fitne.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <span className="text-primary text-sm font-medium">New Programs Available</span>
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="text-balance">TRANSFORM YOUR</span>
          <br />
          <span className="text-primary">BODY & MIND</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
          Elite training programs, expert coaches, and cutting-edge tracking technology to help you achieve results you
          never thought possible.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="#contact">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground mt-1">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground mt-1">Expert Trainers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-primary">98%</div>
            <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
