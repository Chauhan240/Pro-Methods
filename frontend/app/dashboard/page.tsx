import { StatsCards } from "@/components/dashboard/stats-cards"
import { WorkoutLog } from "@/components/dashboard/workout-log"
import { WeeklyActivity } from "@/components/dashboard/weekly-activity"
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, John!</h1>
        <p className="text-muted-foreground">{"Here's your fitness overview for today."}</p>
      </div>

      <StatsCards />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WorkoutLog />
          <WeeklyActivity />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <UpcomingSessions />
        </div>
      </div>
    </div>
  )
}
