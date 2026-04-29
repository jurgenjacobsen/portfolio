import { StrictMode, useState  } from "react";
import { createRoot } from "react-dom/client";
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
} from "@/components/ui/context-menu";

import { Analytics } from "@vercel/analytics/react";
import {  AudioWaveform, RefreshCcw, Share,  } from "lucide-react";

function Root() {
    const [animationsEnabled, setAnimationsEnabled] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("animations-enabled") !== "false";
        }
        return true;
    });

    const share = async () => {
        try {
            const shareData = {
                title: "Jürgen Jacobsen - Portfolio",
                text: "Check out my portfolio website!",
                url: window.location.href
            };

            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                alert("Sharing is not supported in this browser.");
            };
        } catch (err) {
            console.error("Sharing failed:", err);
        }
    };


    return (
        <StrictMode>
            <Analytics />
            <ContextMenu>
                <ContextMenuTrigger>
                    <App />
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuGroup>
                        <ContextMenuItem onClick={share}>
                            <Share className="w-4 h-4" /> Share
                        </ContextMenuItem>


                        <ContextMenuItem onClick={() => window.location.reload()}>
                            <RefreshCcw className="w-4 h-4" /> Reload
                        </ContextMenuItem>
                        
                        <ContextMenuSeparator/>
                        
                        <ContextMenuCheckboxItem 
                            checked={animationsEnabled}
                            onCheckedChange={setAnimationsEnabled}>
                            <AudioWaveform className="w-4 h-4"/> Animations
                        </ContextMenuCheckboxItem>
                    </ContextMenuGroup>
                </ContextMenuContent>
            </ContextMenu>
        </StrictMode>
    );
}
createRoot(document.getElementById("root")!).render(<Root />);
