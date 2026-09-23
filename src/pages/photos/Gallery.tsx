import { SEO } from "@/components/shared";
import {
    SinglePhotoBanner,
    MultiplePhotoBanner,
    SmallPhotoCard,
    MediumPhotoCard,
    ContactCTA,
} from "@/components/features/photos";

export default function Photos() {
    return (
        <main>
            <SEO
                title="Photography & Design | Jürgen Jacobsen"
                description="Portfolio of photography and design work by Jürgen Jacobsen."
                canonical="/photos"
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Photography & Design", path: "/photos" },
                ]}
            />

            <div className="mt-6 md:mt-0 space-y-4 md:space-y-6">
                <SinglePhotoBanner
                    src="/gallery/IMG_1519-lg.webp"
                    srcSet="
                        /gallery/IMG_1519-sm.webp 640w,
                        /gallery/IMG_1519-md.webp 1280w,
                        /gallery/IMG_1519-lg.webp 2048w,
                        /gallery/IMG_1519-xl.webp 2560w
                    "
                    sizes="(min-width: 1152px) 1120px, calc(100vw - 2rem)"
                    alt="Photography & Design"
                    title="Dolomiti"
                    subtitle="Italy 2026"
                    label="Featured"
                    labelColor="bg-blue-700"
                />

                {/* 2-Card Row: Medium (2 col) + Small (1 col) on desktop, stacked on mobile */}
                <div className="w-full md:aspect-21/9 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <MediumPhotoCard
                        src="/gallery/IMG_9962-3-lg.webp"
                        srcSet="/gallery/IMG_9962-3-sm.webp 640w, /gallery/IMG_9962-3-md.webp 1280w, /gallery/IMG_9962-3-lg.webp 2048w, /gallery/IMG_9962-3-xl.webp 2560w"
                        sizes="(min-width: 1152px) 746px, (min-width: 768px) 66vw, calc(100vw - 2rem)"
                        alt="Photography & Design"
                        title="Air Invictus"
                        subtitle="Porto 2026"
                        label="Latest"
                        labelColor="bg-[#E13735]"
                    />
                    <SmallPhotoCard
                        src="/gallery/IMG_0343-md.webp"
                        srcSet="/gallery/IMG_0343-sm.webp 640w, /gallery/IMG_0343-md.webp 1280w, /gallery/IMG_0343-lg.webp 2048w"
                        sizes="(min-width: 1152px) 373px, (min-width: 768px) 33vw, calc(100vw - 2rem)"
                        alt="Photography & Design"
                        darken={false}
                    />
                </div>

                {/* 3-Card Row: 3 Small cards on desktop, 1 col on mobile, 2 col on tablet */}
                <div className="w-full md:aspect-21/9 relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <SmallPhotoCard
                        src="/gallery/IMG_0387-2-md.webp"
                        srcSet="/gallery/IMG_0387-2-sm.webp 640w, /gallery/IMG_0387-2-md.webp 1280w, /gallery/IMG_0387-2-lg.webp 2048w"
                        sizes="(min-width: 1152px) 373px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, calc(100vw - 2rem)"
                        alt="Photography & Design"
                        darken={false}
                    />
                    <SmallPhotoCard
                        src="/gallery/IMG_0572-2-md.webp"
                        srcSet="/gallery/IMG_0572-2-sm.webp 640w, /gallery/IMG_0572-2-md.webp 1280w, /gallery/IMG_0572-2-lg.webp 2048w"
                        sizes="(min-width: 1152px) 373px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, calc(100vw - 2rem)"
                        alt="Photography & Design"
                        darken={false}
                    />
                    <SmallPhotoCard
                        src="/gallery/IMG_9735-md.webp"
                        srcSet="/gallery/IMG_9735-sm.webp 640w, /gallery/IMG_9735-md.webp 1280w, /gallery/IMG_9735-lg.webp 2048w"
                        sizes="(min-width: 1152px) 373px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, calc(100vw - 2rem)"
                        alt="Photography & Design"
                        darken={false}
                    />
                </div>


                <MultiplePhotoBanner
                    photos={[
                        {
                            src: "/gallery/IMG_1852-md.webp",
                            srcSet: "/gallery/IMG_1852-sm.webp 640w, /gallery/IMG_1852-md.webp 1280w, /gallery/IMG_1852-lg.webp 2048w",
                            sizes: "(min-width: 1152px) 373px, 33vw",
                            alt: "Liguria",
                        },
                        {
                            src: "/gallery/IMG_1766-md.webp",
                            srcSet: "/gallery/IMG_1766-sm.webp 640w, /gallery/IMG_1766-md.webp 1280w, /gallery/IMG_1766-lg.webp 2048w",
                            sizes: "(min-width: 1152px) 373px, 33vw",
                            alt: "Liguria",
                        },
                        {
                            src: "/gallery/IMG_1781-md.webp",
                            srcSet: "/gallery/IMG_1781-sm.webp 640w, /gallery/IMG_1781-md.webp 1280w, /gallery/IMG_1781-lg.webp 2048w",
                            sizes: "(min-width: 1152px) 373px, 33vw",
                            alt: "Liguria",
                        },
                    ]}
                    title="Liguria"
                    subtitle="Italy 2026"
                    label="Favorites"
                />

                <ContactCTA />
            </div>
        </main>
    );
}