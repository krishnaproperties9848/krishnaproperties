import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative w-full pb-16 pt-28 sm:pb-20 sm:pt-36 lg:min-h-[85vh] lg:pt-60">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Open plots in East Hyderabad and the Hyderabad–Warangal corridor"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto px-4 sm:px-8 lg:px-12">
                <div className="max-w-4xl">
                    <h1 className="mb-6 sm:mb-8 font-serif text-[clamp(2rem,7vw,4.5rem)] font-medium leading-[1.1] text-gold-light">
                        Open plots, simplified.
                        <br />
                        <span className="text-white">East Hyderabad &amp; Hyderabad–Warangal corridor.</span>
                    </h1>

                    <p className="mb-8 sm:mb-10 max-w-xl text-base sm:text-lg leading-relaxed text-gray-200 md:text-xl">
                        Shortlist the right plot with clear, practical guidance from Bhukya Krishna (Senior Property Consultant).
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                        <a
                            href="tel:+919848151456"
                            className="flex h-12 sm:h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold-light via-gold to-gold-dark px-6 sm:px-8 text-sm sm:text-base font-bold text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] focus-ring"
                            aria-label="Call Bhukya Krishna at +91 9848 151 456"
                        >
                            Call +91 9848 151 456
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
