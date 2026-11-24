// =========================================================================
// C. STATE MANAGEMENT WITH LOCALSTORAGE PERSISTENCE
// =========================================================================
const state = {
  theme: localStorage.getItem('happycart_theme') || 'light',
  pincode: localStorage.getItem('happycart_pincode') || 'Chennai 600001',
  cart: JSON.parse(localStorage.getItem('happycart_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('happycart_wishlist') || '[]'),
  compare: JSON.parse(localStorage.getItem('happycart_compare') || '[]'),
  history: JSON.parse(localStorage.getItem('happycart_history') || '["earbuds-anc","smartwatch-bt","laptop-14-i5","mirrorless-camera","gan-charger-65w","air-fryer-45l"]'),
  appliedCoupon: null,
  activeFilter: 'all',
  searchQuery: '',
  currentSlide: 0
};

function saveState() {
  localStorage.setItem('happycart_theme', state.theme);
  localStorage.setItem('happycart_pincode', state.pincode);
  localStorage.setItem('happycart_cart', JSON.stringify(state.cart));
  localStorage.setItem('happycart_wishlist', JSON.stringify(state.wishlist));
  localStorage.setItem('happycart_compare', JSON.stringify(state.compare));
  localStorage.setItem('happycart_history', JSON.stringify(state.history));
}

function formatINR(num) {
  return '₹' + Number(num).toLocaleString('en-IN');
}

// =========================================================================
// D. THEME INITIALIZATION & TOGGLE
// =========================================================================
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  if (theme === 'dark') {
    icon.textContent = '☀️';
    label.textContent = 'Crisp Light';
  } else {
    icon.textContent = '🌙';
    label.textContent = 'Obsidian Dark';
  }
  saveState();
}

document.getElementById('themeToggle').addEventListener('click', () => {
  applyTheme(state.theme === 'light' ? 'dark' : 'light');
  showToast(`Switched to ${state.theme === 'dark' ? 'Obsidian Neon Dark' : 'Crisp Royal Light'} Mode`);
});

// =========================================================================
// E. HERO CAROUSEL & 3D PERSPECTIVE HOVER TILT
// =========================================================================
const heroTrack = document.getElementById('heroTrack');
const heroDots = document.querySelectorAll('.carousel-dot');
const totalSlides = 4;
let carouselTimer;

function goToSlide(index) {
  state.currentSlide = (index + totalSlides) % totalSlides;
  heroTrack.style.transform = `translateX(-${state.currentSlide * 100}%)`;
  heroDots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === state.currentSlide);
  });
}

function startAutoPlay() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => goToSlide(state.currentSlide + 1), 6500);
}

document.getElementById('heroPrev').addEventListener('click', () => {
  goToSlide(state.currentSlide - 1);
  startAutoPlay();
});

document.getElementById('heroNext').addEventListener('click', () => {
  goToSlide(state.currentSlide + 1);
  startAutoPlay();
});

heroDots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(Number(dot.dataset.slide));
    startAutoPlay();
  });
});

