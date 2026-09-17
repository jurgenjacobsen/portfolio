import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    FileTextIcon,
    DownloadIcon,
    ExternalLinkIcon,
    PrinterIcon,
} from "lucide-react";
import { SectionCard, SEO } from "@/components/shared";
import { Select } from "@/components/ui";

const CV_OPTIONS = [
    {
        value: "aviation_CV.pdf",
        label: "Aviation Detailed Experience",
        downloadName: "Jurgen_Jacobsen_CV_Aviation.pdf",
    },
    {
        value: "general_CV.pdf",
        label: "General Experience",
        downloadName: "Jurgen_Jacobsen_CV_General.pdf",
    },
];

export default function CV() {
    const [searchParams, setSearchParams] = useSearchParams();
    const versionParam =
        searchParams.get("version") || searchParams.get("type");

    const getInitialVersion = () => {
        if (versionParam === "general" || versionParam === "general_CV.pdf") {
            return "general_CV.pdf";
        }
        if (versionParam === "aviation" || versionParam === "aviation_CV.pdf") {
            return "aviation_CV.pdf";
        }
        return "aviation_CV.pdf";
    };

    const [selectedVersion, setSelectedVersion] =
        useState<string>(getInitialVersion);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const activeCv =
        CV_OPTIONS.find((opt) => opt.value === selectedVersion) ||
        CV_OPTIONS[0];
    const currentPdfPath = `/cv/${activeCv.value}`;

    const handleVersionChange = (newVal: string) => {
        setSelectedVersion(newVal);
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set("version", newVal.replace("_CV.pdf", ""));
                return next;
            },
            { replace: true },
        );
    };

    const handlePrint = () => {
        const iframe = document.getElementById(
            "pdf-frame",
        ) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } else {
            window.open(currentPdfPath, "_blank");
        }
    };

    return (
        <main>
            <SEO
                title={`Curriculum Vitae (${activeCv.label}) | Jürgen Jacobsen`}
                description="Curriculum Vitae of Jürgen Jacobsen. View or download the official resume spanning aviation and web development experience."
                canonical="/cv"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Curriculum Vitae", path: "/cv" },
                ]}
            />
            <SectionCard className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both relative z-20">
                <header className="pb-4 border-b border-border">
                    <div className="space-y-4">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 
                        border border-border rounded-full 
                        text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                        bg-primary/5 
                        animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                        >
                            <FileTextIcon className="size-3 md:size-4" />
                            <span>Curriculum Vitae</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                            CURRICULUM{" "}
                            <span className="text-primary italic font-serif">
                                VITAE
                            </span>
                            .
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                            View or download my official resume and career
                            timeline.
                        </p>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full relative z-10">
                    <div className="w-full md:w-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                        <Select
                            value={selectedVersion}
                            onChange={(val) => handleVersionChange(val)}
                            placeholder="Select a CV version..."
                            className="w-full md:w-auto"
                            triggerClassName="w-full"
                            options={CV_OPTIONS}
                        />
                    </div>

                    <div className="flex flex-wrap md:justify-end items-center gap-2 md:gap-4 pt-2 md:pt-0 no-print animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 fill-mode-both">
                        <a
                            href={currentPdfPath}
                            download={activeCv.downloadName}
                            className="inline-flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-lg border border-primary text-primary-foreground bg-primary hover:bg-primary/75 hover:border-primary/75 transition-all duration-300 cursor-pointer"
                        >
                            <DownloadIcon className="size-4" />
                            <span>Download PDF</span>
                        </a>

                        <a
                            href={currentPdfPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-lg border border-border/50 text-primary hover:bg-primary/5 hover:border-primary/25 transition-all duration-300 cursor-pointer"
                        >
                            <ExternalLinkIcon className="size-4" />
                            <span className="hidden sm:inline">
                                Open in New Tab
                            </span>
                            <span className="sm:hidden">Open</span>
                        </a>

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-lg border border-border/50 text-primary hover:bg-primary/5 hover:border-primary/25 transition-all duration-300 cursor-pointer hidden sm:inline-flex"
                            title="Print Document"
                        >
                            <PrinterIcon className="size-4" />
                            <span>Print</span>
                        </button>
                    </div>
                </div>
            </SectionCard>

            <SectionCard
                className={`animate-in fade-in slide-in-from-bottom-4 duration-700 delay-650 fill-mode-both ${
                    isFullscreen ? "relative z-60" : "relative z-10"
                }`}
            >
                {/* Embedded PDF Viewer */}
                <div
                    className={`relative w-full transition-all rounded-xl overflow-hidden border border-border bg-card shadow-lg ${
                        isFullscreen
                            ? "fixed inset-4 z-60 h-[calc(100vh-2rem)] bg-background p-4 flex flex-col"
                            : "h-[75vh] min-h-150 md:min-h-212.5"
                    }`}
                >
                    {isFullscreen && (
                        <div className="flex justify-between items-center pb-3 mb-2 border-b border-border">
                            <span className="font-bold text-sm uppercase text-muted-foreground">
                                CV Preview ({activeCv.label})
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsFullscreen(false)}
                                className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium rounded-full border border-border bg-background hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            >
                                Close Fullscreen
                            </button>
                        </div>
                    )}

                    <object
                        key={currentPdfPath}
                        data={`${currentPdfPath}#toolbar=1&navpanes=0&scrollbar=1`}
                        type="application/pdf"
                        className="w-full h-full flex-1 rounded-lg"
                    >
                        <iframe
                            id="pdf-frame"
                            src={`${currentPdfPath}#toolbar=1&navpanes=0&scrollbar=1`}
                            title={`Jürgen Jacobsen - Curriculum Vitae (${activeCv.label})`}
                            className="w-full h-full border-0 rounded-lg"
                        >
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                                <FileTextIcon className="size-12 text-primary" />
                                <h3 className="text-xl font-bold">
                                    PDF Preview Unavailable
                                </h3>
                                <p className="text-muted-foreground max-w-md">
                                    Your browser does not support embedding PDF
                                    files directly. You can download the PDF or
                                    open it in a new tab.
                                </p>
                                <div className="flex gap-4">
                                    <a
                                        href={currentPdfPath}
                                        download={activeCv.downloadName}
                                        className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors cursor-pointer"
                                    >
                                        Download PDF
                                    </a>
                                    <a
                                        href={currentPdfPath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-full border border-border bg-background hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        Open PDF
                                    </a>
                                </div>
                            </div>
                        </iframe>
                    </object>
                </div>
            </SectionCard>
        </main>
    );
}
