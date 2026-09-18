import { SEO } from "@/components/shared";

export default function Charts() {


    return (
        <main className="space-y-6 md:space-y-8">
            <SEO
                title="Aeronautical Charts Design | Jürgen Jacobsen"
                description="Custom aeronautical charts design, training instrument procedures and SOPs training procedures by Jürgen Jacobsen."
                canonical="/charts"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Aeronautical Charts", path: "/charts" },
                ]}
            />
        </main>
    );
}