import { Link } from "react-router-dom";
import { MoveLeftIcon, OctagonAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/shared";

export default function NotFound() {
    return (
        <main className="flex items-center justify-center">
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

                <Button
                    asChild
                    variant="outline"
                    className="mt-2 px-4 hover:opacity-75 duration-300"
                >
                    <Link to="/" className="flex items-center gap-2">
                        <MoveLeftIcon className="size-4" />
                        Back to Home
                    </Link>
                </Button>
            </SectionCard>
        </main>
    );
}
