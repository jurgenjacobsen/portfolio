import {
    HammerIcon,
    MapIcon,
} from "lucide-react";

import { SectionCard, SEO } from "@/components/shared";

export default function Charts() {
    return (
        <main className="space-y-6 md:space-y-8">
            <SEO
                title="Aeronautical Cartography & Procedure Design | Jürgen Jacobsen"
                description="Custom aeronautical cartography and procedural chart design tailored for flight schools, visual approach plates (VAC), and flight training SOP guides."
                canonical="/charts"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Aeronautical Charts", path: "/charts" },
                ]}
            />
            {/* 1. Header SectionCard */}
            <SectionCard className="space-y-6">

                <header className="space-y-4">
                    {/* Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 
                            border border-border rounded-full 
                            text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                            bg-primary/5 
                            animate-in fade-in slide-in-from-bottom-4 duration-700"
                        >
                            <MapIcon className="size-3.5 md:size-4" />
                            <span>Aeronautical Cartography & Procedure Design</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                        AERONAUTICAL{" "}
                        <span className="text-primary italic font-serif">
                            CHARTS
                        </span>
                        .
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                        Custom aeronautical cartography and procedural chart design tailored for flight schools, training academies, and pilot operations. Drawing inspiration from industry gold standards like <strong className="text-foreground">Jeppesen</strong> and <strong className="text-foreground">Lufthansa Systems LIDO</strong>, I design bespoke visual approach plates (VAC), aerodrome traffic circuits, training sector maps, and flight training SOP guides engineered for optimal cockpit legibility, situational awareness, and safety.
                    </p>

                    {/* Key Competencies Badges */}
                    <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                        {[
                            "Flight School SOPs",
                            "Training Instrument Procedures",
                            "ICAO PANS-OPS 8168",
                            "IFR Theory & Practice Design",
                        ].map((badge, idx) => (
                            <span
                                key={idx}
                                className="text-xs font-semibold px-3 py-1 rounded-lg bg-muted/40 border border-border text-foreground/90"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                    {/* TEMPORARY */}
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 
                            border border-border rounded-full 
                            text-[10px] md:text-xs uppercase tracking-wider font-bold
                            bg-primary/5 text-red-500
                        "
                        >
                            <HammerIcon className="size-3 md:size-4" />
                            <span>Page under construction</span>
                        </div>
                    </div>
                </header>
            </SectionCard>
        </main>
    );
}