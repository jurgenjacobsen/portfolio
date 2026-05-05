import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// 1. Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Go up one level from /scripts to the root, then into /public/projects
const projectsDir = path.join(__dirname, '..', 'public', 'projects');
const outputPath = path.join(projectsDir, 'index.json');

const files = fs.readdirSync(projectsDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const fileContent = fs.readFileSync(path.join(projectsDir, file), 'utf-8');
    const { data } = matter(fileContent);

    return {
      filename: file,
      slug: file.replace('.md', ''),
      ...data
    };
  });

fs.writeFileSync(outputPath, JSON.stringify(files, null, 2));
console.log('Project index with metadata generated!');