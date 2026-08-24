import ContactHero from "@/components/features/contact/Hero";
import { SEO } from "@/components/shared";

export default function Contact() {
    return (
        <main>
            <SEO
                title="Contact & Inquiries | Jürgen Jacobsen"
                description="Get in touch with Jürgen Jacobsen for software development, aviation consultation, collaborations, or inquiries."
                canonical="/contact"
            />
            <ContactHero />
        </main>
    );
}

