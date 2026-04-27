import { Contact2Icon, HomeIcon, InfoIcon, LibraryBigIcon } from "lucide-react";

export default function Navbar() {
    function NavbarButton(props: { children: any; href: string }) {
        return (
            <a
                href={props.href}
                className="py-1 px-4 rounded-lg hover:bg-primary/5 transition-colors duration-300 cursor-pointer border border-border/50 hover:border-primary/25 group inline-flex items-center gap-1"
            >
                <span className="inline-flex items-center gap-2">
                    {props.children}
                </span>
            </a>
        );
    }

    return (
        <>
            <nav className="rounded-xl bg-card py-3 px-8 flex justify-between items-center shadow-md border border-border">
                <div className="flex items-baseline">
                    <h1 className="font-bold text-lg">Jürgen</h1>
                    <span className="opacity-50 text-sm font-medium">.fyi</span>
                </div>
                <ul className="flex gap-4">
                    <NavbarButton href="/">
                        <HomeIcon className="size-4 group-hover:scale-105 transition-transform" />{" "}
                        Home
                    </NavbarButton>
                    <NavbarButton href="/projects">
                        <LibraryBigIcon className="size-4 group-hover:scale-105 transition-transform" />
                        Projects
                    </NavbarButton>
                    <NavbarButton href="/contact">
                        <Contact2Icon className="size-4 group-hover:scale-105 transition-transform" />{" "}
                        Contact
                    </NavbarButton>
                    <NavbarButton href="/about">
                        <InfoIcon className="size-4 group-hover:scale-105 transition-transform" />{" "}
                        About
                    </NavbarButton>
                </ul>
            </nav>
        </>
    );
}
