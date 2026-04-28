import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/icons";
import { SectionCard } from "@/components/ui";
import { MailboxIcon, UsersRound } from "lucide-react";

export const socials_links = [
    {
        icon: GithubIcon,
        name: "GitHub",
        url: "https://github.com/jurgenjacobsen",
    },
    {
        icon: LinkedinIcon,
        name: "LinkedIn",
        url: "https://linkedin.com/in/jurgenjacobsen",
    },
    {
        icon: InstagramIcon,
        name: "Instagram",
        url: "https://instagram.com/jurgen.jacobsen",
    },
    {
        icon: MailboxIcon,
        name: "Email",
        url: "mailto:jurgenjacobsen@outlook.com",
    },
];

export default function Socials() {
    return (
        <>
            <SectionCard className="space-y-8">
                <header className="space-y-4">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 
                    border border-border rounded-full 
                    text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                    bg-primary/5 
                    animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <UsersRound className="size-3 md:size-4" />
                        <span>Connect</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                        SOCIALS{" "}
                        <span className="text-primary italic font-serif">
                            LINKS
                        </span>
                        .
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
                        Connect with me on social media!
                    </p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {socials_links.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary
                        text-lg md:text-xl font-black tracking-tight uppercase
                        hover:underline inline-flex items-center gap-3 md:gap-4
                        transition-all duration-300
                        border border-border rounded-xl p-4 md:p-5 group hover:bg-muted/30"
                        >
                            {link.icon ? (
                                <link.icon className="size-8 md:size-12 inline-block shrink-0 group-hover:scale-105 transition-transform duration-300" />
                            ) : null}
                            <span className="truncate">{link.name}</span>
                        </a>
                    ))}
                </div>
            </SectionCard>
        </>
    );
}
