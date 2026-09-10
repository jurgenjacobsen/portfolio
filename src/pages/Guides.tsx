import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SEO } from "@/components/shared";
import {
    GuidesHero,
    GuidesSidebar,
    GuideContent,
    type GuidesIndexData,
    type HeadingItem,
} from "@/components/features/guides";
import parseFrontMatter from "front-matter";

function slugifyHeading(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
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
        if (!activeGuide || loadingContent) return;

        let ticking = false;

        const updateActiveHeading = () => {
            const headings = Array.from(
                document.querySelectorAll("article h2, article h3"),
            ) as HTMLElement[];
            if (headings.length === 0) return;

            const scrollY = window.scrollY;
            const offset = 140;

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

            let currentId = headings[0].id;
            for (const heading of headings) {
                const top = heading.getBoundingClientRect().top;
                if (top <= offset) {
                    currentId = heading.id;
                } else {
                    break;
                }
            }

            if (currentId) {
                setActiveHeadingId(currentId);
            }
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
    }, [activeGuide, loadingContent, markdownContent]);

    // Smooth scroll to anchor on initial page load if hash exists
    useEffect(() => {
        if (!loadingContent && window.location.hash) {
            const id = decodeURIComponent(window.location.hash.slice(1));
            const el = document.getElementById(id);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveHeadingId(id);
                }, 150);
            }
        }
    }, [loadingContent, markdownContent]);

    // Keep URL hash synchronized with active heading as user scrolls
    useEffect(() => {
        if (!activeHeadingId) return;
        const timer = setTimeout(() => {
            if (window.location.hash !== `#${activeHeadingId}`) {
                window.history.replaceState(null, "", `#${activeHeadingId}`);
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
                    loadingContent={loadingContent}
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
