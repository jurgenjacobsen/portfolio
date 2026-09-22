import { useState, useMemo } from "react";
import { supabase, type ProjectRow } from "@/lib/supabase";
import ProjectEditorModal from "./ProjectEditorModal";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Star,
    Loader2,
    AlertCircle,
} from "lucide-react";

interface ProjectsPanelProps {
    projects: ProjectRow[];
    loading: boolean;
    onRefresh: () => void;
}

export default function ProjectsPanel({
    projects,
    loading,
    onRefresh,
}: ProjectsPanelProps) {
    const [search, setSearch] = useState("");
    const [tagFilter, setTagFilter] = useState("all");
    const [editingProject, setEditingProject] = useState<ProjectRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Collect all existing tags
    const allTags = useMemo(() => {
        const set = new Set<string>();
        projects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, [projects]);

    // Filtered projects
    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const matchesSearch =
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.slug.toLowerCase().includes(search.toLowerCase()) ||
                (p.description || "").toLowerCase().includes(search.toLowerCase());

            const matchesTag =
                tagFilter === "all" || (p.tags || []).includes(tagFilter);

            return matchesSearch && matchesTag;
        });
    }, [projects, search, tagFilter]);

    const handleCreateNew = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleEdit = (project: ProjectRow) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleToggleHighlight = async (project: ProjectRow) => {
        setActionLoading(project.id);
        try {
            const { error } = await supabase
                .from("projects")
                .update({ highlight: !project.highlight })
                .eq("id", project.id);
            if (error) throw error;
            onRefresh();
        } catch (err) {
            console.error("Failed to toggle highlight:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        setActionLoading(id);
        try {
            const { error } = await supabase.from("projects").delete().eq("id", id);
            if (error) throw error;
            setDeletingId(null);
            onRefresh();
        } catch (err) {
            console.error("Failed to delete project:", err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Top controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex flex-1 items-center gap-2 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects by title, slug, or text..."
                            className="w-full bg-background border border-input rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    <select
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="bg-background border border-input rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted-foreground"
                    >
                        <option value="all">All Tags</option>
                        {allTags.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-xs sm:text-sm hover:opacity-90 transition cursor-pointer shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                </button>
            </div>

            {/* Projects Table */}
            <div className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <p className="text-xs font-mono">Loading projects from Supabase...</p>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground space-y-2">
                        <p className="text-sm font-medium">No projects found</p>
                        <p className="text-xs">
                            {search || tagFilter !== "all"
                                ? "Try resetting your search filters."
                                : "Create your first project using the button above."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                                <tr>
                                    <th className="py-3 px-4">Project</th>
                                    <th className="py-3 px-4 hidden md:table-cell">Slug</th>
                                    <th className="py-3 px-4 hidden sm:table-cell">Tags</th>
                                    <th className="py-3 px-4 text-center">Highlight</th>
                                    <th className="py-3 px-4 hidden lg:table-cell">Updated</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {filteredProjects.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-muted/20 transition group"
                                    >
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                {p.image ? (
                                                    <img
                                                        src={p.image}
                                                        alt={p.title}
                                                        className="w-9 h-9 rounded-lg object-cover border border-border shrink-0 bg-muted"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg border border-border bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground shrink-0">
                                                        {p.title.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-foreground truncate">
                                                        {p.title}
                                                    </div>
                                                    <div className="text-[11px] text-muted-foreground line-clamp-1">
                                                        {p.description || "No description provided."}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 hidden md:table-cell font-mono text-xs text-muted-foreground">
                                            /code/{p.slug}
                                        </td>
                                        <td className="py-3.5 px-4 hidden sm:table-cell">
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {(p.tags || []).slice(0, 3).map((t) => (
                                                    <span
                                                        key={t}
                                                        className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-foreground"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                                {(p.tags || []).length > 3 && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        +{(p.tags || []).length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <button
                                                onClick={() => handleToggleHighlight(p)}
                                                disabled={actionLoading === p.id}
                                                title="Toggle Highlight"
                                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                                    p.highlight
                                                        ? "bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20"
                                                        : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                                }`}
                                            >
                                                <Star
                                                    className={`w-4 h-4 ${
                                                        p.highlight ? "fill-amber-500" : ""
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-muted-foreground">
                                            {p.updated_at
                                                ? new Date(p.updated_at).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="inline-flex items-center gap-1">
                                                <a
                                                    href={`/code/${p.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="View Public Page"
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    title="Edit Project"
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingId(p.id)}
                                                    title="Delete Project"
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                        <div className="flex items-center gap-3 text-destructive">
                            <AlertCircle className="w-6 h-6" />
                            <h3 className="font-bold text-base">Delete Project</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Are you sure you want to delete this project? This action deletes the record from the Supabase `projects` table permanently.
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeletingId(null)}
                                className="px-3.5 py-1.5 rounded-xl border border-input text-xs font-medium hover:bg-muted cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deletingId)}
                                disabled={actionLoading === deletingId}
                                className="px-4 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
                            >
                                {actionLoading === deletingId ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    "Confirm Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Edit / Create Modal */}
            <ProjectEditorModal
                isOpen={isModalOpen}
                project={editingProject}
                existingTags={allTags}
                onClose={() => setIsModalOpen(false)}
                onSaved={onRefresh}
            />
        </div>
    );
}
