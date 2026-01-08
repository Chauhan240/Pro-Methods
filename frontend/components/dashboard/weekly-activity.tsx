"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Calendar } from "lucide-react"

const data = [
  { day: "Mon", workouts: 1, duration: 45 },
  { day: "Tue", workouts: 1, duration: 60 },
  { day: "Wed", workouts: 0, duration: 0 },
  { day: "Thu", workouts: 1, duration: 55 },
  { day: "Fri", workouts: 1, duration: 50 },
  { day: "Sat", workouts: 1, duration: 75 },
  { day: "Sun", workouts: 0, duration: 0 },
]

export function WeeklyActivity() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="duration" fill="oklch(0.75 0.18 55)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Total This Week</p>
            <p className="text-xl font-bold">285 min</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Gym Days</p>
            <p className="text-xl font-bold">5 / 7</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
