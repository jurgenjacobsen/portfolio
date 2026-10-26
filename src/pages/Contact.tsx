import ContactHero from "@/components/features/contact/ContactHero";
import SEO from "@/components/shared/SEO";

export default function Contact() {
    return (
        <main id="main-content">
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

