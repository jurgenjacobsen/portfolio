import { createContext, use, useState, useMemo, useCallback } from "react";
import type { ProjectProps } from "@/pages/code/Code";

export interface ProjectFiltersState {
    search: string;
    techFilter: string;
    sortBy: string;
    availableTags: string[];
    filteredProjects: ProjectProps[];
    loading: boolean;
    hasActiveFilters: boolean;
}

export interface ProjectFiltersActions {
    setSearch: (search: string) => void;
    setTechFilter: (tag: string) => void;
    setSortBy: (sort: string) => void;
    clearFilters: () => void;
}

export interface ProjectFiltersContextValue {
    state: ProjectFiltersState;
    actions: ProjectFiltersActions;
}

export const ProjectFiltersContext =
    createContext<ProjectFiltersContextValue | null>(null);

export function useProjectFilterState(
    projects: ProjectProps[] = [],
    loading = false,
): ProjectFiltersContextValue {
    const [search, setSearch] = useState("");
    const [techFilter, setTechFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        projects.forEach((p) => {
            p.tags.forEach((tag) => tags.add(tag.toLowerCase()));
        });
        return Array.from(tags).sort();
    }, [projects]);

    const filteredProjects = useMemo(() => {
        let result = [...projects];

        if (search) {
            const query = search.toLowerCase();
            result = result.filter(
                (project) =>
                    project.title.toLowerCase().includes(query) ||
                    project.description.toLowerCase().includes(query),
            );
        }

        if (techFilter !== "all") {
            const filter = techFilter.toLowerCase();
            result = result.filter((project) =>
                project.tags.some((tag) => tag.toLowerCase() === filter),
            );
        }

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

    const hasActiveFilters =
        techFilter !== "all" || sortBy !== "newest" || search.trim() !== "";

    const clearFilters = useCallback(() => {
        setSearch("");
        setTechFilter("all");
        setSortBy("newest");
    }, []);

    return {
        state: {
            search,
            techFilter,
            sortBy,
            availableTags,
            filteredProjects,
            loading,
            hasActiveFilters,
        },
        actions: {
            setSearch,
            setTechFilter,
            setSortBy,
            clearFilters,
        },
    };
}

export function useProjectFilters(): ProjectFiltersContextValue {
    const context = use(ProjectFiltersContext);
    if (!context) {
        throw new Error(
            "useProjectFilters must be used within a ProjectFiltersProvider",
        );
    }
    return context;
}
