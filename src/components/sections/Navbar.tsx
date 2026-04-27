import { Contact2Icon, HomeIcon, InfoIcon, LibraryBigIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    function NavbarButton(props: { children: React.ReactNode; to: string }) {
        return (
            <Link
                to={props.to}
                className="py-1 px-4 rounded-lg hover:bg-primary/5 transition-colors duration-300 cursor-pointer border border-border/50 hover:border-primary/25 group inline-flex items-center gap-1"
            >
                <span className="inline-flex items-center gap-2">
                    {props.children}
                </span>
            </Link>
        );
    }

    return (
        <nav className="rounded-xl bg-card py-3 px-8 flex justify-between items-center shadow-md border border-border">
            <div className="flex items-baseline">
                <Link
                    to="/"
                    className="flex items-baseline hover:opacity-80 transition-opacity"
                >
                    <h1 className="font-bold text-lg">Jürgen</h1>
                    <span className="opacity-50 text-sm font-medium">.fyi</span>
                </Link>
            </div>
            <ul className="flex gap-4">
                <NavbarButton to="/">
                    <HomeIcon className="size-4 group-hover:scale-105 transition-transform" />{" "}
                    Home
                </NavbarButton>
                <NavbarButton to="/projects">
                    <LibraryBigIcon className="size-4 group-hover:scale-105 transition-transform" />
                    Projects
                </NavbarButton>
                <NavbarButton to="/contact">
                    <Contact2Icon className="size-4 group-hover:scale-105 transition-transform" />{" "}
                    Contact
                </NavbarButton>
                <NavbarButton to="/about">
                    <InfoIcon className="size-4 group-hover:scale-105 transition-transform" />{" "}
                    About
                </NavbarButton>
            </ul>
        </nav>
    );
}
