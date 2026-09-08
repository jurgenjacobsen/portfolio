import { Link } from "react-router-dom";
import { MoveLeftIcon, OctagonAlertIcon } from "lucide-react";
import { SectionCard, SEO } from "@/components/shared";

export default function NotFound() {
    return (
        <main className="flex items-center justify-center">
            <SEO
                title="404 - Page Not Found | Jürgen Jacobsen"
                description="The page you are looking for does not exist or has been moved."
                robots="noindex, nofollow"
            />
            <SectionCard className="w-full p-6 text-center flex flex-col items-center gap-6">
                <div className="bg-destructive/15 p-4 rounded-full text-destructive">
                    <OctagonAlertIcon className="size-12" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight">404</h1>
                    <h2 className="text-xl font-bold text-muted-foreground">
                        Page Not Found
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The page you're looking for doesn't exist or has been
                        moved.
                    </p>
                </div>

                <Link
                    to="/"
                    className="mt-2 inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium rounded-full border border-border bg-background hover:bg-muted hover:text-foreground transition-all duration-300"
                >
                    <MoveLeftIcon className="size-4" />
                    Back to Home
                </Link>
            </SectionCard>
        </main>
    );
}
