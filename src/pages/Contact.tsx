import ContactHero from "@/components/features/contact/Hero";
import { SEO } from "@/components/shared";

export default function Contact() {
    return (
        <main>
            <SEO
                title="Contact | Jürgen Jacobsen"
                description="Get in touch with Jürgen Jacobsen for open roles, software development projects & collaborations."
                canonical="/contact"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Contact", path: "/contact" },
                ]}
            />
            <ContactHero />
        </main>
    );
}

