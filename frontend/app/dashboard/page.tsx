"use client"

import { useAuth } from "@/lib/auth-context"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { WeeklyActivity } from "@/components/dashboard/weekly-activity"
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { WorkoutSummary } from "@/components/dashboard/workout-summary"
import { BodyStats } from "@/components/dashboard/body-stats"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.first_name || "John"}!</h1>
        <p className="text-muted-foreground">{"Here's your fitness overview for today."}</p>
      </div>

      <StatsCards />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WorkoutSummary />
          <WeeklyActivity />
        </div>
        <div className="space-y-6">
          <BodyStats />
          <QuickActions />
          <UpcomingSessions />
        </div>
      </div>
    </div>
  )
}