// Subtle 3D tilt on active slide visual
const heroCarousel = document.getElementById('heroCarousel');
heroCarousel.addEventListener('mousemove', (e) => {
  const rect = heroCarousel.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  const activeVisual = heroTrack.children[state.currentSlide]?.querySelector('.hero-visual');
  if (activeVisual) {
    activeVisual.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateZ(12px)`;
  }
});

heroCarousel.addEventListener('mouseleave', () => {
  const activeVisual = heroTrack.children[state.currentSlide]?.querySelector('.hero-visual');
  if (activeVisual) {
    activeVisual.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
  }
});

// =========================================================================
// F. RENDER CATEGORY STRIP & PRODUCT CARDS
// =========================================================================
function renderCategoryStrip() {
  const grid = document.getElementById('categoryGrid');
  const card = (cat, index, isClone = false) => `
    <button class="cat-card" data-cat-index="${index}" ${isClone ? 'tabindex="-1"' : ''} onclick="handleCategoryTileClick('${cat.name}', '${cat.filter}', this)">
      <div class="cat-icon-tile">${cat.svg}</div>
      <span class="cat-label">${cat.name}</span>
    </button>
  `;
  const cards = CATEGORIES.map((cat, index) => card(cat, index)).join('');
  const clonedCards = CATEGORIES.map((cat, index) => card(cat, index, true)).join('');
  grid.innerHTML = `
    <div class="category-track">
      <div class="category-set">${cards}</div>
      <div class="category-set" aria-hidden="true">${clonedCards}</div>
    </div>
  `;
}

function handleCategoryTileClick(name, filter, btnEl) {
  const selectedIndex = btnEl.dataset.catIndex;
  document.querySelectorAll('.cat-card').forEach(c => {
    c.classList.toggle('active', c.dataset.catIndex === selectedIndex);
  });
  setDealFilter(filter);
  scrollToSection('deals');
  showToast(`Browsing ${name}`);
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  let list = [...PRODUCTS];

  if (state.activeFilter === 'under5k') {
    list = ALL_CATALOG.filter(p => p.price < 5000);
  } else if (state.activeFilter === 'wishlist') {
    list = ALL_CATALOG.filter(p => state.wishlist.includes(p.id));
  } else if (state.activeFilter !== 'all') {
    list = ALL_CATALOG.filter(p => p.category === state.activeFilter);
  }

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    list = ALL_CATALOG.filter(p =>
      (activeSearchScope === 'all' || p.category === activeSearchScope) &&
      (
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    );
  }

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
        <p style="font-size: 1.05rem; font-weight: 700; margin-bottom: 8px;">No matching deals found</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Try clearing your filter or searching for another product.</p>
        <button class="btn-hero-primary" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(product => buildProductCardHTML(product)).join('');
}

function buildProductCardHTML(product) {
  const isWished = state.wishlist.includes(product.id);
  const isCompared = state.compare.includes(product.id);
  const cartItem = state.cart.find(item => item.id === product.id);

  return `
    <article class="product-card">
      <div class="product-top-bar">
        <span class="discount-badge">-${product.discount}%</span>
        <div class="card-action-icons">
          <button
            class="compare-btn ${isCompared ? 'active' : ''}"
            onclick="toggleCompare('${product.id}')"
            aria-label="Compare ${product.title}"
            title="${isCompared ? 'Remove from Compare' : 'Add to Compare'}"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line>
              <polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line>
            </svg>
          </button>
          <button
            class="wishlist-btn ${isWished ? 'active' : ''}"
            onclick="toggleWishlist('${product.id}')"
            aria-label="Toggle Wishlist for ${product.title}"
            title="${isWished ? 'Remove from Wishlist' : 'Save to Wishlist'}"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="${isWished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="product-visual-box" onclick="openQuickView('${product.id}')">
        <img src="${product.image}" alt="" loading="lazy" />
        <span class="quick-view-pill">Quick View</span>
      </div>

      <div>
        <div class="product-rating">
          <span class="star-icon">★</span>
          <span>${product.rating}</span>
          <span style="color: var(--text-muted); font-weight: 500;">(${product.reviews})</span>
        </div>
        <h3 class="product-title" onclick="openQuickView('${product.id}')">${product.title}</h3>
        <p class="product-subtitle">${product.subtitle}</p>
      </div>

      <div class="product-bottom">
        <div class="price-block">
          <span class="price-current">${formatINR(product.price)}</span>
          <span class="price-mrp">${formatINR(product.mrp)}</span>
        </div>

        ${cartItem ? `
          <div class="qty-stepper">
            <button onclick="updateCartQty('${product.id}', -1)" aria-label="Decrease quantity">−</button>
            <span>${cartItem.qty}</span>
            <button onclick="updateCartQty('${product.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        ` : `
          <button class="add-cart-btn" onclick="addToCart('${product.id}')" aria-label="Add ${product.title} to Cart" title="Add to Cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        `}
      </div>
    </article>
  `;
}

function renderAllMarketplaceSections() {
  // Fashion Flash Deal
  document.getElementById('fashionCollectionGrid').innerHTML = FASHION_COLLECTIONS.map(c => `
    <div class="collection-card" onclick="showToast('Exploring ${c.name} (${c.offer})')">
      <div class="collection-art">${c.svg}</div>
      <div class="collection-name">${c.name}</div>
      <div class="collection-offer">${c.offer}</div>
    </div>
  `).join('');

  // Tech Wishes Grid
  document.getElementById('techWishesGrid').innerHTML = EXTRA_PRODUCTS
    .filter(p => p.section === 'tech')
    .map(p => buildProductCardHTML(p)).join('');

  // Featured Brands
  const brandsGrid = document.getElementById('brandsGrid');
  if (brandsGrid && !brandsGrid.dataset.marqueeReady) {
    brandsGrid.dataset.marqueeReady = 'true';
    const brandCard = b => `
      <div class="brand-tile" onclick="showToast('Opening ${b.name} Official Brand Store — ${b.offer}')">
        <div class="brand-monogram">${b.logo ? `<img src="${b.logo}" alt="${b.name} logo" loading="lazy" />` : b.mono}</div>
        <div class="brand-tile-title">${b.name}</div>
        <div class="brand-tile-offer">${b.offer}</div>
      </div>
    `;
    const cards = FEATURED_BRANDS.map(brandCard).join('');
    const clonedCards = FEATURED_BRANDS.map(brandCard).join('');
    brandsGrid.innerHTML = `
      <div class="brand-track">
        <div class="brand-set">${cards}</div>
        <div class="brand-set" aria-hidden="true">${clonedCards}</div>
      </div>
    `;
  }

  // Sports & Healthcare
  document.getElementById('sportsCollectionGrid').innerHTML = SPORTS_COLLECTIONS.map(c => `
    <div class="collection-card" onclick="showToast('Exploring ${c.name} (${c.offer})')">
      <div class="collection-art">${c.svg}</div>
      <div class="collection-name">${c.name}</div>
      <div class="collection-offer">${c.offer}</div>
    </div>
  `).join('');

  // 4-Quad Discovery Grid
  document.getElementById('quadGrid').innerHTML = DISCOVERY_QUADS.map(q => {
    const miniItems = q.items.map(id => ALL_CATALOG.find(p => p.id === id)).filter(Boolean);
    return `
      <div class="quad-box">
        <div class="quad-box-header">
          <h3 class="quad-box-title">${q.title}</h3>
        </div>
        <div class="quad-mini-grid">
          ${miniItems.map(item => `
            <div class="quad-mini-item" onclick="openQuickView('${item.id}')">
              <div class="quad-mini-thumb"><img src="${item.image}" alt="" loading="lazy" /></div>
              <div class="quad-mini-label">${item.title}</div>
            </div>
          `).join('')}
        </div>
        <a href="#deals" class="quad-footer-link" onclick="scrollToSection('deals')">${q.cta}</a>
      </div>
    `;
  }).join('');

  // Beauty, Gourmet & Home Care Grid
  document.getElementById('lifestyleGrid').innerHTML = EXTRA_PRODUCTS
    .filter(p => p.section === 'lifestyle')
    .map(p => buildProductCardHTML(p)).join('');

  // Offers Picked For You Coupons
  document.getElementById('couponsGrid').innerHTML = COUPONS_DATA.map(c => `
    <div class="coupon-card">
      <div>
        <div class="coupon-tag">${c.tag}</div>
        <div class="coupon-headline">${c.title}</div>
        <div class="coupon-desc">${c.desc}</div>
      </div>
      <div class="coupon-code-row">
        <span class="coupon-code-text">${c.code}</span>
        <button class="copy-code-btn" onclick="copyCouponCode('${c.code}', ${c.discount})">Copy Code</button>
      </div>
    </div>
  `).join('');

  // Hot Tags Cloud
  document.getElementById('hotTagsCloud').innerHTML = HOT_TAGS.map(tag => `
    <button class="hot-tag-pill" onclick="quickSearch('${tag.split(' ')[0]}')">${tag}</button>
  `).join('');

  renderBrowsingHistory();
}

function renderBrowsingHistory() {
  const container = document.getElementById('browsingHistoryGrid');
  const items = state.history.map(id => ALL_CATALOG.find(p => p.id === id)).filter(Boolean);
  if (items.length === 0) {
    container.innerHTML = `<p style="grid-column: 1 / -1; font-size: 0.84rem; color: var(--text-muted); padding: 16px; background: var(--bg-surface); border-radius: var(--radius-md);">Click Quick View on any product to build your personal browsing history.</p>`;
    return;
  }
  container.innerHTML = items.slice(0, 6).map(item => `
    <div class="history-card" onclick="openQuickView('${item.id}')">
      <div class="history-thumb"><img src="${item.image}" alt="" loading="lazy" /></div>
      <div style="font-size: 0.8rem; font-weight: 700; margin-bottom: 2px;">${item.title}</div>
      <div style="font-size: 0.82rem; font-weight: 800; color: var(--brand-primary);">${formatINR(item.price)}</div>
    </div>
  `).join('');
}

function clearBrowsingHistory() {
  state.history = [];
  saveState();
  renderBrowsingHistory();
  showToast('Browsing history cleared');
}

function quickSearch(term) {
  const input = document.getElementById('searchInput');
  input.value = term;
  state.searchQuery = term;
  document.getElementById('searchClearBtn').classList.add('visible');
  renderProducts();
  scrollToSection('deals');
  showToast(`Filtered results for "${term}"`);
}

function copyCouponCode(code, discountAmt) {
  const tempInput = document.createElement('input');
  tempInput.value = code;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);

  state.appliedCoupon = { code, discount: discountAmt };
  renderCartDrawer();
  showToast(`🎟️ Copied & applied coupon "${code}" (-${formatINR(discountAmt)})!`);
}

function applyCartCoupon() {
  const code = document.getElementById('cartCouponInput').value.trim().toUpperCase();
  const found = COUPONS_DATA.find(c => c.code === code);
  if (found) {
    state.appliedCoupon = { code: found.code, discount: found.discount };
    renderCartDrawer();
    showToast(`✅ Coupon "${found.code}" applied!`);
  } else if (code === 'WELCOME100') {
    state.appliedCoupon = { code: 'WELCOME100', discount: 100 };
    renderCartDrawer();
    showToast('✅ Newsletter coupon "WELCOME100" applied!');
  } else {
    showToast('Invalid promo code. Try HAPPY500, BANK10, or FIRST100.');
  }
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value.trim();
  if (email) {
    state.appliedCoupon = { code: 'WELCOME100', discount: 100 };
    renderCartDrawer();
    document.getElementById('newsletterEmail').value = '';
    showToast('🎉 Subscribed! Coupon "WELCOME100" (₹100 Off) unlocked & applied to your cart.');
  }
}

function setDealFilter(filter, tabBtn) {
  state.activeFilter = filter;
  if (tabBtn) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    if (tabBtn.classList.contains('filter-tab')) tabBtn.classList.add('active');
  } else {
    document.querySelectorAll('.filter-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.filter === filter);
    });
  }
  renderProducts();
}

function filterByWishlist() {
  if (state.wishlist.length === 0) {
    showToast('Your wishlist is empty. Click the heart icon on any deal to save it!');
    return;
  }
  setDealFilter('wishlist');
  scrollToSection('deals');
  showToast(`Showing ${state.wishlist.length} saved item(s) in your Wishlist`);
}

function resetFilters() {
  state.activeFilter = 'all';
  state.searchQuery = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClearBtn').classList.remove('visible');
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
  setSearchScope('all');
  setDealFilter('all');
}

// =========================================================================
// G. CART & WISHLIST LOGIC + LIVE FREE DELIVERY PROGRESS BAR
// =========================================================================
function addToCart(productId) {
  const product = ALL_CATALOG.find(p => p.id === productId);
  if (!product) return;

  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...product, qty: 1 });
  }
  saveState();
  syncBadges();
  renderProducts();
  renderAllMarketplaceSections();
  renderCartDrawer();
  bumpBadge('cartBadge');
  showToast(`Added "${product.title}" to your cart`);
}

function addSpecialHeroItem(key) {
  const special = HERO_SPECIAL_ITEMS[key];
  if (!special) return;
  const existing = state.cart.find(item => item.id === special.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...special, qty: 1 });
  }
  saveState();
  syncBadges();
  renderCartDrawer();
  openCartDrawer();
  showToast(`Added ${special.title} to your cart!`);
}

function updateCartQty(productId, delta) {
  const idx = state.cart.findIndex(item => item.id === productId);
  if (idx === -1) return;

  state.cart[idx].qty += delta;
  if (state.cart[idx].qty <= 0) {
    state.cart.splice(idx, 1);
  }
  saveState();
  syncBadges();
  renderProducts();
  renderAllMarketplaceSections();
  renderCartDrawer();
}

function toggleWishlist(productId) {
  const idx = state.wishlist.indexOf(productId);
  const product = ALL_CATALOG.find(p => p.id === productId);
  if (!product) return;
  if (idx === -1) {
    state.wishlist.push(productId);
    showToast(`Saved "${product.title}" to Wishlist`);
  } else {
    state.wishlist.splice(idx, 1);
    showToast(`Removed "${product.title}" from Wishlist`);
  }
  saveState();
  syncBadges();
  renderProducts();
  renderAllMarketplaceSections();
  bumpBadge('wishlistBadge');
}

function toggleCompare(productId) {
  const idx = state.compare.indexOf(productId);
  const product = ALL_CATALOG.find(p => p.id === productId);
  if (!product) return;
  if (idx === -1) {
    if (state.compare.length >= 3) {
      showToast('You can compare up to 3 products at once. Opening Compare view...');
      openCompareModal();
      return;
    }
    state.compare.push(productId);
    showToast(`Added "${product.title}" to Compare (${state.compare.length}/3)`);
  } else {
    state.compare.splice(idx, 1);
    showToast(`Removed "${product.title}" from Compare`);
  }
  saveState();
  syncBadges();
  renderProducts();
  renderAllMarketplaceSections();
}

function openCompareModal() {
  closeAllOverlays();
  const items = state.compare.map(id => ALL_CATALOG.find(p => p.id === id)).filter(Boolean);
  const content = document.getElementById('compareContent');

  if (items.length === 0) {
    content.innerHTML = `<p style="font-size: 0.88rem; color: var(--text-muted); padding: 20px 0;">Click the compare arrows (⇄) on up to 3 product cards to compare prices, ratings &amp; specs side by side.</p>`;
  } else {
    content.innerHTML = `
      <div class="compare-grid">
        ${items.map(p => `
          <div class="compare-col">
            <div style="height: 90px; display: grid; place-items: center; margin-bottom: 8px;"><img src="${p.image}" alt="" /></div>
            <div style="font-weight: 800; font-size: 0.92rem; margin-bottom: 4px;">${p.title}</div>
            <div style="color: var(--brand-primary); font-weight: 800; font-size: 1.05rem; margin-bottom: 4px;">${formatINR(p.price)}</div>
            <div style="font-size: 0.78rem; color: var(--warning); font-weight: 700; margin-bottom: 8px;">★ ${p.rating} (${p.reviews})</div>
            <div style="font-size: 0.76rem; color: var(--text-secondary); margin-bottom: 12px;">${p.highlights[0]}</div>
            <div style="display: flex; gap: 6px; justify-content: center;">
              <button class="copy-code-btn" onclick="addToCart('${p.id}'); closeAllOverlays();">Add to Cart</button>
              <button class="preset-chip" style="padding: 4px 8px;" onclick="toggleCompare('${p.id}'); openCompareModal();">Remove</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  backdrop.classList.add('open');
  document.getElementById('compareModal').classList.add('open');
}

function syncBadges() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartBadge').textContent = totalItems;
  document.getElementById('drawerCartCount').textContent = totalItems;
  document.getElementById('wishlistBadge').textContent = state.wishlist.length;
  document.getElementById('popoverWishCount').textContent = state.wishlist.length;
  document.getElementById('compareTopCount').textContent = state.compare.length;
}

function bumpBadge(id) {
  const el = document.getElementById(id);
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 240);
}

function renderCartDrawer() {
  const container = document.getElementById('cartItemsContainer');
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const freeThreshold = 499;
  const progressPct = Math.min(100, (subtotal / freeThreshold) * 100);

  const progressText = document.getElementById('deliveryProgressText');
  const progressFill = document.getElementById('deliveryProgressFill');
  progressFill.style.width = `${progressPct}%`;

  if (subtotal >= freeThreshold) {
    progressText.innerHTML = `🎉 <strong>Congrats!</strong> Your order qualifies for <strong>FREE Express Delivery</strong> to ${state.pincode}`;
  } else {
    const diff = freeThreshold - subtotal;
    progressText.innerHTML = `Add <strong>${formatINR(diff)}</strong> more to unlock <strong>FREE Delivery</strong>!`;
  }

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
        <div style="font-size: 2.6rem; margin-bottom: 10px;">🛍️</div>
            <p style="font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Your cart is empty</p>
        <p style="font-size: 0.82rem; margin-bottom: 18px;">Explore Today's Deals to add electronics, wearables &amp; gadgets.</p>
        <button class="btn-hero-primary" onclick="closeAllOverlays(); scrollToSection('deals')">Explore Deals</button>
      </div>
    `;
  } else {
    container.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.image ? `<img src="${item.image}" alt="" />` : (item.svg || '')}</div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.title}</div>
          <div style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 4px;">${item.subtitle}</div>
          <div class="cart-item-price">${formatINR(item.price * item.qty)}</div>
        </div>
        <div class="qty-stepper">
          <button onclick="updateCartQty('${item.id}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join('');
  }

  const deliveryFee = subtotal === 0 || subtotal >= freeThreshold ? 0 : 49;
  const couponRow = document.getElementById('couponDiscountRow');
  let couponSavings = 0;

  if (state.appliedCoupon && subtotal > 0) {
    couponSavings = Math.min(subtotal, state.appliedCoupon.discount);
    couponRow.style.display = 'flex';
    document.getElementById('appliedCouponName').textContent = state.appliedCoupon.code;
    document.getElementById('cartCouponDiscount').textContent = '-' + formatINR(couponSavings);
  } else {
    couponRow.style.display = 'none';
  }

  document.getElementById('cartSubtotal').textContent = formatINR(subtotal);
  document.getElementById('cartDeliveryFee').textContent = deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee);
  document.getElementById('cartTotal').textContent = formatINR(Math.max(0, subtotal - couponSavings + deliveryFee));
}

