import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Award } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative bg-[#020405] pt-24 sm:pt-32 pb-12">

            {/* --- CTA Section: Ready to Build Your Legacy? --- */}
            {/* Positioned absolutely to overlap or sit nicely above main footer content */}
            <div className="relative mb-12 z-20 px-4 md:px-8">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-r from-[#1a1c20] to-[#0d0f12] p-6 sm:p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 ring-1 ring-gold/20">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-gold/5 to-transparent skew-x-12 opacity-50"></div>
                    <div className="absolute bottom-0 right-0 h-full w-32 bg-gradient-to-l from-gold/5 to-transparent -skew-x-12 opacity-50"></div>

                    <h2 className="relative z-10 mb-2 text-2xl sm:text-3xl font-serif text-[#f2f2f2] md:text-5xl">
                        Speak with <span className="text-[#d4af37] italic">Bhukya Krishna</span>
                    </h2>
                    <p className="relative z-10 mx-auto mb-10 max-w-2xl text-gray-400">
                        Tell me your budget and preferred location. I’ll share practical options and next steps.
                    </p>

                    <div className="relative z-10 flex flex-col items-center justify-center gap-4 md:flex-row">
                        <a
                            href="tel:+919848151456"
                            className="group flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 sm:px-8 text-sm sm:text-base text-black font-bold transition-transform hover:scale-105 focus-ring"
                            aria-label="Call Bhukya Krishna at +91 9848 151 456"
                        >
                            <Phone className="h-4 w-4 fill-black" />
                            Call +91 9848 151 456
                        </a>
                    </div>
                </div>
            </div>

            {/* --- Main Footer Content --- */}
            <div className="container mx-auto px-6">
                {/* Gold Divider */}
                <div className="mb-16 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-8">

                    {/* 1. Brand & Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-xl font-serif text-gold">
                                K
                            </div>
                            <div>
                                <h3 className="text-xl font-serif text-[#f2f2f2] tracking-wide">KRISHNA</h3>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Properties</p>
                                <p className="mt-1 text-[10px] font-medium tracking-wide text-gray-300">Bhukya Krishna · Senior Property Consultant</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Open plots across East Hyderabad and the Hyderabad–Warangal corridor. Trusted local guidance for 15+ years.
                        </p>
                    </div>

                    {/* 2. Quick Links */}
                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#d4af37]">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
                            <li><Link href="/services" className="hover:text-gold transition-colors">Services</Link></li>
                            <li><Link href="/brochures" className="hover:text-gold transition-colors">Brochures</Link></li>
                            <li><Link href="/testimonials" className="hover:text-gold transition-colors">Testimonials</Link></li>
                            <li><Link href="/insights" className="hover:text-gold transition-colors">Blog</Link></li>
                            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* 4. Contact Desk */}
                    <div>
                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#d4af37]">Contact Desk</h4>
                        <div className="space-y-5 text-sm text-gray-400">
                            <div className="flex gap-3">
                                <MapPin className="h-5 w-5 text-gold shrink-0 mt-1" />
                                <div className="space-y-3">
                                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                        <p className="text-[11px] uppercase tracking-[0.15em] text-gold font-semibold mb-1">Corporate Office</p>
                                        <p className="leading-relaxed text-gray-300">
                                            H.No: 8-3-940/A, Flat No. 205, Tirumala Shah Apartments, Ameerpet X Roads, Hyderabad – 500 073
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                                        <p className="text-[11px] uppercase tracking-[0.15em] text-gold font-semibold mb-1">Branch Office</p>
                                        <p className="leading-relaxed text-gray-300">
                                            D.No: 2-1-46/1, 3rd Floor, Sri Venkateswara Housing Colony, Above KS Bakers, Opp. Metro Pillar No. 865, Uppal, Medchal-Malkajgiri District, Telangana – 500 039
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gold shrink-0" />
                                <span>+91 9848 151 456</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gold shrink-0" />
                                <a href="mailto:krishnaproperties9848@gmail.com" className="hover:text-gold transition-colors">krishnaproperties9848@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <MessageCircle className="h-5 w-5 text-gold shrink-0" />
                                <a href="https://wa.me/919848151456" className="hover:text-gold transition-colors">WhatsApp: +91 9848 151 456</a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Copyright */}
                <div className="mt-16 border-t border-white/5 py-8 text-center text-xs text-gray-600">
                    © 2025 Krishna Properties. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
