import {
    ExternalLinkIcon,
    MailIcon,
    SparklesIcon,
} from "lucide-react";

import { Button } from "../ui/button";
import { ReactIcon, TypescriptIcon, NestJSIcon, VueIcon, GoIcon, PostgreSQLIcon, DotNetIcon, CSharpIcon, MongoDBIcon, SupabaseIcon } from "../icons";

type TechStackItem = {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color?: string;
};

export default function Hero() {
    const techstack: TechStackItem[] = [
        { name: "ReactTS", icon: ReactIcon },
        { name: "TypeScript", icon: TypescriptIcon },
        { name: "NestJS", icon: NestJSIcon },
        { name: "Vue", icon: VueIcon },
        { name: "GoLang", icon: GoIcon },
        { name: "PostgreSQL", icon: PostgreSQLIcon },
        { name: ".NET", icon: DotNetIcon },
        { name: "C#", icon: CSharpIcon },
        { name: "MongoDB", icon: MongoDBIcon },
        { name: "Supabase", icon: SupabaseIcon },
    ];

    return (
        <section className="bg-card rounded-xl border border-border p-8 mt-6 space-y-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 md:col-span-2">
                    <div
                        className="
                    inline-flex items-center gap-2 px-4 py-1.5 
                    border border-border rounded-full 
                    text-primary text-xs uppercase tracking-wider font-bold
                    bg-primary/5 
                    animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <SparklesIcon className="size-4 fill-primary/15" />
                        <span>Available for Hire</span>
                    </div>
                    <div className="space-y-4 max-w-3/4 md:max-w-auto mt-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                            CRAFTING{" "}
                            <span className="text-primary italic font-serif">
                                DIGITAL
                            </span>{" "}
                            ARCHITECTURE.
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium ">
                            I'm{" "}
                            <span className="text-foreground font-bold underline decoration-primary/30 decoration-4 underline-offset-4">
                                Jürgen Jacobsen
                            </span>
                            , a Full-stack Engineer dedicated to building
                            robust, scalable, and beautiful web applications.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Button className="rounded-xl px-8 py-4 text-base font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                            <MailIcon className="size-5 mr-2" />
                            Let's Talk
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-xl px-8 py-4 text-base font-bold border-2 hover:bg-muted transition-all"
                        >
                            <ExternalLinkIcon className="size-5 mr-2" />
                            View Work
                        </Button>
                    </div>
                </div>
                <img
                    src="/profile.jpg"
                    alt=""
                    loading="eager"
                    className="border border-border rounded-xl hover:transform hover:scale-101 transition-transform duration-500 hover:rotate-2 brightness-125"
                />
            </div>
            <div className="pt-10 space-y-5">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                        Core Expertise
                    </span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <div className="flex flex-wrap gap-3">
                    {techstack.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 hover:bg-card transition-all cursor-default group/item"
                        >
                            <item.icon
                                className={`size-4 ${item?.color || ""} group-hover/item:scale-110 transition-transform rounded-xs`}
                            />
                            <span className="text-sm font-bold tracking-tight">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