function handleCheckout() {
  if (state.cart.length === 0) {
    showToast('Add at least one item to proceed to checkout.');
    return;
  }
  const total = document.getElementById('cartTotal').textContent;
  state.cart = [];
  saveState();
  syncBadges();
  renderProducts();
  renderCartDrawer();
  closeAllOverlays();
  showToast(`✅ Order confirmed (${total})! Delivering soon to ${state.pincode}.`);
}

// =========================================================================
// H. LIVE SEARCH AUTOCOMPLETE
// =========================================================================
const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
const searchClearBtn = document.getElementById('searchClearBtn');
const searchScope = document.getElementById('searchScope');
const searchScopeBtn = document.getElementById('searchScopeBtn');
const searchScopeLabel = document.getElementById('searchScopeLabel');
const searchScopeMenu = document.getElementById('searchScopeMenu');

const SEARCH_SCOPES = [
  { value: 'all', label: 'All Categories', short: 'All', icon: '🛍️' },
  { value: 'Audio & Wearables', label: 'Audio & Wearables', short: 'Audio', icon: '🎧' },
  { value: 'Computing', label: 'Computing', short: 'Computing', icon: '💻' },
  { value: 'Cameras', label: 'Cameras', short: 'Cameras', icon: '📷' },
  { value: 'Gaming', label: 'Gaming', short: 'Gaming', icon: '🎮' },
  { value: 'Power & Tech', label: 'Power & Tech', short: 'Power', icon: '⚡' },
  { value: 'Smart Home', label: 'Smart Home', short: 'Smart Home', icon: '🏠' },
  { value: 'Home & Kitchen', label: 'Home & Kitchen', short: 'Kitchen', icon: '🍳' },
  { value: 'Beauty', label: 'Beauty', short: 'Beauty', icon: '✨' }
];

