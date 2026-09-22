import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { SEO } from "@/components/shared";
import { Lock, Mail, KeyRound, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface LocationState {
    from?: {
        pathname?: string;
    };
}

export default function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as LocationState)?.from?.pathname || "/admin";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isMagicLink, setIsMagicLink] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const rawAllowedEmails =
        (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ||
        (import.meta.env.NEXT_PUBLIC_ADMIN_EMAIL as string | undefined) ||
        "";
    const allowedAdminEmails = rawAllowedEmails
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

    // If already logged in, redirect directly to admin
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate(from, { replace: true });
            }
        });
    }, [navigate, from]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setLoading(true);

        const cleanEmail = email.trim().toLowerCase();

        if (allowedAdminEmails.length > 0 && !allowedAdminEmails.includes(cleanEmail)) {
            setError("This email address is not authorized for administrator access.");
            setLoading(false);
            return;
        }

        try {
            if (isMagicLink) {
                const { error } = await supabase.auth.signInWithOtp({
                    email: cleanEmail,
                    options: {
                        shouldCreateUser: false, // Prevents creating arbitrary accounts if unknown email
                        emailRedirectTo: window.location.origin + "/admin",
                    },
                });
                if (error) throw error;
                setSuccessMsg("Magic sign-in link sent! Check your inbox.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password,
                });
                if (error) throw error;
                navigate(from, { replace: true });
            }
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to authenticate. Please check credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-md mx-auto py-12 px-4 sm:px-6">
            <SEO
                title="Admin Authentication | Jürgen Jacobsen"
                description="Administrative CMS login portal."
                canonical="/admin/login"
                robots="noindex, nofollow"
            />

            <div className="border border-border/80 bg-card rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Sign in to manage projects, technical guides, and flight logs.
                    </p>
                </div>

                {error && (
                    <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm leading-relaxed">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm leading-relaxed">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            />
                        </div>
                    </div>

                    {!isMagicLink && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition disabled:opacity-50 shadow-sm cursor-pointer"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <span>{isMagicLink ? "Send Magic Link" : "Sign In"}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-2 border-t border-border/60 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsMagicLink(!isMagicLink);
                            setError(null);
                            setSuccessMsg(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                            {isMagicLink
                                ? "Use password sign in instead"
                                : "Sign in via magic email link"}
                        </span>
                    </button>
                </div>
            </div>
        </main>
    );
}
