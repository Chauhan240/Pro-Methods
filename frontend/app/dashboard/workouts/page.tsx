"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, Clock, Flame, Play, Check, ChevronRight, Zap, Heart, Target } from "lucide-react"
import { cn } from "@/lib/utils"

const workoutCategories = [
  { id: "all", name: "All Programs", icon: Dumbbell },
  { id: "strength", name: "Strength", icon: Dumbbell },
  { id: "hiit", name: "HIIT", icon: Zap },
  { id: "cardio", name: "Cardio", icon: Heart },
  { id: "flexibility", name: "Flexibility", icon: Target },
]

const programs = [
  {
    id: 1,
    name: "12-Week Strength Builder",
    category: "strength",
    duration: "12 weeks",
    level: "Intermediate",
    sessions: 48,
    completedSessions: 18,
    image: "/muscular-person-lifting-heavy-weights-in-gym.jpg",
    description: "Build raw strength with progressive overload training",
    enrolled: true,
  },
  {
    id: 2,
    name: "HIIT Fat Burner",
    category: "hiit",
    duration: "8 weeks",
    level: "Advanced",
    sessions: 32,
    completedSessions: 0,
    image: "/intense-cardio-workout-with-person-doing-burpees.jpg",
    description: "High-intensity intervals for maximum calorie burn",
    enrolled: false,
  },
  {
    id: 3,
    name: "Yoga Foundations",
    category: "flexibility",
    duration: "6 weeks",
    level: "Beginner",
    sessions: 24,
    completedSessions: 12,
    image: "/person-doing-yoga-stretch-in-modern-studio.jpg",
    description: "Build flexibility and mindfulness from the ground up",
    enrolled: true,
  },
  {
    id: 4,
    name: "Cardio Endurance",
    category: "cardio",
    duration: "10 weeks",
    level: "Intermediate",
    sessions: 40,
    completedSessions: 0,
    image: "/running-on-treadmill-in-modern-gym-setting.jpg",
    description: "Build cardiovascular endurance and stamina",
    enrolled: false,
  },
]

const todayWorkout = {
  name: "Upper Body Power",
  program: "12-Week Strength Builder",
  week: 4,
  day: 2,
  duration: "55 min",
  calories: 450,
  exercises: [
    { name: "Bench Press", sets: 4, reps: "6-8", completed: true },
    { name: "Overhead Press", sets: 4, reps: "8-10", completed: true },
    { name: "Weighted Pull-ups", sets: 4, reps: "6-8", completed: false },
    { name: "Barbell Rows", sets: 4, reps: "8-10", completed: false },
    { name: "Dumbbell Flyes", sets: 3, reps: "12-15", completed: false },
    { name: "Tricep Pushdowns", sets: 3, reps: "12-15", completed: false },
  ],
}

export default function WorkoutsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeExercise, setActiveExercise] = useState(2)

  const filteredPrograms =
    selectedCategory === "all" ? programs : programs.filter((p) => p.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workouts & Programs</h1>
        <p className="text-muted-foreground">Track your workouts and explore specialized programs</p>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="today">{"Today's Workout"}</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <Card className="bg-card border-border overflow-hidden">
            <div className="relative h-48">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/muscular-person-lifting-heavy-weights-in-gym.jpg')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <Badge className="mb-2">
                  Week {todayWorkout.week} • Day {todayWorkout.day}
                </Badge>
                <h2 className="text-2xl font-bold">{todayWorkout.name}</h2>
                <p className="text-muted-foreground">{todayWorkout.program}</p>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{todayWorkout.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span>{todayWorkout.calories} cal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <span>{todayWorkout.exercises.length} exercises</span>
                </div>
              </div>

              <div className="space-y-3">
                {todayWorkout.exercises.map((exercise, index) => (
                  <div
                    key={exercise.name}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer",
                      exercise.completed
                        ? "bg-primary/5 border-primary/20"
                        : index === activeExercise
                          ? "bg-secondary border-primary"
                          : "bg-secondary border-transparent hover:border-border",
                    )}
                    onClick={() => !exercise.completed && setActiveExercise(index)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                          exercise.completed
                            ? "bg-primary text-primary-foreground"
                            : index === activeExercise
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {exercise.completed ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <p className={cn("font-medium", exercise.completed && "line-through text-muted-foreground")}>
                          {exercise.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                    </div>
                    {index === activeExercise && !exercise.completed && (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Workout Progress</span>
                  <span className="font-medium">
                    {todayWorkout.exercises.filter((e) => e.completed).length} / {todayWorkout.exercises.length}
                  </span>
                </div>
                <Progress
                  value={
                    (todayWorkout.exercises.filter((e) => e.completed).length / todayWorkout.exercises.length) * 100
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {workoutCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={cn("shrink-0", selectedCategory !== cat.id && "bg-transparent")}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <cat.icon className="h-4 w-4 mr-2" />
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="bg-card border-border overflow-hidden group">
                <div className="relative h-40">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${program.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={program.enrolled ? "default" : "secondary"}>
                      {program.enrolled ? "Enrolled" : program.level}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{program.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{program.description}</p>

                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {program.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Dumbbell className="h-4 w-4" />
                      {program.sessions} sessions
                    </span>
                  </div>

                  {program.enrolled && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{Math.round((program.completedSessions / program.sessions) * 100)}%</span>
                      </div>
                      <Progress value={(program.completedSessions / program.sessions) * 100} className="h-1.5" />
                    </div>
                  )}

                  <Button className="w-full mt-4" variant={program.enrolled ? "default" : "outline"}>
                    {program.enrolled ? (
                      <>
                        Continue Program
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      "Start Program"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: "Jan 6", name: "Lower Body Strength", duration: "48 min", calories: 380 },
                { date: "Jan 5", name: "Upper Body Power", duration: "55 min", calories: 450 },
                { date: "Jan 4", name: "Yoga Flow", duration: "35 min", calories: 180 },
                { date: "Jan 3", name: "HIIT Cardio", duration: "30 min", calories: 420 },
                { date: "Jan 2", name: "Core & Abs", duration: "25 min", calories: 220 },
              ].map((workout, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">{workout.date}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{workout.duration}</p>
                    <p className="text-muted-foreground">{workout.calories} cal</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
