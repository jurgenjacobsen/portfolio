import React, { useEffect, useState, useCallback, Component, type ErrorInfo } from "react";
import {
    AlertOctagon,
    Copy,
    Check,
    RotateCcw,
    X,
    ExternalLink,
    FileCode,
    ChevronDown,
    Terminal,
} from "lucide-react";

/**
 * Interface describing an intercepted error (from Vite HMR or browser runtime)
 */
export interface DevErrorInfo {
    type: "vite-compile" | "runtime" | "react";
    message: string;
    stack?: string;
    id?: string;
    frame?: string;
    plugin?: string;
    loc?: {
        file?: string;
        line?: number;
        column?: number;
    };
}

/**
 * Strips ANSI terminal color codes from Vite's code frames
 */
function stripAnsi(text: string): string {
    // eslint-disable-next-line no-control-regex
    return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
}

// Global error subscriber list for HMR and runtime listeners
type ErrorListener = (error: DevErrorInfo | null) => void;
const listeners = new Set<ErrorListener>();
let currentActiveError: DevErrorInfo | null = null;

function notifyListeners(error: DevErrorInfo | null) {
    currentActiveError = error;
    listeners.forEach((listener) => listener(error));
}

// Setup Vite HMR and Global listeners in development
if (import.meta.env.DEV && typeof window !== "undefined") {
    // 1. Vite HMR error listener
    if (import.meta.hot) {
        import.meta.hot.on("vite:error", (payload: { err: DevErrorInfo }) => {
            if (payload && payload.err) {
                notifyListeners({
                    type: "vite-compile",
                    message: payload.err.message || "Compilation error",
                    stack: payload.err.stack,
                    id: payload.err.id,
                    frame: payload.err.frame ? stripAnsi(payload.err.frame) : undefined,
                    plugin: payload.err.plugin,
                    loc: payload.err.loc,
                });
            }
        });

        // Clear error when HMR successfully receives a new module update
        import.meta.hot.on("vite:beforeUpdate", () => {
            notifyListeners(null);
        });
    }

    // 2. Global uncaught runtime errors
    window.addEventListener("error", (event) => {
        // Ignore resize observer and minor benign errors
        if (event.message?.includes("ResizeObserver")) return;

        notifyListeners({
            type: "runtime",
            message: event.message || "Uncaught runtime exception",
            stack: event.error?.stack,
            id: event.filename,
            loc: {
                file: event.filename,
                line: event.lineno,
                column: event.colno,
            },
        });
    });

    // 3. Unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
        const error = event.reason;
        notifyListeners({
            type: "runtime",
            message: error?.message || String(error) || "Unhandled Promise Rejection",
            stack: error?.stack,
        });
    });
}

/**
 * React Error Boundary component that feeds errors into the DevErrorOverlay
 */
export class DevErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (import.meta.env.DEV) {
            notifyListeners({
                type: "react",
                message: error.message || "React rendering error",
                stack: (error.stack || "") + "\n\nComponent Stack:\n" + errorInfo.componentStack,
            });
        }
    }

    render() {
        return this.props.children;
    }
}

/**
 * Custom Vite Dev Error Overlay matching the portfolio's design system
 */
