import { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

interface TerminalCommandProps {
    command?: string;
}

export default function TerminalCommand({
    command = "irm https://jurgen.fyi/blueprint/installer.ps1 | iex",
}: TerminalCommandProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                    <Terminal className="size-4 text-primary" />
                    <span>Run In Terminal (Recommended)</span>
                </div>
                <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/5 text-primary font-semibold text-[10px] tracking-wider uppercase self-start sm:self-auto">
                    Windows PowerShell 5.1+
                </span>
            </div>

            <div className="flex items-center gap-2 bg-background border border-border rounded-lg p-2 font-mono text-xs md:text-sm text-foreground">
                <span className="text-muted-foreground select-none pl-1">
                    &gt;
                </span>
                <code className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
                    {command}
                </code>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-4 py-1 text-xs font-medium rounded-md bg-muted hover:bg-muted/75 text-foreground transition-colors cursor-pointer shrink-0"
                    title="Copy command to clipboard"
                >
                    {copied ? (
                        <>
                            <Check className="size-4 text-green-600" />
                            <span className="text-green-600 font-semibold">
                                Copied!
                            </span>
                        </>
                    ) : (
                        <>
                            <Copy className="size-4 text-muted-foreground" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tip: If downloading `installer.ps1` via browser, unblock before
                running:{" "}
                <code className="font-mono text-[10px] bg-muted px-2 py-1 rounded text-foreground">
                    Unblock-File .\installer.ps1; .\installer.ps1
                </code>
            </p>
        </div>
    );
}
