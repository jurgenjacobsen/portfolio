import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guideDir = path.join(__dirname, "..", "public", "guide");
const outputPath = path.join(guideDir, "_.json");

if (!fs.existsSync(guideDir)) {
    fs.mkdirSync(guideDir, { recursive: true });
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
}

// Load explicit section order configuration if public/guide/sections.json exists
const sectionsConfigPath = path.join(guideDir, "sections.json");
const configuredSectionOrders = {};

if (fs.existsSync(sectionsConfigPath)) {
    try {
        const rawConfig = JSON.parse(
            fs.readFileSync(sectionsConfigPath, "utf-8"),
        );
        if (Array.isArray(rawConfig)) {
            rawConfig.forEach((item, index) => {
                if (typeof item === "string") {
                    configuredSectionOrders[slugify(item)] = index + 1;
                } else if (item && typeof item === "object" && item.id) {
                    configuredSectionOrders[slugify(item.id)] =
                        typeof item.order === "number" ? item.order : index + 1;
                }
            });
        } else if (rawConfig && typeof rawConfig === "object") {
            Object.entries(rawConfig).forEach(([key, val]) => {
                configuredSectionOrders[slugify(key)] =
                    typeof val === "number" ? val : 999;
            });
        }
    } catch (err) {
        console.warn(
            "Warning: Could not parse public/guide/sections.json:",
            err,
        );
    }
}

function formatTitle(str) {
    if (!str) return "";
    return str
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getMarkdownFiles(dir, baseDir = dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getMarkdownFiles(fullPath, baseDir));
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
            const relPath = path
                .relative(baseDir, fullPath)
                .replace(/\\/g, "/");
            files.push({ fullPath, relPath, fileName: entry.name });
        }
    }
    return files;
}

function calculateReadTime(markdownContent) {
    if (!markdownContent) return "1 min read";
    const cleanText = markdownContent
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`.*?`/g, "")
        .replace(/[#*_\-\\[\]()]/g, " ")
        .trim();
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
}

const mdFiles = getMarkdownFiles(guideDir);
const seenSlugs = new Set();
const parsedGuides = [];

for (const { fullPath, relPath, fileName } of mdFiles) {
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(fileContent);

    const pathSegments = relPath.split("/");
    const fallbackSection =
        pathSegments.length > 2 ? pathSegments[0] : "General";
    const fallbackTopic =
        pathSegments.length > 2
            ? pathSegments[1]
            : pathSegments.length > 1
              ? pathSegments[0]
              : "General";

    const defaultSlug = path.parse(fileName).name;
    const slug = data.slug ? String(data.slug).trim() : defaultSlug;

    if (seenSlugs.has(slug)) {
        console.error(
            `Error: Duplicate slug "${slug}" found in ${relPath}. Slugs must be unique.`,
        );
        process.exit(1);
    }
    seenSlugs.add(slug);

    const sectionTitle = data.section || formatTitle(fallbackSection);
    const topicTitle = data.topic || formatTitle(fallbackTopic);
    const title = data.title || formatTitle(defaultSlug);
    const order = typeof data.order === "number" ? data.order : 999;
    const sectionOrder =
        typeof data.sectionOrder === "number"
            ? data.sectionOrder
            : typeof data.section_order === "number"
              ? data.section_order
              : undefined;
    const filePath = `/guide/${relPath}`;

    // 1. Automatize read time if not explicitly provided
    const readTime = data.readTime || calculateReadTime(content);

    // 2. Ensure updatedAt is a precise ISO DateTime string
    let updatedAt = "";
    if (data.updatedAt) {
        const parsed = new Date(data.updatedAt);
        if (!isNaN(parsed.getTime())) {
            updatedAt = parsed.toISOString();
        } else {
            updatedAt = String(data.updatedAt);
        }
    } else {
        try {
            updatedAt = fs.statSync(fullPath).mtime.toISOString();
        } catch {
            updatedAt = new Date().toISOString();
        }
    }

    parsedGuides.push({
        title,
        slug,
        section: sectionTitle,
        sectionId: slugify(sectionTitle),
        sectionOrder,
        topic: topicTitle,
        topicId: slugify(topicTitle),
        order,
        description: data.description || "",
        readTime,
        updatedAt,
        tags: Array.isArray(data.tags) ? data.tags : [],
        filePath,
    });
}

// Group into Sections -> Topics -> Guides
const sectionsMap = new Map();

for (const guide of parsedGuides) {
    const sectionId = guide.sectionId;

    // Determine section order:
    // 1. Explicitly configured in public/guide/sections.json
    // 2. Explicit frontmatter sectionOrder
    // 3. Fallback to guide order or 999
    let secOrder = 999;
    if (configuredSectionOrders[sectionId] !== undefined) {
        secOrder = configuredSectionOrders[sectionId];
    } else if (typeof guide.sectionOrder === "number") {
        secOrder = guide.sectionOrder;
    } else {
        secOrder = guide.order;
    }

    if (!sectionsMap.has(sectionId)) {
        sectionsMap.set(sectionId, {
            id: sectionId,
            title: guide.section,
            order: secOrder,
            topicsMap: new Map(),
        });
    }

    const section = sectionsMap.get(sectionId);
    if (configuredSectionOrders[sectionId] !== undefined) {
        section.order = configuredSectionOrders[sectionId];
    } else if (typeof guide.sectionOrder === "number") {
        section.order = Math.min(section.order, guide.sectionOrder);
    } else {
        section.order = Math.min(section.order, guide.order);
    }

    if (!section.topicsMap.has(guide.topicId)) {
        section.topicsMap.set(guide.topicId, {
            id: guide.topicId,
            title: guide.topic,
            order: guide.order,
            guides: [],
        });
    }

    const topic = section.topicsMap.get(guide.topicId);
    topic.order = Math.min(topic.order, guide.order);
    topic.guides.push(guide);
}

// Convert maps to sorted arrays
const sections = Array.from(sectionsMap.values())
    .map((sec) => {
        const topics = Array.from(sec.topicsMap.values())
            .map((top) => {
                top.guides.sort((a, b) => {
                    if (a.order !== b.order) return a.order - b.order;
                    return a.title.localeCompare(b.title);
                });
                delete top.topicsMap;
                return top;
            })
            .sort((a, b) => {
                if (a.order !== b.order) return a.order - b.order;
                return a.title.localeCompare(b.title);
            });

        return {
            id: sec.id,
            title: sec.title,
            order: sec.order,
            topics,
        };
    })
    .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
    });

const bySlug = {};
for (const guide of parsedGuides) {
    bySlug[guide.slug] = guide;
}

// Flatten guides following the sorted sections & topics hierarchy
const orderedGuides = [];
for (const sec of sections) {
    for (const top of sec.topics) {
        for (const g of top.guides) {
            orderedGuides.push(g);
        }
    }
}

const outputData = {
    sections,
    bySlug,
    guides: orderedGuides,
};

fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
console.log(
    `Guides index generated successfully! Indexed ${parsedGuides.length} guides.`,
);
