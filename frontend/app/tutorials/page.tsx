"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/landing/footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoClip {
    id: string;
    title: string;
    thumbnail: string;
    videoUrl: string; // YouTube embed URL
    bodyPart: string;
}

const clips: VideoClip[] = [
    {
        id: "1",
        title: "Full Body HIIT Workout",
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI",
        bodyPart: "Full Body"
    },
    {
        id: "2",
        title: "Perfect Squat Form",
        thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/qZ1P8EpZ9Gg",
        bodyPart: "Legs"
    },
    {
        id: "3",
        title: "10 Min Abs Blaster",
        thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/AnYl6PvIG7w",
        bodyPart: "Core"
    },
    {
        id: "4",
        title: "Chest Press Technique",
        thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/0KffO4R94jI",
        bodyPart: "Chest"
    },
    {
        id: "5",
        title: "Back Row Variations",
        thumbnail: "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/sTANio_2E0Q",
        bodyPart: "Back"
    },
    {
        id: "6",
        title: "Shoulder Press Guide",
        thumbnail: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/XqC_R7655t4",
        bodyPart: "Shoulders"
    },
    {
        id: "7",
        title: "Bicep Curl Mastery",
        thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
        bodyPart: "Arms"
    },
    {
        id: "8",
        title: "Leg Day Essentials",
        thumbnail: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/IZxyjW9bqP0",
        bodyPart: "Legs"
    },
];

export default function TutorialsPage() {
    const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string>("All");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const bodyParts = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body"];

    const filteredClips = selectedBodyPart === "All"
        ? clips
        : clips.filter(clip => clip.bodyPart === selectedBodyPart);

    return (
        <main className="min-h-screen bg-black text-white">
            <Navigation />

            <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        Workout Library
                    </h1>
                    <p className="text-lg text-gray-400 mb-8">
                        Master your technique with our curated video guides.
                    </p>

                    {/* Body Part Filter Dropdown */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30 rounded-lg text-white font-medium hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
                            >
                                <span>Filter by Body Part: {selectedBodyPart}</span>
                                <ChevronDown className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isDropdownOpen && "rotate-180"
                                )} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                                    {bodyParts.map((bodyPart) => (
                                        <button
                                            key={bodyPart}
                                            onClick={() => {
                                                setSelectedBodyPart(bodyPart);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={cn(
                                                "w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors",
                                                selectedBodyPart === bodyPart && "bg-primary/20 text-primary font-semibold"
                                            )}
                                        >
                                            {bodyPart}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dumbbell Rack Style Video Grid */}
                <div className="relative max-w-6xl mx-auto">
                    {filteredClips.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No tutorials found for {selectedBodyPart}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filteredClips.map((clip, index) => {
                                // Create dumbbell rack staggered effect
                                const rowIndex = Math.floor(index / 4);
                                const colIndex = index % 4;
                                const isEvenRow = rowIndex % 2 === 0;
                                const marginTop = isEvenRow
                                    ? colIndex * 20
                                    : (3 - colIndex) * 20;

                                return (
                                    <div
                                        key={clip.id}
                                        onClick={() => setSelectedClip(clip)}
                                        className="group relative cursor-pointer overflow-hidden rounded-xl bg-gray-900 border border-gray-800 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 aspect-[3/4]"
                                        style={{
                                            marginTop: `${marginTop}px`,
                                            animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                                        }}
                                    >
                                        {/* Thumbnail Image */}
                                        <img
                                            src={clip.thumbnail}
                                            alt={clip.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                        {/* Play Button Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="rounded-full bg-primary/90 p-4 shadow-lg transform group-hover:scale-110 transition-transform">
                                                <Play className="h-6 w-6 text-black fill-current" />
                                            </div>
                                        </div>

                                        {/* Text Info */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <span className="inline-block px-2 py-1 mb-2 text-xs font-medium bg-primary/20 text-primary rounded-full border border-primary/20">
                                                {clip.bodyPart}
                                            </span>
                                            <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-2">
                                                {clip.title}
                                            </h3>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

            {/* Video Modal */}
            <Dialog open={!!selectedClip} onOpenChange={(open) => !open && setSelectedClip(null)}>
                <DialogContent className="bg-black/95 border-gray-800 p-0 overflow-hidden max-w-4xl">
                    <DialogHeader className="absolute top-4 left-4 z-50 p-2 bg-black/50 rounded-lg backdrop-blur text-white">
                        <DialogTitle className="sr-only">{selectedClip?.title}</DialogTitle>
                        <span className="font-medium text-sm">{selectedClip?.title}</span>
                    </DialogHeader>

                    <button
                        onClick={() => setSelectedClip(null)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="relative w-full aspect-video">
                        {selectedClip && (
                            <iframe
                                src={`${selectedClip.videoUrl}?autoplay=1&rel=0`}
                                title={selectedClip.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
}
