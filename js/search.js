/* ═══════════════════════════════════════════════════════
   CASANOVA BEAUTY — search.js
   Búsqueda en tiempo real · Overlay elegante
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var overlay       = document.getElementById('searchOverlay');
  var input         = document.getElementById('searchInput');
  var resultsEl     = document.getElementById('searchResults');
  var noResultsEl   = document.getElementById('searchNoResults');
  var queryDisplay  = document.getElementById('searchQueryDisplay');
  var eyebrow       = document.getElementById('searchEyebrow');
  var searchBtn     = document.getElementById('searchBtn');
  var closeBtn      = document.getElementById('searchClose');

  if (!overlay || !input) return;

  var isOpen = false;
  var debounceTimer = null;

  // ── FORMAT PRICE ──────────────────────────────────────
  function formatPrice(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  // ── RENDER RESULTS ────────────────────────────────────
  function renderResults(query) {
    var products = window.CasanovaProducts || [];
    var q = query.toLowerCase().trim();

    var filtered = q
      ? products.filter(function (p) {
          return (
            p.name.toLowerCase().indexOf(q) !== -1 ||
            p.brand.toLowerCase().indexOf(q) !== -1 ||
            p.category.toLowerCase().indexOf(q) !== -1
          );
        })
      : products;

    resultsEl.innerHTML = '';
    noResultsEl.style.display = 'none';

    if (q) {
      eyebrow.textContent = filtered.length + ' resultado' + (filtered.length !== 1 ? 's' : '');
    } else {
      eyebrow.textContent = 'Colección completa';
    }

    if (filtered.length === 0) {
      if (queryDisplay) queryDisplay.textContent = query;
      noResultsEl.style.display = 'block';
      return;
    }

    filtered.forEach(function (p) {
      var isWished = window.CasanovaWishlist && window.CasanovaWishlist.has(p.id);
      var heartActive = isWished ? ' active' : '';
      var heartFill   = isWished ? '#E85C7A' : 'none';
      var heartStroke = isWished ? '#E85C7A' : 'currentColor';

      var card = document.createElement('div');
      card.className = 'search-result-card';
      card.innerHTML = [
        '<img class="search-result-img" src="' + p.image + '" alt="' + p.name + '" loading="lazy"',
          ' onerror="this.style.display=\'none\';this.parentNode.style.background=\'linear-gradient(135deg,#F2C4C4,#E8D5C4)\'">',
        '<div class="search-result-info">',
          '<div class="search-result-brand">' + p.brand + '</div>',
          '<div class="search-result-name">' + p.name + '</div>',
          '<div class="search-result-price">' + formatPrice(p.price) + '</div>',
        '</div>',
        '<div class="search-result-actions">',
          '<button class="card-wish-btn' + heartActive + '"',
            ' data-id="'    + p.id    + '"',
            ' data-name="'  + p.name  + '"',
            ' data-brand="' + p.brand + '"',
            ' data-price="' + p.price + '"',
            ' data-img="'   + p.image + '"',
            ' aria-label="Favorito">',
            '<svg width="16" height="16" viewBox="0 0 24 24"',
              ' style="fill:' + heartFill + ';stroke:' + heartStroke + '"',
              ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">',
              '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
            '</svg>',
          '</button>',
          '<button class="card-add-btn search-add-btn"',
            ' data-id="'    + p.id    + '"',
            ' data-name="'  + p.name  + '"',
            ' data-brand="' + p.brand + '"',
            ' data-price="' + p.price + '"',
            ' data-img="'   + p.image + '"',
            ' aria-label="Agregar al carrito">',
            'Agregar',
          '</button>',
        '</div>'
      ].join('');

      resultsEl.appendChild(card);
    });
  }

  // ── OPEN / CLOSE ──────────────────────────────────────
  function openSearch() {
    // Cierra carrito y wishlist si están abiertos
    if (window.CasanovaCart)     window.CasanovaCart.close();
    if (window.CasanovaWishlist) window.CasanovaWishlist.close();

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    isOpen = true;
    renderResults('');
    setTimeout(function () { input.focus(); }, 80);
  }

  function closeSearch() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    isOpen = false;
    input.value = '';
  }

  // ── EVENTS ────────────────────────────────────────────
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      isOpen ? closeSearch() : openSearch();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      renderResults(input.value);
    }, 120);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeSearch();
  });

  // Click fuera del panel de búsqueda cierra el overlay
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeSearch();
  });

  window.CasanovaSearch = { open: openSearch, close: closeSearch };

})();