let activeSearchScope = 'all';

function getSearchScopeConfig(value = activeSearchScope) {
  return SEARCH_SCOPES.find(scope => scope.value === value) || SEARCH_SCOPES[0];
}

function renderSearchScopeMenu() {
  const options = SEARCH_SCOPES.map(scope => {
    const count = scope.value === 'all'
      ? ALL_CATALOG.length
      : ALL_CATALOG.filter(p => p.category === scope.value).length;
    const isActive = scope.value === activeSearchScope;
    return `
      <button type="button" class="scope-option ${isActive ? 'active' : ''}" role="option" aria-selected="${isActive}" data-scope="${scope.value}" tabindex="-1">
        <span class="scope-option-icon" aria-hidden="true">${scope.icon}</span>
        <span class="scope-option-text">
          <span class="scope-option-label">${scope.label}</span>
          <span class="scope-option-meta">${count} product${count === 1 ? '' : 's'}</span>
        </span>
        <span class="scope-option-check" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </span>
      </button>
    `;
  }).join('');

  searchScopeMenu.innerHTML = `
    <div class="scope-menu-head">
      <span class="scope-menu-eyebrow">Search in</span>
      <span class="scope-menu-sub">Pick a category to narrow your results</span>
    </div>
    <div class="scope-menu-grid">${options}</div>
  `;
}

