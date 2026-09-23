import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const INPUT_DIR = path.resolve("public/gallery/raw-photos");
const OUTPUT_DIR = path.resolve("public/gallery");

// Desired widths: thumbnail/grid, medium screens, desktop/retina, full 2K/4K/lightbox
const SIZES = [
  { suffix: "-sm", width: 640, quality: 80 },
  { suffix: "-md", width: 1280, quality: 84 },
  { suffix: "-lg", width: 2048, quality: 90 },
  { suffix: "-xl", width: 2560, quality: 92 },
];

async function processPhotos() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const files = await fs.readdir(INPUT_DIR);
  const imageFiles = files.filter((f) =>
    /\.(jpe?g|png|webp|tiff)$/i.test(f)
  );

  if (imageFiles.length === 0) {
    console.log("No images found in photos-raw/");
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to process...\n`);

  // Track expected outputs to clean up orphaned .webp files
  const expectedOutputs = new Set();
  for (const file of imageFiles) {
    const baseName = path.parse(file).name;
    for (const size of SIZES) {
      expectedOutputs.add(`${baseName}${size.suffix}.webp`);
    }
  }

  // Remove stale or orphaned .webp files (e.g. from deleted/renamed raw photos or changed sizes)
  const existingEntries = await fs.readdir(OUTPUT_DIR, { withFileTypes: true });
  for (const entry of existingEntries) {
    if (entry.isFile() && entry.name.endsWith(".webp") && !expectedOutputs.has(entry.name)) {
      await fs.unlink(path.join(OUTPUT_DIR, entry.name));
      console.log(`🗑️  Removed orphaned WebP: ${entry.name}`);
    }
  }

  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = path.parse(file).name;
    const metadata = await sharp(inputPath).rotate().metadata();

    console.log(`Processing: ${file} (${metadata.width}x${metadata.height})`);

    for (const size of SIZES) {
      // Don't upscale if original is smaller than target
      const targetWidth = Math.min(size.width, metadata.width ?? size.width);
      const outputFileName = `${baseName}${size.suffix}.webp`;
      const outputPath = path.join(OUTPUT_DIR, outputFileName);

      await sharp(inputPath)
        .rotate() // Auto-orient based on EXIF tag (critical for phone photos)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: size.quality, effort: 6, smartSubsample: true })
        .toFile(outputPath);

      const stats = await fs.stat(outputPath);
      const kb = (stats.size / 1024).toFixed(1);
      console.log(`  -> ${outputFileName} (${targetWidth}px) [${kb} KB]`);
    }
  }

  console.log("\nFinished generating responsive WebP assets!");
}

processPhotos().catch(console.error);