"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star, CheckCircle2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
    name: string;
    role: string;
    image: string; // URL
    quote: string;
    location: string;
    rating: number;
    investment: string;
    investmentImg?: string;
    verified: boolean;
}

interface TestimonialCardProps {
    testimonial: Testimonial;
    className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex min-w-0 w-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 sm:p-6 backdrop-blur-sm transition-colors hover:border-amber-500/30 md:min-w-[380px] md:max-w-[380px]",
                className
            )}
        >
            {/* Decorative Gradient Blob */}
            <div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/5 blur-3xl transition-opacity group-hover:opacity-100 opacity-50"
                aria-hidden="true"
            />

            {/* Header: Avatar + Info */}
            <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-zinc-700 shadow-sm group-hover:border-amber-500/50 transition-colors">
                        <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    </div>
                    <div>
                        <h4 className="font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
                            {testimonial.name}
                        </h4>
                        <p className="text-xs font-medium text-zinc-500">{testimonial.role}</p>
                        <div className="mt-1 flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "h-3 w-3 fill-amber-500 text-amber-500",
                                        i >= testimonial.rating && "fill-zinc-800 text-zinc-800"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Quote className="h-6 w-6 text-zinc-800 group-hover:text-amber-500/20 transition-colors" />
            </div>

            {/* Quote Body */}
            <blockquote className="relative z-10 mt-6 flex-1">
                <p className="text-sm leading-relaxed text-zinc-400">
                    "{testimonial.quote}"
                </p>
            </blockquote>

            {/* Footer: Investment Badge */}
            <div className="relative z-10 mt-6 flex items-center justify-between border-t border-zinc-900 pt-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                    {testimonial.verified ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                        <User className="h-3.5 w-3.5" />
                    )}
                    {testimonial.verified ? "Verified Customer" : "Customer"}
                </div>

                <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">Invested In</p>
                    <p className="text-xs font-medium text-amber-500">{testimonial.investment}</p>
                </div>
            </div>
        </motion.div>
    );
}
