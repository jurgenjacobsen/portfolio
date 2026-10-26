import { useState, useMemo } from "react";
import { supabase, type GuideRow, type GuideSectionRow } from "@/lib/supabase";
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

interface GuideEditorModalProps {
    guide: GuideRow | null; // null = create new
    sections: GuideSectionRow[];
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

function GuideEditorDialog({
    guide,
    sections,
    onClose,
    onSaved,
    existingTags,
}: Omit<GuideEditorModalProps, "isOpen">) {
    const isEdit = Boolean(guide);

    const [title, setTitle] = useState(guide?.title || "");
    const [slug, setSlug] = useState(guide?.slug || "");
    const [sectionId, setSectionId] = useState(
        guide?.section_id || sections[0]?.id || ""
    );
    const [topic, setTopic] = useState(guide?.topic || "Getting Started");
    const [description, setDescription] = useState(guide?.description || "");
    const [content, setContent] = useState(
        guide?.content || "# Introduction\n\nWrite your guide content here..."
    );
    const [orderIndex, setOrderIndex] = useState(guide?.order_index ?? 0);
    const [tags, setTags] = useState<string[]>(guide?.tags || []);
    const [tagInput, setTagInput] = useState("");

    const [tab, setTab] = useState<"edit" | "preview">("edit");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate reading time directly without useEffect
    const readingTime = useMemo(() => {
        if (!content) return 1;
        const cleanText = content
            .replace(/```[\s\S]*?```/g, "")
            .replace(/[#*_\-\\[\]()]/g, " ")
            .trim();
        const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.ceil(wordCount / 200));
    }, [content]);

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

    const removeTag = (t: string) => {
        setTags(tags.filter((item) => item !== t));
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

        const payload: Partial<GuideRow> = {
            title: title.trim(),
            slug: cleanSlug,
            section_id: sectionId || null,
            topic: topic.trim() || "General",
            description: description.trim() || null,
            content,
            order_index: Number(orderIndex) || 0,
            reading_time_minutes: Number(readingTime) || 1,
            tags,
            updated_at: new Date().toISOString(),
        };

        try {
            if (isEdit && guide) {
                const { error } = await supabase
                    .from("guides")
                    .update(payload)
                    .eq("id", guide.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("guides").insert({
                    ...payload,
                    created_at: new Date().toISOString(),
                });
                if (error) throw error;
            }
            onSaved();
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save guide.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/30">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">
                            {isEdit ? `Edit Guide: ${guide?.title}` : "Write New Technical Guide"}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Managed in Supabase `guides` table
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

                {/* Body */}
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Section & Topic */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Parent Section *
                            </label>
                            <select
                                required
                                value={sectionId}
                                onChange={(e) => setSectionId(e.target.value)}
                                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                {sections.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.title} ({s.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Topic / Sub-Group
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Frontend Architecture, Systems"
                                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Title & Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Guide Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Guide Title"
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
                                placeholder="guide-article-slug"
                                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Short Description / Summary
                        </label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A concise summary of what this guide covers..."
                            className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Sorting & Read Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Order Index
                            </label>
                            <input
                                type="number"
                                value={orderIndex}
                                onChange={(e) => setOrderIndex(Number(e.target.value))}
                                className="w-full bg-background border border-input rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Lower numbers appear first in the guide sidebar.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Estimated Read Time
                            </label>
                            <div className="w-full bg-muted/40 border border-input rounded-xl px-3.5 py-2 text-sm text-muted-foreground font-mono">
                                {readingTime} min read
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Automatically computed based on 200 words/min.
                            </p>
                        </div>
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
                                placeholder="Add tag..."
                                className="flex-1 min-w-[120px] text-xs bg-transparent border-none focus:outline-none p-1"
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
                                Markdown Content
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
                                placeholder="# Guide Title\n\nFull guide documentation in markdown..."
                            />
                        ) : (
                            <div className="border border-border/80 rounded-xl p-5 bg-card min-h-[300px] max-h-[500px] overflow-y-auto prose dark:prose-invert max-w-none text-sm">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content || "*No markdown content yet.*"}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
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
                            <span>{isEdit ? "Save Guide" : "Publish Guide"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function GuideEditorModal(props: GuideEditorModalProps) {
    if (!props.isOpen) return null;

    return (
        <GuideEditorDialog
            key={props.guide?.id || "new"}
            {...props}
        />
    );
}
