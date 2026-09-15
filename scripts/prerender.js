import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const BASE_URL = "https://jurgen.fyi";
const DEFAULT_IMAGE = `${BASE_URL}/img/preview.png`;
const DIST_DIR = path.join(ROOT_DIR, "dist");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error("Error: dist/index.html does not exist. Run 'vite build' before prerendering.");
    process.exit(1);
}

const templateHtml = fs.readFileSync(TEMPLATE_PATH, "utf-8");

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function injectMetadata(html, { title, description, url, image, type = "website" }) {
    let result = html;
    const escapedTitle = escapeHtml(title);
    const escapedDesc = escapeHtml(description);
    const escapedUrl = escapeHtml(url);
    const escapedImage = escapeHtml(image || DEFAULT_IMAGE);
    const escapedType = escapeHtml(type);

    // Replace Title
    result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);

    // Replace Meta Description
    result = result.replace(
        /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta name="description" content="${escapedDesc}" />`
    );

    // Replace Canonical Link
    result = result.replace(
        /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
        `<link rel="canonical" href="${escapedUrl}" />`
    );

    // Replace OpenGraph Tags
    result = result.replace(
        /<meta\s+property="og:type"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:type" content="${escapedType}" />`
    );
    result = result.replace(
        /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:url" content="${escapedUrl}" />`
    );
    result = result.replace(
        /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:title" content="${escapedTitle}" />`
    );
    result = result.replace(
        /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:description" content="${escapedDesc}" />`
    );
    result = result.replace(
        /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:image" content="${escapedImage}" />`
    );
    result = result.replace(
        /<meta\s+property="og:image:alt"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:image:alt" content="${escapedTitle}" />`
    );

    // Replace Twitter Tags
    result = result.replace(
        /<meta\s+(?:property|name)="twitter:url"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="twitter:url" content="${escapedUrl}" />`
    );
    result = result.replace(
        /<meta\s+(?:property|name)="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="twitter:title" content="${escapedTitle}" />`
    );
    result = result.replace(
        /<meta\s+(?:property|name)="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="twitter:description" content="${escapedDesc}" />`
    );
    result = result.replace(
        /<meta\s+(?:property|name)="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i,
        `<meta property="twitter:image" content="${escapedImage}" />`
    );

    return result;
}

function writeRouteHtml(routePath, metadata) {
    // Clean route path (e.g. "/code/archivum-md" -> "code/archivum-md")
    const cleanPath = routePath.replace(/^\/+/, "").replace(/\/+$/, "");
    const targetDir = path.join(DIST_DIR, cleanPath);
    const targetFile = path.join(targetDir, "index.html");

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const modifiedHtml = injectMetadata(templateHtml, {
        ...metadata,
        url: `${BASE_URL}/${cleanPath}`,
    });

    fs.writeFileSync(targetFile, modifiedHtml);
}

// 1. Static Top-Level Routes
const STATIC_ROUTES = [
    {
        path: "/aviation",
        title: "Commercial Aviation & Flight Experience | Jürgen Jacobsen",
        description:
            "Commercial aviation journey, flight experience, and piloting credentials of Jürgen Jacobsen, licensed commercial pilot with 230+ flight hours across various aircraft types.",
    },
    {
        path: "/code",
        title: "Software Projects & Open Source | Jürgen Jacobsen",
        description:
            "Explore software engineering projects, open-source tools, and applications built with TypeScript, React, Node.js, and more by Jürgen Jacobsen.",
    },
    {
        path: "/guides",
        title: "Knowledge Guides & Reference Manuals | Jürgen Jacobsen",
        description:
            "Curated reference manuals, aviation standard operating procedures, software engineering workflows, and system guides built for clarity and precision.",
    },
    {
        path: "/cv",
        title: "Curriculum Vitae & Career Timeline | Jürgen Jacobsen",
        description:
            "Curriculum Vitae and career timeline of Jürgen Jacobsen. View or download the official resume spanning software engineering and aviation.",
    },
    {
        path: "/photos",
        title: "Photography & Design | Jürgen Jacobsen",
        description:
            "Curated collection of photography and visual design work by Jürgen Jacobsen.",
    },
    {
        path: "/blueprint",
        title: "Blueprint | Jürgen Jacobsen",
        description:
            "Scaffold and synchronize project development configurations, agent guidelines, and templates directly from your terminal.",
    },
    {
        path: "/contact",
        title: "Contact & Inquiries | Jürgen Jacobsen",
        description:
            "Get in touch with Jürgen Jacobsen for software development, aviation consultation, collaborations, or inquiries.",
    },
    {
        path: "/charts",
        title: "Aeronautical Cartography & Procedure Design | Jürgen Jacobsen",
        description:
            "Custom aeronautical cartography, training instrument procedures and SOPs training procedures by Jürgen Jacobsen.",
    },
];

let totalPrerendered = 0;

for (const route of STATIC_ROUTES) {
    writeRouteHtml(route.path, route);
    totalPrerendered++;
}

// 2. Dynamic Project Routes
const projectsIndexPath = path.join(PUBLIC_DIR, "projects", "_.json");
if (fs.existsSync(projectsIndexPath)) {
    try {
        const projects = JSON.parse(fs.readFileSync(projectsIndexPath, "utf-8"));
        if (Array.isArray(projects)) {
            for (const project of projects) {
                if (!project.slug) continue;
                const techSummary = project.tags && project.tags.length > 0
                    ? project.tags.slice(0, 3).join(", ")
                    : "";
                const title = project.title
                    ? techSummary
                        ? `${project.title} - ${techSummary} | Jürgen Jacobsen`
                        : `${project.title} | Jürgen Jacobsen`
                    : "Project Details | Jürgen Jacobsen";
                const description =
                    project.description ||
                    "Project details and source code by Jürgen Jacobsen.";
                const image = project.image
                    ? project.image.startsWith("http")
                        ? project.image
                        : `${BASE_URL}${project.image.startsWith("/") ? "" : "/"}${project.image}`
                    : DEFAULT_IMAGE;

                writeRouteHtml(`/code/${project.slug}`, {
                    title,
                    description,
                    image,
                    type: "article",
                });
                totalPrerendered++;
            }
        }
    } catch (e) {
        console.error("Error prerendering projects:", e);
    }
}

// 3. Dynamic Guide Routes
const guideIndexPath = path.join(PUBLIC_DIR, "guide", "_.json");
if (fs.existsSync(guideIndexPath)) {
    try {
        const guidesData = JSON.parse(fs.readFileSync(guideIndexPath, "utf-8"));
        const guides = guidesData.guides || [];
        for (const guide of guides) {
            if (!guide.slug) continue;
            const title = `${guide.title} | Guides | Jürgen Jacobsen`;
            const description =
                guide.description ||
                "Comprehensive documentation, aviation flight operational procedures, and technical tutorials by Jürgen Jacobsen.";

            writeRouteHtml(`/guides/${guide.slug}`, {
                title,
                description,
                image: DEFAULT_IMAGE,
                type: "article",
            });
            totalPrerendered++;
        }
    } catch (e) {
        console.error("Error prerendering guides:", e);
    }
}

console.log(`Prerender complete! Successfully generated ${totalPrerendered} route HTML files.`);
