import ProjectTag from "@/components/shared/project-tag";
import type { ProjectProps } from "@/pages/code/Code";
import { StarIcon } from "lucide-react";

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
        <div className="relative overflow-hidden rounded-xl group min-h-60 sm:min-h-70 md:min-h-0 md:aspect-3/1 border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8 md:mt-0">
            {/* Background Image */}
            {metadata?.image && (
                <img
                    src={metadata.image}
                    alt={metadata.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            )}

            {/* High-contrast multi-stop gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/45 to-black/15" />

            {/* Content Container */}
            <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end gap-3 md:gap-4 z-10">
                {/* Title & Stars Row */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <h1 className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                        {metadata?.title || "Untitled Project"}
                    </h1>

                    {metadata?.stars !== undefined && metadata.stars > 0 && (
                        <div className="inline-flex items-center gap-2 px-4 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold shrink-0 animate-in fade-in duration-700 delay-300 fill-mode-both">
                            <StarIcon className="size-4 fill-current" />
                            <span>{metadata.stars}</span>
                        </div>
                    )}
                </div>

                {/* Tags & Metadata Badges */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
                    {metadata?.tags.map((tag, i) => (
                        <ProjectTag
                            key={tag}
                            tag={tag}
                            icon={tag}
                            className="text-white! bg-white/10! border-white/20! backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
                            style={{ animationDelay: `${400 + i * 50}ms` }}
                        />
                    ))}

                    <span
                        className="hidden sm:inline mx-1 text-white/50 animate-in fade-in duration-700 fill-mode-both"
                        style={{
                            animationDelay: `${400 + (metadata?.tags.length || 0) * 50}ms`,
                        }}
                    >
                        •
                    </span>

                    <ProjectTag
                        icon="Calendar"
                        tag={formatDate(metadata?.createdAt)}
                        title={`Created on ${formatDate(metadata?.createdAt)}`}
                        className="text-white! bg-white/10! border-white/20! backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
                        style={{
                            animationDelay: `${450 + (metadata?.tags.length || 0) * 50}ms`,
                        }}
                    />
                    <ProjectTag
                        icon="Clock"
                        tag={formatDate(metadata?.updatedAt)}
                        title={`Last updated on ${formatDate(metadata?.updatedAt)}`}
                        className="text-white! bg-white/10! border-white/20! backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both"
                        style={{
                            animationDelay: `${500 + (metadata?.tags.length || 0) * 50}ms`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
