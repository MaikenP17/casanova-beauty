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
  var IMG = 'Recursos/Productos/';

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
      image: IMG + 'peptide-lip-treatment.webp',
      desc: 'El tratamiento de labios más codiciado del momento. Formulado con complejo peptídico, aceite de jojoba y extracto de cereza, hidrata y rellena visiblemente con cada aplicación.',
      benefits: ['Hidratación profunda hasta 12 horas', 'Efecto volumen visible', 'Aroma a caramelo salado', 'Perfecta como base bajo el labial'],
      howTo: 'Aplica directamente desde el envase sobre labios limpios. Reaplica durante el día según necesidad. Ideal sola o bajo cualquier labial.'
    },
    {
      id: '4',
      brand: 'CHARLOTTE TILBURY',
      name: 'Pillow Talk Lipstick',
      price: 145000,
      category: 'labios',
      badge: 'Más Vendido',
      image: IMG + 'pillow-talk-lipstick.webp',
      desc: 'El labial más famoso del mundo beauty. Este rosa nude universalmente favorecedor define los labios con un acabado satinado sedoso y duración de hasta 8 horas.',
      benefits: ['Tono universalmente favorecedor', 'Acabado satinado de alta cobertura', 'Duración de hasta 8 horas', 'Enriquecido con Vitamina E'],
      howTo: 'Aplica desde el centro hacia las comisuras para un acabado perfecto. Para mayor definición, delinea primero con un lápiz labial nude.'
    },
    {
      id: '6',
      brand: 'KIKO MILANO',
      name: 'Smart Fusion Eyeshadow Palette',
      price: 78000,
      category: 'ojos',
      badge: null,
      image: IMG + 'smart-fusion-palette.jpg',
      desc: 'Paleta de sombras altamente pigmentadas con acabados matte, shimmer y satín en perfecta armonía. Diseñada para crear looks de día a noche con una sola paleta.',
      benefits: ['Alta pigmentación en una sola pasada', 'Fórmula de larga duración', 'Acabados matte, shimmer y satín', 'Fácil de difuminar y mezclar'],
      howTo: 'Usa los tonos claros como base, los medios para el pliegue y los oscuros o shimmer para el párpado móvil. Difumina con movimientos circulares.'
    },
    {
      id: '10',
      brand: 'CHARLOTTE TILBURY',
      name: 'Flawless Filter',
      price: 178000,
      category: 'base',
      badge: null,
      image: IMG + 'flawless-filter.webp',
      desc: 'El secreto de Charlotte Tilbury para una piel de porcelana luminosa. Úsalo solo, mezclado con tu base o como toque final para ese glow de "sin maquillaje pero perfecta".',
      benefits: ['Efecto glass skin instantáneo', 'Glow natural y no grasoso', 'Versátil: primer, mezcla o acabado', 'Para todos los tonos de piel'],
      howTo: 'Aplica con los dedos o una esponja sobre el centro del rostro. Mezcla con tu base favorita o aplica en capas ligeras para un glow buildable.'
    },
    {
      id: '9',
      brand: 'RARE BEAUTY',
      name: 'Soft Pinch Liquid Blush',
      price: 125000,
      category: 'rostro',
      badge: 'Nuevo',
      image: IMG + 'soft-pinch-blush.webp',
      desc: 'El rubor líquido que revolucionó las redes. Una sola gota de pigmento intenso crea un rubor fresco y natural que dura todo el día. Creado con amor por Selena Gomez.',
      benefits: ['Ultra-pigmentado: una gota es suficiente', 'Duración todo el día sin retoques', 'Acabado natural y fresco', 'Libre de aceite, apto para pieles mixtas'],
      howTo: 'Aplica una sola gota sobre las mejillas con los dedos y difumina rápidamente con movimientos circulares. Construye intensidad agregando más gotas.'
    },
    {
      id: '5',
      brand: 'RHODE',
      name: 'Barrier Butter',
      price: 98000,
      category: 'skincare',
      badge: null,
      image: IMG + 'barrier-butter.webp',
      desc: 'El ritual de skincare definitivo. Este bálsamo ultrarrico en ceramidas y escualano restaura la barrera cutánea y deja una textura aterciopelada incomparable.',
      benefits: ['Restaura la barrera cutánea', 'Ceramidas + escualano de alta concentración', 'Textura mantequilla que se funde', 'Ideal para labios, cutículas y zonas secas'],
      howTo: 'Aplica una pequeña cantidad sobre el rostro limpio como último paso de tu rutina nocturna. También úsalo en labios y cutículas durante el día.'
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
      '<article class="product-card" data-id="' + p.id + '" data-category="' + p.category + '">',
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
