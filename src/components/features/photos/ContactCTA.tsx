import { Link } from "react-router-dom";
import { Camera, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { SectionCard } from "@/components/shared";

export default function ContactCTA() {
    return (
        <SectionCard
            aria-label="Photography and Creative Inquiries"
            className="space-y-6 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-4 sm:space-y-6 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-border rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-bold bg-primary/5 text-primary">
                        <Camera className="size-3.5 sm:size-4" />
                        <span>Creative Design & Photography</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight md:leading-[0.9] text-foreground">
                        LOOKING FOR{" "}
                        <span className="text-primary italic font-serif">
                            VISUAL STORYTELLING
                        </span>
                        ?
                    </h2>

                    <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
                        Combining my passion for photography and design, I offer a range of services to help you tell your story through pictures. 
                        Whether you're looking for photography, social media content design, or web and graphic design, I can help bring your vision to life.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 text-xs text-muted-foreground font-semibold pt-1">
                        <div className="flex items-center gap-2 text-foreground">
                            <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-600 shrink-0" />
                            <span>Event & Portrait Photography</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                            <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-600 shrink-0" />
                            <span>Social Media Content Design</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                            <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-600 shrink-0" />
                            <span>Web & Graphic Design</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4 shrink-0 w-full sm:w-auto">
                    <Link
                        to="/contact"
                        className="group inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-all select-none cursor-pointer px-4 py-2 sm:px-5 sm:py-2.5 bg-primary hover:bg-primary/75 text-card duration-300 hover:border-primary/25 text-sm w-full sm:w-auto text-center"
                    >
                        <Mail className="size-4 mr-2" />
                        <span>Get In Touch</span>
                    </Link>

                    <Link
                        to="/contact"
                        className="group inline-flex items-center justify-center rounded-lg border border-border font-semibold whitespace-nowrap transition-all select-none cursor-pointer px-4 py-2 sm:px-5 sm:py-2.5 bg-muted hover:bg-muted/50 duration-300 hover:border-primary/25 text-foreground text-sm w-full sm:w-auto text-center"
                    >
                        <Sparkles className="size-4 mr-2" />
                        <span>Request Prints</span>
                    </Link>
                </div>
            </div>
        </SectionCard>
    );
}
