import AboutHero from "@/components/features/about/Hero";
import Curriculum from "@/components/features/about/Curriculum";

export default function About() {
    return (
        <main className="space-y-4 md:space-y-8">
            <AboutHero />
            <Curriculum />
        </main>
    );
}
