import {
    Select
} from "@/components/ui";
import { LastCommit, Icon } from "@/components/shared";
import { Link } from "react-router";

type LinkType = {
    href: string;
    icon: React.ReactNode;
    label: string;
    type?: "EXT";
    disabled?: boolean;
}

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

    const competencies: LinkType[] = [
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
            disabled: true,
        },
        {
            href: "/photos",
            icon: <Icon id="Image" className="w-4 h-4" />,
            label: "Photo & Design",
        },
    ];

    const information: LinkType[] = [
        {
            href: "/guides",
            icon: <Icon id="BookOpenIcon" className="w-4 h-4" />,
            label: "Guides",
            disabled: true,
        },
        {
            href: "/rss.xml",
            icon: <Icon id="RssIcon" className="w-4 h-4" />,
            label: "RSS Feed",
            type: "EXT",
        },
        {
            href: "/sitemap.xml",
            icon: <Icon id="Map" className="w-4 h-4" />,
            label: "Sitemap",
            type: "EXT",
        },
        {
            href: "/boilerplate",
            icon: <Icon id="Container" className="w-4 h-4" />,
            label: "Boilerplate",
            disabled: true,
        }
    ];

    return (
        <>
            <footer className="w-full border-t-2 border-border mt-8 pt-4 py-8 no-print">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="px-6 ">
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
                        <h3 className="font-bold text-lg tracking-tight mb-1">
                            Competencies
                        </h3>
                        <div className="flex flex-col gap-2 text-sm font-normal text-muted-foreground group p-4 bg-card rounded-xl border border-border">
                            <ul className="space-y-2">
                                {
                                    competencies.map((comp, index) => (
                                        comp.disabled ? (
                                            <li key={index}
                                            className="flex items-center gap-2 text-sm text-muted-foreground opacity-50 cursor-default">
                                                {comp.icon}
                                                {comp.label}
                                            </li>
                                        ) : (
                                            <li key={index}>
                                                {
                                                    comp.type === "EXT" ? (
                                                        <a
                                                            href={comp.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                                        >
                                                            {comp.icon}
                                                            {comp.label}
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            to={comp.href}
                                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                                        >
                                                            {comp.icon}
                                                            {comp.label}
                                                        </Link>
                                                    )
                                                }
                                            </li>
                                        )
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-1">
                            Information
                        </h3>
                        <div className="flex flex-col gap-2 text-sm font-normal text-muted-foreground group p-4 bg-card rounded-xl border border-border">
                            <ul className="space-y-2">
                                {
                                    information.map((info, index) => (
                                        info.disabled ? (
                                            <li key={index}
                                            className="flex items-center gap-2 text-sm text-muted-foreground opacity-50 cursor-default">
                                                {info.icon}
                                                {info.label}
                                            </li>
                                        ) : (
                                            <li key={index}>
                                                {
                                                    info.type === "EXT" ? (
                                                        <a
                                                            href={info.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                                        >
                                                            {info.icon}
                                                            {info.label}
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            to={info.href}
                                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                                                        >
                                                            {info.icon}
                                                            {info.label}
                                                        </Link>
                                                    )
                                                }
                                            </li>
                                        )
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight mb-1">
                            System
                        </h3>
                        <div className="space-y-4">
                            <LastCommit />

                            <Select
                                title={
                                    <>
                                    <Icon id="Captions" className="size-4" />
                                    <span>Language</span>
                                    
                                    </>
                                }                                                                                                                                                                                                                       
                                options={[                                                                                                                                                                                                                   
                                    { value: "en", label: "English", disabled: true },                                                                                                                                                                                             
                                    { value: "de", label: "Deutsch", disabled: true },                                                                                                                                                                                            
                                    { value: "pt-br", label: "Português", disabled: true },                                                                                                                                                                           
                                ]}                                                                                                                                                                                                           
                                value={"en"}                                                                                                                                                                                                            
                                onChange={() => {}}                                                                                                                                                                                        
                                placeholder="Select a language..."                                                                                                                                                                                             
                                className="text-sm opacity-50 cursor-default pointer-events-none {/*  DISABLES SELECT TEMPORARY */}"
                                triggerClassName="w-full"                                                                                                                                                                                
                                menuClassName="your-dropdown-list-class"                                                                                                                                                                                    
                                optionClassName="your-option-item-class"                                                                                                                                                                                    
                            />  
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
