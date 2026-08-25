import { useEffect, useMemo } from "react";

export interface BreadcrumbItem {
    name: string;
    path: string;
}

export interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
    image?: string;
    type?: "website" | "article";
    robots?: string;
    jsonLd?: Record<string, unknown> | Record<string, unknown>[];
    breadcrumbs?: BreadcrumbItem[];
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
    jsonLd,
    breadcrumbs,
}: SEOProps) {
    const isNoIndex = Boolean(robots && robots.includes("noindex"));

    const canonicalUrl = isNoIndex
        ? undefined
        : canonical
          ? canonical.startsWith("http")
              ? canonical
              : `${SITE_URL}${canonical.startsWith("/") ? "" : "/"}${canonical}`
          : SITE_URL;

    const imageUrl = image
        ? image.startsWith("http")
            ? image
            : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
        : DEFAULT_IMAGE;

    const finalJsonLd = useMemo(() => {
        const schemas: Record<string, unknown>[] = [];

        if (jsonLd) {
            if (Array.isArray(jsonLd)) {
                schemas.push(...jsonLd);
            } else if (
                typeof jsonLd === "object" &&
                "@graph" in jsonLd &&
                Array.isArray(jsonLd["@graph"])
            ) {
                schemas.push(...(jsonLd["@graph"] as Record<string, unknown>[]));
            } else {
                schemas.push(jsonLd);
            }
        }

        if (breadcrumbs && breadcrumbs.length > 0) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbs.map((crumb, idx) => ({
                    "@type": "ListItem",
                    "position": idx + 1,
                    "name": crumb.name,
                    "item": crumb.path.startsWith("http")
                        ? crumb.path
                        : `${SITE_URL}${crumb.path.startsWith("/") ? "" : "/"}${crumb.path}`,
                })),
            });
        }

        if (schemas.length === 0) return undefined;
        if (schemas.length === 1) return schemas[0];
        return {
            "@context": "https://schema.org",
            "@graph": schemas,
        };
    }, [jsonLd, breadcrumbs]);

    useEffect(() => {
        document.title = title;

        const setMetaTag = (
            attrName: "name" | "property",
            key: string,
            content?: string,
        ) => {
            let el = document.querySelector(`meta[${attrName}="${key}"]`);
            if (!el) {
                const altAttr = attrName === "name" ? "property" : "name";
                el = document.querySelector(`meta[${altAttr}="${key}"]`);
            }
            if (!content) {
                if (el) el.remove();
                return;
            }
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attrName, key);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        const setLinkTag = (rel: string, href?: string) => {
            let el = document.querySelector(`link[rel="${rel}"]`);
            if (!href) {
                if (el) el.remove();
                return;
            }
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

        // Canonical (remove if noindex / undefined)
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

        // Dynamic JSON-LD injection
        const jsonLdId = "dynamic-jsonld";
        let scriptEl = document.getElementById(jsonLdId) as HTMLScriptElement | null;
        if (finalJsonLd) {
            if (!scriptEl) {
                scriptEl = document.createElement("script");
                scriptEl.id = jsonLdId;
                scriptEl.type = "application/ld+json";
                document.head.appendChild(scriptEl);
            }
            scriptEl.textContent = JSON.stringify(finalJsonLd);
        } else if (scriptEl) {
            scriptEl.remove();
        }
    }, [title, description, canonicalUrl, imageUrl, type, robots, finalJsonLd]);

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {robots && <meta name="robots" content={robots} />}

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:type" content={type} />
            <meta property="og:image" content={imageUrl} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={imageUrl} />
            {canonicalUrl && <meta property="twitter:url" content={canonicalUrl} />}

            {/* Structured Data (JSON-LD) */}
            {finalJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(finalJsonLd),
                    }}
                />
            )}
        </>
    );
}

