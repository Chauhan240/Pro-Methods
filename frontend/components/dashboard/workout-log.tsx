"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Check, Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"

type Exercise = {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  completed: boolean
}

const exerciseOptions = [
  "Bench Press",
  "Squats",
  "Deadlift",
  "Pull-ups",
  "Shoulder Press",
  "Barbell Rows",
  "Lunges",
  "Bicep Curls",
  "Tricep Dips",
  "Leg Press",
  "Lat Pulldown",
  "Cable Flyes",
]

export function WorkoutLog() {
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: "1", name: "Bench Press", sets: 4, reps: 10, weight: 135, completed: true },
    { id: "2", name: "Squats", sets: 4, reps: 8, weight: 185, completed: true },
    { id: "3", name: "Deadlift", sets: 3, reps: 6, weight: 225, completed: false },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: 3,
    reps: 10,
    weight: 0,
  })

  const addExercise = () => {
    if (!newExercise.name) return
    setExercises([
      ...exercises,
      {
        id: Date.now().toString(),
        ...newExercise,
        completed: false,
      },
    ])
    setNewExercise({ name: "", sets: 3, reps: 10, weight: 0 })
    setShowAdd(false)
  }

  const toggleComplete = (id: string) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, completed: !ex.completed } : ex)))
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          {"Today's Workout"}
        </CardTitle>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Exercise
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAdd && (
          <div className="p-4 bg-secondary rounded-lg space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Exercise</Label>
                <Select value={newExercise.name} onValueChange={(v) => setNewExercise({ ...newExercise, name: v })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {exerciseOptions.map((ex) => (
                      <SelectItem key={ex} value={ex}>
                        {ex}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Sets</Label>
                  <Input
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: Number(e.target.value) })}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label>Reps</Label>
                  <Input
                    type="number"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: Number(e.target.value) })}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label>Weight</Label>
                  <Input
                    type="number"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: Number(e.target.value) })}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addExercise}>Add</Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border transition-all",
                exercise.completed ? "bg-primary/5 border-primary/20" : "bg-secondary border-transparent",
              )}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleComplete(exercise.id)}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                    exercise.completed ? "bg-primary border-primary" : "border-muted-foreground",
                  )}
                >
                  {exercise.completed && <Check className="h-4 w-4 text-primary-foreground" />}
                </button>
                <div>
                  <p className={cn("font-medium", exercise.completed && "line-through text-muted-foreground")}>
                    {exercise.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight} lbs
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeExercise(exercise.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {exercises.filter((e) => e.completed).length} / {exercises.length} completed
            </span>
          </div>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${(exercises.filter((e) => e.completed).length / exercises.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
