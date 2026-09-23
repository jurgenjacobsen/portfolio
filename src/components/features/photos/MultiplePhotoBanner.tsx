import PhotoCardButton from "./PhotoCardButton";
import { cn } from "@/lib/utils";

export interface Photo {
    src: string;
    srcSet?: string;
    sizes?: string;
    alt: string;
}

export interface MultiplePhotoBannerProps {
    photos: Photo[];
    title?: string;
    subtitle?: string;
    label?: string;
    labelColor?: string;
    to?: string;
    overlay?: boolean;
    darken?: boolean;
}

export default function MultiplePhotoBanner({
    photos,
    title,
    subtitle,
    label,
    labelColor,
    to,
    overlay = true,
    darken,
}: MultiplePhotoBannerProps) {
    const showOverlay = darken !== undefined ? darken : overlay;
    const hasContent = Boolean(label || title || subtitle || to);

    return (
        <div className="w-full aspect-4/3 sm:aspect-video md:aspect-21/9 rounded-xl overflow-hidden relative">
            <div className="w-full h-full flex">
                {photos.map((photo, i) => (
                    <img
                        src={photo.src}
                        srcSet={photo.srcSet}
                        sizes={photo.sizes || "(min-width: 1152px) 373px, 33vw"}
                        alt={photo.alt}
                        className="w-full h-full min-w-0 flex-1 object-cover"
                        key={i}
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                    />
                ))}
            </div>
            {(showOverlay || hasContent) && (
                <div
                    className={cn(
                        "absolute left-0 top-0 w-full h-full p-4 sm:p-6 md:p-8 flex flex-col justify-between pointer-events-none",
                        showOverlay && "bg-black/35"
                    )}
                >
                    <div className="flex justify-center items-center gap-2">
                        {label && (
                            <span
                                className={`rounded-full ${labelColor || "bg-primary"} text-primary-foreground text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-0.5 sm:py-1 shadow-xs`}
                            >
                                {label}
                            </span>
                        )}
                    </div>
                    {hasContent && (
                        <div className="flex-1 flex flex-col justify-center items-center text-center px-2">
                            {title && (
                                <h3 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white font-bold tracking-tight leading-tight md:leading-normal drop-shadow-md">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <h4 className="text-base sm:text-xl md:text-2xl lg:text-3xl text-white font-medium sm:font-normal mt-1 sm:mt-2 drop-shadow-sm">
                                    {subtitle}
                                </h4>
                            )}
                            {to && (
                                <div className="mt-3 sm:mt-4 md:mt-6">
                                    <PhotoCardButton to={to} label="View More" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
