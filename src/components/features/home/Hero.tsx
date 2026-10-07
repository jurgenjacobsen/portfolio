import { useState } from "react";
import { ExternalLink, MailIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import SectionCard from "@/components/layout/SectionCard";
import { Link } from "react-router-dom";

export default function Hero() {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <SectionCard className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
            <div className="flex flex-col-reverse md:grid md:grid-cols-4 h-full gap-6 md:gap-4 items-center md:items-stretch">
                <div className="w-full md:col-span-3 flex flex-col justify-between h-full">
                    <div
                        className="
                        w-fit self-start
                        inline-flex items-center gap-2 px-4 py-1
                        border border-border rounded-full 
                        text-primary text-xs uppercase tracking-wider font-bold
                        bg-muted
                        animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <SparklesIcon className="size-3 md:size-4 " />
                        <span>Available for Hire</span>
                    </div>

                    <div className="mt-6">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                            Jürgen Jacobsen
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                            I'm{" "}
                            <span className="text-foreground font-bold underline decoration-primary/25 decoration-4 underline-offset-4">
                                Jürgen Jacobsen
                            </span>
                            . I'm a licensed commercial pilot with 228+ flight hours across multiple aircraft types, and a full-stack developer building web products.
                        </p>
                    </div>

                    <div className="text-sm flex flex-wrap sm:flex-nowrap w-full md:w-auto gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                        <Link
                            to="/contact"
                            className="group flex-1 md:flex-initial inline-flex items-center justify-center rounded-xl font-semibold whitespace-nowrap transition-[background-color,border-color] select-none cursor-pointer px-4 md:px-8 py-2 bg-primary hover:bg-primary/75 text-card duration-300 hover:border-primary/25"
                            data-cuelume-navigate="success"
                        >
                            <MailIcon className="size-4 md:size-5 mr-2 duration-300" />
                            Let's Talk
                        </Link>
                        <Link
                            to="/code"
                            className="group flex-1 md:flex-initial inline-flex items-center justify-center rounded-xl font-semibold whitespace-nowrap transition-[background-color,border-color] select-none cursor-pointer px-4 md:px-8 py-2 hover:bg-muted/50 border border-border hover:border-primary/25 text-foreground duration-300"
                            data-cuelume-navigate
                        >
                            <ExternalLink className="size-4 md:size-5 mr-2 duration-300" />
                            View Projects
                        </Link>
                    </div>
                </div>
                <div className="w-full max-w-48 sm:max-w-60 md:max-w-none md:col-span-1 relative group animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
                    <div className="absolute inset-0 bg-primary/10 rounded-xl -rotate-3 group-hover:rotate-6 transition-transform duration-500 animate-essential" />
                    {!imageLoaded && (
                        <Skeleton
                            className={cn("absolute inset-0 rounded-xl z-15")}
                        />
                    )}
                    <img
                        src="/img/profile.jpg"
                        fetchPriority="high"
                        alt="Jürgen Jacobsen"
                        width={1589}
                        height={2117}
                        onLoad={() => setImageLoaded(true)}
                        className="relative z-10 w-full h-full md:h-auto aspect-square md:aspect-auto object-cover rounded-xl border border-border shadow-sm hover:grayscale transition-all duration-500 brightness-125 group-hover:-rotate-3 animate-essential"
                    />
                </div>
            </div>
        </SectionCard>
    );
}