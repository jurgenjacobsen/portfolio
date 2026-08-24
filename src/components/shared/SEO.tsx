import { useEffect } from "react";

export interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
    image?: string;
    type?: "website" | "article";
    robots?: string;
}

const SITE_URL = "https://jurgen.fyi";
const DEFAULT_IMAGE = `${SITE_URL}/img/preview.png`;
const DEFAULT_DESCRIPTION =
    "Personal portfolio of Jürgen Jacobsen, Commercial Pilot and Software Engineer. Showcasing software engineering projects, flight experience, and aeronautical cartography.";
const DEFAULT_ROBOTS =
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export default function SEO({
    title,
    description = DEFAULT_DESCRIPTION,
    canonical,
    image = DEFAULT_IMAGE,
    type = "website",
    robots = DEFAULT_ROBOTS,
}: SEOProps) {

    const canonicalUrl = canonical
        ? canonical.startsWith("http")
            ? canonical
            : `${SITE_URL}${canonical.startsWith("/") ? "" : "/"}${canonical}`
        : SITE_URL;

    const imageUrl = image
        ? image.startsWith("http")
            ? image
            : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
        : DEFAULT_IMAGE;

    useEffect(() => {
        document.title = title;

        const setMetaTag = (
            attrName: "name" | "property",
            key: string,
            content: string,
        ) => {
            let el = document.querySelector(`meta[${attrName}="${key}"]`);
            if (!el) {
                const altAttr = attrName === "name" ? "property" : "name";
                el = document.querySelector(`meta[${altAttr}="${key}"]`);
            }
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attrName, key);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        const setLinkTag = (rel: string, href: string) => {
            let el = document.querySelector(`link[rel="${rel}"]`);
            if (!el) {
                el = document.createElement("link");
                el.setAttribute("rel", rel);
                document.head.appendChild(el);
            }
            el.setAttribute("href", href);
        };

        // Primary meta
        setMetaTag("name", "description", description);
        if (robots) {
            setMetaTag("name", "robots", robots);
        }

        // Canonical
        setLinkTag("canonical", canonicalUrl);

        // OpenGraph
        setMetaTag("property", "og:title", title);
        setMetaTag("property", "og:description", description);
        setMetaTag("property", "og:url", canonicalUrl);
        setMetaTag("property", "og:type", type);
        setMetaTag("property", "og:image", imageUrl);

        // Twitter
        setMetaTag("property", "twitter:title", title);
        setMetaTag("property", "twitter:description", description);
        setMetaTag("property", "twitter:url", canonicalUrl);
        setMetaTag("property", "twitter:image", imageUrl);
        setMetaTag("property", "twitter:card", "summary_large_image");
    }, [title, description, canonicalUrl, imageUrl, type, robots]);

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {robots && <meta name="robots" content={robots} />}

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:image" content={imageUrl} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={imageUrl} />
            <meta property="twitter:url" content={canonicalUrl} />
        </>
    );
}
