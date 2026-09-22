import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    supabase,
    type ProjectRow,
    type GuideSectionRow,
    type GuideRow,
    type FlightLogRow,
} from "@/lib/supabase";
import { SectionCard, SEO } from "@/components/shared";
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
        <main className="space-y-6 mt-6">
            <SEO
                title="Admin Management Console | Jürgen Jacobsen"
                description="Consolidated administrative management interface for projects, guides, and flight logs."
                canonical="/admin"
                robots="noindex, nofollow"
            />

            <SectionCard className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-lg border border-border text-primary flex items-center justify-center shrink-0">
                        <FolderKanban className="size-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-foreground tracking-tight">
                                Admin Console
                            </h1>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <ShieldCheck className="size-4 text-primary" />
                            <span>Signed in as:</span>
                            <span className="text-foreground font-medium">
                                {userEmail}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-4 self-end md:self-auto">
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        title="Set or update your permanent account password"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-xs font-medium hover:text-foreground hover:bg-muted transition cursor-pointer"
                    >
                        <KeyRound className="size-4 text-primary" />
                        <span>Set Password</span>
                    </button>

                    <button
                        onClick={refreshAll}
                        disabled={isRefreshing}
                        title="Reload all Supabase data"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-xs font-medium hover:text-foreground hover:bg-muted transition cursor-pointer"
                    >
                        <RefreshCw
                            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        <span>Sync</span>
                    </button>

                    <button
                        onClick={handleSignOut}
                        title="Sign out of Admin session"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/25 bg-destructive/5 text-destructive text-xs font-medium hover:bg-destructive/0 transition cursor-pointer"
                    >
                        <LogOut className="size-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </SectionCard>

            <SectionCard className="flex items-center justify-between gap-4">
                <button
                    onClick={() => setActiveTab("projects")}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs sm:text-sm border border-border font-medium transition cursor-pointer ${
                        activeTab === "projects"
                            ? "bg-background text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <Code2 className="w-4 h-4 text-primary" />
                    <span>Projects</span>
                    <span className="px-2 py-1 rounded-md bg-muted text-[10px] font-mono">
                        {projects.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("guides")}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs sm:text-sm border border-border font-medium transition cursor-pointer ${
                        activeTab === "guides"
                            ? "bg-background text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Guides</span>
                    <span className="px-2 py-1 rounded-md bg-muted text-[10px] font-mono">
                        {guides.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab("aviation")}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs sm:text-sm border border-border font-medium transition cursor-pointer ${
                        activeTab === "aviation"
                            ? "bg-background text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <Plane className="w-4 h-4 text-primary" />
                    <span>Aviation</span>
                    <span className="px-2 py-1 rounded-md bg-muted text-[10px] font-mono">
                        {flightLogs.length}
                    </span>
                </button>
            </SectionCard>
            

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
