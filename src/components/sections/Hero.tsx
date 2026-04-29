import { useState } from "react";
import { ExternalLink, MailIcon, SparklesIcon } from "lucide-react";

import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { Icon, SectionCard, type IconId } from "../ui";
import { useNavigate } from "react-router-dom";

type TechStackItem = {
    name: string;
    icon: IconId;
    color?: string;
};

export default function Hero() {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);
    const techstack: TechStackItem[] = [
        { name: "ReactTS", icon: "react" },
        { name: "TypeScript", icon: "typescript" },
        { name: "NestJS", icon: "nestjs" },
        { name: "Vue", icon: "vue" },
        { name: "GoLang", icon: "go" },
        { name: "PostgreSQL", icon: "postgresql" },
        { name: ".NET", icon: "dotnet" },
        { name: "C#", icon: "csharp" },
        { name: "MongoDB", icon: "mongodb" },
        { name: "Supabase", icon: "supabase" },
    ];

    return (
        <SectionCard className="space-y-6">
            <div className="flex flex-col-reverse md:flex-row gap-8 items-center md:items-start">
                <div className="flex-1">
                    <div
                        className="
                    inline-flex items-center gap-2 px-4 py-1.5 
                    border border-border rounded-full 
                    text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                    bg-primary/5 
                    animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <SparklesIcon className="size-3 md:size-4 fill-primary/15" />
                        <span>Available for Hire</span>
                    </div>
                    <div className="space-y-6 mt-4">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                            CRAFTING{" "}
                            <span className="text-primary italic font-serif">
                                DIGITAL
                            </span>{" "}
                            ARCHITECTURE.
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                            I'm{" "}
                            <span className="text-foreground font-bold underline decoration-primary/30 decoration-4 underline-offset-4">
                                Jürgen Jacobsen
                            </span>
                            , a Full-stack Engineer dedicated to building
                            robust, scalable, and beautiful web applications.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                        <button
                            onClick={() => navigate("/contact")}
                            className="
                            group inline-flex shrink-0 items-center justify-center rounded-xl font-semibold
                            disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap transition-all select-none cursor-pointer
                            px-8 py-2 bg-primary hover:bg-primary/75 text-card duration-300 hover:border-primary/25
                            shadow-md"
                        >
                            <MailIcon className="size-5 mr-2 group-hover:scale-101 transition-transform duration-300" />
                            Let's Talk
                        </button>
                        <button
                            onClick={() => navigate("/projects")}
                            className="
                            group inline-flex shrink-0 items-center justify-center rounded-xl border border-border font-semibold
                            disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap transition-all select-none cursor-pointer
                            px-8 py-2 bg-muted hover:bg-muted/50 duration-300 hover:border-primary/25"
                        >
                            <ExternalLink
                                id="linkedin"
                                className="size-5 mr-2 group-hover:scale-101 transition-transform duration-300"
                            />
                            View Projects
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/3 aspect-square relative group animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
                    <div className="absolute inset-0 bg-primary/10 rounded-xl -rotate-3 group-hover:rotate-6 transition-transform duration-500 animate-essential" />
                    {!imageLoaded && (
                        <Skeleton
                            className={cn("absolute inset-0 rounded-xl z-15")}
                        />
                    )}
                    <img
                        src="/img/profile.jpg"
                        alt="Jürgen Jacobsen"
                        onLoad={() => setImageLoaded(true)}
                        className="relative z-10 w-full h-full object-cover rounded-xl border border-border shadow-xl hover:grayscale transition-all duration-500 brightness-125 group-hover:-rotate-3 animate-essential"
                    />
                </div>
            </div>
            <div className="pt-4 md:pt-10 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                        Core Expertise
                    </span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <div className="flex flex-wrap gap-3">
                    {techstack.map((item, index) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/25 border border-border/50 hover:border-primary/25 hover:bg-card transition-all cursor-default group/item animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                            style={{ animationDelay: `${800 + index * 100}ms` }}
                        >
                            <Icon
                                id={item.icon}
                                className={`size-4 ${item?.color || ""} group-hover/item:scale-110 transition-transform rounded-xs`}
                            />
                            <span className="text-sm font-bold tracking-tight">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}
