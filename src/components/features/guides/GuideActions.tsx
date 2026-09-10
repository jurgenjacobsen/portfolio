import { CheckIcon, LinkIcon, Share2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideActionsProps {
    isRead: boolean;
    onToggleRead: () => void;
    copiedLink: boolean;
    onCopyLink: () => void;
    onShare: () => void;
}

export default function GuideActions({
    isRead,
    onToggleRead,
    copiedLink,
    onCopyLink,
    onShare,
}: GuideActionsProps) {
    return (
        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-sm">
            {/* Left: Mark as Read */}
            <button
                type="button"
                onClick={onToggleRead}
                aria-pressed={isRead}
                className={cn(
                    "py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center gap-2",
                    isRead
                        ? "bg-primary text-primary-foreground border-primary"
                        : "text-primary border-border/50 hover:bg-primary/5 hover:border-primary/25",
                )}
            >
                <CheckIcon
                    aria-hidden="true"
                    className="size-4 transition-transform"
                />
                <span>{isRead ? "Marked as Read" : "Mark as Read"}</span>
            </button>

            {/* Right: Copy Link & Share Guide */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onCopyLink}
                    className={cn(
                        "py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center gap-2",
                        copiedLink
                            ? "bg-primary text-primary-foreground border-primary"
                            : "text-primary border-border/50 hover:bg-primary/5 hover:border-primary/25",
                    )}
                >
                    {copiedLink ? (
                        <>
                            <CheckIcon
                                aria-hidden="true"
                                className="size-4 transition-transform"
                            />
                            <span>Copied Link</span>
                        </>
                    ) : (
                        <>
                            <LinkIcon
                                aria-hidden="true"
                                className="size-4 transition-transform"
                            />
                            <span>Copy Link</span>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={onShare}
                    className="py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center gap-2 text-primary border-border/50 hover:bg-primary/5 hover:border-primary/25"
                >
                    <Share2Icon
                        aria-hidden="true"
                        className="size-4 transition-transform"
                    />
                    <span>Share Guide</span>
                </button>
            </div>
        </div>
    );
}
