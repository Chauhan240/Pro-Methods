"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Calendar, Clock, Video, MapPin, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const trainers = [
  {
    id: 1,
    name: "Marcus Johnson",
    specialty: "Strength & Conditioning",
    rating: 4.9,
    reviews: 127,
    sessions: 850,
    price: 75,
    image: "/professional-male-fitness-trainer-portrait-dark-ba.jpg",
    bio: "Former professional athlete with 10+ years of training experience. Specializes in building raw strength and athletic performance.",
    certifications: ["NASM-CPT", "CSCS", "CrossFit L2"],
    availability: ["Mon", "Tue", "Thu", "Fri", "Sat"],
  },
  {
    id: 2,
    name: "Sarah Chen",
    specialty: "HIIT & Cardio",
    rating: 4.8,
    reviews: 98,
    sessions: 720,
    price: 65,
    image: "/professional-female-fitness-trainer-portrait-dark-.jpg",
    bio: "High-energy trainer focused on fat loss and cardiovascular health. Known for creative, challenging workouts.",
    certifications: ["ACE-CPT", "TRX Certified", "Spin Instructor"],
    availability: ["Mon", "Wed", "Thu", "Sat", "Sun"],
  },
  {
    id: 3,
    name: "David Williams",
    specialty: "Bodybuilding",
    rating: 4.9,
    reviews: 156,
    sessions: 1200,
    price: 85,
    image: "/professional-male-bodybuilding-trainer-portrait-da.jpg",
    bio: "Competition-winning bodybuilder with expertise in muscle hypertrophy and contest prep.",
    certifications: ["IFBB Pro", "NASM-CPT", "Precision Nutrition"],
    availability: ["Tue", "Wed", "Fri", "Sat", "Sun"],
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    specialty: "Yoga & Flexibility",
    rating: 5.0,
    reviews: 89,
    sessions: 650,
    price: 60,
    image: "/professional-female-yoga-instructor-portrait-dark-.jpg",
    bio: "RYT-500 certified yoga instructor specializing in vinyasa flow and mobility work for athletes.",
    certifications: ["RYT-500", "FRC Mobility", "Pilates Mat"],
    availability: ["Mon", "Tue", "Wed", "Fri", "Sun"],
  },
]

const bookedSessions = [
  {
    id: 1,
    trainer: trainers[0],
    date: "Today",
    time: "2:00 PM",
    type: "In-Person",
    status: "upcoming",
  },
  {
    id: 2,
    trainer: trainers[1],
    date: "Tomorrow",
    time: "10:00 AM",
    type: "Virtual",
    status: "upcoming",
  },
  {
    id: 3,
    trainer: trainers[3],
    date: "Jan 10",
    time: "6:00 PM",
    type: "In-Person",
    status: "upcoming",
  },
  {
    id: 4,
    trainer: trainers[2],
    date: "Jan 5",
    time: "3:00 PM",
    type: "In-Person",
    status: "completed",
  },
]

export default function TrainersPage() {
  const [selectedTrainer, setSelectedTrainer] = useState<(typeof trainers)[0] | null>(null)
  const [bookingStep, setBookingStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const handleBook = () => {
    setBookingStep(2)
    setTimeout(() => {
      setBookingStep(0)
      setSelectedTrainer(null)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trainers & Sessions</h1>
        <p className="text-muted-foreground">Book sessions with our expert trainers</p>
      </div>

      <Tabs defaultValue="trainers" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="trainers">Find Trainers</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="trainers" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {trainers.map((trainer) => (
              <Card key={trainer.id} className="bg-card border-border overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div
                      className="w-32 h-40 sm:w-40 sm:h-48 bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url('${trainer.image}')` }}
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{trainer.name}</h3>
                          <p className="text-sm text-primary">{trainer.specialty}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="font-medium">{trainer.rating}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{trainer.bio}</p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {trainer.certifications.slice(0, 2).map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold">${trainer.price}/hr</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedTrainer(trainer)}>
                              Book Session
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            {bookingStep < 2 ? (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Book with {trainer.name}</DialogTitle>
                                  <DialogDescription>Schedule your training session</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose a date" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                                        <SelectItem value="jan10">Jan 10</SelectItem>
                                        <SelectItem value="jan11">Jan 11</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Select Time</label>
                                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose a time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="9am">9:00 AM</SelectItem>
                                        <SelectItem value="10am">10:00 AM</SelectItem>
                                        <SelectItem value="2pm">2:00 PM</SelectItem>
                                        <SelectItem value="4pm">4:00 PM</SelectItem>
                                        <SelectItem value="6pm">6:00 PM</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Session Type</label>
                                    <Select value={selectedType} onValueChange={setSelectedType}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="inperson">In-Person</SelectItem>
                                        <SelectItem value="virtual">Virtual</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="pt-2 border-t border-border">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Session Fee</span>
                                      <span className="font-semibold">${trainer.price}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button className="w-full" onClick={handleBook}>
                                  Confirm Booking
                                </Button>
                              </>
                            ) : (
                              <div className="py-12 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Check className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Session Booked!</h3>
                                <p className="text-muted-foreground mt-2">
                                  Your session with {trainer.name} has been confirmed.
                                </p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Your Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookedSessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border transition-all",
                    session.status === "completed"
                      ? "bg-secondary/50 border-transparent"
                      : "bg-secondary border-border",
                  )}
                >
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={session.trainer.image || "/placeholder.svg"} />
                    <AvatarFallback>{session.trainer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{session.trainer.name}</p>
                      {session.status === "completed" && (
                        <Badge variant="secondary" className="text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-primary">{session.trainer.specialty}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.time}
                      </span>
                      <span className="flex items-center gap-1">
                        {session.type === "Virtual" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        {session.type}
                      </span>
                    </div>
                  </div>
                  {session.status === "upcoming" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-transparent">
                        Reschedule
                      </Button>
                      <Button size="sm">Join</Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
