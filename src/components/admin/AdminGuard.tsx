import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { Loader2, ShieldAlert } from "lucide-react";

interface AdminGuardProps {
    children: ReactNode;
}

const rawAllowedEmails =
    (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ||
    (import.meta.env.NEXT_PUBLIC_ADMIN_EMAIL as string | undefined) ||
    "";
const allowedAdminEmails = rawAllowedEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export default function AdminGuard({ children }: AdminGuardProps) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [unauthorized, setUnauthorized] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let mounted = true;

        const validateSession = async (sess: Session | null) => {
            if (!sess) {
                if (mounted) {
                    setSession(null);
                    setUnauthorized(false);
                    setLoading(false);
                }
                return;
            }

            // If an admin email whitelist is configured, enforce it
            if (allowedAdminEmails.length > 0) {
                const userEmail = sess.user.email?.toLowerCase();
                if (!userEmail || !allowedAdminEmails.includes(userEmail)) {
                    await supabase.auth.signOut();
                    if (mounted) {
                        setSession(null);
                        setUnauthorized(true);
                        setLoading(false);
                    }
                    return;
                }
            }

            if (mounted) {
                setSession(sess);
                setUnauthorized(false);
                setLoading(false);
            }
        };

        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            validateSession(initialSession);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            validateSession(newSession);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-mono">
                    Authenticating session...
                </p>
            </div>
        );
    }

    if (unauthorized) {
        return (
            <div className="max-w-md mx-auto my-16 p-6 sm:p-8 bg-card border border-destructive/30 rounded-2xl text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
                <p className="text-sm text-muted-foreground">
                    Your account is not authorized to access the admin console.
                </p>
                <div className="pt-2">
                    <a
                        href="/admin/login"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
                    >
                        Return to Sign In
                    </a>
                </div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
