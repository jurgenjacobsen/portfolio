import { ExternalLinkIcon, LibraryBigIcon } from "lucide-react";
import { Button } from "../../ui/button";
import GithubIcon from "../../icons/Github";
import { Icon, type IconId } from "@/components/ui/icon";
import type { ProjectProps } from "@/pages/Projects";
import { SectionCard } from "@/components/ui";
import { useNavigate } from "react-router-dom";

export default function ProjectHighlight(props: { projects: ProjectProps[] }) {
    const projects: ProjectProps[] = props.projects;

    const navigate = useNavigate();

    return (
        <SectionCard className="space-y-6">
            <header className="space-y-4">
                <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 
                    border border-border rounded-full 
                    text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                    bg-primary/5 
                    animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                    <LibraryBigIcon className="size-3 md:size-4" />
                    <span>Showcase</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                    HIGHLIGHTED{" "}
                    <span className="text-primary italic font-serif">
                        PROJECTS
                    </span>
                    .
                </h1>
                <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                    A collection of work ranging from full-stack platforms to
                    experimental tools and open-source contributions.
                </p>
            </header>
            <div
                className={`grid grid-cols-1 ${projects.length <= 1 ? "" : "md:grid-cols-3"} gap-4`}
            >
                <div
                    className={`${projects.length <= 1 ? "" : "md:col-span-2"}  group relative overflow-hidden rounded-xl border border-border bg-card transition-all animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both`}
                >
                    <div className="aspect-video md:aspect-3/1 w-full overflow-hidden">
                        <img
                            src={projects[0]?.image}
                            alt={projects[0]?.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-2">
                                <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase">
                                    {projects[0]?.title}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {projects[0]?.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-muted/25 border border-border/50 text-primary inline-flex gap-1.5 items-center"
                                        >
                                            <Icon
                                                id={tag as IconId}
                                                className="size-3"
                                            />{" "}
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                {projects[0]?.github && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-xl size-9 cursor-pointer hover:opacity-75 "
                                        onClick={() => {
                                            window.open(
                                                projects[0]?.github,
                                                "_blank",
                                            );
                                        }}
                                    >
                                        <GithubIcon className="size-4 fill-foreground" />
                                    </Button>
                                )}
                                {projects[0]?.slug && (
                                    <Button
                                        size="icon"
                                        className="rounded-xl size-9 cursor-pointer"
                                        onClick={() =>
                                            navigate(
                                                `/projects/${projects[0].slug}`,
                                            )
                                        }
                                    >
                                        <ExternalLinkIcon className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
                            {projects[0]?.description}
                        </p>
                    </div>
                </div>

                {/* Secondary Projects Stack */}
                {projects.length > 1 && (
                    <div className="flex flex-col gap-4">
                        {projects.slice(1, 4).map((project, i) => (
                            <div
                                key={i}
                                className="flex-1 group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                                style={{ animationDelay: `${400 + i * 150}ms` }}
                            >
                                <div className="aspect-video md:aspect-3/1 md:h-full w-full overflow-hidden relative">
                                    <img
                                        src={project?.image}
                                        alt={project?.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <h4 className="text-white font-black tracking-tight uppercase">
                                            {project?.title}
                                        </h4>
                                        <div className="flex gap-2 mt-1">
                                            {project?.tags
                                                .slice(0, 4)
                                                .map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="group text-[9px] font-bold text-white/90 uppercase inline-flex gap-1 bg-primary/25 rounded-full px-2 py-1 whitespace-nowrap"
                                                    >
                                                        <Icon
                                                            id={tag as IconId}
                                                            className="size-3 group-hover:grayscale-0 grayscale transition duration-300"
                                                        />{" "}
                                                        <span className="max-w-15 truncate">
                                                            {tag}
                                                        </span>
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            className="rounded-xl size-8 bg-card text-black hover:bg-card/90 cursor-pointer"
                                            onClick={() =>
                                                window.open(
                                                    project.link,
                                                    "_blank",
                                                )
                                            }
                                        >
                                            <ExternalLinkIcon className="size-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SectionCard>
    );
}
