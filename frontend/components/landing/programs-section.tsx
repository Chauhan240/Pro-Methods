import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const programs = [
  {
    title: "STRENGTH",
    subtitle: "Build Power",
    image: "/muscular-person-lifting-heavy-weights-in-gym.jpg",
    duration: "12 Weeks",
  },
  {
    title: "HIIT",
    subtitle: "Burn Fat Fast",
    image: "/intense-cardio-workout-with-person-doing-burpees.jpg",
    duration: "8 Weeks",
  },
  {
    title: "FLEXIBILITY",
    subtitle: "Move Better",
    image: "/person-doing-yoga-stretch-in-modern-studio.jpg",
    duration: "6 Weeks",
  },
]

export function ProgramsSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">SPECIALIZED PROGRAMS</h2>
            <p className="text-muted-foreground">Choose your path to transformation</p>
          </div>
          <Button variant="outline" className="mt-4 sm:mt-0 bg-transparent" asChild>
            <Link href="/dashboard/workouts">
              View All Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div key={program.title} className="group relative overflow-hidden rounded-lg aspect-[3/4] cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${program.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-xs text-primary font-medium mb-2">{program.duration}</span>
                <h3 className="text-2xl font-bold">{program.title}</h3>
                <p className="text-muted-foreground">{program.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
