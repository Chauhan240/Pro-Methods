"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { nutritionApi, MealLog } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
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
import { Utensils, Plus, Flame, Droplet, Beef, Cookie, Apple, Coffee, Moon, Sun, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const dailyGoals = {
  calories: { target: 2400 },
  protein: { target: 180 },
  carbs: { target: 250 },
  fat: { target: 80 },
  water: { target: 8 },
}

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
  // Keto Removed as requested
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
  // Indian Items
  { name: "Roti (1 piece)", calories: 120, protein: 3, carbs: 18, fat: 3.7 },
  { name: "Dal Tadka (1 bowl)", calories: 240, protein: 7, carbs: 12, fat: 5 },
  { name: "Paneer Butter Masala (1 bowl)", calories: 400, protein: 12, carbs: 10, fat: 25 },
  { name: "Idli (2 pieces)", calories: 120, protein: 4, carbs: 24, fat: 0.5 },
  { name: "Dosa (1 plain)", calories: 133, protein: 3, carbs: 23, fat: 3 },
  { name: "Chole Bhature (1 serving)", calories: 450, protein: 14, carbs: 50, fat: 20 },
  { name: "Biryani (Chicken 1 plate)", calories: 600, protein: 30, carbs: 60, fat: 25 },
  { name: "Samosa (1 piece)", calories: 260, protein: 3, carbs: 24, fat: 18 },
  { name: "Palak Paneer (1 bowl)", calories: 340, protein: 10, carbs: 6, fat: 15 },
  { name: "Rajma Chawal (1 plate)", calories: 420, protein: 12, carbs: 65, fat: 8 },
]

export default function NutritionPage() {
  const { token } = useAuth()
  const [selectedMeal, setSelectedMeal] = useState<string>("Breakfast")
  const [waterCount, setWaterCount] = useState(0)
  const [showAddFood, setShowAddFood] = useState(false)
  const [newFood, setNewFood] = useState("")
  const [mealLogs, setMealLogs] = useState<MealLog[]>([])
  const [currentMacros, setCurrentMacros] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 })

  useEffect(() => {
    if (token) {
      loadNutritionData()
    }
  }, [token])

  const loadNutritionData = async () => {
    try {
      const data = await nutritionApi.getTodayNutrition(token!)
      setMealLogs(data.meal_logs)
      setWaterCount(data.water_intake)
      calculateMacros(data.meal_logs)
    } catch (error) {
      console.error("Failed to load nutrition data", error)
    }
  }

  const calculateMacros = (logs: MealLog[]) => {
    const macros = logs.reduce((acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fat: acc.fat + log.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
    setCurrentMacros(macros)
  }

  const handleAddFood = async (foodItem: typeof foodDatabase[0]) => {
    if (!token) return

    try {
      const newLog = await nutritionApi.addMealLog(token, {
        meal_type: selectedMeal,
        food_name: foodItem.name,
        calories: foodItem.calories,
        protein: foodItem.protein,
        carbs: foodItem.carbs,
        fat: foodItem.fat
      })

      const updatedLogs = [...mealLogs, newLog]
      setMealLogs(updatedLogs)
      calculateMacros(updatedLogs)
      setShowAddFood(false)
      setNewFood("")
      toast.success("Food added successfully")
    } catch (error) {
      toast.error("Failed to add food")
    }
  }

  const handleRemoveFood = async (mealId: number) => {
    if (!token) return

    try {
      await nutritionApi.deleteMealLog(token, mealId)
      const updatedLogs = mealLogs.filter(m => m.id !== mealId)
      setMealLogs(updatedLogs)
      calculateMacros(updatedLogs)
      toast.success("Food removed")
    } catch (error) {
      toast.error("Failed to remove food")
    }
  }

  const handleWaterUpdate = async (count: number) => {
    if (!token) return
    setWaterCount(count)
    try {
      await nutritionApi.updateWaterIntake(token, count)
    } catch (error) {
      console.error("Failed to update water", error)
    }
  }

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
          {Math.round(current)}g / {target}g
        </p>
      </div>
    )
  }

  const getMealsByType = (type: string) => mealLogs.filter(log => log.meal_type === type)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nutrition & Diet</h1>
        <p className="text-muted-foreground">Track your meals, manage goals, and stay hydrated.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                {"Today's Macros"} (Auto-refresh)
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
                      strokeDasharray={`${Math.min((currentMacros.calories / dailyGoals.calories.target) * 440, 440)} 440`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{Math.round(currentMacros.calories)}</span>
                    <span className="text-sm text-muted-foreground">/ {dailyGoals.calories.target} cal</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-around">
                <MacroCircle
                  label="Protein"
                  current={currentMacros.protein}
                  target={dailyGoals.protein.target}
                  color="#ef4444"
                  icon={Beef}
                />
                <MacroCircle
                  label="Carbs"
                  current={currentMacros.carbs}
                  target={dailyGoals.carbs.target}
                  color="#3b82f6"
                  icon={Cookie}
                />
                <MacroCircle
                  label="Fat"
                  current={currentMacros.fat}
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
                      <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select meal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Breakfast">Breakfast</SelectItem>
                          <SelectItem value="Lunch">Lunch</SelectItem>
                          <SelectItem value="Snack">Snack</SelectItem>
                          <SelectItem value="Dinner">Dinner</SelectItem>
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
                            onClick={() => handleAddFood(food)}
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
              {["Breakfast", "Lunch", "Snack", "Dinner"].map((type) => {
                const typeLogs = getMealsByType(type)
                if (typeLogs.length === 0) return null

                const mealCalories = typeLogs.reduce((sum, f) => sum + f.calories, 0)
                const mealProtein = typeLogs.reduce((sum, f) => sum + f.protein, 0)

                return (
                  <div key={type} className="p-4 rounded-lg bg-secondary">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {type === "Breakfast" && <Coffee className="h-5 w-5 text-primary" />}
                          {type === "Lunch" && <Sun className="h-5 w-5 text-primary" />}
                          {type === "Snack" && <Apple className="h-5 w-5 text-primary" />}
                          {type === "Dinner" && <Moon className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <p className="font-semibold">{type}</p>
                          <p className="text-xs text-muted-foreground">{typeLogs.length} items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{mealCalories} cal</p>
                        <p className="text-xs text-muted-foreground">{Math.round(mealProtein)}g protein</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {typeLogs.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm py-2 border-t border-border group">
                          <span>{item.food_name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">{item.calories} cal</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveFood(item.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              {mealLogs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No meals logged today. Start adding food!
                </div>
              )}
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
                    onClick={() => handleWaterUpdate(i + 1)}
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
