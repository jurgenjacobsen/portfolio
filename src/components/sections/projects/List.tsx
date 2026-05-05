import ListHeader from "@/components/ui/list-header";
import type { ProjectProps } from "@/pages/Projects";
import ListedProject from "./ListedProject";
import { SectionCard } from "@/components/ui";

interface ProjectsListProps {
    projects: ProjectProps[];
    availableTags: string[];
    search: string;
    setSearch: (val: string) => void;
    techFilter: string;
    setTechFilter: (val: string) => void;
    sortBy: string;
    setSortBy: (val: string) => void;
    loading: boolean;
}

export default function ProjectsList({
    projects,
    availableTags,
    search,
    setSearch,
    techFilter,
    setTechFilter,
    sortBy,
    setSortBy,
    loading,
}: ProjectsListProps) {
    return (
        <SectionCard className="space-y-8">
            <ListHeader
                search={search}
                setSearch={setSearch}
                techFilter={techFilter}
                setTechFilter={setTechFilter}
                availableTags={availableTags}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <div className="space-y-6">
                {loading ? (
                    <div className="py-20 text-center">
                        <p className="text-xl font-bold text-muted-foreground uppercase tracking-tight">
                            Loading projects...
                        </p>
                    </div>
                ) : projects.length > 0 ? (
                    projects.map((project, i) => (
                        <ListedProject key={i} project={project} />
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
