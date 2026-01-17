"use client";

import { CometCard } from "@/components/ui/comet-card";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const testimonials = [
    {
        id: "F7RA",
        name: "Alex Thompson",
        role: "Member since 2023",
        image: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?q=80&w=1287&auto=format&fit=crop",
        quote: "Pro Methods completely transformed my approach to fitness. The tracking is intuitive and the results are real.",
    },
    {
        id: "K9LB",
        name: "Sarah Jenkins",
        role: "Yoga Enthusiast",
        image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1000",
        quote: "I love the variety of tutorials available. It feels like having a personal trainer in my pocket!",
    },
    {
        id: "M2XC",
        name: "Mike Chen",
        role: "Bodybuilder",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000",
        quote: "The nutrition tracking is top notch. Finally, an app that understands macros for serious lifters.",
    },
    {
        id: "J8XA",
        name: "Emily Rodriguez",
        role: "Marathon Runner",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1000",
        quote: "Training for my first marathon was daunting, but Pro Methods scheduled my progressive overload perfectly.",
    },
    {
        id: "R4KD",
        name: "David Kim",
        role: "Crossfit Athlete",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000",
        quote: "The community features keep me motivated. Seeing others crush their goals pushes me to work harder.",
    },
];

export function TestimonialsSection() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect)
        };
    }, [emblaApi, onSelect]);

    return (
        <section id="testimonials" className="py-24 bg-black overflow-hidden relative">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                        Success Stories
                    </h2>
                    <p className="text-lg text-gray-400">
                        Hear from our community of achievers.
                    </p>
                </div>

                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-4">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4 flex justify-center">
                                    <div className="scale-90 transition-transform duration-300 transform-gpu">
                                        <CometCard className="p-0 border-0 bg-transparent shadow-none">
                                            <button
                                                type="button"
                                                className="flex w-72 flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 saturate-0 transition-all duration-300 hover:saturate-100" // Reduced width to w-72
                                                aria-label={`View testimonial from ${testimonial.name}`}
                                                style={{
                                                    transformStyle: "preserve-3d",
                                                    transform: "none",
                                                    opacity: 1,
                                                }}
                                            >
                                                <div className="mx-2 flex-1">
                                                    <div className="relative mt-2 aspect-[4/5] w-full overflow-hidden rounded-[16px]">
                                                        <img
                                                            loading="lazy"
                                                            className="absolute inset-0 h-full w-full bg-[#000000] object-cover contrast-75 transition-transform duration-500 hover:scale-105"
                                                            alt={testimonial.name}
                                                            src={testimonial.image}
                                                            style={{
                                                                boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                                                                opacity: 1,
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                                                            <p className="text-white text-xs italic mb-2 line-clamp-3">
                                                                "{testimonial.quote}"
                                                            </p>
                                                            <p className="text-white font-bold text-sm">{testimonial.name}</p>
                                                            <p className="text-gray-400 text-xs">{testimonial.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex flex-shrink-0 items-center justify-center p-4">
                                                    <img
                                                        src="/logos/pm-logo.jpg"
                                                        alt="Pro Methods Logo"
                                                        className="h-8 w-auto object-contain"
                                                    />
                                                </div>
                                            </button>
                                        </CometCard>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-black/50 border-gray-700 hover:bg-white/10 text-white"
                            onClick={scrollPrev}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-black/50 border-gray-700 hover:bg-white/10 text-white"
                            onClick={scrollNext}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    );
}
