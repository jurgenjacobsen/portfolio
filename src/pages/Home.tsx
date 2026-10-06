import Hero from "@/components/features/home/Hero";
import QuickInfo from "@/components/features/home/QuickInfo";
import SEO from "@/components/shared/SEO";

export default function Home() {
    return (
        <main id="main-content">
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
