import { useState, useEffect } from "react";
import { format, isSameDay, startOfDay } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { workoutApi, WorkoutExercise } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Dumbbell, Plus, Save, Trash2, Lock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Assuming shadcn Calendar exists
import { cn } from "@/lib/utils";

const BODY_PARTS = [
    "Chest",
    "Back",
    "Bicep",
    "Tricep",
    "Legs",
    "Core",
    "Cardio",
];

const EXERCISE_OPTIONS: Record<string, string[]> = {
    Chest: ["Bench Press", "Push Ups", "Dumbbell Flyes", "Incline Press", "Chest Press Machine"],
    Back: ["Pull Ups", "Barbell Rows", "Lat Pulldowns", "Deadlifts", "Seated Rows"],
    Bicep: ["Barbell Curls", "Dumbbell Curls", "Hammer Curls", "Preacher Curls"],
    Tricep: ["Tricep Dips", "Tricep Pushdowns", "Skull Crushers", "Overhead Extensions"],
    Legs: ["Squats", "Lunges", "Leg Press", "Leg Extensions", "Calf Raises"],
    Core: ["Crunches", "Planks", "Leg Raises", "Russian Twists"],
    Cardio: ["Treadmill", "Cycling", "Elliptical", "Rowing Machine", "Jump Rope"],
};

export function MyWorkoutRoutine() {
    const { token } = useAuth();
    const [date, setDate] = useState<Date>(new Date());
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [bodyPart, setBodyPart] = useState<string>("");
    const [exerciseName, setExerciseName] = useState<string>("");
    const [sets, setSets] = useState<string>("3");
    const [reps, setReps] = useState<string>("10");
    const [weight, setWeight] = useState<string>("");
    const [duration, setDuration] = useState<string>("20"); // Minutes

    const isToday = isSameDay(date, new Date());
    const isPast = startOfDay(date) < startOfDay(new Date());
    const isEditable = isToday; // Only allow editing today's workout

    useEffect(() => {
        if (token) {
            fetchWorkoutLog();
        }
    }, [date, token]);

    const fetchWorkoutLog = async () => {
        setIsLoading(true);
        try {
            const formattedDate = format(date, "yyyy-MM-dd");
            const log = await workoutApi.getWorkoutLogByDate(token!, formattedDate);
            if (log) {
                setExercises(log.exercises);
            } else {
                setExercises([]);
            }
        } catch (error) {
            console.error("Failed to fetch workout log", error);
            // Don't show error toast on 404/null, just empty list
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddExercise = () => {
        if (!bodyPart || !exerciseName) {
            toast.error("Please select a body part and exercise");
            return;
        }

        let newExercise: WorkoutExercise;

        if (bodyPart === "Cardio") {
            newExercise = {
                body_part: bodyPart,
                exercise_name: exerciseName,
                duration_minutes: parseInt(duration) || 20,
            };
        } else {
            newExercise = {
                body_part: bodyPart,
                exercise_name: exerciseName,
                sets: parseInt(sets) || 1,
                reps: parseInt(reps) || 0,
                weight: parseFloat(weight) || 0,
            };
        }

        setExercises([...exercises, newExercise]);

        // Reset form partially
        // Keep body part selected for convenience? Maybe resets make sense.
        // setBodyPart(""); 
        setExerciseName("");
        setWeight("");
    };

    const handleRemoveExercise = (index: number) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const handleSave = async () => {
        if (!token) return;
        setIsSaving(true);
        try {
            const formattedDate = format(date, "yyyy-MM-dd");
            await workoutApi.createWorkoutLog(token, {
                date: formattedDate,
                exercises: exercises,
            });
            toast.success("Workout saved successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to save workout");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl">My Daily Routine</CardTitle>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </CardHeader>
                <CardContent>
                    {!isEditable && (
                        <div className="mb-6 p-4 bg-muted/50 rounded-lg flex items-center gap-3 text-muted-foreground">
                            <Lock className="h-5 w-5" />
                            <p>This record is locked. You can view past workouts but can only edit today's routine.</p>
                        </div>
                    )}

                    {/* Input Form - Only visible if editable */}
                    {isEditable && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6 mb-8 p-4 border rounded-lg bg-secondary/20">
                            <div className="space-y-2 lg:col-span-1">
                                <Label>Body Part</Label>
                                <Select value={bodyPart} onValueChange={setBodyPart}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BODY_PARTS.map((part) => (
                                            <SelectItem key={part} value={part}>{part}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 lg:col-span-2">
                                <Label>Exercise / Machine</Label>
                                <Select value={exerciseName} onValueChange={setExerciseName} disabled={!bodyPart}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Exercise..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bodyPart && EXERCISE_OPTIONS[bodyPart]?.map((ex) => (
                                            <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>


                            {bodyPart === "Cardio" ? (
                                <div className="space-y-2">
                                    <Label>Duration (mins)</Label>
                                    <Input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="20"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label>Sets</Label>
                                        <Input
                                            type="number"
                                            value={sets}
                                            onChange={(e) => setSets(e.target.value)}
                                            placeholder="3"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Reps</Label>
                                        <Input
                                            type="number"
                                            value={reps}
                                            onChange={(e) => setReps(e.target.value)}
                                            placeholder="10"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Weight (kg)</Label>
                                        <Input
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex items-end lg:col-span-6 justify-end">
                                <Button onClick={handleAddExercise} disabled={!bodyPart || !exerciseName}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Exercise
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Exercise List */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Dumbbell className="h-5 w-5 text-primary" />
                            Exercises for {format(date, "MMMM do")}
                        </h3>

                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading...</div>
                        ) : exercises.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                                No exercises recorded for this day.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {exercises.map((ex, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-secondary/40 rounded-lg border">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-lg">{ex.exercise_name}</p>
                                                <p className="text-sm text-muted-foreground">{ex.body_part}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                {ex.body_part === "Cardio" ? (
                                                    <p className="font-medium">{ex.duration_minutes} mins</p>
                                                ) : (
                                                    <>
                                                        <p className="font-medium">{ex.sets} sets × {ex.reps} reps</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {ex.weight ? `${ex.weight} kg` : "Bodyweight"}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            {isEditable && (
                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveExercise(idx)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {isEditable && exercises.length > 0 && (
                        <div className="mt-8 flex justify-end">
                            <Button size="lg" onClick={handleSave} disabled={isSaving}>
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? "Saving..." : "Save Routine"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
