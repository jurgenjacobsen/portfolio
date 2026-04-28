import { MailIcon, MessageSquareIcon, SendIcon, MapPinIcon, BriefcaseIcon } from "lucide-react";
import { SectionCard, TechIcon } from "@/components/ui";

export default function ContactHero() {
    return (
        <SectionCard className="space-y-8">
            <div className="space-y-6">
                <div
                    className="
                inline-flex items-center gap-2 px-4 py-1.5 
                border border-border rounded-full 
                text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                bg-primary/5 
                animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                    <MessageSquareIcon className="size-3 md:size-4 fill-primary/15" />
                    <span>Get in Touch</span>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                        LET'S START A{" "}
                        <span className="text-primary italic font-serif text-3xl">
                            CONVERSATION
                        </span>
                        .
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl">
                        Have a project in mind or just want to say hi? I'm always
                        open to discussing new opportunities, creative ideas or
                        focal points to be part of your visions.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex flex-wrap gap-4 mt-6">
                        <a href="/contact" className="
                            group inline-flex shrink-0 items-center justify-center rounded-xl font-semibold
                            disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap transition-all select-none cursor-pointer
                            px-8 py-2 bg-primary hover:bg-primary/75 text-card duration-300 hover:border-primary/25
                            shadow-md">
                            <SendIcon className="size-5 mr-2 group-hover:scale-101 transition-transform duration-300" />
                            Send an Email
                        </a>
                        <a href="/projects" className="
                            group inline-flex shrink-0 items-center justify-center rounded-xl border border-border font-semibold
                            disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap transition-all select-none cursor-pointer
                            px-8 py-2 bg-muted hover:bg-muted/50 duration-300 hover:border-primary/25">
                            <TechIcon id="linkedin" className="size-5 mr-2 group-hover:scale-101 transition-transform duration-300" />
                            Linkedin
                        </a>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-border/50">
                <div className="group flex items-start gap-4 p-2 transition-colors">
                    <div className="mt-1 p-2 rounded-xl bg-muted/50 text-primary shrink-0">
                        <MapPinIcon className="size-5" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            Location
                        </span>
                        <p className="text-base md:text-lg font-bold group-hover:text-primary transition-colors truncate">Porto, Portugal</p>
                    </div>
                </div>
                
                <div className="group flex items-start gap-4 p-2 transition-colors">
                    <div className="mt-1 p-2 rounded-xl bg-muted/50 text-primary shrink-0">
                        <MailIcon className="size-5" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            Email
                        </span>
                        <p className="text-base md:text-lg font-bold truncate group-hover:text-primary transition-colors">
                            jurgenjacobsen@outlook.com
                        </p>
                    </div>
                </div>

                <div className="group flex items-start gap-4 p-2 transition-colors">
                    <div className="mt-1 p-2 rounded-xl bg-muted/50 text-primary shrink-0">
                        <BriefcaseIcon className="size-5" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            Availability
                        </span>
                        <p className="text-base md:text-lg font-bold group-hover:text-primary transition-colors truncate">
                            Open for Freelance
                        </p>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}

