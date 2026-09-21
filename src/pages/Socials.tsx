import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/icons";
import { SectionCard, SEO } from "@/components/shared";
import {
    MailIcon,
    UsersRound,
    ExternalLinkIcon,
    SendIcon,
    CopyIcon,
    CheckIcon,
    XIcon,
} from "lucide-react";

const CONTACT_EMAIL = "jurgenjacobsen@outlook.com";

interface SocialProfile {
    name: string;
    handle: string;
    category: string;
    description: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    actionText: string;
    isEmail?: boolean;
}

const SOCIAL_PROFILES: SocialProfile[] = [
    {
        name: "GitHub",
        handle: "@jurgenjacobsen",
        category: "Code & Open Source",
        description:
            "Explore public repositories, open-source projects, developer tools, and contributions.",
        url: "https://github.com/jurgenjacobsen",
        icon: GithubIcon,
        actionText: "View Repositories",
    },
    {
        name: "LinkedIn",
        handle: "/in/jurgenjacobsen",
        category: "Professional Network",
        description:
            "Professional journey, aviation certifications, full-stack experience, and network.",
        url: "https://linkedin.com/in/jurgenjacobsen",
        icon: LinkedinIcon,
        actionText: "Connect on LinkedIn",
    },
    {
        name: "Instagram",
        handle: "@jurgen.jacobsen",
        category: "Photography & Aviation",
        description:
            "Aviation photography, cockpit moments, flight journeys, and personal highlights.",
        url: "https://instagram.com/jurgen.jacobsen",
        icon: InstagramIcon,
        actionText: "Follow on Instagram",
    },
    {
        name: "Email",
        handle: CONTACT_EMAIL,
        category: "Direct Inquiries",
        description:
            "Direct communication for career opportunities, aviation consulting, or project collaborations.",
        url: `mailto:${CONTACT_EMAIL}`,
        icon: MailIcon,
        actionText: "Send an Email",
        isEmail: true,
    },
];

export default function Socials() {
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
        <main>
            <SEO
                title="Social Links & Profiles | Jürgen Jacobsen"
                description="Connect with Jürgen Jacobsen across GitHub, LinkedIn, Instagram, and direct email."
                canonical="/socials"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Socials", path: "/socials" },
                ]}
            />
            <SectionCard className="space-y-8">
                <header className="space-y-4">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 
                        border border-border rounded-full 
                        text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                        bg-primary/5 
                        animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <UsersRound className="size-3 md:size-4 fill-primary/15" />
                        <span>Connect</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                            SOCIAL{" "}
                            <span className="text-primary italic font-serif text-3xl md:text-7xl">
                                PROFILES
                            </span>
                            .
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                            Find me across the web. Whether you want to explore my open-source code repositories, follow my aviation journey, network professionally, or send a direct message.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {SOCIAL_PROFILES.map((profile, index) => {
                        const IconComponent = profile.icon;
                        return (
                            <div
                                key={profile.name}
                                style={{ animationDelay: `${300 + index * 100}ms` }}
                                className="group relative p-5 md:p-6 rounded-xl border border-border bg-card hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="p-3 rounded-xl bg-muted/60 text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-300 shrink-0">
                                            <IconComponent className="size-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider bg-primary/5 text-primary border border-border/80 group-hover:border-primary/25 transition-colors">
                                                {profile.category}
                                            </span>
                                            {!profile.isEmail && (
                                                <a
                                                    href={profile.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={`Open ${profile.name} in new tab`}
                                                    className="p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                                >
                                                    <ExternalLinkIcon className="size-4 group-hover:scale-110 transition-transform duration-300" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                                                {profile.name}
                                            </h2>
                                            <span className="text-xs md:text-sm font-semibold text-muted-foreground font-mono">
                                                {profile.handle}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                            {profile.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-5 mt-5 border-t border-border/50 flex flex-wrap items-center gap-3">
                                    {profile.isEmail ? (
                                        <>
                                            <a
                                                href={profile.url}
                                                className="group/btn inline-flex shrink-0 items-center justify-center rounded-xl font-semibold whitespace-nowrap transition-all select-none cursor-pointer px-4 py-2 bg-primary hover:bg-primary/75 text-card duration-300 hover:border-primary/25 text-xs md:text-sm shadow-sm"
                                            >
                                                <MailIcon className="size-4 mr-2 group-hover/btn:scale-105 transition-transform duration-300" />
                                                Send an Email
                                            </a>
                                            <button
                                                type="button"
                                                onClick={handleCopyEmail}
                                                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-border font-semibold whitespace-nowrap transition-all select-none cursor-pointer px-4 py-2 bg-muted hover:bg-muted/50 duration-300 hover:border-primary/25 text-foreground text-xs md:text-sm"
                                                aria-label="Copy email address"
                                            >
                                                {copied ? (
                                                    <>
                                                        <CheckIcon className="size-4 mr-2 text-primary animate-in zoom-in-75 duration-200" />
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CopyIcon className="size-4 mr-2" />
                                                        <span>Copy Email</span>
                                                    </>
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <a
                                            href={profile.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/btn inline-flex shrink-0 items-center justify-center rounded-xl font-semibold whitespace-nowrap transition-all select-none cursor-pointer px-4 py-2 bg-muted hover:bg-muted/50 border border-border hover:border-primary/25 text-foreground duration-300 text-xs md:text-sm"
                                        >
                                            <ExternalLinkIcon className="size-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                            {profile.actionText}
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Direct Contact Banner */}
                <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="font-bold text-base md:text-lg tracking-tight">
                            Want to get in touch?
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground font-medium">
                            Check where you can reach me or send a direct message via the contact page.
                        </p>
                    </div>
                    <Link
                        to="/contact"
                        className="group inline-flex shrink-0 items-center justify-center rounded-xl font-semibold whitespace-nowrap transition-all select-none cursor-pointer px-6 py-2.5 bg-primary hover:bg-primary/75 text-card duration-300 hover:border-primary/25 shadow-md text-sm"
                    >
                        <SendIcon className="size-4 mr-2 group-hover:scale-105 transition-transform duration-300" />
                        Contact Page
                    </Link>
                </div>
            </SectionCard>

            {/* Temporary Toast Notification */}
            {copied && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border shadow-xl text-foreground animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-sm"
                >
                    <div className="p-1.5 rounded-full bg-primary/10 text-primary shrink-0">
                        <CheckIcon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight">
                            Email copied to clipboard
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {CONTACT_EMAIL}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCopied(false)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer shrink-0"
                        aria-label="Dismiss notification"
                    >
                        <XIcon className="size-4" />
                    </button>
                </div>
            )}
        </main>
    );
}
