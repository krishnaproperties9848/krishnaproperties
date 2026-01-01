import { Compass } from "lucide-react";

export default function GrowthCorridors() {
    return (
        <section className="relative z-10 bg-black pb-24 pt-10">
            <div className="container mx-auto px-6">
                <div className="mx-auto max-w-4xl rounded-2xl border border-gold/20 bg-white/5 p-6 sm:p-10">
                    <div className="flex items-center justify-center gap-3 text-center">
                        <Compass className="h-6 w-6 text-gold" aria-hidden="true" />
                        <h2 className="text-2xl sm:text-3xl font-serif text-gold-light">Hyderabad–Warangal corridor focus</h2>
                    </div>
                    <p className="mt-4 text-center text-sm sm:text-base leading-relaxed text-gray-300">
                        I work primarily in East Hyderabad and along the Hyderabad–Warangal highway belt, where buyers often look for open plots with clear access,
                        neighborhood context, and straightforward next steps.
                    </p>
                </div>
            </div>
        </section>
    );
}
