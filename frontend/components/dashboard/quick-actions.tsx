"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Calendar, Utensils, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

const actions = [
  { label: "Start Workout", icon: Dumbbell, href: "/dashboard/workouts", color: "bg-primary" },
  { label: "Book Trainer", icon: Calendar, href: "/dashboard/trainers", color: "bg-emerald-500" },
  { label: "Log Meal", icon: Utensils, href: "/dashboard/nutrition", color: "bg-blue-500" },
  { label: "View Progress", icon: TrendingUp, href: "/dashboard/progress", color: "bg-orange-500" },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="secondary"
              className="h-auto py-4 flex flex-col items-center gap-2"
              asChild
            >
              <Link href={action.href}>
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
