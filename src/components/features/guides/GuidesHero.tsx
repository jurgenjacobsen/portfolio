import SectionCard from "@/components/layout/SectionCard";
import { BookOpenIcon } from "lucide-react";

export default function GuidesHero() {
    return (
        <SectionCard className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <header className="space-y-4">
                <div
                    className="
                    w-fit self-start
                    inline-flex items-center gap-2 px-4 py-1
                    border border-border rounded-full 
                    text-primary text-xs uppercase tracking-wider font-bold
                    bg-muted
                    animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                    <BookOpenIcon aria-hidden="true" className="size-3 md:size-4 "/>
                    <span>Guides</span>
                </div>

                <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                    KNOWLEDGE GUIDES
                </h2>

                <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both max-w-3xl">
                    Curated reference manuals, aviation standard operating
                    procedures, software engineering workflows, and system
                    guides built for clarity and precision.
                </p>
            </header>
        </SectionCard>
    );
}
