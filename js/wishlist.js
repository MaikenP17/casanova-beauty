/* ═══════════════════════════════════════════════════════
   CASANOVA BEAUTY — wishlist.js
   Favoritos · localStorage · Sidebar drawer
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var STORAGE_KEY = 'casanova_wishlist';

  // ── STATE ─────────────────────────────────────────────
  // Guarda objetos completos {id, name, brand, price, img}
  var wishlistMap = {};

  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      JSON.parse(stored).forEach(function (item) {
        wishlistMap[item.id] = item;
      });
    }
  } catch (e) {}

  // ── DOM ───────────────────────────────────────────────
  var drawer        = document.getElementById('wishlistDrawer');
  var wishlistBtn   = document.getElementById('wishlistBtn');
  var closeBtn      = document.getElementById('wishlistClose');
  var wOverlay      = document.getElementById('wishlistOverlay');
  var itemsEl       = document.getElementById('wishlistItems');
  var emptyEl       = document.getElementById('wishlistEmpty');
  var countBadge    = document.getElementById('wishlistCount');

  if (!drawer) return;

  // ── PERSIST ───────────────────────────────────────────
  function save() {
    try {
      var arr = Object.keys(wishlistMap).map(function (k) { return wishlistMap[k]; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  // ── BADGE ─────────────────────────────────────────────
  function updateBadge() {
    var count = Object.keys(wishlistMap).length;
    if (countBadge) {
      countBadge.textContent = count;
      countBadge.classList.toggle('visible', count > 0);
    }
    // Sincronizar corazones en product grid y en search overlay
    document.querySelectorAll('.card-wish-btn').forEach(function (btn) {
      var active = !!wishlistMap[btn.dataset.id];
      btn.classList.toggle('active', active);
      var svg = btn.querySelector('svg');
      if (svg) {
        svg.style.fill   = active ? '#E85C7A' : 'none';
        svg.style.stroke = active ? '#E85C7A' : 'currentColor';
      }
    });
  }

  // ── FORMAT PRICE ─────────────────────────────────────
  function formatPrice(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  // ── RENDER DRAWER ─────────────────────────────────────
  function render() {
    if (!itemsEl) return;
    itemsEl.innerHTML = '';

    var ids = Object.keys(wishlistMap);
    if (ids.length === 0) {
      if (emptyEl) emptyEl.style.display = 'flex';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    ids.forEach(function (id) {
      var p = wishlistMap[id];
      var el = document.createElement('div');
      el.className = 'wishlist-item';
      el.innerHTML = [
        '<img class="wishlist-item-img" src="' + p.img + '" alt="' + p.name + '" loading="lazy"',
          ' onerror="this.style.display=\'none\';this.parentNode.style.background=\'linear-gradient(135deg,#F2C4C4,#E8D5C4)\'">',
        '<div class="wishlist-item-info">',
          '<div class="wishlist-item-brand">' + p.brand + '</div>',
          '<div class="wishlist-item-name">' + p.name + '</div>',
          '<div class="wishlist-item-price">' + formatPrice(p.price) + '</div>',
          '<div class="wishlist-item-actions">',
            '<button class="wishlist-add-btn card-add-btn"',
              ' data-id="'    + p.id    + '"',
              ' data-name="'  + p.name  + '"',
              ' data-brand="' + p.brand + '"',
              ' data-price="' + p.price + '"',
              ' data-img="'   + p.img   + '"',
            '>Al carrito</button>',
            '<button class="wishlist-remove-btn" data-id="' + p.id + '">Quitar</button>',
          '</div>',
        '</div>'
      ].join('');
      itemsEl.appendChild(el);
    });
  }

  // ── ADD / REMOVE / TOGGLE ────────────────────────────
  function add(product) {
    wishlistMap[product.id] = product;
    save();
    updateBadge();
  }

  function remove(id) {
    delete wishlistMap[id];
    save();
    render();
    updateBadge();
  }

  function toggle(product) {
    if (wishlistMap[product.id]) {
      remove(product.id);
    } else {
      add(product);
    }
  }

  function has(id) {
    return !!wishlistMap[id];
  }

  // ── DRAWER OPEN / CLOSE ───────────────────────────────
  function open() {
    // Cierra el carrito si está abierto
    if (window.CasanovaCart) window.CasanovaCart.close();
    render();
    drawer.classList.add('open');
    if (wOverlay) wOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    drawer.classList.remove('open');
    if (wOverlay) wOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // ── EVENTS ────────────────────────────────────────────
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function () {
      drawer.classList.contains('open') ? close() : open();
    });
  }

  if (closeBtn)  closeBtn.addEventListener('click', close);
  if (wOverlay)  wOverlay.addEventListener('click', close);

  // Quitar del drawer
  if (itemsEl) {
    itemsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.wishlist-remove-btn');
      if (btn) remove(btn.dataset.id);
    });
  }

  // Corazón en product grid / search results (event delegation)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.card-wish-btn');
    if (!btn) return;
    toggle({
      id:    btn.dataset.id,
      name:  btn.dataset.name,
      brand: btn.dataset.brand,
      price: parseInt(btn.dataset.price, 10),
      img:   btn.dataset.img
    });
    // Micro-animación del corazón
    btn.style.transform = 'scale(1.35)';
    setTimeout(function () { btn.style.transform = ''; }, 200);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) close();
  });

  // ── INIT ─────────────────────────────────────────────
  updateBadge();

  // ── API PÚBLICA ───────────────────────────────────────
  window.CasanovaWishlist = { has: has, add: add, remove: remove, toggle: toggle, open: open, close: close };

})();
