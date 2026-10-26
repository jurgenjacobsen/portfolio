import { useState } from "react";
import { supabase, type ProjectRow } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    X,
    Save,
    Loader2,
    Eye,
    Edit3,
    Sparkles,
} from "lucide-react";

interface ProjectEditorModalProps {
    project: ProjectRow | null; // null = create new
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    existingTags: string[];
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
}

function ProjectEditorDialog({
    project,
    onClose,
    onSaved,
    existingTags,
}: Omit<ProjectEditorModalProps, "isOpen">) {
    const isEdit = Boolean(project);

    const [title, setTitle] = useState(project?.title || "");
    const [slug, setSlug] = useState(project?.slug || "");
    const [description, setDescription] = useState(project?.description || "");
    const [content, setContent] = useState(
        project?.content ||
            "# Overview\n\nDescribe your project here...\n\n## Tech Stack\n- TypeScript\n- React"
    );
    const [image, setImage] = useState(project?.image || "");
    const [github, setGithub] = useState(project?.github || "");
    const [link, setLink] = useState(project?.link || "");
    const [highlight, setHighlight] = useState(Boolean(project?.highlight));
    const [tags, setTags] = useState<string[]>(project?.tags || []);
    const [tagInput, setTagInput] = useState("");
    const [downloads, setDownloads] = useState({
        hideUnavailable: Boolean(project?.downloads?.hideUnavailable),
        disableAll: Boolean(project?.downloads?.disableAll),
        hideDownloads: Boolean(project?.downloads?.hideDownloads),
    });

    const [tab, setTab] = useState<"edit" | "preview">("edit");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTitleChange = (val: string) => {
        setTitle(val);
        if (!isEdit && !slug) {
            setSlug(slugify(val));
        }
    };

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setTagInput("");
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleKeyDownTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(tagInput);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        const cleanSlug = slug.trim() || slugify(title);
        if (!title.trim() || !cleanSlug) {
            setError("Title and slug are required.");
            setSaving(false);
            return;
        }

        const payload: Partial<ProjectRow> = {
            title: title.trim(),
            slug: cleanSlug,
            description: description.trim() || null,
            content,
            image: image.trim() || null,
            github: github.trim() || null,
            link: link.trim() || null,
            highlight,
            tags,
            downloads,
            updated_at: new Date().toISOString(),
        };

        try {
            if (isEdit && project) {
                const { error } = await supabase
                    .from("projects")
                    .update(payload)
                    .eq("id", project.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("projects").insert({
                    ...payload,
                    created_at: new Date().toISOString(),
                    stars: 0,
                });
                if (error) throw error;
            }
            onSaved();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save project.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/30">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">
                            {isEdit ? `Edit Project: ${project?.title}` : "Create New Project"}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Managed in Supabase `projects` table
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                        {error}
                    </div>
                )}

                {/* Modal Body */}
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="My Awesome Project"
                                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Slug *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setSlug(slugify(title))}
                                    className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <Sparkles className="w-3 h-3" /> Auto
                                </button>
                            </div>
                            <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="my-awesome-project"
                                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Short Description
                        </label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief synopsis displayed on the projects index page..."
                            className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Links & Image */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Image URL / Path
                            </label>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="/img/preview.png"
                                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                placeholder="https://github.com/..."
                                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Demo / Live Link
                            </label>
                            <input
                                type="url"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Highlight & Downloads Toggles */}
                    <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-wrap items-center gap-6 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={highlight}
                                onChange={(e) => setHighlight(e.target.checked)}
                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                            />
                            <span className="font-medium">Highlight on Home/Code</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground text-xs">
                            <input
                                type="checkbox"
                                checked={downloads.hideUnavailable}
                                onChange={(e) =>
                                    setDownloads({ ...downloads, hideUnavailable: e.target.checked })
                                }
                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                            />
                            <span>Hide Unavailable Downloads</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground text-xs">
                            <input
                                type="checkbox"
                                checked={downloads.disableAll}
                                onChange={(e) =>
                                    setDownloads({ ...downloads, disableAll: e.target.checked })
                                }
                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                            />
                            <span>Disable Downloads</span>
                        </label>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-1.5 items-center p-2 rounded-xl border border-input bg-background min-h-[42px]">
                            {tags.map((t) => (
                                <span
                                    key={t}
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                                >
                                    {t}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(t)}
                                        className="hover:text-destructive cursor-pointer"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDownTag}
                                placeholder="Type tag & press enter..."
                                className="flex-1 min-w-[140px] text-xs bg-transparent border-none focus:outline-none p-1"
                            />
                        </div>
                        {existingTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 items-center text-[11px] text-muted-foreground">
                                <span>Suggested:</span>
                                {existingTags
                                    .filter((t) => !tags.includes(t))
                                    .slice(0, 8)
                                    .map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => addTag(t)}
                                            className="px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
                                        >
                                            + {t}
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Markdown Body */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Project Markdown Body
                            </label>
                            <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-muted/40">
                                <button
                                    type="button"
                                    onClick={() => setTab("edit")}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                                        tab === "edit"
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTab("preview")}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                                        tab === "preview"
                                            ? "bg-background text-foreground shadow-xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Eye className="w-3.5 h-3.5" /> Preview
                                </button>
                            </div>
                        </div>

                        {tab === "edit" ? (
                            <textarea
                                rows={14}
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-background border border-input rounded-xl p-3.5 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="# Title\n\nFull project documentation..."
                            />
                        ) : (
                            <div className="border border-border/80 rounded-xl p-5 bg-card min-h-[300px] max-h-[500px] overflow-y-auto prose dark:prose-invert max-w-none text-sm">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content || "*No markdown content yet.*"}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Footer buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-xl border border-input hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-5 py-2 text-sm rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                            {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span>{isEdit ? "Save Changes" : "Create Project"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ProjectEditorModal(props: ProjectEditorModalProps) {
    if (!props.isOpen) return null;

    return (
        <ProjectEditorDialog
            key={props.project?.id || "new"}
            {...props}
        />
    );
}
