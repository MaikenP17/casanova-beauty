/* ═══════════════════════════════════════════════════════
   CASANOVA BEAUTY — filters.js
   Product data · Grid render · Category filtering
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── PRODUCT DATA ──────────────────────────────────────
  var PRODUCTS = [
    {
      id: 1,
      brand: 'RHODE',
      name: 'Peptide Lip Treatment Salted Caramel',
      price: 89000,
      category: 'labios',
      badge: 'Más Vendido',
      image: 'https://images.unsplash.com/photo-1631214524020-3c69b8b2b110?w=600&q=80&fit=crop'
    },
    {
      id: 2,
      brand: 'KIKO MILANO',
      name: 'Unlimited Double Touch',
      price: 65000,
      category: 'labios',
      badge: null,
      image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf0e69?w=600&q=80&fit=crop'
    },
    {
      id: 3,
      brand: 'E.L.F. COSMETICS',
      name: 'Halo Glow Liquid Filter',
      price: 72000,
      category: 'base',
      badge: 'Nuevo',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80&fit=crop'
    },
    {
      id: 4,
      brand: 'CHARLOTTE TILBURY',
      name: 'Pillow Talk Lipstick',
      price: 145000,
      category: 'labios',
      badge: 'Más Vendido',
      image: 'https://images.unsplash.com/photo-1599733594230-6b823276b1e3?w=600&q=80&fit=crop'
    },
    {
      id: 5,
      brand: 'RHODE',
      name: 'Barrier Butter',
      price: 98000,
      category: 'skincare',
      badge: null,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80&fit=crop'
    },
    {
      id: 6,
      brand: 'KIKO MILANO',
      name: 'Smart Fusion Eyeshadow Palette',
      price: 78000,
      category: 'ojos',
      badge: null,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80&fit=crop'
    },
    {
      id: 7,
      brand: 'E.L.F.',
      name: 'Putty Blush Turks & Caicos',
      price: 55000,
      category: 'rostro',
      badge: null,
      image: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80&fit=crop'
    },
    {
      id: 8,
      brand: 'NYX',
      name: 'Soft Matte Lip Cream Monte Carlo',
      price: 48000,
      category: 'labios',
      badge: null,
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80&fit=crop'
    },
    {
      id: 9,
      brand: 'RARE BEAUTY',
      name: 'Soft Pinch Liquid Blush',
      price: 125000,
      category: 'rostro',
      badge: 'Nuevo',
      image: 'https://images.unsplash.com/photo-1614159869003-1b1f2d5b6b7f?w=600&q=80&fit=crop'
    },
    {
      id: 10,
      brand: 'CHARLOTTE TILBURY',
      name: 'Flawless Filter',
      price: 178000,
      category: 'base',
      badge: null,
      image: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&q=80&fit=crop'
    },
    {
      id: 11,
      brand: 'KIKO MILANO',
      name: 'Power Pro Mascara',
      price: 58000,
      category: 'ojos',
      badge: null,
      image: 'https://images.unsplash.com/photo-1583241475880-083f84372725?w=600&q=80&fit=crop'
    },
    {
      id: 12,
      brand: 'E.L.F.',
      name: 'Camo CC Cream SPF 30',
      price: 62000,
      category: 'base',
      badge: null,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80&fit=crop'
    },
    {
      id: 13,
      brand: 'RHODE',
      name: 'Pocket Blush Rosy Afternoon',
      price: 95000,
      category: 'rostro',
      badge: 'Agotándose',
      image: 'https://images.unsplash.com/photo-1597225638840-60b9c7d7f6f5?w=600&q=80&fit=crop'
    },
    {
      id: 14,
      brand: 'NYX',
      name: 'Epic Ink Liner',
      price: 42000,
      category: 'ojos',
      badge: null,
      image: 'https://images.unsplash.com/photo-1631217872822-8f3f43bf01da?w=600&q=80&fit=crop'
    },
    {
      id: 15,
      brand: 'RARE BEAUTY',
      name: 'Kind Words Matte Lipstick',
      price: 118000,
      category: 'labios',
      badge: null,
      image: 'https://images.unsplash.com/photo-1625093950458-f0ab1a6e9e0a?w=600&q=80&fit=crop'
    }
  ];

  // ── FORMAT PRICE ──────────────────────────────────────
  function formatPrice(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  // ── RENDER CARD ───────────────────────────────────────
  function renderCard(product) {
    var badge = product.badge
      ? '<span class="card-badge">' + product.badge + '</span>'
      : '';

    return [
      '<article class="product-card" data-category="' + product.category + '">',
        '<div class="card-img-wrap">',
          '<img',
          ' src="' + product.image + '"',
          ' alt="' + product.name + '"',
          ' loading="lazy"',
          ' width="480"',
          ' height="480"',
          ' crossorigin="anonymous"',
          ' onerror="this.style.display=\'none\';this.parentNode.style.background=\'linear-gradient(135deg,#F2C4C4,#E8D5C4)\'"',
          '>',
          badge,
          '<button class="card-add-btn"',
            ' data-id="'    + product.id    + '"',
            ' data-name="'  + product.name  + '"',
            ' data-brand="' + product.brand + '"',
            ' data-price="' + product.price + '"',
            ' data-img="'   + product.image + '"',
            ' aria-label="Agregar ' + product.name + ' al carrito"',
          '>',
            'Agregar al carrito',
          '</button>',
        '</div>',
        '<div class="card-info">',
          '<span class="card-brand">' + product.brand + '</span>',
          '<h3 class="card-name">' + product.name + '</h3>',
          '<span class="card-price">' + formatPrice(product.price) + '</span>',
        '</div>',
      '</article>'
    ].join('');
  }

  // ── RENDER ALL PRODUCTS ───────────────────────────────
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

  // ── FILTER TAB EVENTS ─────────────────────────────────
  function initFilterTabs() {
    var tabs = document.getElementById('filterTabs');
    if (!tabs) return;

    tabs.addEventListener('click', function (e) {
      var tab = e.target.closest('.filter-tab');
      if (!tab) return;

      tabs.querySelectorAll('.filter-tab').forEach(function (t) {
        t.classList.remove('active');
      });
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