function openSearchScopeMenu(focusFirst = false) {
  renderSearchScopeMenu();
  searchScope.classList.add('open');
  searchScopeMenu.classList.add('open');
  searchScopeBtn.setAttribute('aria-expanded', 'true');
  document.getElementById('accountPopover').classList.remove('open');
  document.getElementById('megaMenu').classList.remove('open');
  searchDropdown.classList.remove('open');
  if (focusFirst) {
    const target = searchScopeMenu.querySelector('.scope-option.active') || searchScopeMenu.querySelector('.scope-option');
    if (target) target.focus();
  }
}

function closeSearchScopeMenu() {
  searchScope.classList.remove('open');
  searchScopeMenu.classList.remove('open');
  searchScopeBtn.setAttribute('aria-expanded', 'false');
}

function setSearchScope(value) {
  activeSearchScope = value;
  const scope = getSearchScopeConfig(value);
  searchScopeLabel.textContent = scope.short;
  searchScopeBtn.setAttribute('aria-label', `Search in ${scope.label}`);
  searchInput.placeholder = value === 'all'
    ? 'Search products, brands & more...'
    : `Search in ${scope.label}...`;
  closeSearchScopeMenu();
  if (searchInput.value.trim()) {
    renderSearchDropdown(searchInput.value);
    renderProducts();
  }
}

