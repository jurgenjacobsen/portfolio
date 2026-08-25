import { Link } from "react-router-dom";
import { Award, Camera, Code, PlaneIcon } from "lucide-react";

export default function QuickInfo() {
    const primary = [
        {
            label: "Flight Hours",
            icon: PlaneIcon,
            title: "230+ hrs",
            subtitle: "78 hrs PIC",
            link: "/aviation",
        },
        {
            label: "Pilot Ratings",
            icon: Award,
            title: (
                <span className="flex items-center gap-2">
                    CPL <span className="text-sm">/</span> 
                    IR <span className="text-sm">/</span> 
                    ME
                </span>
            ),
            subtitle: "Class 1 Medical",
            link: "/aviation"
        },
        {
            label: "Programmer",
            icon: Code,
            title: "24+ Projects",
            subtitle: "Full-Stack & React",
            link: "/code"
        },
        {
            label: "Photo & Design",
            icon: Camera,
            title: "3+ Years",
            subtitle: "Meeting Client Needs",
            link: "/photos"
        }
    ]

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {
                    primary.map((p) => {
                    const Icon = p.icon;
                    return (
                        <Link
                            key={p.label}
                            to={p.link}
                            className="p-4 rounded-xl border border-border/75 bg-card hover:border-primary/50 transition-all duration-300 shadow-md flex flex-col justify-between group"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {p.label}
                                </span>
                                <div className="p-1 rounded-lg bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Icon className="size-4" />
                                </div>
                            </div>
                            <div>
                                <div className="text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                    {p.title}
                                </div>
                                <div className="text-xs text-muted-foreground font-medium mt-2">
                                    {p.subtitle}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <div className="grid grid-cols-3">

            </div>
        </>
    )
}