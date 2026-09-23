import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface PhotoCardButtonProps {
    to: string;
    label?: string;
    children?: React.ReactNode;
    className?: string;
}

export default function PhotoCardButton({
    to,
    label,
    children,
    className,
}: PhotoCardButtonProps) {
    return (
        <div className="bg-card rounded-lg group shadow-xs inline-flex">
            <Link
                to={to}
                className={cn(
                    "py-1 px-3 sm:px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold whitespace-nowrap text-primary border-border hover:bg-primary/5 hover:border-primary/50 hover:text-foreground/75 pointer-events-auto",
                    className
                )}
            >
                {label || children}
            </Link>
        </div>
    );
}
