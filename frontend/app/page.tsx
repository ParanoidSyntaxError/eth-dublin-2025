export default function Home() {
    return (
        <div className="pt-16 min-h-screen w-screen bg-black text-white overflow-hidden relative">
            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-8">
                        {/* Main Title */}
                        <div className="space-y-4">
                            <h1 className="text-8xl md:text-9xl font-bold tracking-tight">
                                HACK.
                                <br />
                                FUND
                            </h1>

                            <div className="space-y-4">
                                <div className="inline-block">
                                    <span className="bg-green-400 text-black px-4 py-2 text-2xl md:text-3xl font-bold">
                                        Bridging the Valley of Death
                                    </span>
                                </div>

                                <div className="inline-block">
                                    <span className="bg-pink-300 text-black px-4 py-2 text-xl md:text-2xl font-semibold">
                                        ETH Dublin 2025 - Hackathon
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}