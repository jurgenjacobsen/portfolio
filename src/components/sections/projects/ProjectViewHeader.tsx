import { SectionCard } from "@/components/ui";
import ProjectTag from "@/components/ui/project-tag";
import type { ProjectProps } from "@/pages/Projects";

export default function ProjectViewHeader(props: { metadata: ProjectProps }) {
    const { metadata } = props;

    const formatDate = (dateString?: Date | string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <SectionCard className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <div className="relative overflow-hidden rounded-xl group aspect-3/1">
                {metadata?.image && (
                    <img
                        src={metadata.image}
                        alt={metadata.title}
                        className="w-full rounded-xl aspect-3/1 object-cover"
                    />
                )}
                <div
                    className={`absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent opacity-75`}
                />
                <div className="absolute inset-0 bottom-0 left-0 p-6 w-full flex flex-col justify-end gap-4">
                    <h1
                        className={`font-bold text-3xl text-card tracking-tight w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both`}
                    >
                        {metadata?.title || "Untitled Project"}
                    </h1>
                    <div
                        className={`w-full flex flex-wrap items-center gap-2 text-xs font-semibold`}
                    >
                        {metadata?.tags.map((tag, i) => (
                            <ProjectTag
                                key={tag}
                                tag={tag}
                                icon={tag}
                                className="text-card! animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
                                style={{ animationDelay: `${400 + i * 100}ms` }}
                            />
                        ))}
                        <span className="hidden sm:inline mx-2 text-card animate-in fade-in duration-700 delay-500 fill-mode-both">
                            •
                        </span>
                        <ProjectTag
                            icon="Calendar"
                            tag={formatDate(metadata?.createdAt)}
                            title={`Created on ${formatDate(metadata?.createdAt)}`}
                            className="text-card! animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
                            style={{
                                animationDelay: `${400 + (metadata?.tags.length || 0) * 100}ms`,
                            }}
                        />
                        <ProjectTag
                            icon="Clock"
                            tag={formatDate(metadata?.updatedAt)}
                            title={`Last updated on ${formatDate(metadata?.updatedAt)}`}
                            className="text-card! animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
                            style={{
                                animationDelay: `${400 + ((metadata?.tags.length || 0) + 1) * 100}ms`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
