import { StarIcon } from "lucide-react";
import type { ProjectProps } from "@/pages/Projects";
import { Icon, type IconId } from "@/components/shared/icon";
import { Link } from "react-router-dom";
import ProjectTag from "@/components/shared/project-tag";

export default function ListedProject({ project }: { project: ProjectProps }) {
    const formatDate = (dateString?: Date | string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    function Button({
        icon,
        link,
        title,
        className,
        style,
    }: {
        icon?: string;
        link: string;
        title?: string;
        className?: string;
        style: "outline" | "solid";
    }) {
        const isExternal =
            link && link.startsWith("http") && !link.includes("jurgen.fyi");

        const baseStyle = `
            group inline-flex shrink-0 items-center justify-center gap-2 font-semibold rounded-xl transition-all cursor-pointer
            disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap select-none
            px-4 md:px-8 py-2 transition-all duration-300 w-full md:w-full
        `;

        const outlineStyle =
            "bg-muted hover:bg-muted/50 border border-border hover:border-primary/25";
        const solidStyle =
            "bg-primary hover:bg-primary/75 border border-primary hover:border-primary/75 text-card";

        if (isExternal) {
            return (
                <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    title={title}
                    className={
                        baseStyle +
                        " " +
                        (style === "outline" ? outlineStyle : solidStyle) +
                        " " +
                        className
                    }
                    aria-disabled={link ? "false" : "true"}
                >
                    <Icon id={icon as IconId} className="size-4" />
                    <span className="text-sm md:text-base">{title}</span>
                </a>
            );
        } else {
            return (
                <Link
                    to={link}
                    title={title}
                    className={
                        baseStyle +
                        " " +
                        (style === "outline" ? outlineStyle : solidStyle) +
                        " " +
                        className
                    }
                    aria-disabled={link ? "false" : "true"}
                >
                    <Icon id={icon as IconId} className="size-4" />
                    <span className="text-sm md:text-base">{title}</span>
                </Link>
            );
        }
    }

    return (
        <div className="group p-4 md:p-6 rounded-xl border border-border">
            <div className="flex flex-col md:grid md:grid-cols-4 gap-6 items-start">
                <div className="md:col-span-3 space-y-2 md:space-y-4 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-primary transition-colors">
                            {project.title}
                        </h2>

                        {project.stars !== undefined && project.stars > 0 && (
                            <div className="flex items-center gap-1 px-4 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500">
                                <StarIcon className="size-4 fill-current" />
                                <span className="text-xs font-bold">
                                    {project.stars}
                                </span>
                            </div>
                        )}
                    </div>

                    <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-semibold pt-2">
                        {project.tags.map((tag, j) => (
                            <ProjectTag key={j} tag={tag} j={j} icon={tag} />
                        ))}

                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold uppercase text-muted-foreground/60">
                            <span className="hidden sm:inline ml-2">•</span>
                            <ProjectTag
                                icon="Calendar"
                                tag={formatDate(project.createdAt)}
                                title={`Created on ${formatDate(project.createdAt)}`}
                                className="bg-transparent border-none px-0 text-muted-foreground/60"
                            />
                            <ProjectTag
                                icon="Clock"
                                tag={formatDate(project.updatedAt)}
                                title={`Last updated on ${formatDate(project.updatedAt)}`}
                                className="bg-transparent border-none px-0 text-muted-foreground/60"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                    {project.github && (
                        <Button
                            icon="github"
                            link={project.github}
                            title="GitHub"
                            style="outline"
                            className="flex-1 md:w-full"
                        />
                    )}

                    {project.link ||
                        (project.slug && (
                            <Button
                                icon="BookOpen"
                                link={
                                    project.link || `/projects/${project.slug}`
                                }
                                title="Details"
                                style="solid"
                                className="flex-1 md:w-full"
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
