import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { LastCommit, Icon } from "@/components/shared";
import { Link } from "react-router";

function SocialMediaLink(props: { href: string; label: string; icon: React.ReactNode }) {
    return (
        <a
            href={props.href}
            target="_blank"
            rel="noopener noreferrer"
            title={props.label}
            aria-label={props.label}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 p-1 rounded-lg bg-card border border-border/75 group"
        >
            {props.icon}
        </a>
    );
}

export default function Footer() {
    const socialMedia = [
        {
            href: "https://linkedin.com/in/jurgenjacobsen",
            icon: <Icon id="linkedin" className="w-4 h-4 group-hover:fill-[#0a66c2]" />,
            label: "Linkedin",
        },
        {
            href: "https://github.com/jurgenjacobsen",
            icon: <Icon id="github" className="w-4 h-4" />,
            label: "GitHub",
        },
        {
            href: "https://instagram.com/jurgen.jacobsen",
            icon: <Icon id="instagram" className="w-4 h-4 group-hover:fill-[#FF0069]" />,
            label: "Instagram",
        },
    ];

    const competencies = [
        {
            href: "/aviation",
            icon: <Icon id="PlaneIcon" className="w-4 h-4" />,
            label: "Aviation",
        },
        {
            href: "/code",
            icon: <Icon id="Code2Icon" className="w-4 h-4" />,
            label: "Code",
        },
        {
            href: "/charts",
            icon: <Icon id="StickyNote" className="w-4 h-4" />,
            label: "Aviation Charts",
        },
        {
            href: "/charts",
            icon: <Icon id="Image" className="w-4 h-4" />,
            label: "Photo & Design",
        },
    ];

    const information = [
        {
            href: "/rss.xml",
            icon: <Icon id="RssIcon" className="w-4 h-4" />,
            label: "RSS Feed",
        },
    ];

    return (
        <>
            <footer className="w-full border-t-2 border-border mt-8 pt-4 md:p-8 no-print">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <h3 className="font-bold text-lg tracking-tight">
                            Jürgen Jacobsen
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            © {new Date().getFullYear()} Jürgen Jacobsen.
                            <br />
                            All rights reserved.
                        </p>

                        <div className="inline-flex items-center gap-2 mt-4">
                            {socialMedia.map((social, index) => (
                                <SocialMediaLink
                                    key={index}
                                    href={social.href}
                                    label={social.label}
                                    icon={social.icon}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-2">
                            Competencies
                        </h3>
                        <div className="flex flex-col gap-2 text-sm font-normal text-muted-foreground group py-2 px-4 bg-card rounded-xl border border-border">
                            <ul className="space-y-2">
                                {
                                    competencies.map((comp, index) => (
                                        <li key={index}>
                                            <Link
                                                to={comp.href}
                                                className="flex
    items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                            >
                                                {comp.icon}
                                                {comp.label}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-2">
                            Information
                        </h3>
                        <div className="flex flex-col gap-2 text-sm font-normal text-muted-foreground group py-2 px-4 bg-card rounded-xl border border-border">
                            <ul className="space-y-2">
                                {
                                    information.map((info, index) => (
                                        <li key={index}>
                                            <Link
                                                to={info.href}
                                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                            >
                                                {info.icon}
                                                {info.label}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-2">
                            System
                        </h3>
                        <div className="space-y-2">
                            <LastCommit />
                            <Select>
                                <SelectTrigger className="w-full mt-2 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Icon id="Captions" className="size-4" />
                                        <SelectValue placeholder="Language" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            value="en"
                                            className="cursor-pointer"
                                        >
                                            English
                                        </SelectItem>
                                        <SelectItem
                                            value="de"
                                            disabled
                                            className="cursor-pointer"
                                        >
                                            Deutsch
                                        </SelectItem>
                                        <SelectItem
                                            value="pt-br"
                                            disabled
                                            className="cursor-pointer"
                                        >
                                            Português
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
