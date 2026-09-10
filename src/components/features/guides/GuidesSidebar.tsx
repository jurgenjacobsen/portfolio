import React from "react";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuidesIndexData, GuideItem, HeadingItem } from "./types";

const ChevronIcon = ({ isOpen = false }: { isOpen?: boolean }) => (
    <svg
        aria-hidden="true"
        focusable="false"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

interface GuidesSidebarProps {
    indexData: GuidesIndexData | null;
    openSections: Record<string, boolean>;
    toggleSection: (sectionId: string) => void;
    isMobileDirectoryOpen: boolean;
    setIsMobileDirectoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
    loadingIndex: boolean;
    activeGuide: GuideItem | null;
    readGuides: Record<string, boolean>;
    onSelectGuide: (slug: string) => void;
    activeHeadingId: string;
    clientHeadings: HeadingItem[];
    onHeadingClick: (e: React.MouseEvent, id: string) => void;
}

export default function GuidesSidebar({
    indexData,
    openSections,
    toggleSection,
    isMobileDirectoryOpen,
    setIsMobileDirectoryOpen,
    loadingIndex,
    activeGuide,
    readGuides,
    onSelectGuide,
    activeHeadingId,
    clientHeadings,
    onHeadingClick,
}: GuidesSidebarProps) {
    return (
        <aside className="w-full md:w-84 shrink-0 bg-card p-4 text-sm shadow-md rounded-xl select-none md:sticky md:top-6 md:max-h-[calc(100vh-3rem)] md:overflow-y-auto sidebar-scrollbar scrollbar-track-my-4">
            {/* Sidebar Header & Mobile Collapsible Bar */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">
                        Directory
                    </h2>
                    {indexData && (
                        <span className="text-xs font-semibold text-muted-foreground">
                            ({indexData.guides.length})
                        </span>
                    )}
                </div>

                {/* Collapsible Mobile Bar Toggle Button */}
                <button
                    type="button"
                    onClick={() => setIsMobileDirectoryOpen((prev) => !prev)}
                    aria-expanded={isMobileDirectoryOpen}
                    aria-controls="guides-directory-nav"
                    className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
                >
                    <span>
                        {isMobileDirectoryOpen
                            ? "Hide Directory"
                            : "Browse Directory"}
                    </span>
                    <ChevronIcon isOpen={isMobileDirectoryOpen} />
                </button>
            </div>

            {/* Directory Navigation */}
            <div
                id="guides-directory-nav"
                className={`${
                    isMobileDirectoryOpen ? "block mt-4" : "hidden"
                } md:block md:mt-4`}
            >
                {loadingIndex ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                        <Loader2Icon
                            aria-hidden="true"
                            className="size-4 animate-spin"
                        />
                        <span>Loading index...</span>
                    </div>
                ) : (
                    <nav
                        aria-label="Guides Directory"
                        className="flex flex-col space-y-2"
                    >
                        {indexData?.sections.map((section) => {
                            const isOpen = !!openSections[section.id];
                            return (
                                <div key={section.id}>
                                    {/* Section Header Button */}
                                    <button
                                        id={`section-btn-${section.id}`}
                                        aria-expanded={isOpen}
                                        aria-controls={`section-panel-${section.id}`}
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full flex items-center justify-between px-2 py-1 font-medium text-foreground hover:text-foreground/75 transition-colors cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
                                    >
                                        <span>{section.title}</span>
                                        <ChevronIcon isOpen={isOpen} />
                                    </button>

                                    {/* Collapsible Section Topics & Guides */}
                                    <div
                                        id={`section-panel-${section.id}`}
                                        role="region"
                                        aria-labelledby={`section-btn-${section.id}`}
                                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                                            isOpen
                                                ? "grid-rows-[1fr] opacity-100 mt-2"
                                                : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="relative pl-2 space-y-2 border-l border-border ml-2">
                                                {section.topics.map(
                                                    (topic, topicIdx) => (
                                                        <div
                                                            key={topic.id}
                                                            className="space-y-2"
                                                        >
                                                            {topic.title &&
                                                                (section.topics.length > 1 ||
                                                                    topic.title.toLowerCase() !==
                                                                        section.title.toLowerCase()) && (
                                                                    <h3
                                                                        style={{
                                                                            animationDelay: `${topicIdx * 50}ms`,
                                                                        }}
                                                                        className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-2 animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both"
                                                                    >
                                                                        {topic.title}
                                                                    </h3>
                                                                )}

                                                            <div className="space-y-2">
                                                                {topic.guides.map(
                                                                    (guide, guideIdx) => {
                                                                        const isActive =
                                                                            guide.slug ===
                                                                            activeGuide?.slug;
                                                                        const isRead =
                                                                            !!readGuides[guide.slug];
                                                                        const itemDelay =
                                                                            (topicIdx * 3 +
                                                                                guideIdx) *
                                                                            45;
                                                                        const availableHeadings =
                                                                            isActive &&
                                                                            clientHeadings.length > 0
                                                                                ? clientHeadings
                                                                                : guide.headings || [];

                                                                        const activeParentH2Id = (() => {
                                                                            if (
                                                                                !activeHeadingId ||
                                                                                availableHeadings.length === 0
                                                                            )
                                                                                return "";
                                                                            const idx =
                                                                                availableHeadings.findIndex(
                                                                                    (h) =>
                                                                                        h.id ===
                                                                                        activeHeadingId,
                                                                                );
                                                                            if (idx === -1)
                                                                                return "";
                                                                            const current =
                                                                                availableHeadings[idx];
                                                                            if (
                                                                                current.level === 2
                                                                            )
                                                                                return current.id;
                                                                            for (
                                                                                let i = idx - 1;
                                                                                i >= 0;
                                                                                i--
                                                                            ) {
                                                                                if (
                                                                                    availableHeadings[i]
                                                                                        .level === 2
                                                                                ) {
                                                                                    return availableHeadings[
                                                                                        i
                                                                                    ].id;
                                                                                }
                                                                            }
                                                                            return "";
                                                                        })();

                                                                        return (
                                                                            <div
                                                                                key={guide.slug}
                                                                                className="space-y-1"
                                                                            >
                                                                                <button
                                                                                    onClick={() =>
                                                                                        onSelectGuide(
                                                                                            guide.slug,
                                                                                        )
                                                                                    }
                                                                                    aria-current={
                                                                                        isActive
                                                                                            ? "page"
                                                                                            : undefined
                                                                                    }
                                                                                    style={{
                                                                                        animationDelay: `${itemDelay}ms`,
                                                                                    }}
                                                                                    className={`relative w-full text-left ml-2 pl-4 pr-2 py-2 flex items-center justify-between text-sm transition-colors cursor-pointer animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${
                                                                                        isActive
                                                                                            ? "text-foreground font-semibold"
                                                                                            : "text-muted-foreground hover:text-primary"
                                                                                    }`}
                                                                                >
                                                                                    {isActive && (
                                                                                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-foreground rounded-full" />
                                                                                    )}
                                                                                    <span className="truncate block mr-2">
                                                                                        {guide.title}
                                                                                    </span>
                                                                                    {isRead && (
                                                                                        <CheckIcon
                                                                                            aria-hidden="true"
                                                                                            className="size-4 text-muted-foreground shrink-0"
                                                                                        />
                                                                                    )}
                                                                                </button>

                                                                                {/* Glossary / On this page index under the active guide title */}
                                                                                {isActive &&
                                                                                    availableHeadings.length >
                                                                                        0 && (
                                                                                        <div className="ml-2 pl-3 border-l border-border my-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 mb-1.5 px-1.5 flex items-center gap-1.5">
                                                                                                <span>
                                                                                                    On This Page
                                                                                                </span>
                                                                                            </div>
                                                                                            {availableHeadings.map(
                                                                                                (heading) => {
                                                                                                    const isHeadingActive =
                                                                                                        activeHeadingId ===
                                                                                                        heading.id;
                                                                                                    const isParentActive =
                                                                                                        heading.level === 2 &&
                                                                                                        activeParentH2Id ===
                                                                                                            heading.id;
                                                                                                    const isH3 =
                                                                                                        heading.level === 3;

                                                                                                    return (
                                                                                                        <a
                                                                                                            key={heading.id}
                                                                                                            href={`#${heading.id}`}
                                                                                                            onClick={(e) =>
                                                                                                                onHeadingClick(
                                                                                                                    e,
                                                                                                                    heading.id,
                                                                                                                )
                                                                                                            }
                                                                                                            className={cn(
                                                                                                                "block rounded transition-all truncate select-none",
                                                                                                                isH3
                                                                                                                    ? "pl-3.5 pr-1.5 py-0.5 text-[11px]"
                                                                                                                    : "px-1.5 py-1 text-xs font-medium",
                                                                                                                isHeadingActive
                                                                                                                    ? "text-primary font-bold bg-primary/10"
                                                                                                                    : isParentActive
                                                                                                                      ? "text-foreground font-semibold"
                                                                                                                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                                                                                                            )}
                                                                                                            title={heading.text}
                                                                                                        >
                                                                                                            <span className="flex items-center gap-1.5 truncate">
                                                                                                                <span className="truncate">
                                                                                                                    {heading.text}
                                                                                                                </span>
                                                                                                            </span>
                                                                                                        </a>
                                                                                                    );
                                                                                                },
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                            </div>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </nav>
                )}
            </div>
        </aside>
    );
}
