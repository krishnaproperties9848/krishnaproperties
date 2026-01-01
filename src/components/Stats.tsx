export default function Stats() {
    return (
        <div className="w-full border-t border-b border-gold/30 py-8 bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto px-6">
                <div className="grid divide-y divide-gold/30 md:grid-cols-3 md:divide-x md:divide-y-0 text-center">
                    <div className="py-4 md:px-4">
                        <div className="mb-2 font-serif text-3xl text-gold-light sm:text-4xl md:text-5xl">
                            500+
                        </div>
                        <div className="text-sm font-medium uppercase tracking-wider text-gray-300">
                            Acres Managed
                        </div>
                    </div>
                    <div className="py-4 md:px-4">
                        <div className="mb-2 font-serif text-3xl text-gold-light sm:text-4xl md:text-5xl">
                            ₹2,000Cr+
                        </div>
                        <div className="text-sm font-medium uppercase tracking-wider text-gray-300">
                            Portfolio Value
                        </div>
                    </div>
                    <div className="py-4 md:px-4">
                        <div className="mb-2 font-serif text-3xl text-gold-light sm:text-4xl md:text-5xl">
                            Zero
                        </div>
                        <div className="text-sm font-medium uppercase tracking-wider text-gray-300">
                            Litigation Record
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
