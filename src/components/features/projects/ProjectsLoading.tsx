import { useState, useEffect } from "react";
import { Code2Icon, SparklesIcon, LoaderCircle, Dot } from "lucide-react";
import SectionCard from "@/components/layout/SectionCard";

const LOADING_STEPS = [
    "Querying Supabase project registry…",
    "Resolving repository manifests…",
    "Hydrating GitHub stargazers & metrics…",
    "Compiling software catalog…",
];

export function ProjectsListLoading() {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
        }, 1400);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 fill-mode-both">
            {/* Live Status Banner */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                                <LoaderCircle className="animate-spin size-4 text-primary" aria-hidden="true" />
                                Indexing Catalog
                            </span>
                            <Dot className="text-muted-foreground/25 hidden sm:inline"/>
                            <span
                                key={stepIndex}
                                className="text-xs text-muted-foreground font-medium animate-in fade-in duration-300"
                            >
                                {LOADING_STEPS[stepIndex]}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Subtle scanning beam indicator */}
                <div className="h-0.5 w-full bg-muted overflow-hidden rounded-full relative">
                    <div className="h-full bg-primary/40 rounded-full animate-pulse w-3/5" />
                </div>
            </div>

            {/* Staggered Project Card Skeletons */}
            <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                    <ProjectCardSkeleton key={i} index={i} />
                ))}
            </div>
        </div>
    );
}

function ProjectCardSkeleton({ index }: { index: number }) {
    const titleWidths = ["w-48 sm:w-64", "w-56 sm:w-72", "w-40 sm:w-56"];
    const descWidths = ["w-4/5", "w-3/5", "w-2/3"];

    return (
        <div
            className="p-4 md:p-6 rounded-xl border border-border bg-card shadow-xs animate-in fade-in duration-500 fill-mode-both"
            style={{ animationDelay: `${index * 120}ms` }}
        >
            <div className="flex flex-col md:grid md:grid-cols-4 gap-6 items-start">
                <div className="md:col-span-3 space-y-3.5 w-full">
                    {/* Title & Star Pill */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div
                            className={`h-7 rounded-lg bg-muted/80 animate-pulse ${titleWidths[index % titleWidths.length]}`}
                        />
                        <div className="h-6 w-16 rounded-full bg-muted/50 animate-pulse" />
                    </div>

                    {/* Description lines */}
                    <div className="space-y-2 pt-0.5">
                        <div className="h-4 w-full max-w-2xl rounded-md bg-muted/60 animate-pulse" />
                        <div
                            className={`h-4 rounded-md bg-muted/40 animate-pulse ${descWidths[index % descWidths.length]}`}
                        />
                    </div>

                    {/* Tech tag pills & metadata */}
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                        <div className="h-5 w-16 rounded-full bg-muted/60 animate-pulse" />
                        <div className="h-5 w-20 rounded-full bg-muted/60 animate-pulse" />
                        <div className="h-5 w-14 rounded-full bg-muted/50 animate-pulse" />
                        <div className="h-5 w-24 rounded-full bg-muted/40 animate-pulse hidden sm:block" />
                        <span className="hidden sm:inline text-muted/50 ml-1">•</span>
                        <div className="h-4 w-24 rounded bg-muted/30 animate-pulse hidden sm:block" />
                    </div>
                </div>

                {/* Action Buttons on right */}
                <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <div className="h-9 rounded-xl bg-muted/50 animate-pulse flex-1 md:w-28" />
                    <div className="h-9 rounded-xl bg-muted/80 animate-pulse flex-1 md:w-28" />
                </div>
            </div>
        </div>
    );
}

export function ProjectHighlightSkeleton() {
    return (
        <SectionCard className="space-y-6 animate-in fade-in duration-500 fill-mode-both">
            <header>
                <div
                    className="
                    w-fit self-start
                    inline-flex items-center gap-2 px-4 py-1
                    border border-border rounded-full 
                    text-primary text-xs uppercase tracking-wider font-bold
                    bg-primary/5 
                    animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                    <Code2Icon className="size-3 md:size-4" aria-hidden="true" />
                    <span>Programming</span>
                </div>
                <h1 className="mt-6 text-4xl md:text-7xl font-black tracking-tighter uppercase text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                    CODE PROJECTS
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                    A collection of my web development projects, showcasing a
                    range of skills and technologies. From full-stack
                    applications to open-source contributions, these projects
                    highlight my expertise in building innovative solutions.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Main featured skeleton card */}
                <div className="md:col-span-3 flex flex-col h-full overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                    <div className="w-full aspect-16/10 md:aspect-auto md:flex-1 min-h-52 md:min-h-64 bg-muted/60 animate-pulse relative overflow-hidden flex items-center justify-center border-b border-border">
                        <SparklesIcon className="size-8 text-muted-foreground/20 animate-pulse" aria-hidden="true" />
                    </div>
                    <div className="p-4 md:p-6 shrink-0 space-y-4">
                        <div className="flex justify-between items-center gap-4">
                            <div className="h-8 w-56 rounded-lg bg-muted/80 animate-pulse" />
                            <div className="flex gap-2">
                                <div className="size-8 rounded-md bg-muted/60 animate-pulse" />
                                <div className="size-8 rounded-md bg-primary/40 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-full rounded bg-muted/50 animate-pulse" />
                            <div className="h-4 w-4/5 rounded bg-muted/40 animate-pulse" />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            <div className="h-6 w-20 rounded-full bg-muted/50 animate-pulse" />
                            <div className="h-6 w-24 rounded-full bg-muted/50 animate-pulse" />
                            <div className="h-6 w-16 rounded-full bg-muted/50 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Secondary featured skeleton cards (stack of 3) */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-border bg-card overflow-hidden shadow-xs"
                        >
                            <div className="aspect-3/1 w-full bg-muted/50 animate-pulse flex items-center justify-center border-b border-border">
                                <Code2Icon className="size-5 text-muted-foreground/20 animate-pulse" aria-hidden="true" />
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="h-5 w-40 rounded bg-muted/80 animate-pulse" />
                                <div className="flex gap-2 pt-1">
                                    <div className="h-5 w-16 rounded-full bg-muted/50 animate-pulse" />
                                    <div className="h-5 w-14 rounded-full bg-muted/50 animate-pulse" />
                                    <div className="h-5 w-20 rounded-full bg-muted/40 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}

export default ProjectsListLoading;
