"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Video, MapPin } from "lucide-react"

const sessions = [
  {
    id: 1,
    trainer: "Marcus Johnson",
    type: "Strength Training",
    time: "Today, 2:00 PM",
    location: "In-Person",
    avatar: "/professional-male-fitness-trainer-portrait-dark-ba.jpg",
  },
  {
    id: 2,
    trainer: "Sarah Chen",
    type: "HIIT Session",
    time: "Tomorrow, 10:00 AM",
    location: "Virtual",
    avatar: "/professional-female-fitness-trainer-portrait-dark-.jpg",
  },
  {
    id: 3,
    trainer: "Elena Rodriguez",
    type: "Yoga Flow",
    time: "Fri, 6:00 PM",
    location: "In-Person",
    avatar: "/professional-female-yoga-instructor-portrait-dark-.jpg",
  },
]

export function UpcomingSessions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Upcoming Sessions
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={session.avatar || "/placeholder.svg"} />
              <AvatarFallback>{session.trainer[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{session.trainer}</p>
              <p className="text-sm text-primary">{session.type}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{session.time}</span>
                <span className="flex items-center gap-1">
                  {session.location === "Virtual" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                  {session.location}
                </span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 bg-transparent">
              Join
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
