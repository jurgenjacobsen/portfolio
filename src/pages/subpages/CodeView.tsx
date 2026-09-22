import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { SectionCard, SEO } from "@/components/shared";
import NotFound from "@/pages/NotFound";
import type { ProjectProps } from "../Code";
import remarkGfm from "remark-gfm";
import ProjectViewHeader from "@/components/features/projects/ProjectViewHeader";
import ProjectPreview from "@/components/features/projects/ProjectPreview";
import { GithubClient, type GithubRepo } from "@/lib/Github";
import Download from "@/components/features/projects/Download";
import { Skeleton } from "@/components/ui";
import { Check, ChevronLeft, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

const getCachedRepo = (owner: string, repo: string): GithubRepo | null => {
    try {
        const cached = sessionStorage.getItem(`gh_repo_${owner}_${repo}`);
        if (!cached) return null;
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
            return data;
        }
    } catch {
        // ignore cache read errors
    }
    return null;
};

const setCachedRepo = (owner: string, repo: string, data: GithubRepo) => {
    try {
        sessionStorage.setItem(
            `gh_repo_${owner}_${repo}`,
            JSON.stringify({ data, timestamp: Date.now() }),
        );
    } catch {
        // ignore cache write errors
    }
};



function CodeViewSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both">
            {/* Header Hero Banner Skeleton */}
            <div className="relative overflow-hidden rounded-xl min-h-60 sm:min-h-70 md:min-h-0 md:aspect-3/1 bg-muted/60 dark:bg-muted/30 p-4 sm:p-6 md:p-8 flex flex-col justify-end gap-3 md:gap-4 border border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                <Skeleton className="h-8 md:h-10 w-2/3 md:w-1/2 rounded-xl bg-card/60" />
                <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-full bg-card/60" />
                    <Skeleton className="h-6 w-24 rounded-full bg-card/60" />
                    <Skeleton className="h-6 w-16 rounded-full bg-card/60" />
                    <span className="hidden sm:inline text-muted-foreground/30">
                        •
                    </span>
                    <Skeleton className="h-6 w-28 rounded-full bg-card/60" />
                    <Skeleton className="h-6 w-28 rounded-full bg-card/60" />
                </div>
            </div>

            {/* Content Body Skeleton */}
            <SectionCard className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                <div className="space-y-3">
                    <Skeleton className="h-8 w-56 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-11/12 rounded-md" />
                    <Skeleton className="h-4 w-4/5 rounded-md" />
                </div>
                <Skeleton className="h-44 w-full rounded-xl" />
                <div className="space-y-3">
                    <Skeleton className="h-6 w-40 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                </div>
            </SectionCard>

            {/* Recommendations Skeleton */}
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                <div className="flex items-center gap-4 px-2">
                    <Skeleton className="h-7 w-56 rounded-lg" />
                    <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-card rounded-xl p-6 border border-border space-y-4 shadow-md"
                        >
                            <Skeleton className="aspect-3/1 w-full rounded-lg" />
                            <Skeleton className="h-6 w-3/4 rounded-md" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-2/3 rounded-md" />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Skeleton className="h-5 w-14 rounded-full" />
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function ProjectView() {
    const { projectSlug } = useParams();
    const [content, setContent] = useState("");
    const [metadata, setMetadata] = useState<ProjectProps | null>(null);
    const [projects, setProjects] = useState<ProjectProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [shareStatus, setShareStatus] = useState<
        "idle" | "copied" | "shared"
    >("idle");
    const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (shareTimeoutRef.current) {
                clearTimeout(shareTimeoutRef.current);
            }
        };
    }, []);

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(window.location.href);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = window.location.href;
                textArea.style.position = "fixed";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            setShareStatus("copied");
            if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
            shareTimeoutRef.current = setTimeout(
                () => setShareStatus("idle"),
                2000,
            );
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: metadata?.title || "Project Details",
            text: metadata?.description || metadata?.title || "",
            url: window.location.href,
        };

        if (
            navigator.share &&
            (!navigator.canShare || navigator.canShare(shareData))
        ) {
            try {
                await navigator.share(shareData);
                setShareStatus("shared");
                if (shareTimeoutRef.current)
                    clearTimeout(shareTimeoutRef.current);
                shareTimeoutRef.current = setTimeout(
                    () => setShareStatus("idle"),
                    2000,
                );
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    await copyToClipboard();
                }
            }
        } else {
            await copyToClipboard();
        }
    };

    const getLatestDate = (date1?: string, date2?: string) => {
        if (!date1) return date2 || "";
        if (!date2) return date1 || "";
        return new Date(date1) > new Date(date2) ? date1 : date2;
    };

    const getEarliestDate = (date1?: string, date2?: string) => {
        if (!date1) return date2 || "";
        if (!date2) return date1 || "";
        return new Date(date1) < new Date(date2) ? date1 : date2;
    };

    useEffect(() => {
        let isMounted = true;

        async function fetchProjectData() {
            try {
                setLoading(true);
                setNotFound(false);

                const { data: supaProject, error } = await supabase
                    .from("projects")
                    .select("*")
                    .eq("slug", projectSlug)
                    .maybeSingle();

                if (error || !supaProject) {
                    if (isMounted) {
                        setNotFound(true);
                        setLoading(false);
                    }
                    return;
                }

                const loadedProject: ProjectProps = {
                    title: supaProject.title,
                    description: supaProject.description || "",
                    image: supaProject.image || "",
                    tags: supaProject.tags || [],
                    link: supaProject.link || undefined,
                    github: supaProject.github || undefined,
                    createdAt: supaProject.created_at,
                    updatedAt: supaProject.updated_at,
                    date: supaProject.updated_at || supaProject.created_at,
                    highlight: supaProject.highlight,
                    slug: supaProject.slug,
                    downloads: supaProject.downloads || undefined,
                    stars: supaProject.stars || 0,
                };
                const loadedBody = supaProject.content || "";

                if (!isMounted) return;

                // Step 1: Immediately render the project data and markdown (Instant UI load)
                setMetadata(loadedProject);
                setContent(loadedBody);
                setLoading(false);

                // Step 2: Fetch and hydrate GitHub stats in the background
                if (
                    loadedProject.github &&
                    loadedProject.github.startsWith("https://github.com")
                ) {
                    try {
                        const parsedUrl = new URL(loadedProject.github);
                        const isGithubHost =
                            parsedUrl.hostname === "github.com" &&
                            parsedUrl.protocol === "https:";
                        if (isGithubHost) {
                            const params = parsedUrl.pathname
                                .split("/")
                                .filter(Boolean);
                            if (params.length >= 2) {
                                const owner = params[0];
                                const repo = params[1];

                                const github = new GithubClient();
                                let repoData = getCachedRepo(owner, repo);
                                if (!repoData) {
                                    repoData = await github.fetchRepo(
                                        owner,
                                        repo,
                                    );
                                    setCachedRepo(owner, repo, repoData);
                                }

                                const githubCreated = repoData.created_at;
                                const githubUpdated =
                                    repoData.pushed_at || repoData.updated_at;

                                if (isMounted) {
                                    setMetadata((prev) =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  stars: repoData.stargazers_count,
                                                  createdAt: getEarliestDate(
                                                      prev.createdAt,
                                                      githubCreated,
                                                  ),
                                                  updatedAt: getLatestDate(
                                                      prev.updatedAt,
                                                      githubUpdated,
                                                  ),
                                                  date: getLatestDate(
                                                      prev.date,
                                                      githubUpdated,
                                                  ),
                                              }
                                            : null,
                                    );
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching github data:", error);
                    }
                }
            } catch (err) {
                console.error("Error loading markdown:", err);
                if (isMounted) setNotFound(true);
            }
        }

        async function fetchProjects() {
            try {
                // Try Supabase first
                try {
                    const { data: supaProjects, error } = await supabase
                        .from("projects")
                        .select("id, slug, title, description, tags, highlight, image, github, link, downloads, created_at, updated_at, stars")
                        .order("created_at", { ascending: false });

                    if (!error && supaProjects && supaProjects.length > 0) {
                        if (isMounted) {
                            setProjects(
                                supaProjects.map((p) => ({
                                    title: p.title,
                                    description: p.description || "",
                                    image: p.image || "",
                                    tags: p.tags || [],
                                    link: p.link || undefined,
                                    github: p.github || undefined,
                                    createdAt: p.created_at,
                                    updatedAt: p.updated_at,
                                    highlight: p.highlight,
                                    slug: p.slug,
                                    downloads: p.downloads || undefined,
                                    stars: p.stars || 0,
                                }))
                            );
                        }
                        return;
                    }
                } catch (e) {
                    console.warn("Supabase projects list query failed, using static:", e);
                }

                const response = await fetch("/projects/_.json");
                if (!response.ok) return;
                const data = await response.json();
                if (isMounted) {
                    setProjects(data);
                }
            } catch (err) {
                console.error("Error loading projects:", err);
            }
        }

        fetchProjectData();
        fetchProjects();
        window.scrollTo(0, 0);

        return () => {
            isMounted = false;
        };
    }, [projectSlug]);

    const recommendations = useMemo(() => {
        if (!metadata) return [];
        return projects
            .filter((p) => p.slug !== projectSlug)
            .map((p) => ({
                project: p,
                score: p.tags.filter((t) => metadata.tags.includes(t)).length,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((item) => item.project);
    }, [projects, metadata, projectSlug]);

    const techSummary = metadata?.tags?.length
        ? metadata.tags.slice(0, 3).join(", ")
        : "";
    const pageTitle = metadata?.title
        ? techSummary
            ? `${metadata.title} - ${techSummary} | Jürgen Jacobsen`
            : `${metadata.title} | Jürgen Jacobsen`
        : "Project Details | Jürgen Jacobsen";
    const pageDescription =
        metadata?.description ||
        "Project details and source code by Jürgen Jacobsen.";

    const projectSchema = useMemo(() => {
        if (!metadata) return undefined;
        return {
            "@context": "https://schema.org",
            "@type": metadata.github ? "SoftwareSourceCode" : "CreativeWork",
            name: metadata.title,
            description: metadata.description,
            ...(metadata.github ? { codeRepository: metadata.github } : {}),
            ...(metadata.link ? { url: metadata.link } : {}),
            ...(metadata.image
                ? {
                      image: metadata.image.startsWith("http")
                          ? metadata.image
                          : `https://jurgen.fyi${metadata.image.startsWith("/") ? "" : "/"}${metadata.image}`,
                  }
                : {}),
            ...(metadata.tags && metadata.tags.length > 0
                ? {
                      programmingLanguage: metadata.tags[0],
                      keywords: metadata.tags.join(", "),
                  }
                : {}),
            author: {
                "@type": "Person",
                name: "Jürgen Jacobsen",
                url: "https://jurgen.fyi/",
            },
            ...(metadata.createdAt ? { dateCreated: metadata.createdAt } : {}),
            ...(metadata.updatedAt ? { dateModified: metadata.updatedAt } : {}),
        };
    }, [metadata]);

    if (notFound) {
        return <NotFound />;
    }

    if (loading) {
        return (
            <div>
                <SEO
                    title="Loading Project... | Jürgen Jacobsen"
                    canonical={`/code/${projectSlug}`}
                />
                <CodeViewSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 fill-mode-both">
            <SEO
                title={pageTitle}
                description={pageDescription}
                canonical={`/code/${projectSlug}`}
                image={metadata?.image}
                type="article"
                jsonLd={projectSchema}
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Code", path: "/code" },
                    {
                        name: metadata?.title || "Project Details",
                        path: `/code/${projectSlug}`,
                    },
                ]}
            />
            <ProjectViewHeader metadata={metadata!} />

            <div className="grid md:hidden bg-card rounded-xl border border-border p-4 md:p-8 mt-4 md:mt-6 shadow-md grid-cols-2 gap-4">
                <Link
                    to="/code"
                    className="font-medium py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center justify-center gap-2 text-primary border-border/50 hover:bg-primary/5 hover:border-primary/25"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Link>
                <button
                    type="button"
                    onClick={handleShare}
                    aria-label={
                        shareStatus === "copied"
                            ? "Link copied"
                            : shareStatus === "shared"
                              ? "Project shared"
                              : "Share project"
                    }
                    className="py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground border-primary"
                >
                    {shareStatus === "shared" ? (
                        <>
                            <Check className="w-4 h-4" />
                            Shared!
                        </>
                    ) : shareStatus === "copied" ? (
                        <>
                            <Check className="w-4 h-4" />
                            Link Copied!
                        </>
                    ) : (
                        <>
                            <Share2 className="w-4 h-4" />
                            Share
                        </>
                    )}
                </button>
            </div>

            <SectionCard className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                <article className="prose lg:prose-base max-w-none text-foreground leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </article>
                {metadata?.github &&
                    !metadata.downloads?.hideDownloads &&
                    !metadata.downloads?.disableAll && (
                        <Download
                            projectId={metadata.github}
                            hideUnavailable={
                                metadata.downloads?.hideUnavailable
                            }
                            disableAll={metadata.downloads?.disableAll}
                        />
                    )}
            </SectionCard>

            {recommendations.length > 0 && (
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                    <div className="flex items-center gap-4 px-2">
                        <h2 className="text-2xl font-black tracking-tight">
                            Recommended Projects
                        </h2>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendations.map((project, idx) => (
                            <div
                                key={project.slug}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                                style={{
                                    animationDelay: `${300 + idx * 100}ms`,
                                }}
                            >
                                <ProjectPreview project={project} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
