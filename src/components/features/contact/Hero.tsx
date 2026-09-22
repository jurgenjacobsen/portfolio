import { useState, useRef, useEffect } from "react";
import {
    MailIcon,
    MessageSquareIcon,
    SendIcon,
    MapPinIcon,
    BriefcaseIcon,
    CopyIcon,
    CheckIcon,
} from "lucide-react";
import { SectionCard, Icon } from "@/components/shared";

const CONTACT_EMAIL = "jurgenjacobsen@outlook.com";

export default function ContactHero() {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopyEmail = async () => {
        try {
            if (navigator?.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(CONTACT_EMAIL);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = CONTACT_EMAIL;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                textArea.remove();
            }
            setCopied(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setCopied(false);
            }, 2500);
        } catch (err) {
            console.error("Failed to copy email to clipboard:", err);
        }
    };

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
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                        LET'S START A{" "}
                        <span className="text-primary italic font-serif text-3xl md:text-7xl">
                            CONVERSATION
                        </span>
                        .
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                        I'm always open to new opportunities and collaborations. 
                        Whether you have an open role, a project in mind, or just want to say hello, feel free to reach out. I look forward to connecting with you!
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                    <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="
                        group inline-flex shrink-0 items-center justify-center rounded-xl font-semibold
                        whitespace-nowrap transition-all select-none cursor-pointer
                        px-8 py-2 bg-primary hover:bg-primary/75 text-card duration-300 hover:border-primary/25
                        shadow-md"
                    >
                        <SendIcon className="size-5 mr-2 group-hover:scale-101 transition-transform duration-300" />
                        Send an Email
                    </a>
                    <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="
                        group inline-flex shrink-0 items-center justify-center rounded-xl border border-border font-semibold
                        whitespace-nowrap transition-all select-none cursor-pointer
                        px-8 py-2 bg-muted hover:bg-muted/50 duration-300 hover:border-primary/25 text-foreground"
                        aria-label="Copy email address"
                    >
                        {copied ? (
                            <>
                                <CheckIcon className="size-5 mr-2 text-primary animate-in zoom-in-75 duration-200" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <CopyIcon className="size-5 mr-2 group-hover:scale-101 transition-transform duration-300" />
                                <span>Copy Email</span>
                            </>
                        )}
                    </button>
                    <a
                        href="https://linkedin.com/in/jurgenjacobsen"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                        group inline-flex shrink-0 items-center justify-center rounded-xl border border-border font-semibold
                        whitespace-nowrap transition-all select-none cursor-pointer
                        px-8 py-2 bg-muted hover:bg-muted/50 duration-300 hover:border-primary/25 text-foreground"
                    >
                        <Icon
                            id="linkedin"
                            className="size-5 mr-2 group-hover:scale-101 transition-transform duration-300"
                        />
                        Linkedin
                    </a>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-6 pt-10 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
                <div className="group flex items-start gap-4 p-2 transition-colors">
                    <div className="mt-1 p-2 rounded-xl bg-muted/50 text-primary shrink-0">
                        <MapPinIcon className="size-5" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            Location
                        </span>
                        <p className="text-base md:text-lg font-bold group-hover:text-primary transition-colors truncate">
                            Porto, Portugal
                        </p>
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
                        <div className="flex items-center gap-2">
                            <p className="text-base md:text-lg font-bold truncate group-hover:text-primary transition-colors text-primary hover:underline">
                                <a href={`mailto:${CONTACT_EMAIL}`}>
                                    {CONTACT_EMAIL}
                                </a>
                            </p>
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                title="Copy email address"
                                aria-label="Copy email address"
                                className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted/75 transition-colors cursor-pointer shrink-0"
                            >
                                {copied ? (
                                    <CheckIcon className="size-4 text-primary animate-in zoom-in-75 duration-200" />
                                ) : (
                                    <CopyIcon className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="group flex items-start gap-4 p-2 transition-colors">
                    <div className="mt-1 p-2 rounded-xl bg-muted/50 text-primary shrink-0">
                        <BriefcaseIcon className="size-5" />
                    </div>
                    <div className="space-y-1 overflow-hidden">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            Current Status
                        </span>
                        <p className="text-base md:text-lg font-bold group-hover:text-primary transition-colors truncate">
                            Available to hire
                        </p>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
