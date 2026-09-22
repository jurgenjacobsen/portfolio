import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfmPlugin from "remark-gfm";
const remarkGfm = (remarkGfmPlugin as any).default || remarkGfmPlugin;
import { Loader2Icon, BookOpenIcon } from "lucide-react";
import GuideHeader from "./GuideHeader";
import GuideActions from "./GuideActions";
import type { GuideItem } from "./types";

function slugifyHeading(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
}

function getHeadingText(children: React.ReactNode): string {
    if (!children) return "";
    if (typeof children === "string") return children;
    if (typeof children === "number") return String(children);
    if (Array.isArray(children)) {
        return children.map(getHeadingText).join("");
    }
    if (
        typeof children === "object" &&
        children !== null &&
        "props" in children
    ) {
        return getHeadingText(
            (children as { props?: { children?: React.ReactNode } }).props
                ?.children,
        );
    }
    return "";
}

interface GuideContentProps {
    activeGuide: GuideItem | null;
    loadingContent: boolean;
    markdownContent: string;
    isRead: boolean;
    onToggleRead: () => void;
    copiedLink: boolean;
    onCopyLink: () => void;
    onShare: () => void;
}

export default function GuideContent({
    activeGuide,
    loadingContent,
    markdownContent,
    isRead,
    onToggleRead,
    copiedLink,
    onCopyLink,
    onShare,
}: GuideContentProps) {
    const markdownComponents = useMemo(
        () => ({
            h2: ({
                children,
                ...props
            }: React.ComponentPropsWithoutRef<"h2">) => {
                const rawText = getHeadingText(children);
                const id = slugifyHeading(rawText);
                return (
                    <h2 id={id} className="scroll-mt-24" {...props}>
                        {children}
                    </h2>
                );
            },
            h3: ({
                children,
                ...props
            }: React.ComponentPropsWithoutRef<"h3">) => {
                const rawText = getHeadingText(children);
                const id = slugifyHeading(rawText);
                return (
                    <h3 id={id} className="scroll-mt-24" {...props}>
                        {children}
                    </h3>
                );
            },
        }),
        [],
    );

    return (
        <div className="w-full min-w-0 bg-card p-6 md:p-8 shadow-md rounded-xl space-y-6">
            {loadingContent ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                    <Loader2Icon
                        aria-hidden="true"
                        className="size-6 animate-spin text-primary"
                    />
                    <p className="text-sm font-medium">
                        Loading guide content...
                    </p>
                </div>
            ) : activeGuide ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <GuideHeader guide={activeGuide} />

                    <article className="prose lg:prose-base max-w-none text-foreground leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                        >
                            {markdownContent}
                        </ReactMarkdown>
                    </article>

                    <GuideActions
                        isRead={isRead}
                        onToggleRead={onToggleRead}
                        copiedLink={copiedLink}
                        onCopyLink={onCopyLink}
                        onShare={onShare}
                    />
                </div>
            ) : (
                <div className="text-center py-16 space-y-4">
                    <BookOpenIcon
                        aria-hidden="true"
                        className="size-10 text-muted-foreground/40 mx-auto"
                    />
                    <h3 className="text-lg font-bold text-foreground">
                        No Guides Found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Add guides in the{" "}
                        <span className="font-semibold text-foreground">
                            Admin Dashboard
                        </span>{" "}
                        to get started.
                    </p>
                </div>
            )}
        </div>
    );
}
