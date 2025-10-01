#!/usr/bin/env node
// Batch convert PNG/JPG images in public/images/{cases,timeline} to WebP & AVIF using sharp.
// Usage: node scripts/convert-images.mjs [--quality=80] [--avifQuality=50] [--force]
// Optional flags:
//   --quality=80 (webp quality)
//   --avifQuality=50 (AVIF cq)
//   --force (re-generate even if target exists)

import fs from 'fs';
import path from 'path';
import url from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const roots = [
  path.join(projectRoot, 'public', 'images', 'cases'),
  path.join(projectRoot, 'public', 'images', 'timeline')
];

const existingRoots = roots.filter(r => fs.existsSync(r));
if (!existingRoots.length) {
  console.error('No se encontraron directorios de imágenes. Crea public/images/cases o public/images/timeline.');
  process.exit(1);
}

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const [k,v] = arg.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));

const quality = parseInt(args.quality ?? '78', 10);
const avifQuality = parseInt(args.avifQuality ?? '48', 10);
const force = Boolean(args.force && args.force !== 'false');

const exts = new Set(['.png', '.jpg', '.jpeg']);

async function convertOne(rootDir, relFile) {
  const ext = path.extname(relFile).toLowerCase();
  if (!exts.has(ext)) return;
  const base = relFile.slice(0, -ext.length);
  const webpOut = base + '.webp';
  const avifOut = base + '.avif';

  const inputFull = path.join(rootDir, relFile);
  const webpFull = path.join(rootDir, webpOut);
  const avifFull = path.join(rootDir, avifOut);

  if (!force && fs.existsSync(webpFull) && fs.existsSync(avifFull)) {
    console.log('↷ Skip (ya existen):', relFile);
    return;
  }

  try {
    await Promise.all([
      sharp(inputFull).webp({ quality, effort: 4 }).toFile(webpFull),
      sharp(inputFull).avif({ quality: avifQuality, effort: 4 }).toFile(avifFull)
    ]);
    console.log('✔ Convertido:', relFile, '→ *.webp / *.avif');
  } catch (err) {
    console.error('✖ Error convirtiendo', relFile, err.message);
  }
}

function collectImages(rootDir) {
  const collected = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const rel = path.relative(rootDir, full);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (exts.has(path.extname(entry).toLowerCase())) collected.push(rel);
    }
  }
  walk(rootDir);
  return collected;
}

async function run() {
  let total = 0;
  for (const root of existingRoots) {
    const relRoot = path.relative(projectRoot, root);
    const files = collectImages(root);
    if (!files.length) {
      console.log('No hay imágenes en', relRoot);
      continue;
    }
    console.log(`\n→ Procesando ${files.length} archivo(s) en ${relRoot}`);
    for (const f of files) {
      // eslint-disable-next-line no-await-in-loop
      await convertOne(root, f);
      total++;
    }
  }
  console.log(`\nListo. Procesados ${total} archivo(s). Asegúrate de commitear los nuevos .webp/.avif.`);
  console.log('Ejemplo: node scripts/convert-images.mjs --quality=82 --avifQuality=55 --force');
}

run();
