import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";
import fs from "fs";


const generateDynamicRoutes = () => {
    const pagesDir = path.resolve(__dirname, "src/pages");
    const files = fs.readdirSync(pagesDir);
    return files
        .filter((file) => file.endsWith(".tsx"))
        .map((file) => `/${file.replace(".tsx", "").toLowerCase()}`);
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        Sitemap({
            hostname: "https://jurgen.fyi",
            generateRobotsTxt: true,
            robots: [{ userAgent: "*", allow: "/" }],
            /*dynamicRoutes: [
                '/projects',
                '/contact',
                '/about',
                '/blog',
            ]*/
                dynamicRoutes: generateDynamicRoutes(),
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
