// =========================================================================
// HAPPYCART — MOBILE APP ENHANCEMENTS (phones only)
// Loaded after app.js. Desktop behavior is intentionally not modified.
// =========================================================================
(function () {
  const MOBILE_QUERY = '(max-width: 768px)';
  const mobileMedia = window.matchMedia(MOBILE_QUERY);

  const tabbar = document.getElementById('mobileTabbar');
  const backdrop = document.getElementById('globalBackdrop');
  const cartBadge = document.getElementById('cartBadge');
  const wishlistBadge = document.getElementById('wishlistBadge');
  const mobileCartBadge = document.getElementById('mobileCartBadge');
  const mobileWishlistBadge = document.getElementById('mobileWishlistBadge');
  const heroCarousel = document.getElementById('heroCarousel');

  let manualActiveUntil = 0;
  let scrollFrame = null;

  function isMobile() {
    return mobileMedia.matches;
  }

  // -----------------------------------------------------------------------
  // Bottom tab bar: badges, active state & scroll spy
  // -----------------------------------------------------------------------
  function mirrorBadges() {
    if (mobileCartBadge && cartBadge) {
      mobileCartBadge.textContent = cartBadge.textContent;
    }
    if (mobileWishlistBadge && wishlistBadge) {
      mobileWishlistBadge.textContent = wishlistBadge.textContent;
    }
  }

  function setActiveTab(name) {
    if (!tabbar) return;
    tabbar.querySelectorAll('.mobile-tab').forEach(function (tab) {
      const isActive = tab.dataset.tab === name;
      tab.classList.toggle('active', isActive);
      if (isActive) {
        tab.setAttribute('aria-current', 'page');
      } else {
        tab.removeAttribute('aria-current');
      }
    });
  }

  function overlayIsOpen() {
    return Boolean(backdrop && backdrop.classList.contains('open'));
  }

  function updateActiveFromScroll() {
    if (!isMobile() || !tabbar || overlayIsOpen()) return;

    const probe = window.scrollY + 150;
    const categories = document.getElementById('categories');
    const deals = document.getElementById('deals');
    let active = 'home';

    if (categories && probe >= categories.getBoundingClientRect().top + window.scrollY) {
      active = 'categories';
    }
    if (deals && probe >= deals.getBoundingClientRect().top + window.scrollY) {
      active = 'deals';
    }
    setActiveTab(active);
  }

  function scheduleActiveUpdate() {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(function () {
      scrollFrame = null;
      if (Date.now() < manualActiveUntil) return;
      updateActiveFromScroll();
    });
  }

  if (tabbar) {
    tabbar.addEventListener('click', function (event) {
      const tab = event.target.closest('.mobile-tab');
      if (!tab || !isMobile()) return;

      setActiveTab(tab.dataset.tab);
      manualActiveUntil = Date.now() + 1400;
    });

    window.addEventListener('scroll', scheduleActiveUpdate, { passive: true });
    window.addEventListener('resize', function () {
      updateActiveFromScroll();
    });
  }

  if (cartBadge) {
    new MutationObserver(mirrorBadges).observe(cartBadge, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  if (wishlistBadge) {
    new MutationObserver(mirrorBadges).observe(wishlistBadge, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  // -----------------------------------------------------------------------
  // Overlay scroll lock (mobile only) + restore active tab after closing
  // -----------------------------------------------------------------------
  function syncScrollLock() {
    if (!backdrop) return;
    const shouldLock = isMobile() && overlayIsOpen();
    document.body.classList.toggle('mobile-scroll-lock', shouldLock);
  }

  if (backdrop) {
    new MutationObserver(function () {
      const wasOpen = document.body.classList.contains('mobile-scroll-lock');
      syncScrollLock();
      if (wasOpen && !overlayIsOpen()) {
        window.setTimeout(updateActiveFromScroll, 60);
      }
    }).observe(backdrop, { attributes: true, attributeFilter: ['class'] });
  }

  if (mobileMedia.addEventListener) {
    mobileMedia.addEventListener('change', syncScrollLock);
  } else if (mobileMedia.addListener) {
    mobileMedia.addListener(syncScrollLock);
  }

  // -----------------------------------------------------------------------
  // Hero carousel: horizontal swipe (replaces arrows on phones)
  // -----------------------------------------------------------------------
  if (heroCarousel) {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    heroCarousel.addEventListener('touchstart', function (event) {
      if (event.touches.length !== 1) return;
      tracking = true;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    }, { passive: true });

    heroCarousel.addEventListener('touchcancel', function () {
      tracking = false;
    }, { passive: true });

    heroCarousel.addEventListener('touchend', function (event) {
      if (!tracking) return;
      tracking = false;

      const touch = event.changedTouches[0];
      if (!touch || !isMobile()) return;

      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
      if (typeof window.goToSlide !== 'function' || typeof window.startAutoPlay !== 'function') return;

      const currentSlide = typeof state !== 'undefined' ? state.currentSlide : 0;
      window.goToSlide(currentSlide + (deltaX < 0 ? 1 : -1));
      window.startAutoPlay();
    }, { passive: true });
  }

  // -----------------------------------------------------------------------
  // Initialise
  // -----------------------------------------------------------------------
  function initMobile() {
    mirrorBadges();
    setActiveTab('home');
    syncScrollLock();
    updateActiveFromScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobile);
  } else {
    initMobile();
  }
})();
