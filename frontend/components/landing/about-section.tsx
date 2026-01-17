import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function AboutSection() {
    return (
        <section id="about" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            MEET THE FOUNDER
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                            Nishant Jain
                        </h2>
                        <div className="space-y-4 text-muted-foreground text-lg">
                            <p>
                                Welcome to Pro Methods! I'm Nishant Jain, and my mission is to help you unlock your true potential through disciplined training and expert guidance.
                            </p>
                            <p>
                                With years of experience in the fitness industry, I've designed Pro Methods to be more than just a gym—it's a community where we push boundaries, break personal records, and build lasting strength.
                            </p>
                            <p>
                                My philosophy is simple: consistent effort combined with the right methods yields extraordinary results. Join us, and let's craft the best version of yourself together.
                            </p>
                        </div>
                    </div>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border shadow-xl">
                        {/* Placeholder for Video Embed */}
                                    <div className="relative aspect-video rounded-xl overflow-hidden border border-border shadow-xl">
                    <iframe
                        className="absolute inset-0 w-full h-full rounded-xl"
                        src="https://www.youtube.com/embed/W0yfS44RVsM"
                        title="Pro Methods Founder Introduction"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
