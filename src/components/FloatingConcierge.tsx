"use client";

import { useState } from "react";
import { Phone, MessageCircle, Mail, X, MessageSquare } from "lucide-react";

export default function FloatingConcierge() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed right-4 sm:right-8 z-[100] flex flex-col items-end gap-4 bottom-safe" style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}>

            {/* Expandable Menu */}
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col gap-3">
                    {/* Phone */}
                    <a href="tel:+919848151456" className="flex h-12 items-center gap-3 rounded-full bg-white pl-4 pr-2 shadow-xl transition-transform hover:scale-105 focus-ring">
                        <span className="text-sm font-bold text-gray-700">Call Us</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Phone className="h-5 w-5" />
                        </div>
                    </a>

                    {/* WhatsApp */}
                    <a href="https://wa.me/919848151456" className="flex h-12 items-center gap-3 rounded-full bg-white pl-4 pr-2 shadow-xl transition-transform hover:scale-105 focus-ring">
                        <span className="text-sm font-bold text-gray-700">WhatsApp</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                            <MessageCircle className="h-5 w-5" />
                        </div>
                    </a>

                    {/* Email */}
                    <a href="mailto:krishnaproperties9848@gmail.com" className="flex h-12 items-center gap-3 rounded-full bg-white pl-4 pr-2 shadow-xl transition-transform hover:scale-105 focus-ring">
                        <span className="text-sm font-bold text-gray-700">Email</span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white">
                            <Mail className="h-5 w-5" />
                        </div>
                    </a>
                </div>
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f9df7b] text-black shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all hover:scale-110 hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] focus-ring"
                aria-label={isOpen ? "Close contact options" : "Open contact options"}
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                {/* Pulse Effect - respects reduced motion via CSS */}
                <span className="absolute -inset-1 rounded-full border border-gold/50 opacity-0 transition-opacity group-hover:opacity-100 animate-ping" aria-hidden="true"></span>

                {isOpen ? (
                    <X className="h-8 w-8 transition-transform rotate-90" />
                ) : (
                    <MessageSquare className="h-8 w-8" />
                )}
            </button>
        </div>
    );
}
