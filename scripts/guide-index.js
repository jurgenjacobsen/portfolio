import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const cacheDir = path.join(rootDir, "public", "cache");
const outputPath = path.join(cacheDir, "guides.json");

// Read .env if present
const envPath = path.join(rootDir, ".env");
const env = {};
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
    for (const line of lines) {
        const match = line.match(/^\s*([^#=]+)=(.*)$/);
        if (match) {
            let val = match[2].trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            env[match[1].trim()] = val;
        }
    }
}

const supabaseUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    env.VITE_SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.SUPABASE_SERVICE_ROLE_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function slugify(text) {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
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

function extractHeadings(markdownContent) {
    if (!markdownContent) return [];
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(markdownContent)) !== null) {
        const level = match[1].length;
        const rawText = match[2].trim();
        const cleanText = rawText
            .replace(/`([^`]+)`/g, "$1")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/[*_~]/g, "")
            .trim();
        const id = slugify(cleanText);
        if (cleanText && id) {
            headings.push({ id, text: cleanText, level });
        }
    }
    return headings;
}

function formatTitle(str) {
    if (!str) return "";
    return str
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function generateIndex() {
    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Missing Supabase URL or Key in .env");
        process.exit(1);
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const [sectionsRes, guidesRes] = await Promise.all([
            supabase.from("guide_sections").select("*").order("order_index", { ascending: true }),
            supabase.from("guides").select("*").order("order_index", { ascending: true }),
        ]);

        if (sectionsRes.error) throw sectionsRes.error;
        if (guidesRes.error) throw guidesRes.error;

        const dbSections = sectionsRes.data || [];
        const dbGuides = guidesRes.data || [];

        const bySlug = {};
        const sectionMap = new Map();

        dbSections.forEach((s) => {
            sectionMap.set(s.id, {
                id: s.id,
                title: s.title,
                order: s.order_index ?? 0,
                topics: new Map(),
            });
        });

        const allGuides = [];

        for (const g of dbGuides) {
            const secId = g.section_id || "general";
            let secNode = sectionMap.get(secId);
            if (!secNode) {
                secNode = {
                    id: secId,
                    title: formatTitle(secId),
                    order: 999,
                    topics: new Map(),
                };
                sectionMap.set(secId, secNode);
            }

            const topicName = g.topic || "General";
            if (!secNode.topics.has(topicName)) {
                secNode.topics.set(topicName, []);
            }

            const readTime = calculateReadTime(g.content);
            const headings = extractHeadings(g.content);

            const guideItem = {
                title: g.title,
                slug: g.slug,
                section: secNode.title,
                sectionId: secNode.id,
                topic: topicName,
                topicId: slugify(topicName),
                order: g.order_index ?? 0,
                description: g.description || "",
                tags: g.tags || [],
                updatedAt: g.updated_at || g.created_at || new Date().toISOString(),
                readTime,
                filePath: `/guide/${g.slug}.md`,
                headings,
            };

            secNode.topics.get(topicName).push(guideItem);
            bySlug[g.slug] = guideItem;
            allGuides.push(guideItem);
        }

        const sortedSections = Array.from(sectionMap.values())
            .sort((a, b) => a.order - b.order)
            .map((s) => {
                const sortedTopics = Array.from(s.topics.entries()).map(([tTitle, gList], i) => ({
                    id: slugify(tTitle),
                    title: tTitle,
                    order: i + 1,
                    guides: gList.sort((a, b) => a.order - b.order),
                }));
                return {
                    id: s.id,
                    title: s.title,
                    order: s.order,
                    topics: sortedTopics,
                };
            });

        const finalIndex = {
            sections: sortedSections,
            bySlug,
            guides: allGuides,
        };

        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(finalIndex, null, 2));
        console.log(`✓ Guides index synced from Supabase (${allGuides.length} guides to public/cache/guides.json)!`);
    } catch (err) {
        console.error("❌ Error syncing guides from Supabase:", err.message);
        process.exit(1);
    }
}

generateIndex();