function initSearchScope() {
  if (searchScope.dataset.ready === 'true') return;
  searchScope.dataset.ready = 'true';

  renderSearchScopeMenu();
  setSearchScope(activeSearchScope);

  searchScopeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (searchScope.classList.contains('open')) {
      closeSearchScopeMenu();
    } else {
      openSearchScopeMenu();
    }
  });

  searchScopeBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSearchScopeMenu();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openSearchScopeMenu(true);
    }
  });

  searchScopeMenu.addEventListener('click', (event) => {
    const option = event.target.closest('.scope-option');
    if (!option) return;
    setSearchScope(option.dataset.scope);
    searchInput.focus();
  });

  searchScopeMenu.addEventListener('keydown', (event) => {
    const options = Array.from(searchScopeMenu.querySelectorAll('.scope-option'));
    const currentIndex = options.indexOf(document.activeElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      closeSearchScopeMenu();
      searchScopeBtn.focus();
      return;
    }
    if (event.key === 'Tab') {
      closeSearchScopeMenu();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      let nextIndex = currentIndex;
      if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1 + options.length) % options.length;
      if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + options.length) % options.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = options.length - 1;
      options[nextIndex].focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-scope')) closeSearchScopeMenu();
  });

  document.addEventListener('focusin', (event) => {
    if (!event.target.closest('.search-scope')) closeSearchScopeMenu();
  });
}

