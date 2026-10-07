import { createContext, use } from "react";
import type { GuideItem } from "./types";

export interface GuideContextValue {
    activeGuide: GuideItem | null;
    isRead: boolean;
    onToggleRead: () => void;
    copiedLink: boolean;
    onCopyLink: () => void;
    onShare: () => void;
    loadingContent?: boolean;
    markdownContent?: string;
}

export const GuideContext = createContext<GuideContextValue | null>(null);

export function useGuideContext(): GuideContextValue {
    const context = use(GuideContext);
    if (!context) {
        throw new Error("useGuideContext must be used within a GuideProvider");
    }
    return context;
}
