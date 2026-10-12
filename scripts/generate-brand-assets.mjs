// Generates favicons, app icons and the default Open Graph image from the logo.
// Run with: npm run brand
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logo = path.join(root, 'src/assets/brand/logo.png');
const ogBackground = path.join(root, 'scripts/source/og-background.jpg');
const publicDir = path.join(root, 'public');

await mkdir(path.join(publicDir, 'og'), { recursive: true });

const trimmed = await sharp(logo).trim({ threshold: 10 }).toBuffer();

async function squareIcon(size, padding, background) {
  const inner = Math.round(size * (1 - padding * 2));
  const icon = await sharp(trimmed)
    .resize(inner, inner, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: icon, gravity: 'center' }])
    .png()
    .toBuffer();
}

const transparent = { r: 255, g: 255, b: 255, alpha: 0 };
const white = { r: 255, g: 255, b: 255, alpha: 1 };

await writeFile(path.join(publicDir, 'favicon-32x32.png'), await squareIcon(32, 0.02, transparent));
await writeFile(path.join(publicDir, 'favicon-16x16.png'), await squareIcon(16, 0, transparent));
await writeFile(path.join(publicDir, 'apple-touch-icon.png'), await squareIcon(180, 0.1, white));
await writeFile(path.join(publicDir, 'icon-192.png'), await squareIcon(192, 0.1, white));
await writeFile(path.join(publicDir, 'icon-512.png'), await squareIcon(512, 0.1, white));
await writeFile(path.join(publicDir, 'icon-maskable-512.png'), await squareIcon(512, 0.2, white));

// Single-image ICO wrapping a 32x32 PNG.
const png32 = await squareIcon(32, 0.02, transparent);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(path.join(publicDir, 'favicon.ico'), Buffer.concat([header, png32]));

// Open Graph image 1200x630.
const ogLogo = await sharp(await squareIcon(150, 0.08, white))
  .composite([
    {
      input: Buffer.from(
        '<svg width="150" height="150"><rect width="150" height="150" rx="20" ry="20"/></svg>',
      ),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer();

const ogText = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <style>
    .brand { font: 700 34px 'Arial Narrow', Arial, sans-serif; fill: #ffffff; letter-spacing: 3px; }
    .title { font: 800 54px Arial, sans-serif; fill: #ffffff; }
    .sub { font: 500 24px Arial, sans-serif; fill: #c9cbe6; }
    .tag { font: 700 22px Arial, sans-serif; fill: #ffffff; letter-spacing: 2px; }
  </style>
  <text x="250" y="122" class="brand">ANTRROW AUTO PARTS</text>
  <rect x="250" y="138" width="80" height="5" fill="#ED1C24"/>
  <text x="70" y="300" class="title">Custom-Machined</text>
  <text x="70" y="368" class="title">Components.</text>
  <text x="70" y="436" class="title" fill="#ED1C24" style="fill:#ED1C24">Built to Your Drawing.</text>
  <text x="70" y="510" class="sub">CNC Turning · Polygon Milling · Centreless Grinding</text>
  <rect x="70" y="552" width="430" height="44" rx="6" fill="#ED1C24"/>
  <text x="90" y="582" class="tag">PADI, CHENNAI · 35 YEARS</text>
</svg>`);

await sharp(ogBackground)
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .composite([
    { input: ogLogo, top: 50, left: 70 },
    { input: ogText, top: 0, left: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(publicDir, 'og/default.jpg'));

console.log('Brand assets generated in /public');
