import { useState, useMemo, useEffect } from "react";
import { GithubClient } from "@/lib/Github";
import ProjectHighlight from "@/components/features/projects/Highlight";
import ProjectsList from "@/components/features/projects/List";

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
};

export default function Projects() {
    const [search, setSearch] = useState("");
    const [techFilter, setTechFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [projects, setProjects] = useState<ProjectProps[]>([]);
    const [loading, setLoading] = useState(true);

    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        projects.forEach((p) => {
            p.tags.forEach((tag) => tags.add(tag.toLowerCase()));
        });
        return Array.from(tags).sort();
    }, [projects]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch("/projects/_.json");
                const data: (ProjectProps & { highlight?: boolean })[] =
                    await response.json();

                const github = new GithubClient();

                // Fetch stars and dates for each project that has a github URL
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

                                        const repoData = await github.fetchRepo(
                                            owner,
                                            repo,
                                        );
                                        return {
                                            ...project,
                                            stars: repoData.stargazers_count,
                                            createdAt:
                                                repoData.created_at ||
                                                project.createdAt,
                                            updatedAt:
                                                repoData.pushed_at ||
                                                repoData.updated_at ||
                                                project.updatedAt,
                                            date:
                                                project.date ||
                                                repoData.pushed_at ||
                                                project.updatedAt,
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

                setProjects(projectsWithGithubData);
            } catch (error) {
                console.error("Error loading projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
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

    const filteredProjects = useMemo(() => {
        let result = [...projects];

        // Search filter
        if (search) {
            result = result.filter(
                (project) =>
                    project.title
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    project.description
                        .toLowerCase()
                        .includes(search.toLowerCase()),
            );
        }

        // Tech filter
        if (techFilter !== "all") {
            result = result.filter((project) =>
                project.tags.some(
                    (tag) => tag.toLowerCase() === techFilter.toLowerCase(),
                ),
            );
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "alphabetical") {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === "stars") {
                return (b.stars || 0) - (a.stars || 0);
            }
            const dateA = new Date(a.date || a.createdAt || "").getTime();
            const dateB = new Date(b.date || b.createdAt || "").getTime();
            if (sortBy === "newest") return dateB - dateA;
            if (sortBy === "oldest") return dateA - dateB;
            return 0;
        });

        return result;
    }, [search, techFilter, sortBy, projects]);

    return (
        <main className="space-y-4 md:space-y-8">
            {!loading && highlightedProjects.length > 0 && (
                <ProjectHighlight projects={highlightedProjects} />
            )}
            <ProjectsList
                projects={filteredProjects}
                availableTags={availableTags}
                search={search}
                setSearch={setSearch}
                techFilter={techFilter}
                setTechFilter={setTechFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                loading={loading}
            />
        </main>
    );
}
