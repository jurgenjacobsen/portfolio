import { useState, useEffect } from "react";
import { SectionCard, SEO } from "@/components/shared";
import {
    BlueprintHero,
    TerminalCommand,
    FilesList,
    CommandReference,
    type ManifestFile,
} from "@/components/features/blueprint";
import { Download } from "lucide-react";

const fallbackFiles: ManifestFile[] = [
    {
        id: "editorconfig",
        name: ".editorconfig",
        category: "Code Quality",
        description:
            "Consistent cross-editor indentation and charset configuration",
        default: true,
    },
    {
        id: "prettier",
        name: ".prettierrc",
        category: "Code Quality",
        description: "Prettier code formatting standards",
        default: true,
    },
];

export default function Blueprint() {
    const [files, setFiles] = useState<ManifestFile[]>(fallbackFiles);
    const [version, setVersion] = useState<string>("1.0.0");

    useEffect(() => {
        let isMounted = true;
        fetch("/blueprint/manifest.json")
            .then((res) => {
                if (!res.ok) return null;
                const ct = res.headers.get("content-type");
                if (ct && !ct.includes("application/json")) return null;
                return res.json();
            })
            .then((data) => {
                if (isMounted && data) {
                    if (data.version) setVersion(data.version);
                    if (Array.isArray(data.files) && data.files.length > 0) {
                        setFiles(data.files);
                    }
                }
            })
            .catch(() => {
                // Keep fallback files
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <main>
            <SEO
                title="Blueprint | Jürgen Jacobsen"
                description="Scaffold and synchronize project development configurations, agent guidelines, and templates directly from your terminal."
                canonical="/blueprint"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Blueprint", path: "/blueprint" },
                ]}
            />

            <BlueprintHero />

            <SectionCard className="space-y-8">
                {/* Header & Quick-Start Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                                Blueprint
                            </h2>
                            <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-primary/5 text-primary font-bold">
                                v{version}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Synchronize configurations and starter templates
                            hosted live at{" "}
                            <code className="text-xs font-mono bg-muted px-2 py-1 rounded text-foreground">
                                /blueprint
                            </code>
                            .
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <a
                            href="/blueprint/installer.ps1"
                            download="installer.ps1"
                            className="inline-flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/75 transition-colors duration-300 cursor-pointer"
                        >
                            <Download className="size-4" />
                            <span>Download Installer</span>
                        </a>
                    </div>
                </div>

                {/* In-Terminal One-Liner Banner */}
                <TerminalCommand />

                {/* Available Files in Catalogue */}
                <FilesList files={files} />

                {/* CLI Command Reference */}
                <CommandReference />
            </SectionCard>
        </main>
    );
}
