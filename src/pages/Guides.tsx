import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SEO } from "@/components/shared";
import GuidesHero from "@/components/features/guides/GuidesHero";
import parseFrontMatter from "front-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    ClockIcon,
    Share2Icon,
    CheckIcon,
    LinkIcon,
    BookOpenIcon,
    Loader2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideItem {
    title: string;
    slug: string;
    section: string;
    sectionId: string;
    topic: string;
    topicId: string;
    order: number;
    description: string;
    readTime: string;
    updatedAt: string;
    tags: string[];
    filePath: string;
}

interface TopicNode {
    id: string;
    title: string;
    order: number;
    guides: GuideItem[];
}

interface SectionNode {
    id: string;
    title: string;
    order: number;
    topics: TopicNode[];
}

interface GuidesIndexData {
    sections: SectionNode[];
    bySlug: Record<string, GuideItem>;
    guides: GuideItem[];
}

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

function formatMonthYear(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

export default function Guides() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [indexData, setIndexData] = useState<GuidesIndexData | null>(null);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        {},
    );
    const [isMobileDirectoryOpen, setIsMobileDirectoryOpen] =
        useState<boolean>(false);
    const [markdownContent, setMarkdownContent] = useState<string>("");
    const [loadingIndex, setLoadingIndex] = useState<boolean>(true);
    const [loadingContent, setLoadingContent] = useState<boolean>(false);
    const [copiedLink, setCopiedLink] = useState<boolean>(false);

    // Track read status per guide slug with localStorage persistence
    const [readGuides, setReadGuides] = useState<Record<string, boolean>>(
        () => {
            try {
                const stored = localStorage.getItem("guides_read_status");
                return stored ? JSON.parse(stored) : {};
            } catch {
                return {};
            }
        },
    );

    // Fetch the pre-built index of guides
    useEffect(() => {
        let isMounted = true;
        fetch("/guide/_.json")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load guides index");
                return res.json();
            })
            .then((data: GuidesIndexData) => {
                if (!isMounted) return;
                setIndexData(data);

                // Open all sections by default
                const initialOpen: Record<string, boolean> = {};
                data.sections.forEach((sec) => {
                    initialOpen[sec.id] = true;
                });
                setOpenSections(initialOpen);
                setLoadingIndex(false);
            })
            .catch((err) => {
                console.error(err);
                if (isMounted) setLoadingIndex(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Resolve active guide from slug or default to the landing guide ("hello-world" or first guide)
    const activeGuide = useMemo(() => {
        if (!indexData || indexData.guides.length === 0) return null;
        if (slug && indexData.bySlug[slug]) {
            return indexData.bySlug[slug];
        }
        // Default to "hello-world" as the landing guide if available
        if (indexData.bySlug["hello-world"]) {
            return indexData.bySlug["hello-world"];
        }
        // Fallback to first guide in the first sorted section, or first indexed guide
        const firstSectionGuide = indexData.sections[0]?.topics[0]?.guides[0];
        return firstSectionGuide || indexData.guides[0];
    }, [indexData, slug]);

    // Keep URL synchronized if /guides is visited without a slug
    useEffect(() => {
        if (!slug && activeGuide) {
            navigate(`/guides/${activeGuide.slug}`, { replace: true });
        }
    }, [slug, activeGuide, navigate]);

    // Fetch and strip frontmatter from the active markdown file
    useEffect(() => {
        if (!activeGuide) {
            setMarkdownContent("");
            return;
        }

        let isMounted = true;
        setLoadingContent(true);

        fetch(activeGuide.filePath)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load markdown content");
                return res.text();
            })
            .then((rawText) => {
                if (!isMounted) return;
                const parsed = parseFrontMatter(rawText);
                setMarkdownContent(parsed.body);
                setLoadingContent(false);
            })
            .catch((err) => {
                console.error(err);
                if (isMounted) {
                    setMarkdownContent("Failed to load guide content.");
                    setLoadingContent(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [activeGuide]);

    const toggleSection = (sectionId: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const handleSelectGuide = (guideSlug: string) => {
        navigate(`/guides/${guideSlug}`);
        setIsMobileDirectoryOpen(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleMarkAsRead = () => {
        if (!activeGuide) return;
        setReadGuides((prev) => {
            const next = {
                ...prev,
                [activeGuide.slug]: !prev[activeGuide.slug],
            };
            try {
                localStorage.setItem(
                    "guides_read_status",
                    JSON.stringify(next),
                );
            } catch (e) {
                console.error("Failed to save read status to localStorage:", e);
            }
            return next;
        });
    };

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        }
    };

    const handleShare = async () => {
        if (navigator.share && activeGuide) {
            try {
                await navigator.share({
                    title: activeGuide.title,
                    text: activeGuide.description || activeGuide.title,
                    url: window.location.href,
                });
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error("Error sharing:", err);
                }
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <main className="space-y-6 md:space-y-8 animate-in fade-in duration-500 fill-mode-both">
            <SEO
                title={
                    activeGuide
                        ? `${activeGuide.title} | Guides | Jürgen Jacobsen`
                        : "Guides | Jürgen Jacobsen"
                }
                description={
                    activeGuide?.description ||
                    "Comprehensive documentation, aviation flight operational procedures, web architecture guides, and technical tutorials by Jürgen Jacobsen."
                }
                canonical={
                    activeGuide ? `/guides/${activeGuide.slug}` : "/guides"
                }
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Guides", path: "/guides" },
                    ...(activeGuide
                        ? [
                              {
                                  name: activeGuide.title,
                                  path: `/guides/${activeGuide.slug}`,
                              },
                          ]
                        : []),
                ]}
            />

            {/* Hero Header Section */}
            <GuidesHero />

            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Collapsible Hierarchical Sidebar */}
                <aside className="w-full md:w-84 shrink-0 bg-card p-4 text-sm shadow-md rounded-xl select-none md:sticky md:top-6">
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
                            onClick={() =>
                                setIsMobileDirectoryOpen((prev) => !prev)
                            }
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
                                                onClick={() =>
                                                    toggleSection(section.id)
                                                }
                                                className="w-full flex items-center justify-between px-2 py-1 font-medium text-foreground hover:text-foreground/75 transition-colors cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
                                            >
                                                <span>{section.title}</span>
                                                <ChevronIcon isOpen={isOpen} />
                                            </button>

                                            {/* Collapsible Section Topics & Guides with smooth open/hide animation */}
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
                                                            (
                                                                topic,
                                                                topicIdx,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        topic.id
                                                                    }
                                                                    className="space-y-2"
                                                                >
                                                                    {topic.title &&
                                                                        (section
                                                                            .topics
                                                                            .length >
                                                                            1 ||
                                                                            topic.title.toLowerCase() !==
                                                                                section.title.toLowerCase()) && (
                                                                            <h3
                                                                                style={{
                                                                                    animationDelay: `${topicIdx * 50}ms`,
                                                                                }}
                                                                                className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-2 animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both"
                                                                            >
                                                                                {
                                                                                    topic.title
                                                                                }
                                                                            </h3>
                                                                        )}

                                                                    <div className="space-y-2">
                                                                        {topic.guides.map(
                                                                            (
                                                                                guide,
                                                                                guideIdx,
                                                                            ) => {
                                                                                const isActive =
                                                                                    guide.slug ===
                                                                                    activeGuide?.slug;
                                                                                const isRead =
                                                                                    !!readGuides[
                                                                                        guide
                                                                                            .slug
                                                                                    ];
                                                                                const itemDelay =
                                                                                    (topicIdx *
                                                                                        3 +
                                                                                        guideIdx) *
                                                                                    45;
                                                                                return (
                                                                                    <button
                                                                                        key={
                                                                                            guide.slug
                                                                                        }
                                                                                        onClick={() =>
                                                                                            handleSelectGuide(
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
                                                                                            {
                                                                                                guide.title
                                                                                            }
                                                                                        </span>
                                                                                        {isRead && (
                                                                                            <CheckIcon
                                                                                                aria-hidden="true"
                                                                                                className="size-4 text-muted-foreground shrink-0"
                                                                                            />
                                                                                        )}
                                                                                    </button>
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

                {/* Main Content Card */}
                <div className="w-full min-w-0 bg-card p-6 md:p-8 shadow-md rounded-xl space-y-6">
                    {loadingContent ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                            <Loader2Icon
                                aria-hidden="true"
                                className="size-6 animate-spin text-primary"
                            />
                            <p className="text-sm font-medium">
                                Loading guide content...
                            </p>
                        </div>
                    ) : activeGuide ? (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Guide Header Banner */}
                            <div className="pb-6 border-b border-border">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="text-primary text-[11px] uppercase font-bold tracking-wider px-2 py-1 rounded-full border border-border">
                                        {activeGuide.section} •{" "}
                                        {activeGuide.topic}
                                    </span>
                                    {activeGuide.readTime && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                            <ClockIcon
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                            <span>{activeGuide.readTime}</span>
                                        </div>
                                    )}
                                    {activeGuide.updatedAt && (
                                        <>
                                            <span className="text-muted-foreground/25">
                                                •
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium">
                                                Updated{" "}
                                                {formatMonthYear(
                                                    activeGuide.updatedAt,
                                                )}
                                            </span>
                                        </>
                                    )}
                                </div>

                                <h1 className="mt-6 text-2xl md:text-5xl font-black tracking-tight text-foreground">
                                    {activeGuide.title}
                                </h1>

                                {activeGuide.description && (
                                    <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                                        {activeGuide.description}
                                    </p>
                                )}

                                {activeGuide.tags &&
                                    activeGuide.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {activeGuide.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 text-xs rounded-full bg-muted/25 text-muted-foreground border border-border font-medium"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                            </div>

                            {/* Markdown Render Body */}
                            <article className="prose dark:prose-invert lg:prose-base max-w-none text-foreground leading-relaxed">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {markdownContent}
                                </ReactMarkdown>
                            </article>

                            {/* Section Footer Actions */}
                            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-sm">
                                {/* Left corner: Mark as Read button */}
                                <button
                                    type="button"
                                    onClick={toggleMarkAsRead}
                                    aria-pressed={
                                        activeGuide
                                            ? !!readGuides[activeGuide.slug]
                                            : false
                                    }
                                    className={cn(
                                        "py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center gap-2",
                                        activeGuide &&
                                            readGuides[activeGuide.slug]
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "text-primary border-border/50 hover:bg-primary/5 hover:border-primary/25",
                                    )}
                                >
                                    <CheckIcon
                                        aria-hidden="true"
                                        className="size-4 transition-transform"
                                    />
                                    <span>
                                        {activeGuide &&
                                        readGuides[activeGuide.slug]
                                            ? "Marked as Read"
                                            : "Mark as Read"}
                                    </span>
                                </button>

                                {/* Right corner: Copy Link & Share Guide buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className={cn(
                                            "py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center gap-2",
                                            copiedLink
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "text-primary border-border/50 hover:bg-primary/5 hover:border-primary/25",
                                        )}
                                    >
                                        {copiedLink ? (
                                            <>
                                                <CheckIcon
                                                    aria-hidden="true"
                                                    className="size-4 transition-transform"
                                                />
                                                <span>Copied Link</span>
                                            </>
                                        ) : (
                                            <>
                                                <LinkIcon
                                                    aria-hidden="true"
                                                    className="size-4 transition-transform"
                                                />
                                                <span>Copy Link</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleShare}
                                        className="py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center gap-2 text-primary border-border/50 hover:bg-primary/5 hover:border-primary/25"
                                    >
                                        <Share2Icon
                                            aria-hidden="true"
                                            className="size-4 transition-transform"
                                        />
                                        <span>Share Guide</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 space-y-4">
                            <BookOpenIcon
                                aria-hidden="true"
                                className="size-10 text-muted-foreground/40 mx-auto"
                            />
                            <h3 className="text-lg font-bold text-foreground">
                                No Guides Found
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Add markdown files to{" "}
                                <code className="bg-muted px-2 py-1 rounded">
                                    public/guide/
                                </code>{" "}
                                to get started.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
