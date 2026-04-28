import AboutHero from "@/components/sections/about/Hero";
import Curriculum from "@/components/sections/about/Curriculum";

export default function About() {
    return (
        <main className="space-y-4 md:space-y-8">
            <AboutHero />
            <Curriculum />
        </main>
    );
}