searchInput.addEventListener('input', (e) => {
  const val = e.target.value;
  state.searchQuery = val;
  searchClearBtn.classList.toggle('visible', val.length > 0);
  renderSearchDropdown(val);
  renderProducts();
});

searchInput.addEventListener('focus', () => {
  if (searchInput.value.trim().length > 0) {
    renderSearchDropdown(searchInput.value);
  }
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeSearchScopeMenu();
    searchDropdown.classList.remove('open');
  }
});

searchClearBtn.addEventListener('click', () => {
  searchInput.value = '';
  state.searchQuery = '';
  searchClearBtn.classList.remove('visible');
  searchDropdown.classList.remove('open');
  renderProducts();
});

document.getElementById('searchSubmitBtn').addEventListener('click', () => {
  closeSearchScopeMenu();
  searchDropdown.classList.remove('open');
  scrollToSection('deals');
});

function renderSearchDropdown(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    searchDropdown.classList.remove('open');
    return;
  }

  const scope = activeSearchScope;
  const scopeConfig = getSearchScopeConfig(scope);
  const scopeLabel = scope === 'all' ? 'All Categories' : scopeConfig.label;
  const safeQuery = query.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const matches = ALL_CATALOG.filter(p => {
    const scopeOk = scope === 'all' || p.category === scope;
    const textOk = p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q);
    return scopeOk && textOk;
  });

  if (matches.length === 0) {
    searchDropdown.innerHTML = `
      <div class="search-dropdown-head">
        <span>Search results</span>
        <span class="search-scope-chip">in ${scopeLabel}</span>
      </div>
      <div class="search-empty">
        <span class="search-empty-icon">🔎</span>
        <p>No matches for "${safeQuery}"</p>
        <span class="search-empty-note">Try another keyword${scope !== 'all' ? ' or switch to All Categories' : ''}.</span>
      </div>
      <div class="search-dropdown-foot">Press Enter to browse all deals</div>
    `;
  } else {
    searchDropdown.innerHTML = `
      <div class="search-dropdown-head">
        <span>Suggestions</span>
        <span class="search-scope-chip">in ${scopeLabel} · ${matches.length}</span>
      </div>
      ${matches.map(m => `
        <div class="search-item" onclick="openQuickView('${m.id}'); searchDropdown.classList.remove('open');">
          <div class="search-item-thumb"><img src="${m.image}" alt="" /></div>
          <div class="search-item-info">
            <div class="search-item-title">${m.title}</div>
            <div class="search-item-meta">${m.subtitle} · ${m.category}</div>
          </div>
          <div class="search-item-price">${formatINR(m.price)}</div>
        </div>
      `).join('')}
      <div class="search-dropdown-foot">Press Enter to browse all deals</div>
    `;
  }
  searchDropdown.classList.add('open');
}

// =========================================================================
// I. OVERLAYS, MODALS, PINCODE & POPOVERS
// =========================================================================
const backdrop = document.getElementById('globalBackdrop');
const cartDrawer = document.getElementById('cartDrawer');
const quickViewModal = document.getElementById('quickViewModal');
const pincodeModal = document.getElementById('pincodeModal');

function openCartDrawer() {
  closeAllOverlays();
  renderCartDrawer();
  backdrop.classList.add('open');
  cartDrawer.classList.add('open');
}

