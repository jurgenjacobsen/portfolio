import { UserIcon, GraduationCapIcon, MapPinIcon } from "lucide-react";
import { SectionCard, Skeleton } from "@/components/ui";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AboutHero() {
    const [imageLoaded, setImageLoaded] = useState(false);

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
                        <UserIcon className="size-3 md:size-4 fill-primary/15" />
                        <span>Profile</span>
                    </div>
                    <div className="space-y-6 mt-4">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                            STORY BEHIND THE{" "}
                            <span className="text-primary italic font-serif">
                                CODE
                            </span>
                            .
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                            I am a software engineer based in Porto, Portugal,
                            with a profound interest in the intersection of
                            design and complex system architecture. My journey
                            in tech is driven by a relentless curiosity for how
                            things work and a commitment to building software
                            that makes an impact.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPinIcon className="size-4 text-primary" />
                            <span className="text-sm font-bold uppercase tracking-tight">
                                Porto, Portugal
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <GraduationCapIcon className="size-4 text-primary" />
                            <span className="text-sm font-bold uppercase tracking-tight">
                                Full-Stack Engineer
                            </span>
                        </div>
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
        </SectionCard>
    );
}
