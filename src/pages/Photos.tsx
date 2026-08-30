import { SEO } from "@/components/shared";
import { Link } from "react-router-dom";

function PhotoCardButton(props: { to: string, label: string }) {
    return (
        <div className="bg-card rounded-lg group">
            <Link to={props.to} className="
            group inline-flex shrink-0 items-center justify-center rounded-lg font-semibold whitespace-nowrap
            transition-colors px-4 py-1 bg-muted hover:bg-primary/5 border border-border/50 hover:border-primary/25 text-primary text-sm pointer-events-auto">
                { props.label }
            </Link>
        </div>
    )
}

function SinglePhotoBanner(props: { src: string, alt: string, title: string, subtitle: string, label?: string, labelColor?: string, to?: string }) {
    return (
        <div className="w-full aspect-21/9 rounded-xl overflow-hidden relative">
            <img
                src={props.src}
                alt={props.alt}
                className="w-full h-full object-cover"
            />
            <div className="absolute left-0 top-0 w-full h-full p-6 flex flex-col justify-between bg-black/25 pointer-events-none">
                <div className="flex justify-center items-center gap-2">
                    {
                        props.label && (
                            <span className={`rounded-full ${props.labelColor || 'bg-primary'} text-primary-foreground text-xs font-bold px-4 py-1`}>
                                { props.label }
                            </span>
                        )
                    }
                </div>
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <h3 className="text-9xl text-white font-bold leading-normal">
                        { props.title }
                    </h3>
                    <h4 className="text-3xl text-white">
                        { props.subtitle }
                    </h4>
                    {
                        props.to && (
                            <div className="mt-4">
                                <PhotoCardButton to="/photos" label="View More" />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

function MultiplePhotoBanner(props: { photos: string[], alt: string, title: string, subtitle: string, label?: string, labelColor?: string, to?: string }) {
    return (
        <div className="w-full aspect-21/9 rounded-xl overflow-hidden relative">
            <div className="w-full h-full flex">
                {
                    props.photos.map((photo, i) => (
                        <img
                            src={photo}
                            alt={props.alt}
                            className="w-full h-full min-w-0 flex-1 object-cover transition-all duration-500 ease-in-out hover:flex-3"
                            key={i}
                        />
                    ))
                }
            </div>
            <div className="absolute left-0 top-0 w-full h-full p-6 flex flex-col justify-between bg-black/25 pointer-events-none">
                <div className="flex justify-center items-center gap-2">
                    {
                        props.label && (
                            <span className={`rounded-full ${props.labelColor || 'bg-primary'} text-primary-foreground text-xs font-bold px-4 py-1`}>
                                { props.label }
                            </span>
                        )
                    }
                </div>
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <h3 className="text-9xl text-white font-bold leading-normal">
                        { props.title }
                    </h3>
                    <h4 className="text-3xl text-white">
                        { props.subtitle }
                    </h4>
                    {
                        props.to && (
                            <div className="mt-4">
                                <PhotoCardButton to="/photos" label="View More" />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default function Photos() {

    const PHOTO_CAROUSEL = [
        1, 2, 3, 4, 5
    ]

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

            <div className="space-y-6">
                <SinglePhotoBanner src="/img/1237.webp" alt="Photography & Design" title="Dolomiti" subtitle="Italy 2026" label="Featured" labelColor="bg-blue-700"/>

                <MultiplePhotoBanner photos={["/img/IMG_1852.jpg","/img/IMG_1766.jpg", "/img/IMG_1781.jpg", ]} alt="Photography & Design" title="Liguria" subtitle="Italy 2026" label="Favorites"/>

                { false && <><div className="w-full rounded-xl overflow-auto relative grid grid-cols-4 gap-6">
                    <img src={`https://placehold.co/1920x1080/Webp?text=1`} alt="Photography & Design" className="col-span-2 w-full h-full object-cover rounded-xl" />
                    <div className="col-span-2 bg-card rounded-xl border border-border p-6">
                        <h3 className="text-3xl font-bold text-foregroun leading">
                            Photography & Design
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Explore a curated collection of photography and design work, showcasing creativity and visual storytelling. From capturing breathtaking landscapes to creating innovative design concepts, this portfolio reflects a passion for aesthetics and artistic expression.
                        </p>
                    </div>
                </div>
                
                <div className="w-full aspect-21/9 rounded-xl overflow-hidden relative grid grid-cols-4 gap-6">
                    
                    {
                        PHOTO_CAROUSEL.slice(0,4).map((_, i) => (
                            <div key={i} className="w-full h-full relative overflow-hidden rounded-xl aspect-3/4">
                                <img src={`https://placehold.co/1920x1080/Webp?text=${i+1}`} alt="Photography & Design" className="w-full h-full object-cover rounded-xl" />
                                    <div className="absolute left-0 top-0 w-full h-full p-6 flex flex-col justify-end pointer-events-none">

                                        <Link to="/photos" className="
                                            group inline-flex shrink-0 items-center justify-center rounded-lg font-semibold whitespace-nowrap 
                                            transition-colors px-4 py-1 bg-muted hover:bg-muted/50 border border-primary/75 text-foreground text-sm pointer-events-auto">
                                                View More
                                        </Link>
                                </div>
                            </div>
                        ))
                    }
                </div></>
                }
            </div>
        </main>
    )
}