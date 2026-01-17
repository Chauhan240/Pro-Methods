"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Scale, Ruler, Edit2, Save, X } from "lucide-react"

export function BodyStats() {
    const { user, token, updateUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [weight, setWeight] = useState<string>("")
    const [height, setHeight] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setWeight(user.weight?.toString() || "")
            setHeight(user.height?.toString() || "")
        }
    }, [user])

    const handleSave = async () => {
        if (!token) return
        setIsLoading(true)
        try {
            const updatedUser = await api.updateProfile(token, {
                weight: parseFloat(weight) || null,
                height: parseFloat(height) || null,
            })
            updateUser(updatedUser)
            setIsEditing(false)
            toast.success("Body stats updated!")
        } catch (error) {
            toast.error("Failed to update stats")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Body Stats</CardTitle>
                {!isEditing ? (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4" />
                    </Button>
                ) : (
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Scale className="h-4 w-4" />
                            Weight (kg)
                        </div>
                        {isEditing ? (
                            <Input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="h-8"
                                placeholder="0.0"
                            />
                        ) : (
                            <p className="text-2xl font-bold">{user?.weight || "--"} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Ruler className="h-4 w-4" />
                            Height (in)
                        </div>
                        {isEditing ? (
                            <Input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="h-8"
                                placeholder="0.0"
                            />
                        ) : (
                            <p className="text-2xl font-bold">{user?.height || "--"} <span className="text-sm font-normal text-muted-foreground">in</span></p>
                        )}
                    </div>
                </div>
                {isEditing && (
                    <Button className="w-full mt-4" size="sm" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
