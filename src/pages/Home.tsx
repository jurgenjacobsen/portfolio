import { Hero, QuickInfo } from "@/components/layout";
import { SEO } from "@/components/shared";

const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": "https://jurgen.fyi/#website",
            "url": "https://jurgen.fyi/",
            "name": "Jürgen Jacobsen",
            "alternateName": [
                "Jurgen Jacobsen",
                "jurgen.fyi",
                "Jürgen Jacobsen Portfolio",
                "Jurgen Jacobsen Portfolio"
            ],
            "description":
                "Portfolio of Jürgen Jacobsen, Commercial Pilot and Web Developer.",
            "inLanguage": "en-GB",
        },
        {
            "@type": "Person",
            "@id": "https://jurgen.fyi/#person",
            "name": "Jürgen Jacobsen",
            "url": "https://jurgen.fyi/",
            "image": "https://jurgen.fyi/img/profile.jpg",
            "jobTitle": ["Commercial Pilot", "Web Developer", "Software Engineer"],
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Porto",
                "addressCountry": "PT",
            },
            "sameAs": [
                "https://github.com/jurgenjacobsen",
                "https://linkedin.com/in/jurgenjacobsen",
                "https://instagram.com/jurgen.jacobsen",
            ],
            "knowsAbout": [
                "Commercial Aviation",
                "Aeronautical Cartography",
                "Web Development",
                "Software Engineering",
                "React",
                "TypeScript",
                "Tailwind CSS",
            ],
        },
    ],
};

export default function Home() {
    return (
        <main>
            <SEO
                title="Jürgen Jacobsen | Commercial Pilot & Web Developer"
                description="Personal portfolio of Jürgen Jacobsen, Commercial Pilot and Web Developer. Showcasing web development projects, flight experience, and aeronautical cartography."
                canonical="/"
                jsonLd={homeSchema}
            />
            <Hero />
            <QuickInfo />
        </main>
    );
}


