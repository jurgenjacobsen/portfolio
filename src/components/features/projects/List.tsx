import { use } from "react";
import ListHeader from "./ListHeader";
import type { ProjectProps } from "@/pages/code/Code";
import ListedProject from "./ListedProject";
import SectionCard from "@/components/layout/SectionCard";
import {
    ProjectFiltersContext,
    useProjectFilters,
} from "./useProjectFilters";
import ProjectFiltersProvider from "./ProjectFiltersProvider";
import { ProjectsListLoading } from "./ProjectsLoading";

export interface ProjectsListProps {
    projects?: ProjectProps[];
    loading?: boolean;
}

export default function ProjectsList(props: ProjectsListProps = {}) {
    const context = use(ProjectFiltersContext);

    if (!context && props.projects !== undefined) {
        return (
            <ProjectFiltersProvider
                projects={props.projects}
                loading={props.loading}
            >
                <ProjectsListContent />
            </ProjectFiltersProvider>
        );
    }

    return <ProjectsListContent />;
}

function ProjectsListContent() {
    const {
        state: { filteredProjects, loading },
    } = useProjectFilters();

    return (
        <SectionCard className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
            <ListHeader />

            <div className="space-y-6">
                {loading ? (
                    <ProjectsListLoading />
                ) : filteredProjects.length > 0 ? (
                    filteredProjects.map((project, i) => (
                        <ListedProject
                            key={project.slug || i}
                            project={project}
                            index={i}
                        />
                    ))
                ) : (
                    <div className="py-20 text-center space-y-3">
                        <p className="text-xl font-bold text-muted-foreground uppercase tracking-tight">
                            No projects found
                        </p>
                        <p className="text-sm text-muted-foreground/60">
                            Try adjusting your filters or search terms
                        </p>
                    </div>
                )}
            </div>
        </SectionCard>
    );
}
