import { Button } from "@/components/ui/button"
import { Star, ArrowRight } from "lucide-react"
import Link from "next/link"

const trainers = [
  {
    name: "Marcus Johnson",
    specialty: "Strength & Conditioning",
    rating: 4.9,
    sessions: 850,
    image: "/professional-male-fitness-trainer-portrait-dark-ba.jpg",
  },
  {
    name: "Sarah Chen",
    specialty: "HIIT & Cardio",
    rating: 4.8,
    sessions: 720,
    image: "/professional-female-fitness-trainer-portrait-dark-.jpg",
  },
  {
    name: "David Williams",
    specialty: "Bodybuilding",
    rating: 4.9,
    sessions: 1200,
    image: "/professional-male-bodybuilding-trainer-portrait-da.jpg",
  },
  {
    name: "Elena Rodriguez",
    specialty: "Yoga & Flexibility",
    rating: 5.0,
    sessions: 650,
    image: "/professional-female-yoga-instructor-portrait-dark-.jpg",
  },
]

export function TrainersSection() {
  return (
    <section id="trainers" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              MEET OUR <span className="text-primary">TRAINERS</span>
            </h2>
            <p className="text-muted-foreground">Expert guidance to reach your full potential</p>
          </div>
          <Button variant="outline" className="mt-4 sm:mt-0 bg-transparent" asChild>
            <Link href="/dashboard/trainers">
              View Full Roster
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer) => (
            <div
              key={trainer.name}
              className="group bg-background rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${trainer.image}')` }}
                />
              </div>
              <div className="p-4">
                <span className="text-xs text-primary font-medium">{trainer.specialty}</span>
                <h3 className="text-lg font-semibold mt-1">{trainer.name}</h3>
                <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{trainer.rating}</span>
                  </div>
                  <span>{trainer.sessions} sessions</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
