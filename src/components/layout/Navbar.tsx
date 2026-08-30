import { useState, useEffect } from "react";
import { Code2Icon, FileTextIcon, HomeIcon, MailIcon, PlaneIcon, Image } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen]);

    function NavbarButton(props: {
        children: React.ReactNode;
        to: string;
        className?: string;
    }) {
        const isActive =
            location.pathname === props.to ||
            (location.pathname.startsWith("/code") &&
                props.to === "/code");

        return (
            <Link
                to={props.to}
                className={cn(
                    "py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center gap-2",
                    isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "text-primary border-border/50 hover:bg-primary/5 hover:border-primary/25",
                    props.className,
                )}
            >
                {props.children}
            </Link>
        );
    }

    const NavbarItems = [
        { to: "/", label: "Home", icon: HomeIcon },
        { to: "/aviation", label: "Aviation", icon: PlaneIcon },
        { to: "/code", label: "Code", icon: Code2Icon },
        { to: "/cv", label: "CV", icon: FileTextIcon },
        { to: "/contact", label: "Contact", icon: MailIcon },
    ];

    const HiddenItems = [
        { to: "/photos", label: "Photos", icon: Image },
    ];

    return (
        <nav className="relative z-50 no-print">
            <div className="rounded-xl bg-card py-2 px-4 md:px-8 flex justify-between items-center shadow-md border border-border text-sm">
                <div className="flex items-baseline shrink-0">
                    <Link
                        to="/"
                        className="flex items-baseline"
                    >
                        <span className="font-bold text-lg">Jürgen</span>
                        <span className="opacity-50 text-sm font-medium">
                            .fyi
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-4">
                    {NavbarItems.map((item) => (
                        <li key={item.to}>
                            <NavbarButton to={item.to}>
                                <item.icon className="size-4 transition-transform" />
                                <span>{item.label}</span>
                            </NavbarButton>
                        </li>
                    ))}
                    {HiddenItems.find(item => item.to === window.location.pathname) && (
                        <span className="text-muted-foreground text-xs flex items-center">
                            |
                        </span>
                    )}
                    {HiddenItems.map((item) => {
                            if (item.to === window.location.pathname) return (
                                <li key={item.to}>
                                    <NavbarButton to={item.to}>
                                        <item.icon className="size-4 transition-transform" />
                                        <span>{item.label}</span>
                                    </NavbarButton>
                                </li>
                            )
                        })}
                </ul>

                {/* Mobile Toggle Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-lg border border-border bg-muted/30 text-primary hover:bg-muted/50 transition-all cursor-pointer relative"
                    aria-label="Toggle Menu"
                >
                    <span
                        className={cn(
                            "w-5 h-0.5 bg-current transition-all duration-300 ease-in-out rounded-full",
                            isMenuOpen ? "rotate-45 translate-y-2" : "",
                        )}
                    />
                    <span
                        className={cn(
                            "w-5 h-0.5 bg-current transition-all duration-300 ease-in-out rounded-full",
                            isMenuOpen ? "opacity-0 -translate-x-2" : "",
                        )}
                    />
                    <span
                        className={cn(
                            "w-5 h-0.5 bg-current transition-all duration-300 ease-in-out rounded-full",
                            isMenuOpen ? "-rotate-45 -translate-y-2" : "",
                        )}
                    />
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={cn(
                    "absolute top-full left-0 right-0 mt-2 z-50 bg-card backdrop-blur-md md:hidden transition-all duration-300 ease-in-out border border-border rounded-xl shadow-xl overflow-hidden origin-top",
                    isMenuOpen
                        ? "opacity-100 scale-y-100 pointer-events-auto"
                        : "opacity-0 scale-y-95 pointer-events-none",
                )}
            >
                <div className="flex flex-col p-4 gap-2">
                    <div className="text-xs font-bold text-muted-foreground uppercase px-2 mb-1">
                        Navigation
                    </div>
                    {NavbarItems.map((item) => (
                        <NavbarButton
                            key={item.to}
                            to={item.to}
                            className="w-full justify-start py-2 px-4 border-none hover:bg-primary/5"
                        >
                            <item.icon className="size-4" />
                            <span className="font-bold">{item.label}</span>
                        </NavbarButton>
                    ))}
                </div>
            </div>

            {/* Backdrop for closing menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden bg-background/20"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </nav>
    );
}
