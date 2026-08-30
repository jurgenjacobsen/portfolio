import AviationHero from "@/components/features/aviation/Hero";
import { SectionCard, SEO } from "@/components/shared";
import { Link } from "react-router-dom";
import {
    PlaneIcon,
    CompassIcon,
    ClockIcon,
    FileTextIcon,
    Code2Icon,
    ArrowRightIcon,
} from "lucide-react";

export default function Aviation() {
    return (
        <main className="space-y-6 md:space-y-8 animate-in fade-in duration-700 delay-100 fill-mode-both">
            <SEO
                title="Commercial Aviation & Flight Experience | Jürgen Jacobsen"
                description="Commercial aviation journey, flight experience, and piloting credentials of Jürgen Jacobsen, licensed commercial pilot with 230+ flight hours across various aircraft types."
                canonical="/aviation"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Aviation", path: "/aviation" },
                ]}
            />

            <AviationHero />

            {/* Under Construction Banner Card */}
            <SectionCard className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                <header className="space-y-4">
                    {/* Status badges */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-border rounded-full text-[10px] md:text-xs uppercase tracking-wider font-bold bg-primary/5 text-primary">
                            <span className="relative flex size-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-2 bg-amber-500"></span>
                            </span>
                            <span>This page is under construction</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[0.95] text-foreground">
                        FLIGHT DATA &{" "}
                        <span className="text-primary italic font-serif">
                            CREDENTIALS
                        </span>
                        .
                    </h1>

                    {/* Description */}
                    <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl">
                        This section is currently undergoing active development. Detailed
                        aircraft endorsements, flight hour breakdowns, route logs,
                        cross-country navigation records, and instrument approach
                        procedure archives are being compiled and will be available soon.
                    </p>
                </header>

                {/* Minimalist Upcoming Modules Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                            <CompassIcon className="size-4 text-primary/70" />
                            <span>Route Histories</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Interactive flight trajectories, cross-country flight paths, and
                            aerodrome operations across Europe.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                            <PlaneIcon className="size-4 text-primary/70" />
                            <span>Fleet & Ratings</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Single-engine (SEP) and multi-engine (MEP) aircraft hours, glass
                            cockpit avionics, and simulator time.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                            <ClockIcon className="size-4 text-primary/70" />
                            <span>SOPs & Procedures</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Standard operating procedures, IFR departure & arrival
                            procedures, and flight training documentation.
                        </p>
                    </div>
                </div>

                {/* Quick Navigation Links */}
                <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs text-muted-foreground font-medium">
                        In the meantime, feel free to explore other sections:
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5 text-xs md:text-sm">
                        <Link
                            to="/cv"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/85 transition-all cursor-pointer"
                        >
                            <FileTextIcon className="size-4" />
                            <span>View Pilot CV</span>
                        </Link>
                        <Link
                            to="/code"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold border border-border bg-card hover:bg-muted/50 text-foreground transition-all cursor-pointer"
                        >
                            <Code2Icon className="size-4" />
                            <span>View Code</span>
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold border border-border bg-card hover:bg-muted/50 text-foreground transition-all cursor-pointer"
                        >
                            <span>Get in Touch</span>
                            <ArrowRightIcon className="size-3.5" />
                        </Link>
                    </div>
                </div>
            </SectionCard>
        </main>
    );
}