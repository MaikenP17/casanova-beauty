/* ═══════════════════════════════════════════════════════
   CASANOVA BEAUTY — quickview.js
   Modal de vista rápida de producto (desktop + mobile)
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var overlay = document.getElementById('qvOverlay');
  var modal   = document.getElementById('qvModal');
  var closeBtn = document.getElementById('qvClose');

  if (!overlay || !modal) return;

  // ── FORMAT PRICE ─────────────────────────────────────
  function formatPrice(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  // ── CATEGORY LABEL ───────────────────────────────────
  var CAT_LABELS = {
    labios: 'Labios', ojos: 'Ojos', base: 'Base',
    rostro: 'Rostro', skincare: 'Skincare'
  };

  // ── POPULATE MODAL ───────────────────────────────────
  function populate(p) {
    document.getElementById('qvImage').src  = p.image;
    document.getElementById('qvImage').alt  = p.name;
    document.getElementById('qvBrand').textContent    = p.brand;
    document.getElementById('qvCategory').textContent = CAT_LABELS[p.category] || p.category;
    document.getElementById('qvName').textContent     = p.name;
    document.getElementById('qvPrice').textContent    = formatPrice(p.price);
    document.getElementById('qvDesc').textContent     = p.desc || '';

    // Benefits list
    var ul = document.getElementById('qvBenefits');
    ul.innerHTML = '';
    if (p.benefits && p.benefits.length) {
      p.benefits.forEach(function (b) {
        var li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
    }

    // How to use
    var howToWrap = document.getElementById('qvHowToWrap');
    var howToText = document.getElementById('qvHowTo');
    if (p.howTo) {
      howToText.textContent = p.howTo;
      howToWrap.style.display = '';
    } else {
      howToWrap.style.display = 'none';
    }

    // Add to cart button
    var addBtn = document.getElementById('qvAddBtn');
    addBtn.dataset.id    = p.id;
    addBtn.dataset.name  = p.name;
    addBtn.dataset.brand = p.brand;
    addBtn.dataset.price = p.price;
    addBtn.dataset.img   = p.image;

    // Wishlist heart sync
    var wishBtn = document.getElementById('qvWishBtn');
    wishBtn.dataset.id    = p.id;
    wishBtn.dataset.name  = p.name;
    wishBtn.dataset.brand = p.brand;
    wishBtn.dataset.price = p.price;
    wishBtn.dataset.img   = p.image;

    var isWished = window.CasanovaWishlist && window.CasanovaWishlist.has(p.id);
    wishBtn.classList.toggle('active', isWished);
    wishBtn.querySelector('.qv-wish-label').textContent = isWished ? 'En favoritos' : 'Guardar';

    // Reset add-btn state
    addBtn.textContent = 'Agregar al carrito';
    addBtn.disabled = false;
  }

  // ── OPEN ─────────────────────────────────────────────
  function open(productId) {
    if (!window.CasanovaProducts) return;
    var p = null;
    for (var i = 0; i < window.CasanovaProducts.length; i++) {
      if (window.CasanovaProducts[i].id === productId) { p = window.CasanovaProducts[i]; break; }
    }
    if (!p) return;

    // Close other panels
    if (window.CasanovaCart)     window.CasanovaCart.close();
    if (window.CasanovaWishlist) window.CasanovaWishlist.close();
    if (window.CasanovaSearch)   window.CasanovaSearch.close();

    populate(p);

    // Reset scroll inside modal
    var body = modal.querySelector('.qv-body');
    if (body) body.scrollTop = 0;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Trap focus in modal
    setTimeout(function () {
      var firstFocusable = modal.querySelector('button, [tabindex]');
      if (firstFocusable) firstFocusable.focus();
    }, 50);
  }

  // ── CLOSE ────────────────────────────────────────────
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── ESC KEY ──────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  // ── CLOSE BUTTON ─────────────────────────────────────
  if (closeBtn) closeBtn.addEventListener('click', close);

  // ── CLICK OUTSIDE MODAL ──────────────────────────────
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  // ── ADD TO CART ──────────────────────────────────────
  var addBtn = document.getElementById('qvAddBtn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      if (window.CasanovaCart) {
        window.CasanovaCart.add({
          id:    addBtn.dataset.id,
          name:  addBtn.dataset.name,
          brand: addBtn.dataset.brand,
          price: Number(addBtn.dataset.price),
          image: addBtn.dataset.img
        });
      }
      addBtn.textContent = '¡Agregado!';
      addBtn.disabled = true;
      setTimeout(function () {
        addBtn.textContent = 'Agregar al carrito';
        addBtn.disabled = false;
      }, 1800);
    });
  }

  // ── WISHLIST TOGGLE ──────────────────────────────────
  var wishBtn = document.getElementById('qvWishBtn');
  if (wishBtn) {
    wishBtn.addEventListener('click', function () {
      if (!window.CasanovaWishlist) return;
      var p = {
        id:    wishBtn.dataset.id,
        name:  wishBtn.dataset.name,
        brand: wishBtn.dataset.brand,
        price: Number(wishBtn.dataset.price),
        image: wishBtn.dataset.img
      };
      window.CasanovaWishlist.toggle(p);
      var isNowWished = window.CasanovaWishlist.has(p.id);
      wishBtn.classList.toggle('active', isNowWished);
      wishBtn.querySelector('.qv-wish-label').textContent = isNowWished ? 'En favoritos' : 'Guardar';
    });
  }

  // ── CARD CLICK DELEGATION ────────────────────────────
  document.addEventListener('click', function (e) {
    // Ignore clicks on action buttons
    if (e.target.closest('.card-add-btn') || e.target.closest('.card-wish-btn')) return;

    var card = e.target.closest('.product-card');
    if (card && card.dataset.id) open(card.dataset.id);
  });

  // ── PUBLIC API ───────────────────────────────────────
  window.CasanovaQuickview = { open: open, close: close };

})();
