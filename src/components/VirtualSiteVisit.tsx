"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

const images = [
    {
        src: "/aerial-1.png",
        label: "Aerial Plot View",
        description: "Complete overhead view showcasing plot dimensions and surrounding infrastructure"
    },
    {
        src: "/aerial-2.png",
        label: "Panorama View",
        description: "360-degree view of the entire neighborhood and green cover"
    },
    {
        src: "/aerial-1.png", // Reusing due to generation limit
        label: "Street View",
        description: "Ground-level perspective of the internal roads and access points"
    },
    {
        src: "/aerial-2.png", // Reusing due to generation limit
        label: "Amenity View",
        description: "Close-up of the clubhouse and recreational facilities"
    }
];

export default function VirtualSiteVisit() {
    const [activeImage, setActiveImage] = useState(0);

    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section className="relative z-10 bg-black pb-24 pt-10">
            <div className="container mx-auto px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl sm:text-4xl font-serif text-[#F4E4BC] md:text-5xl uppercase tracking-wide sm:tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        Virtual Site-Visit Suite
                    </h2>
                    <p className="mt-4 text-gray-400 font-medium tracking-wide">Professional drone photography and detailed documentation</p>
                </div>

                <div className="mx-auto max-w-5xl">
                    {/* Main Display */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-[2rem] border border-[#d4af37]/60 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                        <Image
                            src={images[activeImage].src}
                            alt={images[activeImage].label}
                            fill
                            sizes="(max-width: 768px) 100vw, 1024px"
                            className="object-cover transition-all duration-500"
                        />

                        {/* Compass Overlay */}
                        <div className="absolute top-6 right-6 z-20">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/80 bg-black/60 text-[#d4af37] backdrop-blur-md">
                                <Compass className="h-6 w-6" />
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button onClick={prevImage} className="absolute left-2 sm:left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 sm:p-3 text-white backdrop-blur-sm transition-colors hover:bg-[#d4af37] hover:text-black focus-ring" aria-label="Previous image">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 sm:right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 sm:p-3 text-white backdrop-blur-sm transition-colors hover:bg-[#d4af37] hover:text-black focus-ring" aria-label="Next image">
                            <ChevronRight className="h-6 w-6" />
                        </button>

                        {/* Text Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 pt-24 text-left">
                            <h3 className="text-3xl font-serif text-[#F4E4BC] mb-2">{images[activeImage].label}</h3>
                            <p className="text-gray-300 text-sm md:text-base max-w-2xl">{images[activeImage].description}</p>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImage(index)}
                                className={`group relative aspect-video w-full overflow-hidden rounded-xl border transition-all duration-300 ${activeImage === index ? 'border-[#d4af37] ring-1 ring-[#d4af37] scale-105' : 'border-[#d4af37]/30 hover:border-[#d4af37]/60'
                                    }`}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.label}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/20"></div>
                                <div className="absolute bottom-2 left-0 right-0 text-center">
                                    <span className="text-xs font-medium text-white drop-shadow-md">{img.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer Button */}
                    <div className="mt-12 text-center">
                        <button className="h-12 rounded-full bg-gradient-to-b from-[#d4af37] to-[#aa8c2c] px-8 sm:px-10 text-sm font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] uppercase tracking-wide border border-[#F4E4BC]/50 focus-ring">
                            Start Virtual Tour
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
