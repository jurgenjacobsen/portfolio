import { Link } from "react-router-dom";
import { SendIcon, FileTextIcon, AwardIcon, CheckCircle2Icon } from "lucide-react";
import { SectionCard } from "@/components/shared";

export default function ContactCTA() {
    return (
        <SectionCard
            aria-label="Contact and Inquiries"
            className="space-y-6 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-6 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-full text-[10px] md:text-xs uppercase tracking-wider font-bold bg-primary/5 text-primary">
                        <AwardIcon className="size-4" />
                        <span>Commercial Aviation Inquiries</span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-black tracking-tight uppercase leading-[0.9] text-foreground">
                        READY TO DISCUSS{" "}
                        <span className="text-primary italic font-serif">
                            OPPORTUNITIES
                        </span>
                        ?
                    </h2>

                    <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
                        Currently holding a valid EASA Commercial Pilot License (CPL) with Multi-Engine Instrument Rating (ME/IR), Advanced UPRT, and MCC/JOC credentials. Open to commercial flight operations, ferrying, and aviation consulting.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 text-xs text-muted-foreground font-semibold pt-1">
                        <div className="flex items-center gap-2 text-foreground">
                            <CheckCircle2Icon className="size-4 text-emerald-600" />
                            <span>EASA CPL(A) / IR / MEP</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                            <CheckCircle2Icon className="size-4 text-emerald-600" />
                            <span>Class 1 Medical Valid</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                            <CheckCircle2Icon className="size-4 text-emerald-600" />
                            <span>ICAO English Level 6</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0">
                    <Link
                        to="/contact"
                        className="group inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-all select-none cursor-pointer px-4 py-2 bg-primary hover:bg-primary/75 text-card duration-300 hover:border-primary/25"
                    >
                        <SendIcon className="size-4 mr-2" />
                        <span>Contact Page</span>
                    </Link>

                    <Link
                        to="/cv?version=aviation"
                        className="group inline-flex items-center justify-center rounded-lg border border-border font-semibold whitespace-nowrap transition-all select-none cursor-pointer px-4 py-2 bg-muted hover:bg-muted/50 duration-300 hover:border-primary/25 text-foreground"
                    >
                        <FileTextIcon className="size-4 mr-2" />
                        <span>View Aviation CV</span>
                    </Link>
                </div>
            </div>
        </SectionCard>
    );
}
