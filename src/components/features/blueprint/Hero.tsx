import { Icon, SectionCard } from "@/components/shared";

export default function BlueprintHero() {
    return (
        <SectionCard>
            <div className="grid grid-cols-4 gap-6">
                <div className="space-y-6 col-span-3">
                    <div
                        className="
                    inline-flex items-center gap-2 px-4 py-1.5 
                    border border-border rounded-full 
                    text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                    bg-primary/5 
                    animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <Icon id="Package" />
                        <span>Try it</span>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                            BLUE
                            <span className="text-primary italic font-serif text-3xl md:text-7xl">
                                PRINT
                            </span>
                            .
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                            This is the blueprint I use as a template and starting point for my web development projects. It has the core structure and configurations for launching a new project.
                        </p>
                    </div>
                </div>

                <div className="col-span-1 flex items-center justify-center">
                    <Icon id="ContainerIcon" className="min-h-full min-w-full stroke-muted"/>
                </div>
            </div>
        </SectionCard>
    );
}
