import { useState } from "react";
import {
    FileTextIcon,
    DownloadIcon,
    ExternalLinkIcon,
    PrinterIcon,
} from "lucide-react";
import { SectionCard } from "@/components/shared";
import { Button } from "@/components/ui/button";

export default function CV() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handlePrint = () => {
        const iframe = document.getElementById("pdf-frame") as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        } else {
            window.open("/CV.pdf", "_blank");
        }
    };

    return (
        <SectionCard className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
                <div className="space-y-3">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 
                        border border-border rounded-full 
                        text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                        bg-primary/5 
                        animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <FileTextIcon className="size-3 md:size-4" />
                        <span>Curriculum Vitae</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                        CURRICULUM{" "}
                        <span className="text-primary italic font-serif">
                            VITAE
                        </span>
                        .
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
                        View or download my official resume and career timeline.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 no-print">
                    <a
                        href="/CV.pdf"
                        download="Jurgen_Jacobsen_CV.pdf"
                    >
                        <Button variant="default" className="gap-2 cursor-pointer">
                            <DownloadIcon className="size-4" />
                            <span>Download PDF</span>
                        </Button>
                    </a>

                    <a
                        href="/CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="outline" className="gap-2 cursor-pointer">
                            <ExternalLinkIcon className="size-4" />
                            <span className="hidden sm:inline">Open in New Tab</span>
                            <span className="sm:hidden">Open</span>
                        </Button>
                    </a>

                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="gap-2 cursor-pointer hidden sm:inline-flex"
                        title="Print Document"
                    >
                        <PrinterIcon className="size-4" />
                        <span>Print</span>
                    </Button>
                </div>
            </header>

            {/* Embedded PDF Viewer */}
            <div
                className={`relative w-full transition-all duration-300 rounded-xl overflow-hidden border border-border bg-card shadow-lg ${
                    isFullscreen
                        ? "fixed inset-4 z-50 h-[calc(100vh-2rem)] bg-background p-4 flex flex-col"
                        : "h-[75vh] min-h-[600px] md:min-h-[850px]"
                }`}
            >
                {isFullscreen && (
                    <div className="flex justify-between items-center pb-3 mb-2 border-b border-border">
                        <span className="font-bold text-sm uppercase text-muted-foreground">
                            CV Preview
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsFullscreen(false)}
                            className="cursor-pointer"
                        >
                            Close Fullscreen
                        </Button>
                    </div>
                )}

                <object
                    data="/CV.pdf#toolbar=1&navpanes=0&scrollbar=1"
                    type="application/pdf"
                    className="w-full h-full flex-1 rounded-lg"
                >
                    <iframe
                        id="pdf-frame"
                        src="/CV.pdf#toolbar=1&navpanes=0&scrollbar=1"
                        title="Jürgen Jacobsen - Curriculum Vitae"
                        className="w-full h-full border-0 rounded-lg"
                    >
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                            <FileTextIcon className="size-12 text-primary" />
                            <h3 className="text-xl font-bold">PDF Preview Unavailable</h3>
                            <p className="text-muted-foreground max-w-md">
                                Your browser does not support embedding PDF files directly.
                                You can download the PDF or open it in a new tab.
                            </p>
                            <div className="flex gap-4">
                                <a href="/CV.pdf" download="Jurgen_Jacobsen_CV.pdf">
                                    <Button variant="default">Download PDF</Button>
                                </a>
                                <a href="/CV.pdf" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline">Open PDF</Button>
                                </a>
                            </div>
                        </div>
                    </iframe>
                </object>
            </div>
        </SectionCard>
    );
}
