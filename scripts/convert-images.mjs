#!/usr/bin/env node
// Batch convert PNG/JPG images in public/assets to WebP & AVIF using sharp.
// Usage: node scripts/convert-images.mjs
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
const assetsDir = path.join(projectRoot, 'public', 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('No existe el directorio public/assets. Crea uno y coloca tus imágenes allí.');
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

async function convertOne(file) {
  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext)) return;
  const base = file.slice(0, -ext.length);
  const webpOut = base + '.webp';
  const avifOut = base + '.avif';

  const inputFull = path.join(assetsDir, file);
  const webpFull = path.join(assetsDir, webpOut);
  const avifFull = path.join(assetsDir, avifOut);

  if (!force && fs.existsSync(webpFull) && fs.existsSync(avifFull)) {
    console.log('↷ Skip (ya existen):', file);
    return;
  }

  const img = sharp(inputFull);
  try {
    await Promise.all([
      sharp(inputFull).webp({ quality, effort: 4 }).toFile(webpFull),
      sharp(inputFull).avif({ quality: avifQuality, effort: 4 }).toFile(avifFull)
    ]);
    console.log('✔ Convertido:', file, '→ *.webp / *.avif');
  } catch (err) {
    console.error('✖ Error convirtiendo', file, err.message);
  }
}

async function run() {
  const files = fs.readdirSync(assetsDir).filter(f => exts.has(path.extname(f).toLowerCase()));
  if (!files.length) {
    console.log('No hay imágenes PNG/JPG en public/assets.');
    return;
  }
  console.log('Iniciando conversión de', files.length, 'archivo(s)...');
  for (const f of files) {
    // eslint-disable-next-line no-await-in-loop
    await convertOne(f);
  }
  console.log('\nListo. Asegúrate de commitear los nuevos archivos .webp y .avif.');
  console.log('Ejemplo de uso avanzado: node scripts/convert-images.mjs --quality=82 --avifQuality=55 --force');
}

run();
