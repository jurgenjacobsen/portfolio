import fs from "fs";
import path from "path";

const BASE_URL = "https://jurgen.fyi";
const PAGES_DIR = path.join(process.cwd(), "src/pages");
const OUTPUT_DIR = path.join(process.cwd(), "dist");
const EXCLUDE_LIST = ["Socials"]; // Add any others here

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const isoDate = new Date().toISOString();
const files = fs.readdirSync(PAGES_DIR);

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. Add Home first
xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${isoDate}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;

// 2. Add other pages
files.forEach((file) => {
    const name = path.parse(file).name;
    if (name !== "Home" && !EXCLUDE_LIST.includes(name)) {
        const slug = name.toLowerCase();
        xml += `  <url>\n    <loc>${BASE_URL}/${slug}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
    }
});

xml += `</urlset>`;
fs.writeFileSync(path.join(OUTPUT_DIR, "sitemap.xml"), xml);
console.log("Sitemap generated successfully.");
