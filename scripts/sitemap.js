import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const BASE_URL = "https://jurgen.fyi";
const PAGES_DIR = path.join(ROOT_DIR, "src", "pages");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const EXCLUDE_LIST = ["Socials", "index", "subpages", "NotFound", "admin"];

const PAGE_PRIORITIES = {
    aviation: "0.9",
    code: "0.9",
    guides: "0.9",
    cv: "0.8",
    photos: "0.8",
    blueprint: "0.8",
    contact: "0.8",
    charts: "0.6",
};

const isoDate = new Date().toISOString();
const files = fs.readdirSync(PAGES_DIR);

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. Add Home first
xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${isoDate}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;

// 2. Add static top-level pages
files.forEach((file) => {
    const name = path.parse(file).name;
    if (name !== "Home" && !EXCLUDE_LIST.includes(name)) {
        const slug = name.toLowerCase();
        const priority = PAGE_PRIORITIES[slug] || "0.8";
        xml += `  <url>\n    <loc>${BASE_URL}/${slug}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <priority>${priority}</priority>\n  </url>\n`;
    }
});

// 3. Add Project pages from public/projects/_.json
const projectsIndexPath = path.join(PUBLIC_DIR, "projects", "_.json");
if (fs.existsSync(projectsIndexPath)) {
    try {
        const projects = JSON.parse(fs.readFileSync(projectsIndexPath, "utf-8"));
        if (Array.isArray(projects)) {
            projects.forEach((p) => {
                if (!p.slug) return;
                let lastmod = isoDate;
                if (p.updatedAt || p.createdAt) {
                    const d = new Date(p.updatedAt || p.createdAt);
                    if (!isNaN(d.getTime())) {
                        lastmod = d.toISOString();
                    }
                }
                xml += `  <url>\n    <loc>${BASE_URL}/code/${p.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
            });
        }
    } catch (e) {
        console.error("Error reading projects index for sitemap:", e);
    }
}

// 4. Add Guide pages from public/guide/_.json
const guideIndexPath = path.join(PUBLIC_DIR, "guide", "_.json");
if (fs.existsSync(guideIndexPath)) {
    try {
        const guidesData = JSON.parse(fs.readFileSync(guideIndexPath, "utf-8"));
        const guides = guidesData.guides || [];
        guides.forEach((g) => {
            if (!g.slug) return;
            let lastmod = isoDate;
            if (g.updatedAt) {
                const d = new Date(g.updatedAt);
                if (!isNaN(d.getTime())) {
                    lastmod = d.toISOString();
                }
            }
            xml += `  <url>\n    <loc>${BASE_URL}/guides/${g.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
        });
    } catch (e) {
        console.error("Error reading guides index for sitemap:", e);
    }
}

xml += `</urlset>\n`;

// Write to public/sitemap.xml (ensures Vite copies the fresh sitemap to dist/)
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), xml);
console.log("Sitemap successfully written to public/sitemap.xml");

// Also write directly to dist/sitemap.xml if dist exists
if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, "sitemap.xml"), xml);
    console.log("Sitemap successfully written to dist/sitemap.xml");
}
