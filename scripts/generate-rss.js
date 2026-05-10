import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://jurgen.fyi";
const projectsPath = path.join(__dirname, '..', 'public', 'projects', '_.json');
const outputPath = path.join(__dirname, '..', 'public', 'rss.xml');

function generateRSS() {
  try {
    const projectsData = fs.readFileSync(projectsPath, 'utf-8');
    const projects = JSON.parse(projectsData);

    // Sort by date newest first
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const items = projects.map(project => {
      const url = `${BASE_URL}/projects/${project.slug}`;
      const date = new Date(project.createdAt).toUTCString();
      
      return `
    <item>
      <title><![CDATA[${project.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${project.description}]]></description>
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jürgen Jacobsen - Projects</title>
    <link>${BASE_URL}/projects</link>
    <description>Latest projects and blog posts from Jürgen Jacobsen</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

    fs.writeFileSync(outputPath, rss);
    console.log('RSS feed generated successfully at public/rss.xml');
  } catch (error) {
    console.error('Error generating RSS feed:', error);
  }
}

generateRSS();