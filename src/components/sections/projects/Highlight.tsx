import { ExternalLinkIcon, LibraryBigIcon } from "lucide-react";
import { Button } from "../../ui/button";
import GithubIcon from "../../icons/Github";
import { TechIcon, type IconId } from "@/components/ui/tech-icon";
import type { ProjectProps } from "@/pages/Projects";
import { SectionCard } from "@/components/ui";

export default function ProjectHighlight(props: { projects: ProjectProps[] }) {
    const projects: ProjectProps[] = props.projects;

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
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                    HIGHLIGHTED{" "}
                    <span className="text-primary italic font-serif">
                        PROJECTS
                    </span>
                    .
                </h1>
                <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl">
                    A collection of work ranging from full-stack platforms to
                    experimental tools and open-source contributions.
                </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="md:col-span-2 group relative overflow-hidden rounded-xl border border-border bg-card transition-all">
                    <div className="aspect-video w-full overflow-hidden">
                        <img
                            src={projects[0].image}
                            alt={projects[0].title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="p-5 md:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-2">
                                <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase">
                                    {projects[0].title}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {projects[0].tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-muted/25 border border-border/50 text-primary inline-flex gap-1.5 items-center"
                                        >
                                            <TechIcon
                                                id={tag as IconId}
                                                className="size-3"
                                            />{" "}
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl size-9 cursor-pointer"
                                    onClick={() =>
                                        window.open(
                                            projects[0].github,
                                            "_blank",
                                        )
                                    }
                                >
                                    <GithubIcon className="size-4 fill-foreground" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="rounded-xl size-9 cursor-pointer"
                                    onClick={() =>
                                        window.open(projects[0].link, "_blank")
                                    }
                                >
                                    <ExternalLinkIcon className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
                            {projects[0].description}
                        </p>
                    </div>
                </div>

                {/* Secondary Projects Stack */}
                <div className="flex flex-col gap-4">
                    {projects.slice(1, 4).map((project, i) => (
                        <div
                            key={i}
                            className="flex-1 group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="aspect-video md:aspect-auto md:h-full w-full overflow-hidden relative">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <h4 className="text-white font-black tracking-tight uppercase">
                                        {project.title}
                                    </h4>
                                    <div className="flex gap-2 mt-1">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[9px] font-bold text-white/90 uppercase"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="icon"
                                        className="rounded-xl size-8 bg-card text-black hover:bg-card/90 cursor-pointer"
                                        onClick={() =>
                                            window.open(project.link, "_blank")
                                        }
                                    >
                                        <ExternalLinkIcon className="size-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SectionCard>
    );
}
