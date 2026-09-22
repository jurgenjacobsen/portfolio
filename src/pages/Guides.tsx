import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SEO } from "@/components/shared";
import {
    GuidesHero,
    GuidesSidebar,
    GuideContent,
    type GuidesIndexData,
    type HeadingItem,
    type GuideItem,
    type SectionNode,
    type TopicNode,
} from "@/components/features/guides";
import { supabase, type GuideRow, type GuideSectionRow } from "@/lib/supabase";

function stripFrontMatter(text: string): string {
    return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function slugifyHeading(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
}

function extractHeadings(markdownContent: string): HeadingItem[] {
    if (!markdownContent) return [];
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: HeadingItem[] = [];
    let match;
    while ((match = headingRegex.exec(markdownContent)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = slugifyHeading(text);
        headings.push({ id, text, level });
    }
    return headings;
}

function buildGuidesIndex(
    sections: GuideSectionRow[],
    guides: GuideRow[]
): { index: GuidesIndexData; contentMap: Record<string, string> } {
    const bySlug: Record<string, GuideItem> = {};
    const contentMap: Record<string, string> = {};
    const allGuides: GuideItem[] = [];

    const sectionMap = new Map<
        string,
        { id: string; title: string; order: number; topics: Map<string, GuideItem[]> }
    >();

    sections.forEach((s) => {
        sectionMap.set(s.id, {
            id: s.id,
            title: s.title,
            order: s.order_index ?? 0,
            topics: new Map(),
        });
    });

    guides.forEach((g) => {
        const secId = g.section_id || "general";
        let secNode = sectionMap.get(secId);
        if (!secNode) {
            secNode = {
                id: secId,
                title: secId.charAt(0).toUpperCase() + secId.slice(1),
                order: 999,
                topics: new Map(),
            };
            sectionMap.set(secId, secNode);
        }

        const topicName = g.topic || "General";
        if (!secNode.topics.has(topicName)) {
            secNode.topics.set(topicName, []);
        }

        const readTime = `${g.reading_time_minutes || 1} min read`;
        const headings = extractHeadings(g.content || "");

        const guideItem: GuideItem = {
            title: g.title,
            slug: g.slug,
            section: secNode.title,
            sectionId: secNode.id,
            topic: topicName,
            topicId: topicName.toLowerCase().replace(/[\s_]+/g, "-"),
            order: g.order_index ?? 0,
            description: g.description || "",
            readTime,
            updatedAt: g.updated_at || g.created_at || new Date().toISOString(),
            tags: g.tags || [],
            filePath: `/guide/${g.slug}.md`,
            headings,
        };

        secNode.topics.get(topicName)!.push(guideItem);
        bySlug[g.slug] = guideItem;
        contentMap[g.slug] = g.content || "";
        allGuides.push(guideItem);
    });

    const sortedSections: SectionNode[] = Array.from(sectionMap.values())
        .sort((a, b) => a.order - b.order)
        .map((s) => {
            const sortedTopics: TopicNode[] = Array.from(s.topics.entries()).map(
                ([tTitle, gList], i) => ({
                    id: tTitle.toLowerCase().replace(/[\s_]+/g, "-"),
                    title: tTitle,
                    order: i + 1,
                    guides: gList.sort((a, b) => a.order - b.order),
                })
            );
            return {
                id: s.id,
                title: s.title,
                order: s.order,
                topics: sortedTopics,
            };
        });

    return {
        index: {
            sections: sortedSections,
            bySlug,
            guides: allGuides,
        },
        contentMap,
    };
}

export default function Guides() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [indexData, setIndexData] = useState<GuidesIndexData | null>(null);
    const [contentMap, setContentMap] = useState<Record<string, string>>({});
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        {},
    );
    const [isMobileDirectoryOpen, setIsMobileDirectoryOpen] =
        useState<boolean>(false);
    const [loadingIndex, setLoadingIndex] = useState<boolean>(true);
    const [copiedLink, setCopiedLink] = useState<boolean>(false);
    const [activeHeadingId, setActiveHeadingId] = useState<string>("");

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

    // Fetch the index of guides directly from Supabase
    useEffect(() => {
        let isMounted = true;

        async function loadIndex() {
            try {
                const [sectionsRes, guidesRes] = await Promise.all([
                    supabase
                        .from("guide_sections")
                        .select("*")
                        .order("order_index", { ascending: true }),
                    supabase
                        .from("guides")
                        .select("*")
                        .order("order_index", { ascending: true }),
                ]);

                if (sectionsRes.error) throw sectionsRes.error;
                if (guidesRes.error) throw guidesRes.error;

                const { index, contentMap: cMap } = buildGuidesIndex(
                    sectionsRes.data || [],
                    guidesRes.data || []
                );
                if (!isMounted) return;
                setIndexData(index);
                setContentMap(cMap);

                const initialOpen: Record<string, boolean> = {};
                index.sections.forEach((sec) => {
                    initialOpen[sec.id] = true;
                });
                setOpenSections(initialOpen);
                setLoadingIndex(false);
            } catch (err) {
                console.error("Error loading guides from Supabase:", err);
                if (isMounted) setLoadingIndex(false);
            }
        }

        loadIndex();

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

    // Derive markdown content directly from Supabase contentMap
    const markdownContent = useMemo(() => {
        if (!activeGuide) return "";
        if (contentMap[activeGuide.slug]) {
            return stripFrontMatter(contentMap[activeGuide.slug]);
        }
        return "Guide content not found.";
    }, [activeGuide, contentMap]);

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

    // Client-side parsed headings from markdown content
    const clientHeadings = useMemo<HeadingItem[]>(() => {
        if (!markdownContent) return [];
        const headingRegex = /^(#{2,3})\s+(.+)$/gm;
        const items: HeadingItem[] = [];
        let match;

        while ((match = headingRegex.exec(markdownContent)) !== null) {
            const level = match[1].length;
            const rawText = match[2].trim();
            const cleanText = rawText
                .replace(/`([^`]+)`/g, "$1")
                .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
                .replace(/[*_~]/g, "")
                .trim();
            const id = slugifyHeading(cleanText);
            if (cleanText && id) {
                items.push({ id, text: cleanText, level });
            }
        }
        return items;
    }, [markdownContent]);

    // Active heading scroll listener for reliable, continuous scroll-spy
    useEffect(() => {
        if (!activeGuide || !markdownContent) return;

        let ticking = false;

        const updateActiveHeading = () => {
            const headings = Array.from(
                document.querySelectorAll("article h2, article h3"),
            ) as HTMLElement[];
            if (headings.length === 0) return;

            const scrollY = window.scrollY;
            const offset = 140;

            if (scrollY < 100) {
                setActiveHeadingId("");
                return;
            }

            const isBottom =
                window.innerHeight + scrollY >=
                document.documentElement.scrollHeight - 60;

            if (isBottom) {
                const last = headings[headings.length - 1];
                if (last?.id) {
                    setActiveHeadingId(last.id);
                }
                return;
            }

            let currentId = "";
            for (const heading of headings) {
                const top = heading.getBoundingClientRect().top;
                if (top <= offset) {
                    currentId = heading.id;
                } else {
                    break;
                }
            }

            setActiveHeadingId(currentId);
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveHeading();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Run immediately on mount and after a short timeout for rendering
        updateActiveHeading();
        const timer = setTimeout(updateActiveHeading, 150);

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [activeGuide, markdownContent]);

    // Smooth scroll to anchor on initial page load if hash exists
    useEffect(() => {
        if (markdownContent && window.location.hash) {
            const id = decodeURIComponent(window.location.hash.slice(1));
            const el = document.getElementById(id);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveHeadingId(id);
                }, 150);
            }
        }
    }, [markdownContent]);

    // Keep URL hash synchronized with active heading as user scrolls
    useEffect(() => {
        const timer = setTimeout(() => {
            const targetHash = activeHeadingId ? `#${activeHeadingId}` : "";
            if (window.location.hash !== targetHash) {
                const newUrl = targetHash
                    ? `${window.location.pathname}${window.location.search}${targetHash}`
                    : `${window.location.pathname}${window.location.search}`;
                window.history.replaceState(null, "", newUrl);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [activeHeadingId]);

    const handleHeadingClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.replaceState(null, "", `#${id}`);
            setActiveHeadingId(id);
            setIsMobileDirectoryOpen(false);
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
                <GuidesSidebar
                    indexData={indexData}
                    openSections={openSections}
                    toggleSection={toggleSection}
                    isMobileDirectoryOpen={isMobileDirectoryOpen}
                    setIsMobileDirectoryOpen={setIsMobileDirectoryOpen}
                    loadingIndex={loadingIndex}
                    activeGuide={activeGuide}
                    readGuides={readGuides}
                    onSelectGuide={handleSelectGuide}
                    activeHeadingId={activeHeadingId}
                    clientHeadings={clientHeadings}
                    onHeadingClick={handleHeadingClick}
                />

                {/* Main Content Card */}
                <GuideContent
                    activeGuide={activeGuide}
                    loadingContent={loadingIndex}
                    markdownContent={markdownContent}
                    isRead={
                        activeGuide ? !!readGuides[activeGuide.slug] : false
                    }
                    onToggleRead={toggleMarkAsRead}
                    copiedLink={copiedLink}
                    onCopyLink={handleCopyLink}
                    onShare={handleShare}
                />
            </div>
        </main>
    );
}
