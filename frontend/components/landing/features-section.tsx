import { Dumbbell, Users, TrendingUp, Calendar, Utensils, Target } from "lucide-react"

const features = [
  {
    icon: Dumbbell,
    title: "Workout Tracking",
    description:
      "Log every rep, set, and exercise with our intuitive tracking system. Monitor your progress in real-time.",
  },
  {
    icon: Users,
    title: "Expert Trainers",
    description: "Book sessions with certified trainers who specialize in your fitness goals.",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Visualize your journey with detailed charts and insights on your performance over time.",
  },
  {
    icon: Calendar,
    title: "Session Scheduling",
    description: "Easily manage your trainer sessions and workout schedule in one place.",
  },
  {
    icon: Utensils,
    title: "Nutrition Planning",
    description: "Personalized meal plans and macro tracking to fuel your workouts and recovery.",
  },
  {
    icon: Target,
    title: "Specialized Programs",
    description: "Choose from strength, cardio, HIIT, yoga, and more tailored to your needs.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            EVERYTHING YOU NEED TO <span className="text-primary">SUCCEED</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform gives you all the tools to track, improve, and achieve your fitness goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-lg bg-background border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
