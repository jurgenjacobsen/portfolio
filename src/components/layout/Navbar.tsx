import { useState, useEffect } from "react";
import { Contact2Icon, FileUser, HomeIcon, InfoIcon, LibraryBigIcon } from "lucide-react";
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
            (location.pathname.startsWith("/projects") &&
                props.to === "/projects");

        return (
            <Link
                to={props.to}
                className={cn(
                    "py-1 px-4 rounded-lg transition-all duration-300 cursor-pointer border group inline-flex items-center gap-2",
                    isActive
                        ? "bg-primary/5 border-primary/25 text-primary"
                        : "border-border/50 hover:bg-primary/5 hover:border-primary/25",
                    props.className,
                )}
            >
                {props.children}
            </Link>
        );
    }

    return (
        <nav className="relative z-50">
            <div className="rounded-xl bg-card py-3 px-5 md:px-8 flex justify-between items-center shadow-md border border-border">
                <div className="flex items-baseline shrink-0">
                    <Link
                        to="/"
                        className="flex items-baseline hover:opacity-80 transition-opacity"
                    >
                        <h1 className="font-bold text-lg">Jürgen</h1>
                        <span className="opacity-50 text-sm font-medium">
                            .fyi
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-4">
                    <li>
                        <NavbarButton to="/">
                            <HomeIcon className="size-4 group-hover:scale-105 transition-transform" />
                            <span>Home</span>
                        </NavbarButton>
                    </li>
                    <li>
                        <NavbarButton to="/projects">
                            <LibraryBigIcon className="size-4 group-hover:scale-105 transition-transform" />
                            <span>Projects</span>
                        </NavbarButton>
                    </li>
                    <li>
                        <NavbarButton to="/cv">
                            <FileUser className="size-4 group-hover:scale-105 transition-transform" />
                            <span>CV</span>
                        </NavbarButton>
                    </li>
                    <li>
                        <NavbarButton to="/contact">
                            <Contact2Icon className="size-4 group-hover:scale-105 transition-transform" />
                            <span>Contact</span>
                        </NavbarButton>
                    </li>
                    <li>
                        <NavbarButton to="/about">
                            <InfoIcon className="size-4 group-hover:scale-105 transition-transform" />
                            <span>About</span>
                        </NavbarButton>
                    </li>
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
                    "absolute top-full left-0 right-0 mt-2 z-40 bg-card/95 backdrop-blur-md md:hidden transition-all duration-300 ease-in-out border border-border rounded-xl shadow-xl overflow-hidden origin-top",
                    isMenuOpen
                        ? "opacity-100 scale-y-100 pointer-events-auto"
                        : "opacity-0 scale-y-95 pointer-events-none",
                )}
            >
                <div className="flex flex-col p-4 gap-2">
                    <div className="text-xs font-black text-muted-foreground uppercase px-2 mb-1">
                        Navigation
                    </div>
                    <NavbarButton
                        to="/"
                        className="w-full justify-start py-2 px-4 border-none hover:bg-primary/5"
                    >
                        <HomeIcon className="size-4" />
                        <span className="font-bold">Home</span>
                    </NavbarButton>
                    <NavbarButton
                        to="/projects"
                        className="w-full justify-start py-2 px-4 border-none hover:bg-primary/5"
                    >
                        <LibraryBigIcon className="size-4" />
                        <span className="font-bold">Projects</span>
                    </NavbarButton>
                    <NavbarButton
                        to="/cv"
                        className="w-full justify-start py-2 px-4 border-none hover:bg-primary/5"
                    >
                        <FileUser className="size-4" />
                        <span className="font-bold">CV</span>
                    </NavbarButton>
                    <NavbarButton
                        to="/contact"
                        className="w-full justify-start py-2 px-4 border-none hover:bg-primary/5"
                    >
                        <Contact2Icon className="size-4" />
                        <span className="font-bold">Contact</span>
                    </NavbarButton>
                    <NavbarButton
                        to="/about"
                        className="w-full justify-start py-2 px-4 border-none hover:bg-primary/5"
                    >
                        <InfoIcon className="size-4" />
                        <span className="font-bold">About</span>
                    </NavbarButton>
                </div>
            </div>

            {/* Backdrop for closing menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-30 md:hidden bg-background/20"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </nav>
    );
}
