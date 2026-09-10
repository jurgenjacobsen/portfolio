import { SectionCard } from "@/components/shared";
import { BookOpenIcon } from "lucide-react";

export default function GuidesHero() {
    return (
        <SectionCard className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold bg-primary/5">
                    <BookOpenIcon aria-hidden="true" className="size-4" />
                    <span>Guides</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                    KNOWLEDGE{" "}
                    <span className="text-primary italic font-serif">
                        GUIDES
                    </span>
                    .
                </h1>

                <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl">
                    Curated reference manuals, aviation standard operating
                    procedures, software engineering workflows, and system
                    guides built for clarity and precision.
                </p>
            </header>
        </SectionCard>
    );
}