export default function DevErrorOverlay() {
    // Tree-shake out completely in production
    if (!import.meta.env.DEV) return null;

    const [error, setError] = useState<DevErrorInfo | null>(() => currentActiveError);
    const [dismissed, setDismissed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showStack, setShowStack] = useState(false);

    useEffect(() => {
        const listener: ErrorListener = (newError) => {
            setError(newError);
            if (newError) {
                setDismissed(false); // Resurface on new error
            }
        };

        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    // Dismiss on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && error && !dismissed) {
                setDismissed(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [error, dismissed]);

    const handleCopy = useCallback(() => {
        if (!error) return;

        const details = [
            `[${error.type.toUpperCase()}] ${error.message}`,
            error.id ? `File: ${error.id}${error.loc?.line ? `:${error.loc.line}:${error.loc.column}` : ""}` : "",
            error.plugin ? `Plugin: ${error.plugin}` : "",
            error.frame ? `\nCode Frame:\n${error.frame}` : "",
            error.stack ? `\nStack Trace:\n${error.stack}` : "",
        ]
            .filter(Boolean)
            .join("\n");

        navigator.clipboard.writeText(details).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [error]);

    const handleOpenInEditor = useCallback((fileTarget: string) => {
        // Vite provides a built-in dev endpoint to open files directly in VS Code / IDE
        fetch(`/__open-in-editor?file=${encodeURIComponent(fileTarget)}`).catch((err) => {
            console.warn("Could not open in editor:", err);
        });
    }, []);

    if (!error || dismissed) return null;

    // Determine target file string for editor launching
    const targetFile =
        error.id ||
        error.loc?.file ||
        "";
    const lineCol =
        error.loc?.line !== undefined ? `:${error.loc.line}${error.loc.column ? `:${error.loc.column}` : ""}` : "";
    const fullFileLocation = targetFile ? `${targetFile}${lineCol}` : "";

    const typeLabels: Record<DevErrorInfo["type"], { label: string; badge: string }> = {
        "vite-compile": { label: "Vite Compile Error", badge: "HMR Build" },
        "runtime": { label: "Runtime Exception", badge: "Browser" },
        "react": { label: "React Render Error", badge: "Component" },
    };

    return (
        <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dev-error-title"
            className="fixed inset-0 z-99999 flex items-center justify-center p-4 md:p-6 bg-background/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 select-text"
        >
            <div className="relative w-full max-w-4xl bg-card border border-destructive/30 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 my-auto text-foreground">
                {/* 1. Header Bar */}
                <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-destructive/15 text-destructive border border-destructive/25">
                            <AlertOctagon className="size-4" />
                            <span>{typeLabels[error.type].label}</span>
                        </div>

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono text-muted-foreground bg-muted border border-border">
                            {error.plugin ? `plugin: ${error.plugin}` : typeLabels[error.type].badge}
                        </span>
                    </div>

                    <button
                        onClick={() => setDismissed(true)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                        title="Dismiss overlay (Esc)"
                        aria-label="Dismiss error overlay"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* 2. File Location Banner */}
                {fullFileLocation && (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border text-xs font-mono">
                        <div className="flex items-center gap-2 truncate">
                            <FileCode className="size-4 shrink-0 text-primary" />
                            <span className="truncate text-foreground font-semibold">{fullFileLocation}</span>
                        </div>

                        <button
                            onClick={() => handleOpenInEditor(fullFileLocation)}
                            className="inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                            title="Open this file directly in your code editor"
                        >
                            <span>Open in Editor</span>
                            <ExternalLink className="size-3" />
                        </button>
                    </div>
                )}

                {/* 3. Error Headline Message */}
                <div className="space-y-1">
                    <h2 id="dev-error-title" className="text-lg font-bold tracking-tight text-destructive font-mono wrap-break-words">
                        {error.message}
                    </h2>
                </div>

                {/* 4. Code Frame (Vite highlight) */}
                {error.frame && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                            <Terminal className="size-3.5" />
                            <span>Code Snippet</span>
                        </div>
                        <pre className="p-4 rounded-xl bg-muted/70 border border-border text-xs font-mono overflow-x-auto text-foreground leading-relaxed whitespace-pre font-normal">
                            <code>{error.frame}</code>
                        </pre>
                    </div>
                )}

                {/* 5. Collapsible Stack Trace */}
                {error.stack && (
                    <div className="border border-border/80 rounded-xl overflow-hidden bg-muted/20">
                        <button
                            type="button"
                            onClick={() => setShowStack(!showStack)}
                            className="w-full flex items-center justify-between p-3 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <span>Stack Trace ({showStack ? "Hide" : "Show"})</span>
                            <ChevronDown
                                className={`size-4 transition-transform duration-200 ${showStack ? "rotate-180" : ""}`}
                            />
                        </button>
                        {showStack && (
                            <pre className="p-4 pt-2 text-[11px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap border-t border-border/60 max-h-60">
                                <code>{error.stack}</code>
                            </pre>
                        )}
                    </div>
                )}

                {/* 6. Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/60">
                    <p className="text-xs text-muted-foreground order-2 sm:order-1">
                        Press <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">Esc</kbd> to dismiss. Errors auto-clear on save.
                    </p>

                    <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2 justify-end">
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                        >
                            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                            <span>{copied ? "Copied" : "Copy Error"}</span>
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                        >
                            <RotateCcw className="size-3.5" />
                            <span>Reload</span>
                        </button>

                        <button
                            onClick={() => setDismissed(true)}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
