"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Utensils, Plus, Flame, Droplet, Beef, Cookie, Apple, Coffee, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

const dailyGoals = {
  calories: { current: 1850, target: 2400 },
  protein: { current: 142, target: 180 },
  carbs: { current: 180, target: 250 },
  fat: { current: 58, target: 80 },
  water: { current: 6, target: 8 },
}

const meals = [
  {
    id: 1,
    type: "Breakfast",
    icon: Coffee,
    time: "7:30 AM",
    foods: [
      { name: "Oatmeal with Berries", calories: 320, protein: 12, carbs: 54, fat: 6 },
      { name: "Greek Yogurt", calories: 150, protein: 15, carbs: 8, fat: 5 },
      { name: "Black Coffee", calories: 5, protein: 0, carbs: 1, fat: 0 },
    ],
  },
  {
    id: 2,
    type: "Lunch",
    icon: Sun,
    time: "12:30 PM",
    foods: [
      { name: "Grilled Chicken Salad", calories: 450, protein: 42, carbs: 18, fat: 22 },
      { name: "Whole Wheat Bread", calories: 120, protein: 4, carbs: 22, fat: 2 },
    ],
  },
  {
    id: 3,
    type: "Snack",
    icon: Apple,
    time: "3:30 PM",
    foods: [{ name: "Protein Shake", calories: 280, protein: 35, carbs: 12, fat: 8 }],
  },
  {
    id: 4,
    type: "Dinner",
    icon: Moon,
    time: "7:00 PM",
    foods: [
      { name: "Salmon Fillet", calories: 350, protein: 34, carbs: 0, fat: 15 },
      { name: "Brown Rice", calories: 175, protein: 4, carbs: 65, fat: 0 },
    ],
  },
]

const mealPlans = [
  {
    id: 1,
    name: "Muscle Building",
    calories: 2800,
    protein: 200,
    description: "High protein plan for muscle growth",
    active: true,
  },
  {
    id: 2,
    name: "Fat Loss",
    calories: 1800,
    protein: 150,
    description: "Calorie deficit with high protein",
    active: false,
  },
  {
    id: 3,
    name: "Maintenance",
    calories: 2200,
    protein: 160,
    description: "Balanced plan for maintaining weight",
    active: false,
  },
  {
    id: 4,
    name: "Keto",
    calories: 2000,
    protein: 140,
    description: "Low carb, high fat ketogenic diet",
    active: false,
  },
]

const foodDatabase = [
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { name: "Broccoli (1 cup)", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { name: "Eggs (2 large)", calories: 156, protein: 12, carbs: 1.1, fat: 11 },
  { name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Sweet Potato (1 medium)", calories: 103, protein: 2.3, carbs: 24, fat: 0.1 },
  { name: "Avocado (1/2)", calories: 161, protein: 2, carbs: 8.5, fat: 14.7 },
  { name: "Almonds (1 oz)", calories: 164, protein: 6, carbs: 6, fat: 14 },
]

export default function NutritionPage() {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null)
  const [waterCount, setWaterCount] = useState(dailyGoals.water.current)
  const [showAddFood, setShowAddFood] = useState(false)
  const [newFood, setNewFood] = useState("")

  const MacroCircle = ({
    label,
    current,
    target,
    color,
    icon: Icon,
  }: {
    label: string
    current: number
    target: number
    color: string
    icon: React.ElementType
  }) => {
    const percentage = Math.min((current / target) * 100, 100)
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${percentage * 2.26} 226`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={`h-5 w-5`} style={{ color }} />
          </div>
        </div>
        <p className="text-sm font-medium mt-2">{label}</p>
        <p className="text-xs text-muted-foreground">
          {current}g / {target}g
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nutrition & Diet</h1>
        <p className="text-muted-foreground">Track your meals and manage your nutrition goals</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                {"Today's Macros"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-secondary"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="oklch(0.75 0.18 55)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(dailyGoals.calories.current / dailyGoals.calories.target) * 440} 440`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{dailyGoals.calories.current}</span>
                    <span className="text-sm text-muted-foreground">/ {dailyGoals.calories.target} cal</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-around">
                <MacroCircle
                  label="Protein"
                  current={dailyGoals.protein.current}
                  target={dailyGoals.protein.target}
                  color="#ef4444"
                  icon={Beef}
                />
                <MacroCircle
                  label="Carbs"
                  current={dailyGoals.carbs.current}
                  target={dailyGoals.carbs.target}
                  color="#3b82f6"
                  icon={Cookie}
                />
                <MacroCircle
                  label="Fat"
                  current={dailyGoals.fat.current}
                  target={dailyGoals.fat.target}
                  color="#eab308"
                  icon={Droplet}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                {"Today's Meals"}
              </CardTitle>
              <Dialog open={showAddFood} onOpenChange={setShowAddFood}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Food
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Food</DialogTitle>
                    <DialogDescription>Log what you ate</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Meal</Label>
                      <Select value={selectedMeal || ""} onValueChange={setSelectedMeal}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Search Food</Label>
                      <Input
                        placeholder="Search or enter food..."
                        value={newFood}
                        onChange={(e) => setNewFood(e.target.value)}
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {foodDatabase
                        .filter((f) => f.name.toLowerCase().includes(newFood.toLowerCase()))
                        .map((food) => (
                          <div
                            key={food.name}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors"
                            onClick={() => {
                              setShowAddFood(false)
                              setNewFood("")
                            }}
                          >
                            <div>
                              <p className="font-medium text-sm">{food.name}</p>
                              <p className="text-xs text-muted-foreground">
                                P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                              </p>
                            </div>
                            <span className="text-sm font-medium text-primary">{food.calories} cal</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {meals.map((meal) => {
                const mealCalories = meal.foods.reduce((sum, f) => sum + f.calories, 0)
                const mealProtein = meal.foods.reduce((sum, f) => sum + f.protein, 0)

                return (
                  <div key={meal.id} className="p-4 rounded-lg bg-secondary">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <meal.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{meal.type}</p>
                          <p className="text-xs text-muted-foreground">{meal.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{mealCalories} cal</p>
                        <p className="text-xs text-muted-foreground">{mealProtein}g protein</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {meal.foods.map((food, i) => (
                        <div key={i} className="flex items-center justify-between text-sm py-2 border-t border-border">
                          <span>{food.name}</span>
                          <span className="text-muted-foreground">{food.calories} cal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                Water Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {Array.from({ length: dailyGoals.water.target }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWaterCount(i + 1)}
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center transition-all",
                      i < waterCount ? "bg-blue-500 text-white" : "bg-secondary hover:bg-secondary/80",
                    )}
                  >
                    <Droplet className="h-5 w-5" />
                  </button>
                ))}
              </div>
              <p className="text-center mt-4 text-sm text-muted-foreground">
                {waterCount} / {dailyGoals.water.target} glasses
              </p>
              <Progress value={(waterCount / dailyGoals.water.target) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Meal Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mealPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer",
                    plan.active
                      ? "bg-primary/10 border-primary"
                      : "bg-secondary border-transparent hover:border-border",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{plan.name}</p>
                    {plan.active && <Badge>Active</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{plan.calories} cal</span>
                    <span>{plan.protein}g protein</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
