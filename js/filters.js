/* ═══════════════════════════════════════════════════════
   CASANOVA BEAUTY — filters.js
   6 productos · Grid render · Filtro · Búsqueda · Favoritos
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── BASE DE IMÁGENES LOCALES ───────────────────────────
  // Todas las imágenes viven en Recursos/productos/
  // Formatos aceptados: .jpg .jpeg .png .webp
  // Nomenclatura: marca-nombre-corto.jpg (minúsculas, guiones)
  var IMG = 'Recursos/productos/';

  // ── 6 PRODUCTOS — 1 por categoría (labios ×2) ─────────
  // Para agregar un producto nuevo: copia el bloque, asigna
  // un id único, pon la imagen en Recursos/productos/ y
  // referénciala en el campo "image".
  var PRODUCTS = [
    {
      id: '1',
      brand: 'RHODE',
      name: 'Peptide Lip Treatment Salted Caramel',
      price: 89000,
      category: 'labios',
      badge: 'Más Vendido',
      image: IMG + 'Peptide Lip Treatment Salted Caramel.webp'
    },
    {
      id: '4',
      brand: 'CHARLOTTE TILBURY',
      name: 'Pillow Talk Lipstick',
      price: 145000,
      category: 'labios',
      badge: 'Más Vendido',
      image: IMG + 'Pillow Talk Lipstick.webp'
    },
    {
      id: '6',
      brand: 'KIKO MILANO',
      name: 'Smart Fusion Eyeshadow Palette',
      price: 78000,
      category: 'ojos',
      badge: null,
      image: IMG + 'Smart Fusion Eyeshadow Palette.jpg'
    },
    {
      id: '10',
      brand: 'CHARLOTTE TILBURY',
      name: 'Flawless Filter',
      price: 178000,
      category: 'base',
      badge: null,
      image: IMG + 'Flawless Filter.webp'
    },
    {
      id: '9',
      brand: 'RARE BEAUTY',
      name: 'Soft Pinch Liquid Blush',
      price: 125000,
      category: 'rostro',
      badge: 'Nuevo',
      image: IMG + 'Soft Pinch Liquid Blush.webp'
    },
    {
      id: '5',
      brand: 'RHODE',
      name: 'Barrier Butter',
      price: 98000,
      category: 'skincare',
      badge: null,
      image: IMG + 'Barrier Butter.webp'
    }
  ];

  // Exponer globalmente para search.js
  window.CasanovaProducts = PRODUCTS;

  // ── FORMAT PRICE ──────────────────────────────────────
  function formatPrice(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  // ── RENDER CARD ───────────────────────────────────────
  function renderCard(p) {
    var badge = p.badge
      ? '<span class="card-badge">' + p.badge + '</span>'
      : '';

    return [
      '<article class="product-card" data-category="' + p.category + '">',
        '<div class="card-img-wrap">',
          '<img',
            ' src="' + p.image + '"',
            ' alt="' + p.name + '"',
            ' loading="lazy"',
            ' width="480" height="480"',
            ' crossorigin="anonymous"',
            ' onerror="this.style.display=\'none\';this.parentNode.style.background=\'linear-gradient(135deg,#F2C4C4,#E8D5C4)\'"',
          '>',
          badge,
          '<button class="card-wish-btn"',
            ' data-id="'    + p.id    + '"',
            ' data-name="'  + p.name  + '"',
            ' data-brand="' + p.brand + '"',
            ' data-price="' + p.price + '"',
            ' data-img="'   + p.image + '"',
            ' aria-label="Agregar a favoritos"',
          '>',
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">',
              '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
            '</svg>',
          '</button>',
          '<button class="card-add-btn"',
            ' data-id="'    + p.id    + '"',
            ' data-name="'  + p.name  + '"',
            ' data-brand="' + p.brand + '"',
            ' data-price="' + p.price + '"',
            ' data-img="'   + p.image + '"',
            ' aria-label="Agregar ' + p.name + ' al carrito"',
          '>Agregar al carrito</button>',
        '</div>',
        '<div class="card-info">',
          '<span class="card-brand">' + p.brand + '</span>',
          '<h3 class="card-name">' + p.name + '</h3>',
          '<span class="card-price">' + formatPrice(p.price) + '</span>',
        '</div>',
      '</article>'
    ].join('');
  }

  // ── RENDER ALL ────────────────────────────────────────
  function renderProducts() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(renderCard).join('');
  }

  // ── FILTER ────────────────────────────────────────────
  function filterProducts(category) {
    document.querySelectorAll('.product-card').forEach(function (card) {
      var match = category === 'todos' || card.dataset.category === category;
      card.classList.toggle('hidden', !match);
    });
  }

  // ── FILTER TABS ───────────────────────────────────────
  function initFilterTabs() {
    var tabs = document.getElementById('filterTabs');
    if (!tabs) return;
    tabs.addEventListener('click', function (e) {
      var tab = e.target.closest('.filter-tab');
      if (!tab) return;
      tabs.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      filterProducts(tab.dataset.filter);
    });
  }

  // ── INIT ─────────────────────────────────────────────
  function init() {
    renderProducts();
    initFilterTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
