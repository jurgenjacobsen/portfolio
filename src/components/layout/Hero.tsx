import { useState } from "react";
import { ExternalLink, MailIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui";
import { SectionCard } from "@/components/shared";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);

    function Button({ children, onClick, type }: { children: React.ReactNode; onClick: () => void; type?: "primary" | "secondary"}) {
        return (
            <button
                onClick={onClick}
                className={`
                group inline-flex shrink-0 items-center justify-center rounded-xl font-semibold
                disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap transition-all select-none cursor-pointer
                px-8 py-2
                ${type === "primary" ? "bg-primary hover:bg-primary/75 text-card duration-300 hover:border-primary/25" : "hover:bg-muted/50 border border-border hover:border-primary/25"}`}
            >
                {children}
            </button>
        );
    }

    return (
        <SectionCard>
            <div className="flex flex-col-reverse md:flex-row gap-8 items-center md:items-start">
                <div className="flex-1">
                    <div
                        className="
                        inline-flex items-center gap-2 px-4 py-1.5 
                        border border-border rounded-full 
                        text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold
                        bg-primary/5 
                        animate-in fade-in slide-in-from-bottom-4 duration-700"
                    >
                        <SparklesIcon className="size-3 md:size-4 fill-primary/15" />
                        <span>Available for Hire</span>
                    </div>
                    <div className="space-y-6 mt-6">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
                            JÜRGEN{" "}
                            <span className="text-primary italic font-serif">
                                JACOBSEN
                            </span>{" "}
                        </h1>
                        <p className="text-lg md:text-xl  text-muted-foreground leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                            I'm{" "}
                            <span className="text-foreground font-bold underline decoration-primary/30 decoration-4 underline-offset-4">
                                Jürgen Jacobsen
                            </span>
                            . I am a licensed commercial pilot with a passion for software engineering and design. 
                            My aviation experience spans over 230 flight hours across various aircraft types.
                        </p>
                    </div>
                    <div className="text-sm flex md:flex-wrap gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                        <Button
                            type="primary"
                            onClick={() => navigate("/contact")}
                        >
                            <MailIcon className="size-5 mr-2 duration-300" />
                            Let's Talk
                        </Button>
                        <Button onClick={() => navigate("/code")}>
                            <ExternalLink id="linkedin" className="size-5 mr-2 duration-300" />
                            View Projects
                        </Button>
                    </div>
                </div>
                <div className="w-full md:w-1/4 aspect-square relative group animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
                    <div className="absolute inset-0 bg-primary/10 rounded-xl -rotate-3 group-hover:rotate-6 transition-transform duration-500 animate-essential" />
                    {!imageLoaded && (
                        <Skeleton
                            className={cn("absolute inset-0 rounded-xl z-15")}
                        />
                    )}
                    <img
                        src="/img/profile.jpg"
                        alt="Jürgen Jacobsen"
                        onLoad={() => setImageLoaded(true)}
                        className="relative z-10 w-full h-full object-cover rounded-xl border border-border shadow-xl hover:grayscale transition-all duration-500 brightness-125 group-hover:-rotate-3 animate-essential"
                    />
                </div>
            </div>
        </SectionCard>
    );
}