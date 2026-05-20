/* ═══════════════════════════════════════════════════════
   CASANOVA BEAUTY — cart.js
   Cart drawer · localStorage persistence · Real-time UI
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var STORAGE_KEY = 'casanova_cart';

  // ── STATE ─────────────────────────────────────────────
  var cartState = [];

  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) cartState = JSON.parse(stored);
  } catch (e) { cartState = []; }

  // ── DOM REFS ──────────────────────────────────────────
  var cartDrawer  = document.getElementById('cartDrawer');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartBtn     = document.getElementById('cartBtn');
  var cartClose   = document.getElementById('cartClose');
  var cartItems   = document.getElementById('cartItems');
  var cartEmpty   = document.getElementById('cartEmpty');
  var cartFooter  = document.getElementById('cartFooter');
  var cartCount   = document.getElementById('cartCount');
  var cartSubtotal = document.getElementById('cartSubtotal');

  // ── PERSIST ───────────────────────────────────────────
  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cartState)); } catch (e) {}
  }

  // ── DRAWER OPEN / CLOSE ───────────────────────────────
  function openDrawer() {
    if (window.CasanovaWishlist) window.CasanovaWishlist.close();
    if (window.CasanovaSearch)   window.CasanovaSearch.close();
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // ── FORMAT PRICE ──────────────────────────────────────
  function formatPrice(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  // ── COUNTER BADGE ─────────────────────────────────────
  function updateBadge() {
    var total = cartState.reduce(function(sum, item) { return sum + item.qty; }, 0);
    cartCount.textContent = total;
    if (total > 0) {
      cartCount.classList.add('visible');
    } else {
      cartCount.classList.remove('visible');
    }
  }

  // ── RENDER CART ───────────────────────────────────────
  function renderCart() {
    cartItems.innerHTML = '';

    if (cartState.length === 0) {
      cartEmpty.style.display = 'flex';
      cartFooter.classList.remove('visible');
      updateBadge();
      return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.classList.add('visible');

    var subtotal = 0;

    cartState.forEach(function(item) {
      subtotal += item.price * item.qty;

      var el = document.createElement('div');
      el.className = 'cart-item';
      el.dataset.id = item.id;
      el.innerHTML = [
        '<img class="cart-item-img" src="' + item.img + '" alt="' + item.name + '" loading="lazy">',
        '<div class="cart-item-info">',
          '<span class="cart-item-brand">' + item.brand + '</span>',
          '<p class="cart-item-name">' + item.name + '</p>',
          '<div class="cart-item-controls">',
            '<button class="qty-btn" data-action="dec" data-id="' + item.id + '">&#8722;</button>',
            '<span class="cart-item-qty">' + item.qty + '</span>',
            '<button class="qty-btn" data-action="inc" data-id="' + item.id + '">&#43;</button>',
          '</div>',
          '<button class="cart-item-remove" data-id="' + item.id + '">Eliminar</button>',
        '</div>',
        '<span class="cart-item-price">' + formatPrice(item.price * item.qty) + '</span>'
      ].join('');

      cartItems.appendChild(el);
    });

    cartSubtotal.textContent = formatPrice(subtotal);
    updateBadge();
  }

  // ── ADD TO CART ───────────────────────────────────────
  function addToCart(product) {
    var existing = null;
    for (var i = 0; i < cartState.length; i++) {
      if (cartState[i].id === product.id) { existing = cartState[i]; break; }
    }

    if (existing) {
      existing.qty += 1;
    } else {
      cartState.push({
        id:    product.id,
        name:  product.name,
        brand: product.brand,
        price: product.price,
        img:   product.img,
        qty:   1
      });
    }

    saveCart();
    renderCart();
    openDrawer();
    animateAddButton(product.id);
  }

  function animateAddButton(productId) {
    var btn = document.querySelector('.card-add-btn[data-id="' + productId + '"]');
    if (!btn) return;
    var original = btn.textContent;
    btn.textContent = 'Agregado';
    btn.style.background = 'rgba(196, 154, 138, 0.95)';
    setTimeout(function() {
      btn.textContent = original;
      btn.style.background = '';
    }, 1400);
  }

  // ── REMOVE FROM CART ──────────────────────────────────
  function removeFromCart(id) {
    cartState = cartState.filter(function(item) { return item.id !== id; });
    saveCart();
    renderCart();
  }

  // ── UPDATE QUANTITY ───────────────────────────────────
  function updateQuantity(id, delta) {
    for (var i = 0; i < cartState.length; i++) {
      if (cartState[i].id === id) {
        cartState[i].qty = Math.max(1, cartState[i].qty + delta);
        break;
      }
    }
    saveCart();
    renderCart();
  }

  // ── EVENT DELEGATION ──────────────────────────────────
  cartItems.addEventListener('click', function(e) {
    var target = e.target;
    var id = target.dataset.id;

    if (target.classList.contains('qty-btn')) {
      var delta = target.dataset.action === 'inc' ? 1 : -1;
      updateQuantity(id, delta);
    } else if (target.classList.contains('cart-item-remove')) {
      removeFromCart(id);
    }
  });

  // Global add-to-cart listener (called from filters.js card buttons)
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.card-add-btn');
    if (!btn) return;
    addToCart({
      id:    btn.dataset.id,
      name:  btn.dataset.name,
      brand: btn.dataset.brand,
      price: parseInt(btn.dataset.price, 10),
      img:   btn.dataset.img
    });
  });

  // Drawer controls
  cartBtn.addEventListener('click', function() {
    if (cartDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
  cartClose.addEventListener('click', closeDrawer);
  cartOverlay.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDrawer();
  });

  // ── INIT ─────────────────────────────────────────────
  renderCart();

  // Expose addToCart globally for optional use
  window.CasanovaCart = { add: addToCart, open: openDrawer, close: closeDrawer };

})();
