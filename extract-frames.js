/**
 * extract-frames.js — Casanova Beauty
 * Extrae frames del video de scroll para la animación frame-a-frame.
 *
 * USO: node extract-frames.js
 *
 * REQUISITO: ffmpeg instalado y disponible en PATH.
 *   Descarga: https://ffmpeg.org/download.html
 */

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

const framesDir = path.join(__dirname, 'Recursos', 'frames');
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

// Busca el video con cualquier extensión y cualquier capitalización
const candidates = [
  'Video Scroll.mp4', 'Video Scroll.MP4',
  'Video Scroll.mov', 'Video Scroll.MOV',
  'Video Scroll.webm',
  'video-scroll.mp4', 'videoscroll.mp4',
  'Video_Scroll.mp4',
];

let videoPath = null;
for (const name of candidates) {
  const p = path.join(__dirname, 'Recursos', name);
  if (fs.existsSync(p)) { videoPath = p; break; }
}

// Si no encontró nada con nombre esperado, busca cualquier video en /Recursos/
if (!videoPath) {
  const videoExts = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  const files = fs.readdirSync(path.join(__dirname, 'Recursos'));
  const found = files.find(f => videoExts.includes(path.extname(f).toLowerCase()));
  if (found) videoPath = path.join(__dirname, 'Recursos', found);
}

if (!videoPath) {
  console.error('❌ No se encontró ningún video en /Recursos/');
  console.error('   Verifica que el archivo existe y tiene extensión .mp4, .mov, .webm o .avi');
  process.exit(1);
}

console.log(`✅ Video encontrado: ${path.basename(videoPath)}`);
console.log('⏳ Extrayendo frames... esto puede tomar unos segundos.');

// Limpia frames anteriores (jpg y webp)
const prevFrames = fs.readdirSync(framesDir).filter(f => f.endsWith('.webp') || f.endsWith('.jpg'));
if (prevFrames.length > 0) {
  console.log(`   Eliminando ${prevFrames.length} frames anteriores...`);
  prevFrames.forEach(f => fs.unlinkSync(path.join(framesDir, f)));
}

// Extrae frames: 15fps, WebP calidad 78, 1280px — ~106 frames para 7s de video
const outputPattern = path.join(framesDir, 'frame_%04d.webp');
try {
  execSync(
    `ffmpeg -y -i "${videoPath}" -vf "fps=15,scale=1280:-2" -c:v libwebp -quality 78 -compression_level 4 -lossless 0 "${outputPattern}"`,
    { stdio: 'inherit' }
  );
} catch (e) {
  console.error('\n❌ ffmpeg falló. ¿Está instalado y en el PATH del sistema?');
  console.error('   Descarga: https://ffmpeg.org/download.html');
  process.exit(1);
}

const frameCount = fs.readdirSync(framesDir).filter(f => f.endsWith('.webp')).length;

if (frameCount === 0) {
  console.error('❌ No se generaron frames. Revisa el video o los permisos de carpeta.');
  process.exit(1);
}

console.log(`\n✅ ${frameCount} frames WebP extraídos en Recursos/frames/`);
console.log(`   TOTAL_FRAMES ya está fijado en scroll-video.js — no necesitas cambiarlo.`);
console.log(`\n   Haz push de los frames a Git y Vercel los servirá automáticamente.`);
