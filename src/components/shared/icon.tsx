import ReactIcon from "../icons/React";
import TypescriptIcon from "../icons/Typescript";
import NestJSIcon from "../icons/NestJS";
import VueIcon from "../icons/Vue";
import GoIcon from "../icons/Go";
import PostgreSQLIcon from "../icons/PostgreSQL";
import CSharpIcon from "../icons/CSharp";
import DotNetIcon from "../icons/DotNet";
import SupabaseIcon from "../icons/Supabase";
import MongoDBIcon from "../icons/MongoDB";
import GithubIcon from "../icons/Github";
import LinkedinIcon from "../icons/Linkedin";
import PythonIcon from "../icons/Python";
import DjangoIcon from "../icons/Django";
import TailwindCSS from "../icons/Tailwind";
import WindowsIcon from "../icons/Windows";
import AppleIcon from "../icons/Apple";
import LinuxIcon from "../icons/Linux";
import InstagramIcon from "../icons/Instagram";
import FacebookIcon from "../icons/Facebook";
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
    | "python"
    | "django"
    | "tailwindcss"
    | "windowsicon"
    | "appleicon"
    | "linuxicon"
    | "instagram"
    | "facebook"
    | keyof typeof LucideIcons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
    id: IconId;
    className?: string;
}

export const Icon = ({ id, className, ...props }: IconProps) => {
    // Mapping for our custom brand icons
    const brandIcons: Record<
        string,
        React.FC<React.SVGProps<SVGSVGElement>>
    > = {
        react: ReactIcon,
        typescript: TypescriptIcon,
        nestjs: NestJSIcon,
        vue: VueIcon,
        go: GoIcon,
        postgresql: PostgreSQLIcon,
        csharp: CSharpIcon,
        dotnet: DotNetIcon,
        supabase: SupabaseIcon,
        mongodb: MongoDBIcon,
        github: GithubIcon,
        linkedin: LinkedinIcon,
        python: PythonIcon,
        django: DjangoIcon,
        tailwindcss: TailwindCSS,
        windowsicon: WindowsIcon,
        appleicon: AppleIcon,
        linuxicon: LinuxIcon,
        instagram: InstagramIcon,
        facebook: FacebookIcon,
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
