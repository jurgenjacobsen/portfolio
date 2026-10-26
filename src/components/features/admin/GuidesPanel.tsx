import { useState, useMemo } from "react";
import { supabase, type GuideRow, type GuideSectionRow } from "@/lib/supabase";
import GuideEditorModal from "./GuideEditorModal";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ExternalLink,
    Loader2,
    AlertCircle,
    FolderPlus,
    BookOpen,
    Folder,
    Clock,
    X,
} from "lucide-react";

interface GuidesPanelProps {
    guides: GuideRow[];
    sections: GuideSectionRow[];
    loading: boolean;
    onRefresh: () => void;
}

export default function GuidesPanel({
    guides,
    sections,
    loading,
    onRefresh,
}: GuidesPanelProps) {
    const [search, setSearch] = useState("");
    const [sectionFilter, setSectionFilter] = useState("all");
    const [editingGuide, setEditingGuide] = useState<GuideRow | null>(null);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    // Section management modal/state
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [sectionTitle, setSectionTitle] = useState("");
    const [sectionIdInput, setSectionIdInput] = useState("");
    const [sectionOrder, setSectionOrder] = useState(0);
    const [sectionSaving, setSectionSaving] = useState(false);
    const [sectionError, setSectionError] = useState<string | null>(null);

    // Delete states
    const [deletingGuideId, setDeletingGuideId] = useState<string | null>(null);
    const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Filtered guides
    const filteredGuides = useMemo(() => {
        return guides.filter((g) => {
            const matchesSearch =
                g.title.toLowerCase().includes(search.toLowerCase()) ||
                g.slug.toLowerCase().includes(search.toLowerCase()) ||
                (g.topic || "").toLowerCase().includes(search.toLowerCase());

            const matchesSection =
                sectionFilter === "all" || g.section_id === sectionFilter;

            return matchesSearch && matchesSection;
        });
    }, [guides, search, sectionFilter]);

    const allTags = useMemo(() => {
        const set = new Set<string>();
        guides.forEach((g) => (g.tags || []).forEach((t) => set.add(t)));
        return Array.from(set).sort();
    }, [guides]);

    const handleCreateGuide = () => {
        setEditingGuide(null);
        setIsGuideModalOpen(true);
    };

    const handleEditGuide = (guide: GuideRow) => {
        setEditingGuide(guide);
        setIsGuideModalOpen(true);
    };

    const handleDeleteGuide = async (id: string) => {
        setActionLoading(id);
        try {
            const { error } = await supabase.from("guides").delete().eq("id", id);
            if (error) throw error;
            setDeletingGuideId(null);
            onRefresh();
        } catch (err) {
            console.error("Failed to delete guide:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveSection = async (e: React.FormEvent) => {
        e.preventDefault();
        setSectionError(null);
        setSectionSaving(true);

        const cleanId =
            sectionIdInput.trim().toLowerCase().replace(/[\s_]+/g, "-") ||
            sectionTitle.trim().toLowerCase().replace(/[\s_]+/g, "-");

        if (!sectionTitle.trim() || !cleanId) {
            setSectionError("Section Title and ID are required.");
            setSectionSaving(false);
            return;
        }

        try {
            const { error } = await supabase.from("guide_sections").upsert({
                id: cleanId,
                title: sectionTitle.trim(),
                order_index: Number(sectionOrder) || 0,
            });
            if (error) throw error;

            setIsSectionModalOpen(false);
            setSectionTitle("");
            setSectionIdInput("");
            setSectionOrder(0);
            onRefresh();
        } catch (err: unknown) {
            setSectionError(err instanceof Error ? err.message : "Failed to save section.");
        } finally {
            setSectionSaving(false);
        }
    };

    const handleDeleteSection = async (id: string) => {
        setActionLoading(`sec-${id}`);
        try {
            const { error } = await supabase.from("guide_sections").delete().eq("id", id);
            if (error) throw error;
            setDeletingSectionId(null);
            onRefresh();
        } catch (err) {
            console.error("Failed to delete section:", err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Sections Accordion/Bar */}
            <div className="border border-border/80 rounded-2xl bg-card p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Folder className="w-4 h-4 text-primary" />
                        <span>Guide Parent Sections ({sections.length})</span>
                    </div>
                    <button
                        onClick={() => {
                            setSectionTitle("");
                            setSectionIdInput("");
                            setSectionOrder(sections.length + 1);
                            setIsSectionModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition cursor-pointer"
                    >
                        <FolderPlus className="w-3.5 h-3.5 text-primary" />
                        <span>New Section</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    {sections.map((sec) => {
                        const count = guides.filter((g) => g.section_id === sec.id).length;
                        return (
                            <div
                                key={sec.id}
                                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs"
                            >
                                <div className="min-w-0 pr-2">
                                    <div className="font-semibold text-foreground truncate">
                                        {sec.title}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground font-mono">
                                        ID: {sec.id} • Order: {sec.order_index} • {count} guides
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDeletingSectionId(sec.id)}
                                    title="Delete Section"
                                    className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Guides Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex flex-1 items-center gap-2 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search guides by title, slug, topic..."
                            className="w-full bg-background border border-input rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    <select
                        value={sectionFilter}
                        onChange={(e) => setSectionFilter(e.target.value)}
                        className="bg-background border border-input rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-muted-foreground"
                    >
                        <option value="all">All Sections</option>
                        {sections.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.title}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleCreateGuide}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-xs sm:text-sm hover:opacity-90 transition cursor-pointer shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Write Guide</span>
                </button>
            </div>

            {/* Guides Table */}
            <div className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <p className="text-xs font-mono">Loading guides from Supabase...</p>
                    </div>
                ) : filteredGuides.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground space-y-2">
                        <p className="text-sm font-medium">No guides found</p>
                        <p className="text-xs">
                            {search || sectionFilter !== "all"
                                ? "Try resetting your search filters."
                                : "Write your first technical guide using the button above."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-muted/40 border-b border-border/60 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                                <tr>
                                    <th className="py-3 px-4">Guide Article</th>
                                    <th className="py-3 px-4 hidden md:table-cell">Section & Topic</th>
                                    <th className="py-3 px-4 hidden sm:table-cell text-center">Order</th>
                                    <th className="py-3 px-4 hidden lg:table-cell">Read Time</th>
                                    <th className="py-3 px-4 hidden xl:table-cell">Updated</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {filteredGuides.map((g) => (
                                    <tr key={g.id} className="hover:bg-muted/20 transition">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-foreground truncate">
                                                        {g.title}
                                                    </div>
                                                    <div className="text-[11px] font-mono text-muted-foreground">
                                                        /guides/{g.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 hidden md:table-cell">
                                            <div className="text-xs font-medium text-foreground">
                                                {sections.find((s) => s.id === g.section_id)?.title ||
                                                    g.section_id ||
                                                    "—"}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground">
                                                {g.topic || "General"}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 hidden sm:table-cell text-center font-mono text-xs">
                                            {g.order_index}
                                        </td>
                                        <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{g.reading_time_minutes} min read</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 hidden xl:table-cell text-xs text-muted-foreground">
                                            {g.updated_at
                                                ? new Date(g.updated_at).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="inline-flex items-center gap-1">
                                                <a
                                                    href={`/guides/${g.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="View Public Guide"
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleEditGuide(g)}
                                                    title="Edit Guide"
                                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingGuideId(g.id)}
                                                    title="Delete Guide"
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

            {/* Create/Edit Section Modal */}
            {isSectionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base">New Guide Section</h3>
                            <button
                                onClick={() => setIsSectionModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {sectionError && (
                            <div className="p-2.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs">
                                {sectionError}
                            </div>
                        )}

                        <form onSubmit={handleSaveSection} className="space-y-3 text-xs sm:text-sm">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                    Section Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={sectionTitle}
                                    onChange={(e) => {
                                        setSectionTitle(e.target.value);
                                        if (!sectionIdInput) {
                                            setSectionIdInput(
                                                e.target.value
                                                    .toLowerCase()
                                                    .trim()
                                                    .replace(/[\s_]+/g, "-")
                                            );
                                        }
                                    }}
                                    placeholder="e.g. Avionics"
                                    className="w-full bg-background border border-input rounded-xl px-3 py-2"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                    Section ID (Slug) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={sectionIdInput}
                                    onChange={(e) => setSectionIdInput(e.target.value)}
                                    placeholder="e.g. avionics"
                                    className="w-full bg-background border border-input rounded-xl px-3 py-2 font-mono"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                    Order Index
                                </label>
                                <input
                                    type="number"
                                    value={sectionOrder}
                                    onChange={(e) => setSectionOrder(Number(e.target.value))}
                                    className="w-full bg-background border border-input rounded-xl px-3 py-2"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsSectionModalOpen(false)}
                                    className="px-3.5 py-1.5 rounded-xl border border-input text-xs hover:bg-muted cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sectionSaving}
                                    className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
                                >
                                    {sectionSaving ? "Saving..." : "Save Section"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Guide Delete Confirmation Modal */}
            {deletingGuideId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                        <div className="flex items-center gap-3 text-destructive">
                            <AlertCircle className="w-6 h-6" />
                            <h3 className="font-bold text-base">Delete Guide</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Are you sure you want to delete this guide? This action permanently removes the record from Supabase.
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeletingGuideId(null)}
                                className="px-3.5 py-1.5 rounded-xl border border-input text-xs font-medium hover:bg-muted cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteGuide(deletingGuideId)}
                                disabled={actionLoading === deletingGuideId}
                                className="px-4 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
                            >
                                {actionLoading === deletingGuideId ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Section Delete Confirmation Modal */}
            {deletingSectionId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
                        <div className="flex items-center gap-3 text-destructive">
                            <AlertCircle className="w-6 h-6" />
                            <h3 className="font-bold text-base">Delete Section</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Are you sure you want to delete section <span className="font-mono font-bold text-foreground">"{deletingSectionId}"</span>? Any guides in this section will have their section set to null.
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setDeletingSectionId(null)}
                                className="px-3.5 py-1.5 rounded-xl border border-input text-xs font-medium hover:bg-muted cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteSection(deletingSectionId)}
                                disabled={actionLoading === `sec-${deletingSectionId}`}
                                className="px-4 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
                            >
                                {actionLoading === `sec-${deletingSectionId}` ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guide Edit Modal */}
            <GuideEditorModal
                isOpen={isGuideModalOpen}
                guide={editingGuide}
                sections={sections}
                existingTags={allTags}
                onClose={() => setIsGuideModalOpen(false)}
                onSaved={onRefresh}
            />
        </div>
    );
}
