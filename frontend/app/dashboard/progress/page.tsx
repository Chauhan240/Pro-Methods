"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  TrendingUp,
  Calendar,
  Flame,
  Dumbbell,
  Target,
  Award,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const weightData = [
  { date: "Week 1", weight: 185 },
  { date: "Week 2", weight: 184 },
  { date: "Week 3", weight: 183 },
  { date: "Week 4", weight: 182 },
  { date: "Week 5", weight: 181 },
  { date: "Week 6", weight: 180 },
  { date: "Week 7", weight: 179 },
  { date: "Week 8", weight: 178 },
]

const strengthData = [
  { date: "Jan 1", bench: 135, squat: 185, deadlift: 225 },
  { date: "Jan 8", bench: 140, squat: 190, deadlift: 235 },
  { date: "Jan 15", bench: 145, squat: 200, deadlift: 245 },
  { date: "Jan 22", bench: 150, squat: 205, deadlift: 255 },
  { date: "Jan 29", bench: 155, squat: 215, deadlift: 265 },
  { date: "Feb 5", bench: 160, squat: 225, deadlift: 275 },
]

const workoutFrequency = [
  { week: "W1", days: 4, target: 5 },
  { week: "W2", days: 5, target: 5 },
  { week: "W3", days: 3, target: 5 },
  { week: "W4", days: 5, target: 5 },
  { week: "W5", days: 4, target: 5 },
  { week: "W6", days: 5, target: 5 },
  { week: "W7", days: 6, target: 5 },
  { week: "W8", days: 5, target: 5 },
]

const calorieData = [
  { date: "Mon", burned: 450, consumed: 2200 },
  { date: "Tue", burned: 380, consumed: 2400 },
  { date: "Wed", burned: 0, consumed: 2100 },
  { date: "Thu", burned: 520, consumed: 2300 },
  { date: "Fri", burned: 420, consumed: 2500 },
  { date: "Sat", burned: 650, consumed: 2600 },
  { date: "Sun", burned: 200, consumed: 2200 },
]

const achievements = [
  { id: 1, name: "First Workout", description: "Complete your first workout", earned: true, date: "Jan 1" },
  { id: 2, name: "Week Warrior", description: "5 workouts in one week", earned: true, date: "Jan 7" },
  { id: 3, name: "Strength Milestone", description: "Bench press your bodyweight", earned: true, date: "Jan 15" },
  { id: 4, name: "Consistency King", description: "30-day workout streak", earned: false, progress: 18 },
  { id: 5, name: "Iron Will", description: "100 total workouts", earned: false, progress: 42 },
  { id: 6, name: "Nutrition Master", description: "Log meals for 30 days", earned: false, progress: 22 },
]

const gymAttendance = [
  { date: "Jan 1", attended: true },
  { date: "Jan 2", attended: true },
  { date: "Jan 3", attended: false },
  { date: "Jan 4", attended: true },
  { date: "Jan 5", attended: true },
  { date: "Jan 6", attended: true },
  { date: "Jan 7", attended: false },
]

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("8weeks")

  const stats = {
    totalWorkouts: 42,
    currentStreak: 5,
    longestStreak: 12,
    avgWorkoutsPerWeek: 4.8,
    totalCaloriesBurned: 28500,
    weightChange: -7,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Progress & Analytics</h1>
          <p className="text-muted-foreground">Track your fitness journey and achievements</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4weeks">Last 4 Weeks</SelectItem>
            <SelectItem value="8weeks">Last 8 Weeks</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-emerald-500">
                <ChevronUp className="h-3 w-3 mr-1" />
                12%
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-4">{stats.totalWorkouts}</p>
            <p className="text-sm text-muted-foreground">Total Workouts</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <Badge variant="secondary" className="text-emerald-500">
                <ChevronUp className="h-3 w-3 mr-1" />
                8%
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-4">{stats.totalCaloriesBurned.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Calories Burned</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-xs text-muted-foreground">Current</span>
            </div>
            <p className="text-3xl font-bold mt-4">{stats.currentStreak} days</p>
            <p className="text-sm text-muted-foreground">Workout Streak</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <Badge variant="secondary" className="text-emerald-500">
                <ChevronDown className="h-3 w-3 mr-1" />
                {Math.abs(stats.weightChange)} lbs
              </Badge>
            </div>
            <p className="text-3xl font-bold mt-4">178 lbs</p>
            <p className="text-sm text-muted-foreground">Current Weight</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Weight Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis
                        domain={["dataMin - 5", "dataMax + 5"]}
                        tick={{ fill: "#888", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="weight"
                        stroke="oklch(0.75 0.18 55)"
                        fill="oklch(0.75 0.18 55 / 0.2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Weekly Workout Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workoutFrequency}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="week" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="days" fill="oklch(0.75 0.18 55)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Average: <span className="font-semibold text-foreground">{stats.avgWorkoutsPerWeek}</span> workouts
                    per week
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Calories: Burned vs Consumed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calorieData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="burned" name="Burned" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="consumed" name="Consumed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strength" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Strength Progress (1RM Estimates)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bench"
                      name="Bench Press"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="squat"
                      name="Squat"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="deadlift"
                      name="Deadlift"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "Bench Press", current: 160, previous: 135, color: "text-red-500" },
              { name: "Squat", current: 225, previous: 185, color: "text-blue-500" },
              { name: "Deadlift", current: 275, previous: 225, color: "text-emerald-500" },
            ].map((lift) => (
              <Card key={lift.name} className="bg-card border-border">
                <CardContent className="p-6">
                  <p className={`text-sm font-medium ${lift.color}`}>{lift.name}</p>
                  <p className="text-3xl font-bold mt-2">{lift.current} lbs</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-emerald-500">+{lift.current - lift.previous} lbs</span> from start
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Gym Attendance Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => {
                  const attended = Math.random() > 0.4
                  const isToday = i === 9
                  return (
                    <div
                      key={i}
                      className={cn(
                        "aspect-square rounded-lg flex items-center justify-center text-sm transition-all",
                        attended ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground",
                        isToday && "ring-2 ring-primary",
                      )}
                    >
                      {i - 4 > 0 && i - 4 <= 31 ? i - 4 : ""}
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-primary/20" />
                  <span className="text-muted-foreground">Attended</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-secondary" />
                  <span className="text-muted-foreground">Missed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-primary">22</p>
                <p className="text-sm text-muted-foreground mt-1">Days This Month</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-emerald-500">85%</p>
                <p className="text-sm text-muted-foreground mt-1">Attendance Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <p className="text-4xl font-bold text-blue-500">12</p>
                <p className="text-sm text-muted-foreground mt-1">Best Streak</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={cn(
                  "bg-card border-border transition-all",
                  achievement.earned ? "border-primary/50" : "opacity-75",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center",
                        achievement.earned ? "bg-primary/20" : "bg-secondary",
                      )}
                    >
                      {achievement.earned ? (
                        <Award className="h-6 w-6 text-primary" />
                      ) : (
                        <Target className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{achievement.name}</p>
                        {achievement.earned && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                      {achievement.earned ? (
                        <p className="text-xs text-primary mt-2">Earned {achievement.date}</p>
                      ) : (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span>
                              {achievement.progress}/{achievement.name.includes("100") ? 100 : 30}
                            </span>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-muted-foreground/50 rounded-full"
                              style={{
                                width: `${(achievement.progress! / (achievement.name.includes("100") ? 100 : 30)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
