import { SectionCard, SEO } from "@/components/shared";
import { HammerIcon, PlaneIcon } from "lucide-react";

export default function Aviation() {

    return (
        <main className="space-y-4 md:space-y-8">
            <SEO
                title="Commercial Aviation & Flight Experience | Jürgen Jacobsen"
                description="Commercial aviation journey, flight experience, and piloting credentials of Jürgen Jacobsen, licensed commercial pilot with 230+ flight hours across various aircraft types."
                canonical="/aviation"
            />
            <SectionCard>

                <header className="space-y-4">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 
                        border border-border rounded-full 
                        text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                        bg-primary/5 
                        animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <PlaneIcon className="size-3 md:size-4" />
                        <span>Pilot Experience</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                        FLIGHT{" "}
                        <span className="text-primary italic font-serif">
                            PRECISION
                        </span>
                        .
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                        This page is dedicated to my aviation experience, showcasing my journey as a licensed commercial pilot. With over 230 flight hours across various aircraft types, I have honed my skills and developed a deep understanding of aviation principles.
                    </p>
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