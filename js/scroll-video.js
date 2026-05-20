/* ═══════════════════════════════════════════════════════
   CASANOVA BEAUTY — scroll-video.js
   Animación scroll frame-a-frame con detección automática:
   • Modo FRAMES: carga imágenes de /Recursos/frames/ (después de extract-frames.js)
   • Modo VIDEO:  fallback si los frames no existen aún
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── CONFIG — actualizar TOTAL_FRAMES después de ejecutar extract-frames.js ──
  var TOTAL_FRAMES = 169;
  var FRAME_BASE   = 'Recursos/frames/frame_';
  var PRELOAD_MIN  = 20; // frames mínimos antes de activar scroll

  // ── DOM ───────────────────────────────────────────────
  var wrapper  = document.getElementById('hero-scroll-wrapper');
  var canvas   = document.getElementById('scroll-canvas');
  var loader   = document.getElementById('heroLoader');
  var navbar   = document.getElementById('navbar');
  var overlays = document.querySelectorAll('.hero-overlay');

  if (!wrapper || !canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var ticking = false;

  // ── CANVAS ────────────────────────────────────────────
  function resizeCanvas() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── COVER DRAW ────────────────────────────────────────
  function drawSource(src) {
    var cw = window.innerWidth;
    var ch = window.innerHeight;
    var iw = src.naturalWidth || src.videoWidth  || 1280;
    var ih = src.naturalHeight || src.videoHeight || 720;
    var imgA = iw / ih;
    var cvA  = cw / ch;
    var dW, dH, dX, dY;

    if (cvA > imgA) {
      dW = cw; dH = cw / imgA; dX = 0; dY = (ch - dH) / 2;
    } else {
      dH = ch; dW = ch * imgA; dX = (cw - dW) / 2; dY = 0;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(src, dX, dY, dW, dH);
  }

  // ── SCROLL PROGRESS ───────────────────────────────────
  function getProgress() {
    var top   = wrapper.offsetTop;
    var h     = wrapper.offsetHeight;
    var sy    = window.scrollY || window.pageYOffset;
    var denom = h - window.innerHeight;
    if (denom <= 0) return 0;
    return Math.max(0, Math.min(1, (sy - top) / denom));
  }

  // ── OVERLAYS & NAVBAR ─────────────────────────────────
  function updateOverlays(progress) {
    var FADE = 0.05;
    overlays.forEach(function (el) {
      var s = parseFloat(el.dataset.start);
      var e = parseFloat(el.dataset.end);
      var opacity = 0;
      if (progress >= s && progress <= e) {
        var fi = Math.min((progress - s) / FADE, 1);
        var fo = Math.min((e - progress) / FADE, 1);
        opacity = Math.min(fi, fo);
      }
      el.style.opacity = opacity;
    });
  }

  function updateNavbar() {
    navbar.classList.toggle('scrolled', (window.scrollY || 0) > 50);
  }

  function frameSrc(i) {
    return FRAME_BASE + String(i + 1).padStart(4, '0') + '.jpg';
  }

  // ══════════════════════════════════════════════════════
  // MODO A — FRAMES desde disco
  // ══════════════════════════════════════════════════════
  var frames       = new Array(TOTAL_FRAMES);
  var framesLoaded = 0;
  var lastFrameIdx = -1;
  var scrollReady  = false;

  function onScrollFrames() {
    if (!scrollReady) return;
    if (!ticking) {
      requestAnimationFrame(function () {
        var p = getProgress();

        // Fórmula del usuario: scrollY/scrollHeight * totalFrames
        var idx = Math.min(
          Math.floor(p * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );

        if (idx !== lastFrameIdx) {
          var img = frames[idx];
          if (img && img.complete && img.naturalWidth > 0) {
            drawSource(img);
            lastFrameIdx = idx;
          }
        }

        updateOverlays(p);
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }

  function startFrameMode(firstFrame) {
    frames[0] = firstFrame;
    framesLoaded = 1;

    // Precarga el resto
    for (var i = 1; i < TOTAL_FRAMES; i++) {
      (function (idx) {
        var img = new Image();
        img.onload = function () {
          framesLoaded++;
          if (!scrollReady && framesLoaded >= PRELOAD_MIN) {
            scrollReady = true;
            loader.classList.add('hidden');
            drawSource(frames[0]);
            lastFrameIdx = 0;
          }
        };
        img.onerror = function () { framesLoaded++; };
        img.src = frameSrc(idx);
        frames[idx] = img;
      })(i);
    }

    // Si PRELOAD_MIN ≤ 1 (o el frame 0 ya es suficiente)
    if (PRELOAD_MIN <= 1) {
      scrollReady = true;
      loader.classList.add('hidden');
      drawSource(frames[0]);
      lastFrameIdx = 0;
    }

    window.addEventListener('scroll', onScrollFrames, { passive: true });
    window.addEventListener('resize', function () {
      resizeCanvas();
      if (lastFrameIdx >= 0 && frames[lastFrameIdx]) drawSource(frames[lastFrameIdx]);
    });
  }

  // ══════════════════════════════════════════════════════
  // MODO B — VIDEO directo (fallback si no hay frames)
  // ══════════════════════════════════════════════════════
  var video       = null;
  var videoReady  = false;
  var isSeeking   = false;
  var pendingProg = null;

  function seekVideo(progress) {
    if (!videoReady || !video.duration) return;
    var target = progress * video.duration;
    if (Math.abs(video.currentTime - target) < 0.016) return;
    if (isSeeking) { pendingProg = progress; return; }
    isSeeking = true;
    video.currentTime = target;
  }

  function onScrollVideo() {
    if (!ticking) {
      requestAnimationFrame(function () {
        var p = getProgress();
        seekVideo(p);
        updateOverlays(p);
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }

  function startVideoMode() {
    video = document.createElement('video');
    video.muted       = true;
    video.preload     = 'auto';
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.style.display = 'none';
    document.body.appendChild(video);

    function onReady() {
      if (videoReady) return;
      videoReady = true;
      loader.classList.add('hidden');
      video.currentTime = 0;
    }

    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay', onReady);
    video.addEventListener('seeked', function () {
      drawSource(video);
      isSeeking = false;
      if (pendingProg !== null) {
        var p = pendingProg;
        pendingProg = null;
        seekVideo(p);
      }
    });
    video.addEventListener('error', function () {
      loader.classList.add('hidden');
      console.warn('[CasanovaBeauty] Video no encontrado. Ejecuta: node extract-frames.js');
    });

    video.src = 'Recursos/' + encodeURIComponent('Video Scroll.mp4');

    window.addEventListener('scroll', onScrollVideo, { passive: true });
    window.addEventListener('resize', function () {
      resizeCanvas();
      if (videoReady) drawSource(video);
    });
  }

  // ── INIT: detecta si existen frames ──────────────────
  function init() {
    resizeCanvas();
    updateOverlays(0);
    updateNavbar();

    // Sondea si frame_0001.jpg existe
    var probe = new Image();

    probe.onload = function () {
      // ✅ Frames encontrados → Modo A
      startFrameMode(probe);
    };

    probe.onerror = function () {
      // ❌ Sin frames → Modo B (video)
      console.info('[CasanovaBeauty] Sin frames en /Recursos/frames/. Usando video directo.');
      console.info('   Para mejor rendimiento ejecuta: node extract-frames.js');
      startVideoMode();
    };

    probe.src = frameSrc(0);

    // Seguro: ocultar loader máximo en 8s
    setTimeout(function () { loader.classList.add('hidden'); }, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
