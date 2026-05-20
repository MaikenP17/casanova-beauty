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

// Limpia frames anteriores
const prevFrames = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg'));
if (prevFrames.length > 0) {
  console.log(`   Eliminando ${prevFrames.length} frames anteriores...`);
  prevFrames.forEach(f => fs.unlinkSync(path.join(framesDir, f)));
}

// Extrae frames: 24fps, máxima calidad visual, resolución nativa
const outputPattern = path.join(framesDir, 'frame_%04d.jpg');
try {
  execSync(`ffmpeg -i "${videoPath}" -vf "fps=24" -q:v 3 "${outputPattern}"`, {
    stdio: 'inherit'
  });
} catch (e) {
  console.error('\n❌ ffmpeg falló. ¿Está instalado y en el PATH del sistema?');
  console.error('   Descarga: https://ffmpeg.org/download.html');
  process.exit(1);
}

const frameCount = fs.readdirSync(framesDir).filter(f => f.endsWith('.jpg')).length;

if (frameCount === 0) {
  console.error('❌ No se generaron frames. Revisa el video o los permisos de carpeta.');
  process.exit(1);
}

console.log(`\n✅ ${frameCount} frames extraídos en Recursos/frames/`);
console.log(`\n📝 SIGUIENTE PASO:`);
console.log(`   Abre js/scroll-video.js y actualiza la constante:`);
console.log(`   var TOTAL_FRAMES = ${frameCount};`);
console.log(`\n   Luego abre index.html en Chrome y la animación funcionará.`);
