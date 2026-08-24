import { Hero, QuickInfo } from "@/components/layout";
import { SEO } from "@/components/shared";

export default function Home() {
    return (
        <main>
            <SEO
                title="Jürgen Jacobsen | Commercial Pilot & Software Engineer"
                description="Personal portfolio of Jürgen Jacobsen, Commercial Pilot and Software Engineer. Showcasing software engineering projects, flight experience, and aeronautical cartography."
                canonical="/"
            />
            <Hero />
            <QuickInfo />
        </main>
    );
}

