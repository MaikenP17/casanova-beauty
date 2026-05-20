/* ═══════════════════════════════════════════════════════
   CASANOVA BEAUTY — scroll-video.js
   Animación scroll frame-a-frame — JPG, iOS-safe.
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DEVICE DETECTION ─────────────────────────────────
  var isIOS    = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  var isMobile = isIOS || /Mobi|Android/i.test(navigator.userAgent);

  // ── CONFIG — rutas separadas mobile / desktop ─────────
  // Mobile: frames-mobile/ (640px portrait, 91f) del Video scroll Movil.
  // Desktop: frames/ (1080px landscape, 106f) del Video Scroll original.
  var TOTAL_FRAMES = isMobile ? 91  : 106;
  var FRAME_BASE   = isMobile ? 'Recursos/frames-mobile/frame_' : 'Recursos/frames/frame_';
  var FRAME_EXT    = '.jpg';
  var VIDEO_SRC    = isMobile
    ? 'Recursos/' + encodeURIComponent('Video scroll Movil.mp4')
    : 'Recursos/' + encodeURIComponent('Video Scroll.mp4');

  // DPR=1 en mobile: evita que el canvas cuadruplique memoria en iOS/Android.
  var dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

  // ── DOM ───────────────────────────────────────────────
  var wrapper  = document.getElementById('hero-scroll-wrapper');
  var canvas   = document.getElementById('scroll-canvas');
  var loader   = document.getElementById('heroLoader');
  var navbar   = document.getElementById('navbar');
  var overlays = document.querySelectorAll('.hero-overlay');

  if (!wrapper || !canvas) return;

  var ctx = null;
  try { ctx = canvas.getContext('2d'); } catch (e) {}

  var ticking  = false;
  var modeInit = false;

  function frameSrc(i) {
    return FRAME_BASE + String(i + 1).padStart(4, '0') + FRAME_EXT;
  }

  // ── HIDE LOADER ───────────────────────────────────────
  function hideLoader() {
    if (loader) loader.classList.add('hidden');
  }

  // ── CANVAS RESIZE ────────────────────────────────────
  function resizeCanvas() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── COVER DRAW ────────────────────────────────────────
  function drawSource(src) {
    if (!ctx) return;
    var cw = window.innerWidth;
    var ch = window.innerHeight;
    var iw = src.naturalWidth  || src.videoWidth  || 1080;
    var ih = src.naturalHeight || src.videoHeight || 608;
    if (iw === 0 || ih === 0) return;

    var imgA = iw / ih;
    var cvA  = cw / ch;
    var dW, dH, dX, dY;

    if (cvA > imgA) {
      dW = cw; dH = cw / imgA; dX = 0; dY = (ch - dH) / 2;
    } else {
      dH = ch; dW = ch * imgA; dX = (cw - dW) / 2; dY = 0;
    }

    try {
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(src, dX, dY, dW, dH);
    } catch (e) {}
  }

  // ── SCROLL PROGRESS ───────────────────────────────────
  function getProgress() {
    var top   = wrapper.offsetTop;
    var h     = wrapper.offsetHeight;
    var sy    = window.scrollY || window.pageYOffset || 0;
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
    if (navbar) navbar.classList.toggle('scrolled', (window.scrollY || 0) > 50);
  }

  // ══════════════════════════════════════════════════════
  // MODO A — FRAMES JPG
  // ══════════════════════════════════════════════════════
  var frames       = new Array(TOTAL_FRAMES);
  var framesLoaded = 0;
  var lastFrameIdx = -1;
  var scrollReady  = false;

  function onScrollFrames() {
    if (!scrollReady) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var p   = getProgress();
      var idx = Math.min(Math.floor(p * TOTAL_FRAMES), TOTAL_FRAMES - 1);

      if (idx !== lastFrameIdx) {
        var img = frames[idx];
        if (img && img.complete && img.naturalWidth > 0) {
          drawSource(img);
          lastFrameIdx = idx;
        } else {
          // Busca el frame cargado más cercano hacia atrás y adelante
          for (var d = 1; d < 20; d++) {
            var prev = frames[idx - d];
            if (prev && prev.complete && prev.naturalWidth > 0) { drawSource(prev); break; }
            var next = frames[idx + d];
            if (next && next.complete && next.naturalWidth > 0) { drawSource(next); break; }
          }
        }
      }

      updateOverlays(p);
      updateNavbar();
      ticking = false;
    });
  }

  function startFrameMode(firstFrame) {
    if (modeInit) return;
    modeInit = true;

    frames[0] = firstFrame;
    framesLoaded = 1;

    // Dibuja frame 0 inmediatamente
    resizeCanvas();
    drawSource(firstFrame);
    lastFrameIdx = 0;

    // Activa scroll y oculta loader sin esperar más frames
    scrollReady = true;
    hideLoader();

    // Precarga en bloques — en iOS pausas breves entre lotes evitan saturar memoria
    var BATCH_SIZE = isIOS ? 4 : 15;
    var BATCH_DELAY = isIOS ? 400 : 30;
    var nextIdx = 1;

    function loadNextBatch() {
      var end = Math.min(nextIdx + BATCH_SIZE, TOTAL_FRAMES);
      for (var i = nextIdx; i < end; i++) {
        (function (idx) {
          var img = new Image();
          img.onload  = function () { framesLoaded++; };
          img.onerror = function () { framesLoaded++; };
          img.src = frameSrc(idx);
          frames[idx] = img;
        })(i);
      }
      nextIdx = end;
      if (nextIdx < TOTAL_FRAMES) {
        setTimeout(loadNextBatch, BATCH_DELAY);
      }
    }
    loadNextBatch();

    window.addEventListener('scroll', onScrollFrames, { passive: true });
    window.addEventListener('resize', function () {
      resizeCanvas();
      var cur = frames[lastFrameIdx >= 0 ? lastFrameIdx : 0];
      if (cur && cur.complete && cur.naturalWidth > 0) drawSource(cur);
    });
  }

  // ══════════════════════════════════════════════════════
  // MODO B — VIDEO directo (fallback si no hay frames JPG)
  // ══════════════════════════════════════════════════════
  var video      = null;
  var videoReady = false;
  var isSeeking  = false;
  var pendingProg = null;

  function seekVideo(progress) {
    if (!videoReady || !video.duration) return;
    var target = progress * video.duration;
    if (Math.abs(video.currentTime - target) < 0.02) return;
    if (isSeeking) { pendingProg = progress; return; }
    isSeeking = true;
    video.currentTime = target;
  }

  function onScrollVideo() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var p = getProgress();
      seekVideo(p);
      updateOverlays(p);
      updateNavbar();
      ticking = false;
    });
  }

  function startVideoMode() {
    if (modeInit) return;
    modeInit = true;

    // En iOS el seeking de video sin interacción del usuario no funciona.
    // Mostramos fallback estático en su lugar.
    if (isIOS) {
      showStaticFallback();
      return;
    }

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
      hideLoader();
      video.currentTime = 0;
    }

    video.addEventListener('loadeddata', onReady);
    video.addEventListener('canplay',    onReady);
    video.addEventListener('seeked', function () {
      if (video.readyState >= 2) drawSource(video);
      isSeeking = false;
      if (pendingProg !== null) {
        var p = pendingProg;
        pendingProg = null;
        seekVideo(p);
      }
    });
    video.addEventListener('error', function () {
      hideLoader();
      showStaticFallback();
    });

    video.src = VIDEO_SRC;

    window.addEventListener('scroll', onScrollVideo, { passive: true });
    window.addEventListener('resize', function () {
      resizeCanvas();
      if (videoReady) drawSource(video);
    });
  }

  // ── FALLBACK ESTÁTICO ─────────────────────────────────
  // Si canvas falla completamente o no hay frames ni video,
  // muestra un fondo elegante de marca en lugar de rosado vacío.
  function showStaticFallback() {
    hideLoader();
    var sticky = document.getElementById('hero-sticky');
    if (!sticky) return;
    // Ocultar canvas y mostrar gradiente de marca
    canvas.style.display = 'none';
    sticky.style.background = 'linear-gradient(160deg, #F2C4C4 0%, #E8D5C4 40%, #C49A8A 100%)';
    // Activar overlays con opacidad fija para que se vean los textos
    scrollReady = true;
    updateOverlays(0);
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateOverlays(getProgress());
        updateNavbar();
        ticking = false;
      });
    }, { passive: true });
  }

  // ── INIT ─────────────────────────────────────────────
  function init() {
    resizeCanvas();
    updateOverlays(0);
    updateNavbar();

    // Si el canvas context falló (iOS memoria), ir directo a fallback
    if (!ctx) {
      hideLoader();
      showStaticFallback();
      return;
    }

    // Prueba si frame_0001.jpg existe
    var probe = new Image();

    var probeTimeout = setTimeout(function () {
      // Si frame 0 no cargó en 5s, usar fallback de video
      probe.onload = probe.onerror = null;
      startVideoMode();
    }, 5000);

    probe.onload = function () {
      clearTimeout(probeTimeout);
      // Verificar que la imagen realmente tiene píxeles (bug WebP en iOS)
      if (probe.naturalWidth > 0 && probe.naturalHeight > 0) {
        startFrameMode(probe);
      } else {
        startVideoMode();
      }
    };
    probe.onerror = function () {
      clearTimeout(probeTimeout);
      startVideoMode();
    };
    probe.src = frameSrc(0);

    // Loader oculto máximo en 8s pase lo que pase
    setTimeout(hideLoader, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
