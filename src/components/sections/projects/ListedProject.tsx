import { CalendarIcon, ClockIcon, StarIcon } from "lucide-react";
import type { ProjectProps } from "@/pages/Projects";
import { Icon } from "@/components/ui/icon";

export default function ListedProject({ project }: { project: ProjectProps }) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="group p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-all bg-muted/20">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl font-black tracking-tight uppercase group-hover:text-primary transition-colors">
                            {project.title}
                        </h2>
                        {project.stars !== undefined && project.stars > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500">
                                <StarIcon className="size-3.5 fill-current" />
                                <span className="text-xs font-bold">
                                    {project.stars}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/50 border border-border/40">
                            <CalendarIcon className="size-3" />
                            <span>
                                Created on {formatDate(project.createdAt)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/50 border border-border/40">
                            <ClockIcon className="size-3" />
                            <span>
                                Updated on {formatDate(project.updatedAt)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="gap-2
                        
                        group inline-flex shrink-0 items-center justify-center rounded-xl border border-border font-semibold
                            disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap transition-all select-none cursor-pointer
                            px-8 py-2 bg-muted hover:bg-muted/50 duration-300 hover:border-primary/25"
                    >
                        <Icon id="github" className="size-4" />
                        View on GitHub
                    </a>
                </div>
            </div>

            <p className="text-muted-foreground font-medium mt-4 leading-relaxed">
                {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag, j) => (
                    <span
                        key={j}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
