import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Analytics />
        <ContextMenu>
            <ContextMenuTrigger>
                <App />
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuGroup>
                    <ContextMenuItem>Back</ContextMenuItem>
                    <ContextMenuItem disabled>Forward</ContextMenuItem>
                    <ContextMenuItem onClick={() => window.location.reload()}>
                        Reload
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    </StrictMode>,
);
