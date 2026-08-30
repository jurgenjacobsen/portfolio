import { useState } from "react";
import { SectionCard, SEO } from "@/components/shared";
import { Input } from "@/components/ui/input";
import {
    BookOpenIcon,
    SearchIcon,
    ChevronRightIcon,
    PlaneIcon,
    Code2Icon,
    TerminalIcon,
    CompassIcon,
    CheckCircle2Icon,
    ClockIcon,
    SparklesIcon,
    LayersIcon,
    Share2Icon,
    FileTextIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideArticle {
    id: string;
    title: string;
    description: string;
    category: "aviation" | "software" | "tooling" | "workflow";
    readTime: string;
    updatedAt: string;
    tags: string[];
    sections: {
        id: string;
        heading: string;
        content: string[];
        tip?: string;
        codeSnippet?: string;
    }[];
}

const GUIDES_DATA: GuideArticle[] = [
    {
        id: "ifr-flight-planning",
        title: "IFR Flight Planning & SOP Workflow",
        description:
            "A structured breakdown of Instrument Flight Rules preparation, route validation, alternate minimums, and fuel contingencies.",
        category: "aviation",
        readTime: "7 min read",
        updatedAt: "March 2025",
        tags: ["Aviation", "IFR", "Navigation", "SOPs"],
        sections: [
            {
                id: "overview",
                heading: "1. Overview & Objective",
                content: [
                    "Instrument Flight Rules (IFR) operations demand rigorous pre-flight preparation, standard operating procedure (SOP) adherence, and accurate risk assessments before engine start.",
                    "This guide outlines key verification stages including NOTAM analysis, route structure selection, weather minimum compliance, and calculated reserve fuel calculations.",
                ],
                tip: "Always cross-reference alternate aerodrome weather forecasts with the applicable non-precision or precision approach ceiling and visibility minimums.",
            },
            {
                id: "weather-notam",
                heading: "2. Meteorological Assessment & NOTAMs",
                content: [
                    "Review METARs, TAFs, and SIGMET charts along the planned route of flight. Identify freezing levels, icing hazards, turbulence forecasts, and convective activity.",
                    "Verify runway closures, navigational aid outages (VOR/DME/ILS), and airspace restrictions through current NOTAM bulletins.",
                ],
            },
            {
                id: "fuel-contingency",
                heading: "3. Fuel Planning & Alternate Selection",
                content: [
                    "Calculate block fuel ensuring required reserves: Taxi Fuel + Trip Fuel + Contingency (minimum 5%) + Alternate Fuel + Final Reserve Fuel (30/45 min).",
                    "Choose appropriate take-off, destination, and en-route alternates depending on aerodrome operating categories and forecast trend buffers.",
                ],
                tip: "Under ICAO rules, ensure final reserve fuel is protected at all times and not considered usable for routing adjustments.",
            },
        ],
    },
    {
        id: "react-architecture-modern-spa",
        title: "Modern React 19 Architecture & Performance",
        description:
            "Architectural patterns for scalable, lightweight React single-page applications with Tailwind CSS, client caching, and SEO optimization.",
        category: "software",
        readTime: "6 min read",
        updatedAt: "February 2025",
        tags: ["React", "TypeScript", "Tailwind CSS", "Architecture"],
        sections: [
            {
                id: "core-principles",
                heading: "1. Core Principles of High-Performance SPAs",
                content: [
                    "Modern SPAs should prioritize minimal bundle footprints, instant client transitions, and rock-solid state boundary isolation.",
                    "By leveraging component-driven modularity and utility-first styling with Tailwind CSS, interfaces remain clean, consistent, and maintainable.",
                ],
                codeSnippet: `// Example: Clean reactive scroll restoration hook
useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}, [location.pathname]);`,
            },
            {
                id: "seo-metadata",
                heading: "2. Client-Side SEO & Structured Data",
                content: [
                    "Ensure every route mounts dynamic meta tags, OpenGraph attributes, canonical URLs, and Schema.org JSON-LD breadcrumb graphs.",
                    "This guarantees search crawlers accurately index client-rendered applications while maintaining full SPA fluid navigability.",
                ],
                tip: "Include BreadcrumbList and SoftwareSourceCode / Article schemas to maximize rich snippets in search engines.",
            },
        ],
    },
    {
        id: "developer-environment-terminal",
        title: "Unix & PowerShell Productive Developer Setup",
        description:
            "Optimized shell configuration, prompt styling, Git aliases, and build pipeline automation for cross-platform efficiency.",
        category: "tooling",
        readTime: "5 min read",
        updatedAt: "January 2025",
        tags: ["DevOps", "Terminal", "Git", "Tooling"],
        sections: [
            {
                id: "shell-config",
                heading: "1. Shell Ergonomics & Keybindings",
                content: [
                    "A fast terminal workflow relies on instant command recall, Git status awareness, and customized aliases for repetitive tasks.",
                    "Configure auto-completions, syntax highlighting, and minimal status prompts to reduce cognitive overhead during development.",
                ],
                codeSnippet: `# Fast Git commit & push shortcut
git add -A && git commit -m "feat: enhance navigation flow" && git push`,
            },
            {
                id: "automation-scripts",
                heading: "2. Build & Content Automation",
                content: [
                    "Automate repetitive tasks like RSS feed generation, project index collation, and sitemap synchronization directly via pre-build scripts.",
                ],
                tip: "Keep automated build hooks fast and idempotent so local development remains seamless.",
            },
        ],
    },
];

const CATEGORIES = [
    { id: "all", label: "All Guides", icon: LayersIcon, count: GUIDES_DATA.length },
    {
        id: "aviation",
        label: "Aviation & Flight Ops",
        icon: PlaneIcon,
        count: GUIDES_DATA.filter((g) => g.category === "aviation").length,
    },
    {
        id: "software",
        label: "Software & Web Dev",
        icon: Code2Icon,
        count: GUIDES_DATA.filter((g) => g.category === "software").length,
    },
    {
        id: "tooling",
        label: "Tooling & Workflow",
        icon: TerminalIcon,
        count: GUIDES_DATA.filter((g) => g.category === "tooling").length,
    },
];

export default function Guides() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedGuideId, setSelectedGuideId] = useState<string>(GUIDES_DATA[0].id);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredGuides = GUIDES_DATA.filter((guide) => {
        const matchesCategory =
            selectedCategory === "all" || guide.category === selectedCategory;
        const matchesSearch =
            searchQuery.trim() === "" ||
            guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guide.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
            );
        return matchesCategory && matchesSearch;
    });

    const activeGuide =
        filteredGuides.find((g) => g.id === selectedGuideId) ||
        filteredGuides[0] ||
        GUIDES_DATA[0];

    return (
        <main className="space-y-6 md:space-y-8 animate-in fade-in duration-500 fill-mode-both">
            <SEO
                title="Guides | Jürgen Jacobsen"
                description="Comprehensive documentation, aviation flight operational procedures, web architecture guides, and technical tutorials by Jürgen Jacobsen."
                canonical="/guides"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Guides", path: "/guides" },
                ]}
            />

            {/* Hero Header SectionCard */}
            <SectionCard className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                <header className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border rounded-full text-primary text-[10px] md:text-xs uppercase tracking-wider font-bold bg-primary/5">
                        <BookOpenIcon className="size-3 md:size-4" />
                        <span>Guides</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                        TECHNICAL{" "}
                        <span className="text-primary italic font-serif">GUIDES</span>
                        .
                    </h1>

                    <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl">
                        Curated reference manuals, aviation standard operating
                        procedures, software engineering workflows, and system guides
                        built for clarity and precision.
                    </p>

                    {/* Search & Category Filter Toolbar */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Search guides, tags, or topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 rounded-full bg-muted/40 border border-border/80 focus-visible:bg-card"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                const isSelected = selectedCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border",
                                            isSelected
                                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                                : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <Icon className="size-3.5" />
                                        <span>{cat.label}</span>
                                        <span
                                            className={cn(
                                                "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                                                isSelected
                                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {cat.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </header>
            </SectionCard>

            {/* Guides Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Sidebar: Guide List */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Articles & Guides</span>
                        <span>{filteredGuides.length} Found</span>
                    </div>

                    {filteredGuides.length === 0 ? (
                        <div className="bg-card rounded-xl border border-border p-6 text-center text-muted-foreground text-sm">
                            <CompassIcon className="size-8 mx-auto mb-2 opacity-40" />
                            <p className="font-semibold">No guides match your query</p>
                            <p className="text-xs mt-1 text-muted-foreground/80">
                                Try changing your search terms or category filter.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredGuides.map((guide) => {
                                const isActive = guide.id === activeGuide.id;
                                return (
                                    <button
                                        key={guide.id}
                                        onClick={() => setSelectedGuideId(guide.id)}
                                        className={cn(
                                            "w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 group",
                                            isActive
                                                ? "bg-card border-primary/40 shadow-sm ring-1 ring-primary/20"
                                                : "bg-card/70 border-border/70 hover:bg-card hover:border-border"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span
                                                className={cn(
                                                    "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md",
                                                    guide.category === "aviation"
                                                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                        : guide.category === "software"
                                                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                )}
                                            >
                                                {guide.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                                <ClockIcon className="size-3" />
                                                <span>{guide.readTime}</span>
                                            </div>
                                        </div>

                                        <h3
                                            className={cn(
                                                "font-bold text-sm leading-snug group-hover:text-primary transition-colors",
                                                isActive ? "text-foreground" : "text-muted-foreground"
                                            )}
                                        >
                                            {guide.title}
                                        </h3>

                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {guide.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[11px] text-muted-foreground">
                                            <span>{guide.updatedAt}</span>
                                            <ChevronRightIcon
                                                className={cn(
                                                    "size-4 transition-transform",
                                                    isActive
                                                        ? "translate-x-0.5 text-primary"
                                                        : "group-hover:translate-x-1 opacity-50"
                                                )}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right / Center Area: Active Guide Reader */}
                <div className="lg:col-span-8">
                    {activeGuide ? (
                        <SectionCard className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                            {/* Guide Header Banner */}
                            <div className="space-y-4 pb-6 border-b border-border">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-primary/20">
                                        {activeGuide.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                        <ClockIcon className="size-3.5" />
                                        <span>{activeGuide.readTime}</span>
                                    </div>
                                    <span className="text-muted-foreground/40">•</span>
                                    <span className="text-xs text-muted-foreground font-medium">
                                        Updated {activeGuide.updatedAt}
                                    </span>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                                    {activeGuide.title}
                                </h2>

                                <p className="text-base text-muted-foreground leading-relaxed">
                                    {activeGuide.description}
                                </p>

                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {activeGuide.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-0.5 text-xs rounded-full bg-muted/60 text-muted-foreground border border-border/50 font-medium"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Guide Content Sections */}
                            <div className="space-y-8 text-foreground">
                                {activeGuide.sections.map((sec) => (
                                    <section
                                        key={sec.id}
                                        id={sec.id}
                                        className="space-y-4 scroll-mt-24"
                                    >
                                        <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                            <FileTextIcon className="size-4 text-primary opacity-70" />
                                            {sec.heading}
                                        </h3>

                                        <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                                            {sec.content.map((paragraph, pIdx) => (
                                                <p key={pIdx}>{paragraph}</p>
                                            ))}
                                        </div>

                                        {sec.tip && (
                                            <div className="bg-muted/50 border-l-3 border-primary p-4 rounded-r-xl text-xs md:text-sm text-foreground/90 space-y-1">
                                                <div className="flex items-center gap-1.5 font-bold text-primary uppercase text-[11px] tracking-wider">
                                                    <SparklesIcon className="size-3.5" />
                                                    <span>Flight Ops / Pro Tip</span>
                                                </div>
                                                <p className="text-muted-foreground font-medium leading-relaxed">
                                                    {sec.tip}
                                                </p>
                                            </div>
                                        )}

                                        {sec.codeSnippet && (
                                            <div className="rounded-xl overflow-hidden border border-border bg-card shadow-xs">
                                                <div className="bg-muted/40 px-4 py-2 text-xs font-mono font-medium text-muted-foreground border-b border-border flex items-center justify-between">
                                                    <span>Terminal / Code Example</span>
                                                    <span className="text-[10px] uppercase font-bold text-primary">
                                                        Snippet
                                                    </span>
                                                </div>
                                                <pre className="p-4 text-xs md:text-sm font-mono overflow-x-auto text-primary bg-background/50">
                                                    <code>{sec.codeSnippet}</code>
                                                </pre>
                                            </div>
                                        )}
                                    </section>
                                ))}
                            </div>

                            {/* Section Footer Actions */}
                            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2Icon className="size-4 text-emerald-500" />
                                    <span>Standard Operating Procedure Verified</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (navigator.clipboard) {
                                                navigator.clipboard.writeText(
                                                    window.location.href
                                                );
                                            }
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted hover:text-foreground transition-all cursor-pointer font-semibold"
                                    >
                                        <Share2Icon className="size-3.5" />
                                        <span>Share Guide</span>
                                    </button>
                                </div>
                            </div>
                        </SectionCard>
                    ) : null}
                </div>
            </div>
        </main>
    );
}