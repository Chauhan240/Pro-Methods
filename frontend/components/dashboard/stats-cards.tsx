"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Flame, Dumbbell, Clock, Target } from "lucide-react"

const stats = [
  {
    label: "Calories Burned",
    value: "2,847",
    change: "+12%",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "Workouts This Week",
    value: "5",
    change: "+2",
    icon: Dumbbell,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Training Hours",
    value: "8.5",
    change: "+1.5h",
    icon: Clock,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Goals Achieved",
    value: "3/5",
    change: "60%",
    icon: Target,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-emerald-500 font-medium">{stat.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
