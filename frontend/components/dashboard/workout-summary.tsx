"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { workoutApi, WorkoutLog } from "@/lib/api"
import { Activity, Dumbbell, Calendar, Clock } from "lucide-react"
import { format, subDays, isSameDay } from "date-fns"

export function WorkoutSummary() {
    const { token } = useAuth()
    const [recentLogs, setRecentLogs] = useState<WorkoutLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token) {
            fetchRecentLogs()
        }
    }, [token])

    const fetchRecentLogs = async () => {
        try {
            // Fetch last 7 days
            const end = new Date()
            const start = subDays(end, 6)
            // Just fetching all for now, assuming API supports filtering or backend serves latest
            const logs = await workoutApi.getWorkoutLogs(token!)
            // Filter client side for last 7 days just to be sure
            const recent = logs.filter(log => {
                const logDate = new Date(log.date)
                return logDate >= start && logDate <= end
            }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

            setRecentLogs(recent)
        } catch (error) {
            console.error("Failed to fetch logs", error)
        } finally {
            setLoading(false)
        }
    }

    const totalExercises = recentLogs.reduce((sum, log) => sum + log.exercises.length, 0)
    const activeDays = recentLogs.length

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Weekly Workout Summary
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-secondary/50 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-primary">{activeDays}</span>
                        <span className="text-xs text-muted-foreground mt-1">Active Days</span>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-blue-500">{totalExercises}</span>
                        <span className="text-xs text-muted-foreground mt-1">Exercises Completed</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Recent Activity</h4>
                    {loading ? (
                        <div className="text-sm text-center py-2 text-muted-foreground">Loading...</div>
                    ) : recentLogs.length === 0 ? (
                        <div className="text-sm text-center py-2 text-muted-foreground">No workouts logged this week.</div>
                    ) : (
                        <div className="space-y-3">
                            {recentLogs.slice(0, 3).map((log) => (
                                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Calendar className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{format(new Date(log.date), "EEEE, MMM do")}</p>
                                            <p className="text-xs text-muted-foreground">{log.exercises.length} exercises</p>
                                        </div>
                                    </div>
                                    {log.exercises.length > 0 && (
                                        <div className="text-xs text-muted-foreground text-right">
                                            Main Focus: {log.exercises[0].body_part}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
