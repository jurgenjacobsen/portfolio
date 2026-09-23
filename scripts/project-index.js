import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const cacheDir = path.join(rootDir, "public", "cache");
const outputPath = path.join(cacheDir, "projects.json");

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

async function generateIndex() {
    if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Missing Supabase URL or Key in .env");
        process.exit(1);
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        const projects = (data || []).map((p) => ({
            filename: `${p.slug}.md`,
            slug: p.slug,
            title: p.title,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            tags: p.tags || [],
            description: p.description || "",
            highlight: Boolean(p.highlight),
            image: p.image || null,
            github: p.github || null,
            link: p.link || null,
            downloads: p.downloads || { hideUnavailable: false, disableAll: false, hideDownloads: false },
            stars: p.stars || 0,
        }));

        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));
        console.log(`✓ Project index synced from Supabase (${projects.length} projects to public/cache/projects.json)!`);
    } catch (err) {
        console.error("❌ Error syncing projects from Supabase:", err.message);
        process.exit(1);
    }
}

generateIndex();
