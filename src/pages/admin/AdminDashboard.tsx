import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    supabase,
    type ProjectRow,
    type GuideSectionRow,
    type GuideRow,
    type FlightLogRow,
} from "@/lib/supabase";
import { SEO } from "@/components/shared";
import ProjectsPanel from "@/components/admin/ProjectsPanel";
import GuidesPanel from "@/components/admin/GuidesPanel";
import AviationPanel from "@/components/admin/AviationPanel";
import SetPasswordModal from "@/components/admin/SetPasswordModal";
import {
    Code2,
    BookOpen,
    Plane,
    LogOut,
    RefreshCw,
    Database,
    ShieldCheck,
    FolderKanban,
    KeyRound,
} from "lucide-react";

type AdminTab = "projects" | "guides" | "aviation";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<AdminTab>("projects");
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const [projects, setProjects] = useState<ProjectRow[]>([]);
    const [sections, setSections] = useState<GuideSectionRow[]>([]);
    const [guides, setGuides] = useState<GuideRow[]>([]);
    const [flightLogs, setFlightLogs] = useState<FlightLogRow[]>([]);

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingGuides, setLoadingGuides] = useState(true);
    const [loadingFlights, setLoadingFlights] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch user info
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserEmail(user?.email || "Admin");
        });
    }, []);

    // Data loaders
    const fetchProjects = useCallback(async () => {
        setLoadingProjects(true);
        try {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;
            setProjects(data || []);
        } catch (err) {
            console.error("Error fetching projects:", err);
        } finally {
            setLoadingProjects(false);
        }
    }, []);

    const fetchGuidesAndSections = useCallback(async () => {
        setLoadingGuides(true);
        try {
            const [sectionsRes, guidesRes] = await Promise.all([
                supabase
                    .from("guide_sections")
                    .select("*")
                    .order("order_index", { ascending: true }),
                supabase
                    .from("guides")
                    .select("*")
                    .order("order_index", { ascending: true }),
            ]);

            if (sectionsRes.error) throw sectionsRes.error;
            if (guidesRes.error) throw guidesRes.error;

            setSections(sectionsRes.data || []);
            setGuides(guidesRes.data || []);
        } catch (err) {
            console.error("Error fetching guides:", err);
        } finally {
            setLoadingGuides(false);
        }
    }, []);

    const fetchFlightLogs = useCallback(async () => {
        setLoadingFlights(true);
        try {
            const { data, error } = await supabase
                .from("flight_logs")
                .select("*")
                .order("flight_date", { ascending: false });
            if (error) throw error;
            setFlightLogs(data || []);
        } catch (err) {
            console.error("Error fetching flight logs:", err);
        } finally {
            setLoadingFlights(false);
        }
    }, []);

    const refreshAll = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                fetchProjects(),
                fetchGuidesAndSections(),
                fetchFlightLogs(),
            ]);
        } finally {
            setIsRefreshing(false);
        }
    }, [fetchProjects, fetchGuidesAndSections, fetchFlightLogs]);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            supabase.from("projects").select("*").order("created_at", { ascending: false }),
            supabase.from("guide_sections").select("*").order("order_index", { ascending: true }),
            supabase.from("guides").select("*").order("order_index", { ascending: true }),
            supabase.from("flight_logs").select("*").order("flight_date", { ascending: false }),
        ]).then(([p, s, g, f]) => {
            if (!mounted) return;
            if (p.data) setProjects(p.data);
            if (s.data) setSections(s.data);
            if (g.data) setGuides(g.data);
            if (f.data) setFlightLogs(f.data);
            setLoadingProjects(false);
            setLoadingGuides(false);
            setLoadingFlights(false);
        });

        return () => {
            mounted = false;
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login", { replace: true });
    };

    return (
        <main className="space-y-6 mt-2 pb-16">
            <SEO
                title="Admin Management Console | Jürgen Jacobsen"
                description="Consolidated administrative management interface for projects, guides, and flight logs."
                canonical="/admin"
            />

            {/* Top Admin Header Bar */}
            <div className="border border-border/80 bg-card rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                        <FolderKanban className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-foreground tracking-tight">
                                Portfolio CMS Console
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <Database className="w-2.5 h-2.5" /> Supabase Live
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            <span>Signed in as:</span>
                            <span className="font-mono text-foreground font-medium">
                                {userEmail}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        title="Set or update your permanent account password"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer shadow-2xs"
                    >
                        <KeyRound className="w-3.5 h-3.5 text-primary" />
                        <span>Set Password</span>
                    </button>

                    <button
                        onClick={refreshAll}
                        disabled={isRefreshing}
                        title="Reload all Supabase data"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer shadow-2xs"
                    >
                        <RefreshCw
                            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        <span>Sync</span>
                    </button>

                    <button
                        onClick={handleSignOut}
                        title="Sign out of Admin session"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Single-Page Tab Switcher */}
            <div className="flex items-center p-1.5 bg-muted/40 border border-border/80 rounded-2xl max-w-xl">
                <button
                    onClick={() => setActiveTab("projects")}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                        activeTab === "projects"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <Code2 className="w-4 h-4 text-primary" />
                    <span>Projects</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-muted text-[10px] font-mono">
                        {projects.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("guides")}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                        activeTab === "guides"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Guides</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-muted text-[10px] font-mono">
                        {guides.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("aviation")}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                        activeTab === "aviation"
                            ? "bg-background text-foreground shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <Plane className="w-4 h-4 text-primary" />
                    <span>Aviation</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-muted text-[10px] font-mono">
                        {flightLogs.length}
                    </span>
                </button>
            </div>

            {/* Tab Panels */}
            {activeTab === "projects" && (
                <ProjectsPanel
                    projects={projects}
                    loading={loadingProjects}
                    onRefresh={fetchProjects}
                />
            )}

            {activeTab === "guides" && (
                <GuidesPanel
                    guides={guides}
                    sections={sections}
                    loading={loadingGuides}
                    onRefresh={fetchGuidesAndSections}
                />
            )}

            {activeTab === "aviation" && (
                <AviationPanel
                    flightLogs={flightLogs}
                    loading={loadingFlights}
                    onRefresh={fetchFlightLogs}
                />
            )}

            {/* Set Account Password Modal */}
            <SetPasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                userEmail={userEmail || undefined}
            />
        </main>
    );
}
