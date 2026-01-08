"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Dumbbell, Users, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const currentWeek = [5, 6, 7, 8, 9, 10, 11]

const scheduleEvents = [
  {
    id: 1,
    day: 6,
    time: "7:00 AM",
    title: "Upper Body Strength",
    type: "workout",
    duration: "55 min",
  },
  {
    id: 2,
    day: 6,
    time: "2:00 PM",
    title: "Session with Marcus",
    type: "trainer",
    duration: "60 min",
  },
  {
    id: 3,
    day: 7,
    time: "10:00 AM",
    title: "HIIT Cardio",
    type: "workout",
    duration: "30 min",
  },
  {
    id: 4,
    day: 8,
    time: "6:00 AM",
    title: "Lower Body Day",
    type: "workout",
    duration: "50 min",
  },
  {
    id: 5,
    day: 9,
    time: "7:00 AM",
    title: "Push Day",
    type: "workout",
    duration: "55 min",
  },
  {
    id: 6,
    day: 10,
    time: "6:00 PM",
    title: "Yoga with Elena",
    type: "trainer",
    duration: "45 min",
  },
  {
    id: 7,
    day: 11,
    time: "9:00 AM",
    title: "Full Body Workout",
    type: "workout",
    duration: "60 min",
  },
]

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(7)

  const dayEvents = scheduleEvents.filter((e) => e.day === selectedDay)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Plan and manage your workout schedule</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            January 2025
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, i) => (
              <div key={day} className="text-center">
                <p className="text-xs text-muted-foreground mb-2">{day}</p>
                <button
                  onClick={() => setSelectedDay(currentWeek[i])}
                  className={cn(
                    "w-full aspect-square rounded-lg flex flex-col items-center justify-center transition-all",
                    selectedDay === currentWeek[i]
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80",
                    currentWeek[i] === 7 && selectedDay !== 7 && "ring-2 ring-primary/50",
                  )}
                >
                  <span className="text-lg font-semibold">{currentWeek[i]}</span>
                  {scheduleEvents.some((e) => e.day === currentWeek[i]) && (
                    <div className="flex gap-0.5 mt-1">
                      {scheduleEvents
                        .filter((e) => e.day === currentWeek[i])
                        .slice(0, 3)
                        .map((_, j) => (
                          <div
                            key={j}
                            className={cn(
                              "h-1 w-1 rounded-full",
                              selectedDay === currentWeek[i] ? "bg-primary-foreground" : "bg-primary",
                            )}
                          />
                        ))}
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>
              Schedule for January {selectedDay}
              {selectedDay === 7 && (
                <Badge className="ml-2" variant="secondary">
                  Today
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dayEvents.length > 0 ? (
              dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border transition-all",
                    event.type === "trainer"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-secondary border-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      event.type === "trainer" ? "bg-emerald-500/10" : "bg-primary/10",
                    )}
                  >
                    {event.type === "trainer" ? (
                      <Users
                        className={cn("h-5 w-5", event.type === "trainer" ? "text-emerald-500" : "text-primary")}
                      />
                    ) : (
                      <Dumbbell className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </span>
                      <span>{event.duration}</span>
                    </div>
                  </div>
                  <Badge variant={event.type === "trainer" ? "default" : "secondary"}>
                    {event.type === "trainer" ? "Trainer" : "Workout"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No events scheduled</p>
                <Button className="mt-4 bg-transparent" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Workout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>This Week Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Workouts Planned</p>
                  <p className="text-sm text-muted-foreground">5 sessions</p>
                </div>
              </div>
              <span className="text-2xl font-bold">5</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium">Trainer Sessions</p>
                  <p className="text-sm text-muted-foreground">2 booked</p>
                </div>
              </div>
              <span className="text-2xl font-bold">2</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Total Time</p>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                </div>
              </div>
              <span className="text-2xl font-bold">5.5h</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
