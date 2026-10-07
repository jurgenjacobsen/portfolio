import { Code2Icon, SummaryIcon } from "lucide-react";
import { Icon, type IconId } from "@/components/shared/icon";
import SectionCard from "@/components/layout/SectionCard";
import type { ProjectProps } from "@/pages/code/Code";
import { Link } from "react-router-dom";

function SmallProject(props: {project: ProjectProps, i: number}) {
    const { project, i } = props;
    const to = "/code/" + project.slug;

    return (
        <Link
            to={to}
            className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Read more about ${project.title || project.slug}`}
            title={`Read more about ${project.title || project.slug}`}
        >
            <div
                className="group animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both rounded-xl overflow-hidden border border-border bg-card transition-colors hover:border-foreground/20"
                style={{ animationDelay: `${400 + i * 150}ms` }}
            >
                <div className="aspect-3/1 w-full overflow-hidden border-b border-border">
                    <img
                        src={project?.image}
                        alt={project?.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="p-4">
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {project?.title}
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {project?.tags
                            .slice(0, 4)
                            .map((tag) => (
                                <span
                                    key={tag}
                                    className="group text-[9px] font-bold uppercase inline-flex gap-2 rounded-full px-2 py-1 whitespace-nowrap border border-border"
                                >
                                    <Icon
                                        id={tag as IconId}
                                        className="size-3 transition duration-300"
                                    />{" "}
                                    <span className="max-w-15 truncate">
                                        {tag}
                                    </span>
                                </span>
                            ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function MainProject(props: {projects: ProjectProps[]}) {
    const { projects } = props;
    const project = projects[0];

    if (!project) return null;

    return (
        <div
            className={`${projects.length <= 1 ? "md:col-span-5" : "md:col-span-3"} flex flex-col h-full group relative overflow-hidden rounded-xl border border-border bg-card transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both`}
        >
            <div
                className={`relative w-full ${projects.length <= 1 ? "aspect-21/9 min-h-64" : "aspect-16/10 md:aspect-auto md:flex-1 min-h-52 md:min-h-64"} overflow-hidden border-b border-border`}
            >
                <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="p-4 md:p-6 shrink-0 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase">
                            {project.title}
                        </h3>
                        <div className="flex flex-row gap-2 shrink-0">
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`GitHub repository for ${project.title}`}
                                    className="inline-flex items-center justify-center rounded-md size-8 border border-border bg-background hover:bg-muted hover:text-foreground hover:opacity-75 transition-[background-color,color,opacity] duration-300 cursor-pointer"
                                    data-cuelume-navigate="success"
                                >
                                    <Icon
                                        id="github"
                                        className="size-4 fill-foreground"
                                    />
                                </a>
                            )}
                            {project.slug && (
                                <Link
                                    to={`/code/${project.slug}`}
                                    aria-label={`View ${project.title} project details`}
                                    className="inline-flex items-center justify-center rounded-md size-8 bg-primary text-primary-foreground hover:bg-primary/75 duration-300 transition-colors cursor-pointer"
                                    data-cuelume-navigate
                                >
                                    <SummaryIcon className="size-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
                        {project.description}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
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
        </div>
    );
}

export default function ProjectHighlight(props: { projects: ProjectProps[] }) {
    const projects: ProjectProps[] = props.projects;

    return (
        <SectionCard className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <header>
                <div
                    className="
                    w-fit self-start
                    inline-flex items-center gap-2 px-4 py-1
                    border border-border rounded-full 
                    text-primary text-xs uppercase tracking-wider font-bold
                    bg-muted
                    animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                    <Code2Icon className="size-3 md:size-4" />
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
            <div
                className={`grid grid-cols-1 ${projects.length <= 1 ? "" : "md:grid-cols-5"} gap-4`}
            >
                <MainProject projects={projects} />

                {/* Secondary Projects Stack */}
                {projects.length > 1 && (
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                        {projects.slice(1, 4).map((project, i) => (
                            <SmallProject key={project.slug || project.title || i} project={project} i={i} />
                        ))}
                    </div>
                )}
            </div>
        </SectionCard>
    );
}
