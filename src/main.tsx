import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { bind, setTheme, setEnabled } from "cuelume";
import "./index.css";
import App from "./App.tsx";

import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/shared/ContextMenu";

import { AudioWaveform, RefreshCcw, Share, SendToBack } from "lucide-react";

function Root() {
    const [animationsEnabled, setAnimationsEnabled] = useState(() => {
        if (typeof window !== "undefined") {
            // Check localStorage on initial load
            return localStorage.getItem("animations-enabled") !== "false";
        }
        return true;
    });

    const [soundsEnabled, setSoundsEnabled] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("sounds-enabled") !== "false";
        }
        return true;
    });

    useEffect(() => {
        bind();
        setTheme("mech");
    }, []);

    // Defer analytics initialization until after hydration and idle time
    useEffect(() => {
        const initAnalytics = () => {
            import("@vercel/analytics")
                .then(({ inject }) => {
                    inject({ framework: "react" });
                })
                .catch((err) => {
                    console.error("Failed to load analytics:", err);
                });
        };

        if (typeof window !== "undefined") {
            if ("requestIdleCallback" in window) {
                const idleId = window.requestIdleCallback(initAnalytics);
                return () => window.cancelIdleCallback(idleId);
            } else {
                const timeoutId = setTimeout(initAnalytics, 1);
                return () => clearTimeout(timeoutId);
            }
        }
    }, []);

    // Effect to handle persistence and body attribute updates
    useEffect(() => {
        if (typeof window !== "undefined") {
            // 1. Persist to localStorage
            localStorage.setItem(
                "animations-enabled",
                String(animationsEnabled),
            );

            // 2. Update the body attribute for CSS targeting
            if (animationsEnabled) {
                document.body.removeAttribute("data-animations");
            } else {
                document.body.setAttribute("data-animations", "disabled");
            }
        }
    }, [animationsEnabled]);

    // Effect to handle sound persistence and cuelume setEnabled
    useEffect(() => {
        setEnabled(soundsEnabled);
        if (typeof window !== "undefined") {
            localStorage.setItem("sounds-enabled", String(soundsEnabled));
        }
    }, [soundsEnabled]);

    const share = async () => {
        try {
            const shareData = {
                title: "Jürgen Jacobsen - Portfolio",
                text: "Check out my portfolio website!",
                url: window.location.href,
            };

            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                alert("Sharing is not supported in this browser.");
            }
        } catch (err) {
            console.error("Sharing failed:", err);
        }
    };

    return (
        <StrictMode>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="min-h-screen">
                        <App />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuGroup>
                        <ContextMenuItem 
                            onClick={share}
                            data-cuelume-tap="success"
                        >
                            <Share className="w-4 h-4" /> Share
                        </ContextMenuItem>

                        <ContextMenuItem
                            className="mt-1"
                            onClick={() => window.location.reload()}
                            data-cuelume-tap="ready"
                        >
                            <RefreshCcw className="w-4 h-4" /> Reload
                        </ContextMenuItem>

                        <ContextMenuSeparator />

                        <ContextMenuCheckboxItem
                            checked={animationsEnabled}
                            onCheckedChange={setAnimationsEnabled}
                            data-cuelume-toggle
                        >
                            <SendToBack className="w-4 h-4" /> Animations
                        </ContextMenuCheckboxItem>
                        <ContextMenuCheckboxItem
                            checked={soundsEnabled}
                            onCheckedChange={setSoundsEnabled}
                            data-cuelume-toggle
                        >
                            <AudioWaveform className="w-4 h-4" /> Sound Effects
                        </ContextMenuCheckboxItem>
                    </ContextMenuGroup>
                </ContextMenuContent>
            </ContextMenu>
        </StrictMode>
    );
}

createRoot(document.getElementById("root")!).render(<Root />);
