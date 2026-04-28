import * as Icons from "../icons";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

export type IconId =
    | "react"
    | "typescript"
    | "nestjs"
    | "vue"
    | "go"
    | "postgresql"
    | "csharp"
    | "dotnet"
    | "supabase"
    | "mongodb"
    | "github"
    | "linkedin"
    | "github"
    | keyof typeof LucideIcons;

interface TechIconProps extends React.SVGProps<SVGSVGElement> {
    id: IconId;
    className?: string;
}

export const TechIcon = ({ id, className, ...props }: TechIconProps) => {
    // Mapping for our custom brand icons
    const brandIcons: Record<
        string,
        React.FC<React.SVGProps<SVGSVGElement>>
    > = {
        react: Icons.ReactIcon,
        typescript: Icons.TypescriptIcon,
        nestjs: Icons.NestJSIcon,
        vue: Icons.VueIcon,
        go: Icons.GoIcon,
        postgresql: Icons.PostgreSQLIcon,
        csharp: Icons.CSharpIcon,
        dotnet: Icons.DotNetIcon,
        supabase: Icons.SupabaseIcon,
        mongodb: Icons.MongoDBIcon,
        github: Icons.GithubIcon,
        linkedin: Icons.LinkedinIcon,
    };

    // Try to find a brand icon first
    const BrandIcon = brandIcons[id.toLowerCase()];
    if (BrandIcon) {
        return <BrandIcon className={cn("size-4", className)} {...props} />;
    }

    // Fallback to Lucide icons
    const LucideIcon = (LucideIcons as any)[id];
    if (LucideIcon) {
        return <LucideIcon className={cn("size-4", className)} {...props} />;
    }

    // Return null or a fallback if not found
    return null;
};
