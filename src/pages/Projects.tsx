import { useState, useMemo, useEffect } from "react";
import ProjectHighlight from "@/components/sections/projects/Highlight";
import ProjectsList from "@/components/sections/projects/List";
import type { IconId } from "@/components/ui/icon";
import { GithubClient, type GithubRepo } from "@/lib/Github";

export type ProjectProps = {
    title: string;
    description: string;
    image: string;
    tags: (IconId | string)[];
    link: string;
    github: string;
    date?: string;
    stars?: number;
    createdAt?: string;
    updatedAt?: string;
};

export default function Projects() {
    const [search, setSearch] = useState("");
    const [techFilter, setTechFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [repos, setRepos] = useState<ProjectProps[]>([]);
    const [loading, setLoading] = useState(true);

    const featuredProjects: ProjectProps[] = [
        {
            title: "Project Alpha",
            description:
                "A comprehensive full-stack platform built with React, NestJS, and PostgreSQL. Features real-time analytics and a responsive design.",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
            tags: ["React", "NestJS", "PostgreSQL"],
            link: "#",
            github: "#",
            date: "2024-03-01",
            stars: 128,
            createdAt: "2023-11-01",
            updatedAt: "2024-03-01",
        },
        {
            title: "Project Beta",
            description:
                "A modern web application built with TypeScript and Vue.js. Features a clean UI and seamless user experience.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
            tags: ["TypeScript", "Vue"],
            link: "#",
            github: "#",
            date: "2024-02-15",
            stars: 85,
            createdAt: "2023-12-10",
            updatedAt: "2024-02-15",
        },
        {
            title: "Project Gamma",
            description:
                "A high-performance backend service built with Go and Redis. Optimized for low latency and high throughput.",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop",
            tags: ["Go", "Redis"],
            link: "#",
            github: "#",
            date: "2024-01-20",
            stars: 210,
            createdAt: "2023-09-05",
            updatedAt: "2024-01-20",
        },
    ];

    useEffect(() => {
        const github = new GithubClient();
        github.fetchRepos("jurgenjacobsen").then((data) => {
            const githubProjects: ProjectProps[] = data.map(
                (repo: GithubRepo) => ({
                    title: repo.name,
                    description: repo.description || "No description provided",
                    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop", // Fallback image
                    tags:
                        repo.topics.length > 0
                            ? repo.topics
                            : [repo.language || "Unknown"],
                    link: repo.homepage || repo.html_url,
                    github: repo.html_url,
                    date: repo.pushed_at,
                    stars: repo.stargazers_count,
                    createdAt: repo.created_at,
                    updatedAt: repo.pushed_at,
                }),
            );
            setRepos(githubProjects);
            setLoading(false);
        });
    }, []);

    const allProjects = useMemo(() => {
        // Merge featured projects with GitHub repos, avoiding duplicates by title
        const combined = [...featuredProjects];
        repos.forEach((repo) => {
            if (
                !combined.some(
                    (p) => p.title.toLowerCase() === repo.title.toLowerCase(),
                )
            ) {
                combined.push(repo);
            }
        });
        return combined;
    }, [repos, featuredProjects]);

    const filteredProjects = useMemo(() => {
        let result = allProjects.filter((project) => {
            const matchesSearch =
                project.title.toLowerCase().includes(search.toLowerCase()) ||
                project.description
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesTech =
                techFilter === "all" ||
                project.tags.some(
                    (tag) => tag.toLowerCase() === techFilter.toLowerCase(),
                );

            return matchesSearch && matchesTech;
        });

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "alphabetical") {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === "stars") {
                return (b.stars || 0) - (a.stars || 0);
            }
            const dateA = new Date(a.date || "").getTime();
            const dateB = new Date(b.date || "").getTime();
            if (sortBy === "newest") return dateB - dateA;
            if (sortBy === "oldest") return dateA - dateB;
            return 0;
        });

        return result;
    }, [search, techFilter, sortBy, allProjects]);

    return (
        <>
            <ProjectHighlight projects={featuredProjects} />
            <ProjectsList
                projects={filteredProjects}
                search={search}
                setSearch={setSearch}
                techFilter={techFilter}
                setTechFilter={setTechFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                loading={loading}
            />
        </>
    );
}
