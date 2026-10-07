import type { ReactNode } from "react";
import type { ProjectProps } from "@/pages/code/Code";
import {
    ProjectFiltersContext,
    useProjectFilterState,
} from "./useProjectFilters";

export interface ProjectFiltersProviderProps {
    projects: ProjectProps[];
    loading?: boolean;
    children: ReactNode;
}

export function ProjectFiltersProvider({
    projects,
    loading = false,
    children,
}: ProjectFiltersProviderProps) {
    const value = useProjectFilterState(projects, loading);

    return (
        <ProjectFiltersContext value={value}>
            {children}
        </ProjectFiltersContext>
    );
}

export default ProjectFiltersProvider;
