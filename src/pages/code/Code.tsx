import { useState, useMemo, useEffect } from "react";
import { GithubClient, type GithubRepo } from "@/lib/Github";
import ProjectHighlight from "@/components/features/projects/Highlight";
import ProjectsList from "@/components/features/projects/List";
import ProjectFiltersProvider from "@/components/features/projects/ProjectFiltersProvider";
import SEO from "@/components/shared/SEO";
import { supabase } from "@/lib/supabase";

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const memoryRepoCache = new Map<string, { data: GithubRepo; timestamp: number }>();
const githubClient = new GithubClient();

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

const getCachedRepo = (owner: string, repo: string): GithubRepo | null => {
    const key = `gh_repo_${owner}_${repo}`;
    const inMemory = memoryRepoCache.get(key);
    if (inMemory) {
        if (Date.now() - inMemory.timestamp < CACHE_TTL_MS) {
            return inMemory.data;
        }
        memoryRepoCache.delete(key);
    }

    try {
        const cached = sessionStorage.getItem(key);
        if (!cached) return null;
        const parsed = JSON.parse(cached) as { data: GithubRepo; timestamp: number };
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            memoryRepoCache.set(key, parsed);
            return parsed.data;
        }
    } catch {
        // ignore cache read errors
    }
    return null;
};

const setCachedRepo = (owner: string, repo: string, data: GithubRepo) => {
    const key = `gh_repo_${owner}_${repo}`;
    const entry = { data, timestamp: Date.now() };
    memoryRepoCache.set(key, entry);
    try {
        sessionStorage.setItem(key, JSON.stringify(entry));
    } catch {
        // ignore cache write errors
    }
};

export type ProjectProps = {
    title: string;
    description: string;
    image: string;
    tags: string[];
    link?: string;
    github?: string;
    date?: string;
    stars?: number;
    createdAt: string;
    updatedAt: string;
    highlight?: boolean;
    slug: string;
    downloads?: {
        hideUnavailable?: boolean;
        disableAll?: boolean;
        hideDownloads?: boolean;
    };
};

export default function Projects() {
    const [projects, setProjects] = useState<ProjectProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchProjects = async () => {
            try {
                const { data: supaProjects, error: supaError } = await supabase
                    .from("projects")
                    .select("id, slug, title, description, tags, highlight, image, github, link, downloads, created_at, updated_at, stars")
                    .order("created_at", { ascending: false });

                if (supaError) throw supaError;

                const data: (ProjectProps & { highlight?: boolean })[] = (supaProjects || []).map((p) => ({
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
                }));

                if (!isMounted) return;

                // Step 1: Immediately render the project data (Instant UI load)
                const initialProjects: ProjectProps[] = data.map((project) => ({
                    ...project,
                    date: project.date || project.updatedAt,
                }));
                setProjects(initialProjects);
                setLoading(false);

                // Step 2: Fetch and hydrate GitHub stats (stars, pushed dates) asynchronously in the background
                const github = githubClient;

                const projectsWithGithubData = await Promise.all(
                    data.map(async (project) => {
                        if (
                            project.github &&
                            project.github.startsWith("https://github.com")
                        ) {
                            try {
                                const parsedUrl = new URL(project.github);
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

                                        let repoData = getCachedRepo(owner, repo);
                                        if (!repoData) {
                                            repoData = await github.fetchRepo(
                                                owner,
                                                repo,
                                            );
                                            setCachedRepo(owner, repo, repoData);
                                        }

                                        const githubCreated =
                                            repoData.created_at;
                                        const githubUpdated =
                                            repoData.pushed_at ||
                                            repoData.updated_at;

                                        const finalCreatedAt = getEarliestDate(
                                            githubCreated,
                                            project.createdAt,
                                        );
                                        const finalUpdatedAt = getLatestDate(
                                            githubUpdated,
                                            project.updatedAt,
                                        );

                                        return {
                                            ...project,
                                            stars: repoData.stargazers_count,
                                            createdAt: finalCreatedAt,
                                            updatedAt: finalUpdatedAt,
                                            date:
                                                project.date || finalUpdatedAt,
                                        };
                                    }
                                }
                            } catch (error) {
                                console.error(
                                    `Error fetching data for ${project.title}:`,
                                    error,
                                );
                            }
                        }
                        return {
                            ...project,
                            date: project.date || project.updatedAt,
                        };
                    }),
                );

                if (isMounted) {
                    setProjects(projectsWithGithubData);
                }
            } catch (error) {
                console.error("Error loading projects:", error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProjects();

        return () => {
            isMounted = false;
        };
    }, []);

    const highlightedProjects = useMemo(() => {
        return projects
            .filter((p) => p.highlight)
            .sort((a, b) => {
                const dateA = new Date(a.date || a.createdAt || "").getTime();
                const dateB = new Date(b.date || b.createdAt || "").getTime();
                return dateB - dateA;
            })
            .slice(0, 3);
    }, [projects]);

    return (
        <main id="main-content" className="space-y-4 md:space-y-8">
            <SEO
                title="Software Projects | Jürgen Jacobsen"
                description="Explore software engineering projects, open-source tools, and applications built with TypeScript, React, Node.js, and more by Jürgen Jacobsen."
                canonical="/code"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Code", path: "/code" },
                ]}
            />
            {!loading && highlightedProjects.length > 0 && (
                <ProjectHighlight projects={highlightedProjects} />
            )}
            <ProjectFiltersProvider projects={projects} loading={loading}>
                <ProjectsList />
            </ProjectFiltersProvider>
        </main>
    );

}
