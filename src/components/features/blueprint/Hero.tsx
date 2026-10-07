import { Icon } from "@/components/shared/icon";
import SectionCard from "@/components/layout/SectionCard";
import { PackageIcon } from "lucide-react";

export default function BlueprintHero() {
    return (
        <SectionCard>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                    <div
                        className="
                        w-fit self-start
                        inline-flex items-center gap-2 px-4 py-1
                        border border-border rounded-full 
                        text-primary text-xs uppercase tracking-wider font-bold
                        bg-muted
                        animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <PackageIcon className="size-3 md:size-4 " />
                        <span>Try it</span>
                    </div>
                    <div className="mt-6">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                            BLUEPRINT
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both max-w-2xl">
                            This is the blueprint I use as a template and starting point for my web development projects. It has the core structure and configurations for launching a new project.
                        </p>
                    </div>
                </div>

                <div className="col-span-1 flex items-center justify-center">
                    <Icon id="ContainerIcon" className="min-h-full min-w-full stroke-muted animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both"/>
                </div>
            </div>
        </SectionCard>
    );
}
