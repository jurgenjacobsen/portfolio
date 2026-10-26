import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { KeyRound, X, Loader2, CheckCircle2, Lock } from "lucide-react";

interface SetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
}

export default function SetPasswordModal({
    isOpen,
    onClose,
    userEmail,
}: SetPasswordModalProps) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) throw updateError;

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setPassword("");
                setConfirmPassword("");
            }, 1800);
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Failed to update password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/30">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-foreground">
                                Set Account Password
                            </h2>
                            {userEmail && (
                                <p className="text-[11px] text-muted-foreground font-mono">
                                    {userEmail}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {success ? (
                        <div className="py-6 flex flex-col items-center text-center space-y-2 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-10 h-10 animate-in zoom-in duration-200" />
                            <h3 className="font-semibold text-sm">Password Set Successfully!</h3>
                            <p className="text-xs text-muted-foreground">
                                You can now sign in using your email and this password, or continue using magic links.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Since you signed in via magic link, you can set a permanent password below so you can also log in directly with a password in the future.
                            </p>

                            {error && (
                                <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs leading-relaxed">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-background border border-input rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold uppercase text-muted-foreground">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-background border border-input rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-3.5 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-xs"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Set Password</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
