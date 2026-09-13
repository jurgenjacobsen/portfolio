import {
    Terminal,
    FileJson,
    FileText,
    FileCode,
    Settings,
    Download,
    ExternalLink,
} from "lucide-react";
import type { ManifestFile } from "./types";

interface FilesListProps {
    files: ManifestFile[];
}

function getFileIcon(name: string) {
    if (name.endsWith(".ps1")) return Terminal;
    if (name.endsWith(".json")) return FileJson;
    if (name.endsWith(".md")) return FileText;
    if (name.endsWith(".js") || name.endsWith(".ts")) return FileCode;
    return Settings;
}

export default function FilesList({ files }: FilesListProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                <span>Included Configuration Files</span>
                <span className="hidden sm:inline">Action</span>
            </div>

            <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
                {files.map((file) => {
                    const IconComponent = getFileIcon(file.name);
                    return (
                        <div
                            key={file.id || file.name}
                            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors gap-4"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="p-2 rounded-lg bg-primary/5 text-primary shrink-0">
                                    <IconComponent className="size-4" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-mono text-sm font-semibold text-foreground">
                                            {file.name}
                                        </span>
                                        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                                            {file.category}
                                        </span>
                                        {file.default && (
                                            <span className="text-[10px] font-bold px-1.5 py-1 rounded bg-primary/15 text-primary">
                                                DEFAULT
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {file.description}
                                    </p>
                                </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                                <a
                                    href={`/blueprint/${file.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 py-2 px-2 md:px-4 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                                    title={`View ${file.name}`}
                                >
                                    <ExternalLink className="size-4" />
                                    <span className="hidden sm:inline">
                                        View
                                    </span>
                                </a>
                                <a
                                    href={`/blueprint/${file.name}`}
                                    download={file.name}
                                    className="inline-flex items-center justify-center gap-2 p-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                                    title={`Download ${file.name}`}
                                >
                                    <Download className="size-4" />
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
