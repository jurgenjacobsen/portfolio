import { Hero, QuickInfo } from "@/components/layout";
import { SEO } from "@/components/shared";

export default function Home() {
    return (
        <main>
            <SEO
                title="Jürgen Jacobsen | Commercial Pilot & Web Developer"
                description="Personal portfolio of Jürgen Jacobsen, Commercial Pilot and Web Developer. Showcasing web development projects, flight experience, and aeronautical cartography."
                canonical="/"
            />
            <Hero />
            <QuickInfo />
        </main>
    );
}
