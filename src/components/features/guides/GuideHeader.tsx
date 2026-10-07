import { use } from "react";
import { ClockIcon } from "lucide-react";
import type { GuideItem } from "./types";
import { GuideContext } from "./GuideContext";

function formatMonthYear(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

export interface GuideHeaderProps {
    guide?: GuideItem | null;
}

export default function GuideHeader({ guide: propGuide }: GuideHeaderProps = {}) {
    const context = use(GuideContext);
    const guide = propGuide !== undefined ? propGuide : context?.activeGuide ?? null;

    if (!guide) return null;
    return (
        <header className="pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-4">
                <span className="text-primary text-[11px] uppercase font-bold tracking-wider px-2 py-1 rounded-full border border-border">
                    {guide.section} • {guide.topic}
                </span>
                {guide.readTime && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <ClockIcon aria-hidden="true" className="size-4" />
                        <span>{guide.readTime}</span>
                    </div>
                )}
                {guide.updatedAt && (
                    <>
                        <span className="text-muted-foreground/25">•</span>
                        <span className="text-xs text-muted-foreground font-medium">
                            Updated {formatMonthYear(guide.updatedAt)}
                        </span>
                    </>
                )}
            </div>

            <h1 className="mt-6 text-2xl md:text-5xl font-black tracking-tight text-foreground">
                {guide.title}
            </h1>

            {guide.description && (
                <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                    {guide.description}
                </p>
            )}

            {guide.tags && guide.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {guide.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-muted/25 text-muted-foreground border border-border font-medium"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </header>
    );
}
