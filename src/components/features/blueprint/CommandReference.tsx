import { Terminal, RefreshCw, RotateCcw, Trash2 } from "lucide-react";

const cliCommands = [
    {
        command: "irm https://jurgen.fyi/blueprint/installer.ps1 | iex",
        description: "Quick-start interactive scaffolding directly from web",
        icon: Terminal,
    },
    {
        command: ".\\installer.ps1 -Update",
        description: "Check for new releases and sync updated template files",
        icon: RefreshCw,
    },
    {
        command: ".\\installer.ps1 -Reset",
        description:
            "Restore tracked blueprint files back to upstream defaults",
        icon: RotateCcw,
    },
    {
        command: ".\\installer.ps1 -Uninstall",
        description: "Safely remove all blueprint files and the lockfile",
        icon: Trash2,
    },
];

export default function CommandReference() {
    return (
        <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                CLI Commands Reference
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cliCommands.map((item) => (
                    <div
                        key={item.command}
                        className="p-4 rounded-xl border border-border bg-card flex items-center gap-4"
                    >
                        <div className="p-2 rounded-lg bg-muted text-foreground shrink-0">
                            <item.icon className="size-4" />
                        </div>
                        <div className="min-w-0 space-y-1">
                            <code className="text-xs font-mono font-semibold text-primary block truncate">
                                {item.command}
                            </code>
                            <p className="text-[11px] text-muted-foreground leading-tight">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
