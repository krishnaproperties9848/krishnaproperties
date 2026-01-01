import { MapPinned, FileText, Handshake } from "lucide-react";

export default function Features() {
    return (
        <section className="relative z-10 bg-black pb-24 pt-10">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-serif text-gold-light md:text-5xl">
                        Services
                    </h2>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 sm:gap-10 md:gap-12">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center text-center group">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-gold/5 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                            <MapPinned className="h-12 w-12 text-gold" />
                        </div>
                        <h3 className="mb-3 font-serif text-xl text-white">
                            Plot Shortlisting
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Shortlist open plots by budget, location, and timeline across East Hyderabad and the Hyderabad–Warangal corridor.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center text-center group">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-gold/5 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                            <FileText className="h-12 w-12 text-gold" />
                        </div>
                        <h3 className="mb-3 font-serif text-xl text-white">
                            Document & Site Check Support
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Guidance to review basic documents and on-ground details before you pay an advance.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center text-center group">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-gold/5 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                            <Handshake className="h-12 w-12 text-gold" />
                        </div>
                        <h3 className="mb-3 font-serif text-xl text-white">
                            Negotiation & Registration Support
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Help coordinating with sellers and understanding the paperwork steps through registration.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
