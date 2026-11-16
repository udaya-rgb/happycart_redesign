// =========================================================================
// HAPPYCART — MOBILE APP ENHANCEMENTS (phones only)
// Loaded after app.js. Desktop behavior is intentionally not modified.
// =========================================================================
(function () {
  const MOBILE_QUERY = '(max-width: 768px)';
  const mobileMedia = window.matchMedia(MOBILE_QUERY);
  const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

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
  // Marquee strips: auto-scroll while idle, follow the finger while dragged
  // -----------------------------------------------------------------------
  const MARQUEE_RESUME_DELAY = 1200;
  const marqueeControllers = [];

  function canAutoScrollMarquee() {
    return isMobile() && !reducedMotionMedia.matches;
  }

  function initAutoMarquee(gridSelector, durationMs) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    const track = grid.querySelector('.category-track, .brand-track');
    const firstSet = track ? track.querySelector('.category-set, .brand-set') : null;
    if (!track || !firstSet) return;

    const controller = {
      grid: grid,
      firstSet: firstSet,
      setWidth: 0,
      perMs: 0,
      pos: 0,
      pausedUntil: 0,
      touching: false,
      syncPending: true,
      lastTs: 0,
      resumeTimer: null,
      raf: null,
      durationMs: durationMs
    };
    marqueeControllers.push(controller);

    function measure() {
      const width = firstSet.getBoundingClientRect().width;
      if (width > 0) {
        controller.setWidth = width;
        controller.perMs = width / controller.durationMs;
      }
    }

    function resetPosition() {
      if (!canAutoScrollMarquee() || controller.touching || controller.setWidth <= 0) return;
      // The second copied set is identical, so starting one set in is seamless.
      controller.pos = controller.setWidth;
      controller.syncPending = false;
      controller.lastTs = 0;
      grid.scrollLeft = controller.pos;
    }

    function start() {
      if (!canAutoScrollMarquee() || controller.raf) return;
      controller.lastTs = 0;
      controller.raf = window.requestAnimationFrame(step);
    }

    function stop(resetScroll) {
      if (controller.raf) {
        window.cancelAnimationFrame(controller.raf);
        controller.raf = null;
      }
      controller.lastTs = 0;
      if (resetScroll) {
        controller.pos = 0;
        grid.scrollLeft = 0;
      }
    }

    function step(ts) {
      controller.raf = null;

      if (!canAutoScrollMarquee()) {
        stop(true);
        return;
      }

      if (!controller.lastTs) controller.lastTs = ts;
      const dt = Math.min(64, ts - controller.lastTs);
      controller.lastTs = ts;

      const running = !controller.touching && Date.now() >= controller.pausedUntil;

      if (running && controller.setWidth > 0) {
        if (controller.syncPending) {
          controller.pos = grid.scrollLeft;
          controller.syncPending = false;
        }

        controller.pos -= controller.perMs * dt;
        while (controller.pos <= 0) controller.pos += controller.setWidth;
        while (controller.pos >= controller.setWidth * 2) controller.pos -= controller.setWidth;
        grid.scrollLeft = controller.pos;
      }

      controller.raf = window.requestAnimationFrame(step);
    }

    function pause() {
      if (!isMobile()) return;
      controller.touching = true;
      controller.pos = grid.scrollLeft;
      controller.syncPending = false;
      controller.lastTs = 0;
      window.clearTimeout(controller.resumeTimer);
    }

    function resume() {
      if (!isMobile()) return;
      controller.touching = false;
      controller.lastTs = 0;
      controller.pausedUntil = Date.now() + MARQUEE_RESUME_DELAY;
      window.clearTimeout(controller.resumeTimer);
      controller.resumeTimer = window.setTimeout(function () {
        controller.syncPending = true;
        controller.pausedUntil = 0;
        start();
      }, MARQUEE_RESUME_DELAY);
      start();
    }

    function isTouchPointer(event) {
      return event.pointerType && event.pointerType !== 'mouse';
    }

    grid.addEventListener('touchstart', pause, { passive: true });
    grid.addEventListener('touchend', resume, { passive: true });
    grid.addEventListener('touchcancel', resume, { passive: true });

    grid.addEventListener('pointerdown', function (event) {
      if (isTouchPointer(event)) pause();
    }, { passive: true });

    grid.addEventListener('pointerup', function (event) {
      if (isTouchPointer(event)) resume();
    }, { passive: true });

    grid.addEventListener('pointercancel', function (event) {
      if (isTouchPointer(event)) resume();
    }, { passive: true });

    controller.measure = measure;
    controller.resetPosition = resetPosition;
    controller.start = start;
    controller.stop = stop;

    measure();
    resetPosition();
    start();
  }

  function refreshMarquees() {
    marqueeControllers.forEach(function (controller) {
      controller.measure();
      if (canAutoScrollMarquee()) {
        if (!controller.touching) controller.resetPosition();
        controller.start();
      } else {
        controller.stop(true);
      }
    });
  }

  if (mobileMedia.addEventListener) {
    mobileMedia.addEventListener('change', refreshMarquees);
  } else if (mobileMedia.addListener) {
    mobileMedia.addListener(refreshMarquees);
  }

  if (reducedMotionMedia.addEventListener) {
    reducedMotionMedia.addEventListener('change', refreshMarquees);
  } else if (reducedMotionMedia.addListener) {
    reducedMotionMedia.addListener(refreshMarquees);
  }

  let marqueeResizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(marqueeResizeTimer);
    marqueeResizeTimer = window.setTimeout(function () {
      marqueeControllers.forEach(function (controller) {
        controller.measure();
      });
    }, 200);
  }, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      if (!canAutoScrollMarquee()) return;
      marqueeControllers.forEach(function (controller) {
        controller.measure();
        if (!controller.touching) controller.resetPosition();
        controller.start();
      });
    });
  }

  // -----------------------------------------------------------------------
  // Initialise
  // -----------------------------------------------------------------------
  function initMobile() {
    mirrorBadges();
    setActiveTab('home');
    syncScrollLock();
    updateActiveFromScroll();
    initAutoMarquee('.category-grid', 26000);
    initAutoMarquee('.brands-grid', 24000);
  }

  if (document.readyState === 'loading') {
    // window listeners run after app.js has rendered the category/brand strips
    window.addEventListener('DOMContentLoaded', initMobile);
  } else {
    initMobile();
  }
})();