function openQuickView(productId) {
  const p = ALL_CATALOG.find(item => item.id === productId);
  if (!p) return;

  // Record in Browsing History
  state.history = [productId, ...state.history.filter(id => id !== productId)].slice(0, 6);
  saveState();
  renderBrowsingHistory();

  closeAllOverlays();

  document.getElementById('quickViewContent').innerHTML = `
    <div class="qv-grid">
      <div class="qv-visual"><img src="${p.image}" alt="" /></div>
      <div>
        <span class="discount-badge" style="display: inline-block; margin-bottom: 8px;">-${p.discount}% Limited Deal</span>
        <h3 style="font-size: 1.38rem; font-weight: 800; margin-bottom: 4px;">${p.title}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">${p.subtitle} · ★ ${p.rating} (${p.reviews} ratings)</p>
        <div style="display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px;">
          <span style="font-size: 1.5rem; font-weight: 800; color: var(--brand-primary);">${formatINR(p.price)}</span>
          <span style="font-size: 0.92rem; text-decoration: line-through; color: var(--text-muted);">${formatINR(p.mrp)}</span>
        </div>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px; font-size: 0.83rem; color: var(--text-secondary); margin-bottom: 18px;">
          ${p.highlights.map(h => `<li>✓ ${h}</li>`).join('')}
        </ul>
        <div style="display: flex; gap: 10px;">
          <button class="btn-hero-primary" style="flex: 1; justify-content: center;" onclick="addToCart('${p.id}'); closeAllOverlays();">
            Add to Cart
          </button>
          <button class="preset-chip" onclick="toggleWishlist('${p.id}'); openQuickView('${p.id}');">
            ${state.wishlist.includes(p.id) ? '♥ Saved' : '♡ Wishlist'}
          </button>
        </div>
      </div>
    </div>
  `;

  backdrop.classList.add('open');
  quickViewModal.classList.add('open');
}

function openPincodeModal() {
  closeAllOverlays();
  backdrop.classList.add('open');
  pincodeModal.classList.add('open');
}

function applyPincode(cityPin) {
  state.pincode = cityPin;
  document.getElementById('deliveryCityText').textContent = cityPin;
  saveState();
  closeAllOverlays();
  showToast(`📍 Delivery location updated to ${cityPin}`);
}

function submitCustomPincode(e) {
  e.preventDefault();
  const val = document.getElementById('customPincodeInput').value.trim();
  if (/^\d{6}$/.test(val)) {
    applyPincode(`India ${val}`);
    document.getElementById('customPincodeInput').value = '';
  }
}

function closeAllOverlays() {
  backdrop.classList.remove('open');
  cartDrawer.classList.remove('open');
  quickViewModal.classList.remove('open');
  pincodeModal.classList.remove('open');
  document.getElementById('compareModal').classList.remove('open');
  const mobileCategoriesScreen = document.getElementById('mobileCategoriesScreen');
  if (mobileCategoriesScreen) {
    mobileCategoriesScreen.classList.remove('open');
    mobileCategoriesScreen.setAttribute('aria-hidden', 'true');
  }
  closePopovers();
}

function closePopovers() {
  closeSearchScopeMenu();
  document.getElementById('accountPopover').classList.remove('open');
  document.getElementById('megaMenu').classList.remove('open');
  searchDropdown.classList.remove('open');
}

document.getElementById('openCartBtn').addEventListener('click', openCartDrawer);
document.getElementById('closeCartBtn').addEventListener('click', closeAllOverlays);
document.getElementById('openPincodeBtn').addEventListener('click', openPincodeModal);
backdrop.addEventListener('click', closeAllOverlays);

document.getElementById('accountMenuBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  const pop = document.getElementById('accountPopover');
  const isOpen = pop.classList.contains('open');
  closePopovers();
  if (!isOpen) pop.classList.add('open');
});

document.getElementById('megaMenuBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  const menu = document.getElementById('megaMenu');
  const isOpen = menu.classList.contains('open');
  closePopovers();
  if (!isOpen) menu.classList.add('open');
});

function selectMegaCategory(cat) {
  closePopovers();
  setDealFilter(cat);
  scrollToSection('deals');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.account-wrapper') && !e.target.closest('.nav-bar') && !e.target.closest('.search-wrapper')) {
    closePopovers();
  }
});

// =========================================================================
// J. COUNTDOWN TIMER, TOASTS & UTILITIES
// =========================================================================
let remainingSeconds = 4 * 3600 + 28 * 60 + 19;
function startDealTimer() {
  const el = document.getElementById('dealCountdown');
  setInterval(() => {
    if (remainingSeconds <= 0) remainingSeconds = 5 * 3600;
    remainingSeconds--;
    const h = String(Math.floor(remainingSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(remainingSeconds % 60).padStart(2, '0');
    el.textContent = `${h}h : ${m}m : ${s}s`;
  }, 1000);
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 220ms ease';
    setTimeout(() => toast.remove(), 230);
  }, 3000);
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// =========================================================================
// K. BOOTSTRAP APPLICATION
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  document.getElementById('deliveryCityText').textContent = state.pincode;
  initSearchScope();
  renderCategoryStrip();
  renderProducts();
  renderAllMarketplaceSections();
  syncBadges();
  renderCartDrawer();
  startAutoPlay();
  startDealTimer();
});
  

