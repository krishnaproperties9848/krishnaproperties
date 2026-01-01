import { ShieldCheck, FileText, Map, Video, Handshake, CheckCircle2 } from "lucide-react";

export default function Assurance() {
    return (
        <section className="relative z-10 bg-black pb-24 pt-10">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <div className="mb-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#F4E4BC]">
                        Complete Transparency
                    </div>
                    <h2 className="text-4xl font-serif text-white md:text-5xl drop-shadow-lg">
                        Krishna Properties’ Assurance
                    </h2>
                    <p className="mt-4 text-gray-400">Five-point verification process for absolute peace of mind</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:grid-rows-2">

                    {/* 1. Verification Support (Large Card) */}
                    <div className="group relative col-span-1 sm:col-span-2 overflow-hidden rounded-2xl sm:rounded-[2rem] border border-gold/30 bg-[#0a0f12] p-5 sm:p-8 md:p-12 transition-all hover:border-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                        {/* Topographic Background Pattern (CSS Fallback) */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: `radial-gradient(circle at center, #d4af37 1px, transparent 1px), radial-gradient(circle at center, #d4af37 1px, transparent 1px)`,
                                backgroundSize: '40px 40px',
                                backgroundPosition: '0 0, 20px 20px'
                            }}>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 h-full">
                            {/* Live Verified Badge - Titanium Design */}
                            <div className="relative flex flex-col items-center justify-center shrink-0">
                                <div className="group/badge relative flex h-32 w-24 flex-col items-center justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f] p-3 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-[#d4af37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">

                                    {/* Background Texture (inline gradient to avoid external asset) */}
                                    <div
                                        className="absolute inset-0 z-0 opacity-20"
                                        style={{
                                            backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                                            backgroundSize: "6px 6px",
                                        }}
                                    ></div>
                                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>

                                    {/* Top: Security Hologram Strip */}
                                    <div className="relative z-10 flex w-full flex-col items-center gap-1 border-b border-white/5 pb-2">
                                        <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80"></div>
                                        <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#888]">Checks</span>
                                    </div>

                                    {/* Center: Hero Icon */}
                                    <div className="relative z-10 flex flex-1 items-center justify-center py-1">
                                        <div className="relative">
                                            <ShieldCheck className="relative h-10 w-10 text-[#d4af37] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" strokeWidth={1.5} />
                                            {/* Subtle animated ring */}
                                            <div className="absolute -inset-2 animate-[spin_3s_linear_infinite] rounded-full border border-[#d4af37]/20 border-t-transparent" aria-hidden="true"></div>
                                        </div>
                                    </div>

                                    {/* Bottom: Status Indicator */}
                                    <div className="relative z-10 flex w-full flex-col items-center gap-1 rounded bg-white/5 py-1.5 backdrop-blur-sm transition-colors group-hover/badge:bg-[#d4af37]/10">
                                        <div className="flex items-center gap-1.5">
                                            <div className="relative flex h-1.5 w-1.5 shrink-0">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                            </div>
                                            <span className="text-[8px] font-bold uppercase tracking-wider text-gray-300 group-hover/badge:text-[#d4af37]">Active</span>
                                        </div>
                                    </div>

                                    {/* Holographic Sheen Overlay */}
                                    <div className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-700 group-hover/badge:opacity-100" style={{ transform: 'skewX(-20deg) translateX(-150%)', transition: 'transform 0.7s ease-in-out' }}></div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <h3 className="text-2xl md:text-3xl font-serif text-white">Document & Site Verification Support</h3>
                                <p className="text-gray-400 font-light">Guidance to review documents, approvals, and on-ground details before you buy</p>

                                {/* Fake Document Lines */}
                                <div className="mt-4 space-y-2 opacity-50">
                                    <div className="h-1 w-3/4 bg-gold/20 rounded"></div>
                                    <div className="h-1 w-1/2 bg-gold/20 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Clear Title Review */}
                    <div className="group relative col-span-1 overflow-hidden rounded-2xl sm:rounded-[2rem] border border-gold/30 bg-[#0a0f12] p-5 sm:p-8 text-center transition-all hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col items-center justify-center">
                        <div className="mb-6 rounded-full border border-gold/40 bg-black/50 p-4 text-[#d4af37]">
                            <FileText className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">30-Year Clear Title History</h3>
                        <p className="text-sm text-gray-500">Support for document and title checks</p>
                    </div>

                    {/* 3. Physical Site Survey (Mapping) */}
                    <div className="group relative col-span-1 overflow-hidden rounded-2xl sm:rounded-[2rem] border border-gold/30 bg-[#0a0f12] p-5 sm:p-8 text-center transition-all hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col items-center justify-center">
                        <div className="mb-6 rounded-full border border-gold/40 bg-black/50 p-4 text-[#d4af37]">
                            <Map className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">Physical Site Survey</h3>
                        <p className="text-sm text-gray-500">Professional site surveys mapping boundary verification</p>
                    </div>

                    {/* 4. Transparent Progress Tracking */}
                    <div className="group relative col-span-1 overflow-hidden rounded-2xl sm:rounded-[2rem] border border-gold/30 bg-[#0a0f12] p-5 sm:p-8 text-center transition-all hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col items-center justify-center">
                        <div className="mb-6 rounded-full border border-gold/40 bg-black/50 p-4 text-[#d4af37]">
                            <Video className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">Transparent Updates</h3>
                        <p className="text-sm text-gray-500">Periodic photos/videos on progress and compliance steps</p>
                    </div>

                    {/* 5. Negotiation & Documentation Support */}
                    <div className="group relative col-span-1 overflow-hidden rounded-2xl sm:rounded-[2rem] border border-gold/30 bg-[#0a0f12] p-5 sm:p-8 text-center transition-all hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col items-center justify-center">
                        <div className="mb-6 rounded-full border border-gold/40 bg-black/50 p-4 text-[#d4af37]">
                            <Handshake className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">Negotiation Support</h3>
                        <p className="text-sm text-gray-500">Aligned to buyer’s interests with documentation guidance</p>
                    </div>

                    {/* 6. Post-Sale Support */}
                    <div className="group relative col-span-1 overflow-hidden rounded-2xl sm:rounded-[2rem] border border-gold/30 bg-[#0a0f12] p-5 sm:p-8 text-center transition-all hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] flex flex-col items-center justify-center">
                        <div className="mb-6 rounded-full border border-gold/40 bg-black/50 p-4 text-[#d4af37]">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2">Post-Sale Checklist</h3>
                        <p className="text-sm text-gray-500">Support on mutation, taxes, and basic post-registration steps</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
