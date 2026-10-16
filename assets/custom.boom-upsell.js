/*
 * custom.boom-upsell.js
 * ─────────────────────
 * Post add-to-cart upsell popup (promo: Brain Coffee −20%).
 *
 * Responsible for:
 *   • Deciding when the popup is eligible (window.__boomUpsellShouldShow,
 *     called synchronously by the early interceptor in head-scripts.liquid
 *     so the default drawer/notification can be suppressed in time).
 *   • Opening/closing the popup, countdown timer, focus handling.
 *   • The CTA add-to-cart call, success state and hand-off to the theme's
 *     normal post-add flow (cart drawer + section morphs + gift sync).
 *
 * Companion files:
 *   • snippets/boom-upsell-popup.liquid — markup + config JSON
 *   • assets/custom.boom-upsell.css     — styles
 *   • snippets/head-scripts.liquid      — early interceptor + asset tags
 *
 * Loaded deferred on every page; no-ops when the popup isn't rendered
 * (setting disabled or upsell product unavailable).
 */

(function () {
  'use strict';

  if (window.__boomUpsell) return;

  var root = document.getElementById('boom-upsell-popup');
  var cfgEl = document.getElementById('boom-upsell-config');
  if (!root || !cfgEl) return;

  var cfg;
  try {
    cfg = JSON.parse(cfgEl.textContent || '{}');
  } catch (e) {
    return;
  }
  if (!cfg.enabled || !cfg.variantId) return;

  var SS_SHOWN = 'boomUpsellShown';

  var U = (window.__boomUpsell = {
    isOpen: false,
    added: false,
    busy: false,
    hasUpsellInCart: false,
    triggerHandle: '',
  });

  var dialog = root.querySelector('[data-upsell-dialog]');
  var ctaBtn = root.querySelector('[data-upsell-add]');
  var ctaLabelEl = root.querySelector('[data-upsell-cta-label]');
  var timerEl = root.querySelector('[data-upsell-timer]');
  var timeEl = root.querySelector('[data-upsell-time]');

  var timerInterval = null;
  var lastFocus = null;

  function ssGet(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function ssSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }

  // ── Cart state (is the upsell product already in the cart?) ──

  function itemsOf(detail) {
    if (!detail) return [];
    return detail.items || [detail];
  }

  function refreshCartState() {
    fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        U.hasUpsellInCart = (cart.items || []).some(function (item) {
          return item.handle === cfg.productHandle;
        });
      })
      .catch(function () { /* keep last known state */ });
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(refreshCartState, { timeout: 3000 });
  } else {
    setTimeout(refreshCartState, 1500);
  }

  window.addEventListener('theme:cart:add:success', function (event) {
    var hasUpsell = itemsOf(event.detail).some(function (item) {
      return item && item.handle === cfg.productHandle;
    });
    if (hasUpsell) U.hasUpsellInCart = true;
  });

  var refreshTimeout = null;
  window.addEventListener('theme:cart:change:success', function () {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(refreshCartState, 400);
  });

  // ── Eligibility — must stay synchronous (called mid-event-dispatch) ──

  window.__boomUpsellShouldShow = function (items) {
    if (U.isOpen) return false;
    if (!cfg.designMode && U.added) return false;
    // In the theme editor, show the popup on every triggering add so it can
    // be previewed repeatedly — skip the once-per-session and already-in-cart
    // guards there.
    if (!cfg.designMode && ssGet(SS_SHOWN)) return false;
    if (!cfg.designMode && U.hasUpsellInCart) return false;

    // Mirror the theme's own guard: don't fight an open drawer
    // (quickview adds, adds from within the cart drawer).
    try {
      var drawer = window.Alpine && window.Alpine.store && window.Alpine.store('drawer');
      if (drawer && drawer.isOpen) return false;
    } catch (e) { /* Alpine not ready — treat as no drawer */ }

    if (!items || !items.length) return false;
    var triggerHandles = cfg.triggerHandles || [];
    var triggered = false;
    for (var i = 0; i < items.length; i++) {
      var handle = String((items[i] && items[i].handle) || '');
      if (handle === cfg.productHandle) return false; // they're adding it already
      if (triggerHandles.indexOf(handle) !== -1) triggered = true;
    }
    return triggered;
  };

  // ── Open / close ──

  function focusables() {
    return dialog.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePopup();
      return;
    }
    if (event.key !== 'Tab') return;
    var els = focusables();
    if (!els.length) return;
    var first = els[0];
    var last = els[els.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  var ctaOriginalLabel = ctaLabelEl ? ctaLabelEl.textContent : '';

  function openPopup() {
    if (U.isOpen) return;
    U.isOpen = true;
    if (cfg.designMode) {
      // Theme editor: reset the CTA so the popup previews fresh every time.
      U.added = false;
      U.busy = false;
      if (ctaBtn) ctaBtn.classList.remove('is-added', 'is-busy');
      if (ctaLabelEl) ctaLabelEl.textContent = ctaOriginalLabel;
    } else {
      ssSet(SS_SHOWN, '1');
    }

    lastFocus = document.activeElement;
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);

    var target = root.querySelector('[data-upsell-add]');
    if (target) target.focus({ preventScroll: true });

    startTimer();
  }

  function closePopup() {
    if (!U.isOpen) return;
    U.isOpen = false;

    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    stopTimer();

    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
    lastFocus = null;
  }

  window.addEventListener('boom:upsell:show', function (event) {
    // Remember which product triggered the offer — recorded on the upsell
    // line item as a hidden _boom_upsell property for end-of-month stats.
    var trigger = itemsOf(event.detail).filter(function (item) {
      return item && (cfg.triggerHandles || []).indexOf(String(item.handle || '')) !== -1;
    })[0];
    U.triggerHandle = (trigger && trigger.handle) || '';
    openPopup();
  });

  root.querySelectorAll('[data-upsell-close]').forEach(function (el) {
    el.addEventListener('click', closePopup);
  });

  // ── Countdown (starts fresh at open; closes the popup at 0:00) ──

  function startTimer() {
    if (!cfg.showTimer || !timerEl || !timeEl) return;

    var deadline = Date.now() + (cfg.timerSeconds || 30) * 1000;

    function tick() {
      // Round up so the display starts at the full duration and only hits
      // 0:00 when time is truly up. The sub-second interval keeps the
      // countdown visually smooth even when timers drift or get throttled.
      var secs = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      var mins = Math.floor(secs / 60);
      timeEl.textContent = mins + ':' + String(secs % 60).padStart(2, '0');
      if (secs <= 0) {
        stopTimer();
        // Don't close over the success state — the CTA flow closes itself.
        if (!U.added && !U.busy) closePopup();
      }
    }

    tick();
    timerEl.hidden = false;
    timerInterval = setInterval(tick, 250);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // ── CTA: add the upsell product, then hand off to the theme's flow ──

  if (ctaBtn) {
    ctaBtn.addEventListener('click', function () {
      if (U.busy || U.added) return;
      U.busy = true;
      ctaBtn.classList.add('is-busy');

      // Hidden property (leading underscore — never shown to the customer):
      // marks the line as an upsell conversion and records the trigger product.
      var payload = {
        id: cfg.variantId,
        quantity: 1,
        properties: { _boom_upsell: U.triggerHandle || 'true' },
      };
      var sectionIds = [];
      document.querySelectorAll('[data-cart-api-section]').forEach(function (el) {
        var section = el.closest('.shopify-section');
        if (!section) return;
        var id = section.id.replace('shopify-section-', '');
        if (sectionIds.indexOf(id) === -1) sectionIds.push(id);
      });
      if (sectionIds.length) payload.sections = sectionIds;

      var addUrl =
        ((window.theme && window.theme.routes && window.theme.routes.cartAdd) || '/cart/add') + '.js';

      /* Bypass sibling fetch interceptors (bundle-builder, qty-alt) — this is
         a popup-originating add, same as the cart subscription toggle. */
      window.__boomSkipIntercept = true;

      fetch(addUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (r) {
          if (!r.ok) throw new Error('boom-upsell: add failed (' + r.status + ')');
          return r.json();
        })
        .then(function (data) {
          U.added = true;
          U.hasUpsellInCart = true;
          ctaBtn.classList.remove('is-busy');
          ctaBtn.classList.add('is-added');
          if (ctaLabelEl) ctaLabelEl.textContent = cfg.addedLabel || '✓';

          setTimeout(function () {
            closePopup();
            // Re-enter the theme's normal post-add flow: cart drawer opens,
            // cart sections morph, gift sync updates. The early interceptor
            // ignores this event (the added item is the upsell product).
            document.body.dispatchEvent(
              new CustomEvent('theme:cart:add:success', {
                bubbles: true,
                composed: true,
                detail: data,
              })
            );
          }, 1400);
        })
        .catch(function (error) {
          console.error(error);
          U.busy = false;
          ctaBtn.classList.remove('is-busy');
        })
        .finally(function () {
          window.__boomSkipIntercept = false;
        });
    });
  }
})();
