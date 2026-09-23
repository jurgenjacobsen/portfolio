import PhotoCardButton from "./PhotoCardButton";
import { cn } from "@/lib/utils";

export interface MediumPhotoCardProps {
    src: string;
    srcSet?: string;
    sizes?: string;
    alt: string;
    title?: string;
    subtitle?: string;
    label?: string;
    labelColor?: string;
    to?: string;
    overlay?: boolean;
    darken?: boolean;
}

export default function MediumPhotoCard({
    src,
    srcSet,
    sizes = "(min-width: 1152px) 746px, (min-width: 768px) 66vw, calc(100vw - 2rem)",
    alt,
    title,
    subtitle,
    label,
    labelColor,
    to,
    overlay = true,
    darken,
}: MediumPhotoCardProps) {
    const showOverlay = darken !== undefined ? darken : overlay;
    const hasContent = Boolean(label || title || subtitle || to);

    return (
        <div className="border border-border col-span-1 md:col-span-2 aspect-16/10 sm:aspect-video md:aspect-auto md:h-full rounded-xl overflow-hidden relative">
            <img
                src={src}
                srcSet={srcSet}
                sizes={sizes}
                alt={alt}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
            />
            {(showOverlay || hasContent) && (
                <div
                    className={cn(
                        "absolute left-0 top-0 w-full h-full p-4 sm:p-6 flex flex-col justify-between pointer-events-none",
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
                        <div className="flex-1 flex flex-col justify-center items-center text-center px-1">
                            {title && (
                                <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold leading-tight md:leading-normal drop-shadow-md">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <h4 className="text-sm sm:text-base md:text-xl lg:text-2xl text-white font-medium mt-1 drop-shadow-sm">
                                    {subtitle}
                                </h4>
                            )}
                            {to && (
                                <div className="mt-3 sm:mt-4">
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
