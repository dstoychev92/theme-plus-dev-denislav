/*
 * custom.boom-gift-sync.js
 * ──────────────────────────
 * Gift-sync engine for the BOOM! BOX tier bar.
 *
 * Responsible for:
 *   • Keeping free-gift line items in cart consistent with the active tier.
 *   • Showing an optimistic sync state (shimmer + ghost row) immediately.
 *   • Batching Shopify cart calls to minimize perceived lag.
 *
 * Companion files:
 *   • snippets/cart-boom-tier-bar.liquid   — markup + Liquid-computed config
 *   • assets/custom.boom-gift-sync.css     — tier-bar + sync-state styles
 *
 * Loaded via snippets/head-scripts.liquid. Safe to load on every page;
 * no-ops when no tier bar is rendered.
 *
 * Events emitted (on window):
 *   • boom:gift-sync:start   { expected, current }
 *   • boom:gift-sync:end     { added, removed }
 *   • boom:gift-sync:error   { error }
 *
 * Events consumed (on window):
 *   • theme:cart:add:success     — user added a product
 *   • theme:cart:change:success  — qty changed / item removed
 */

(function () {
  'use strict';

  if (window.__boomGiftSync) return;

  // ── Config (read once from the JSON blob the snippet renders) ──
  function readConfig() {
    var el = document.getElementById('boom-gift-sync-config');
    if (!el) return null;
    try { return JSON.parse(el.textContent || '{}'); }
    catch (e) { return null; }
  }

  // ── Copy (localised strings the tier-bar snippet renders into the config) ──
  function copy(key, fallback) {
    var cfg = readConfig();
    var value = cfg && cfg.copy && cfg.copy[key];
    return value || fallback;
  }

  // ── Utility: log with feature flag ──
  var DEBUG =
    typeof window !== 'undefined' &&
    /[?&]boom_debug=1/.test(window.location.search || '');
  function log() {
    if (!DEBUG) return;
    var args = Array.prototype.slice.call(arguments);
    console.log.apply(console, ['[BoomGift]'].concat(args));
  }

  // ── The core engine ──
  var G = window.__boomGiftSync = {
    // state
    busy: false,
    pending: false,
    coalesceMs: 50,
    cooldownUntil: 0,
    abortCtrl: null,
    lastSyncTs: 0,
    // Variant IDs whose /cart/add.js is mid-flight. Prevents the same gift from
    // being queued twice when the engine re-enters before the previous response
    // has morphed into the DOM.
    inFlightAdds: {},

    /**
     * Bypass sibling fetch interceptors (bundle-builder, qty-alt).
     * Preserved from the original implementation — do not change without testing
     * the bundle-builder product template end-to-end.
     */
    bypass: function (fn) {
      var s1 = window.__boomBundleItems;
      var s2 = window.__boomQtyGifts;
      window.__boomBundleItems = null;
      window.__boomQtyGifts = null;
      window.__boomSkipIntercept = true;
      try { return fn(); }
      finally {
        window.__boomBundleItems = s1;
        window.__boomQtyGifts = s2;
        window.__boomSkipIntercept = false;
      }
    },

    // ─────────────────────────────────────────────────────────
    //  Reading state from multiple sources (ordered fast → slow)
    // ─────────────────────────────────────────────────────────

    /**
     * Try to extract new tier-bar data from an event that contains
     * rendered section HTML (theme:cart:add:success, theme:cart:change:success).
     * Returns { expected, current, keys } or null.
     */
    readFromEventSections: function (detail) {
      if (!detail || !detail.sections) return null;
      var html = '';
      for (var key in detail.sections) {
        if (detail.sections[key] && /data-boom-expected-gifts/.test(detail.sections[key])) {
          html = detail.sections[key];
          break;
        }
      }
      if (!html) return null;
      var mE = html.match(/data-boom-expected-gifts="([^"]*)"/);
      var mC = html.match(/data-boom-current-gifts="([^"]*)"/);
      var mK = html.match(/data-boom-current-keys="([^"]*)"/);
      var mV = html.match(/data-boom-cart-variants="([^"]*)"/);
      if (!mE) return null;
      return {
        expected: this._parseIdList(mE[1]),
        current: mC ? this._parseIdList(mC[1]) : [],
        cartVariants: mV ? this._parseIdList(mV[1]) : (mC ? this._parseIdList(mC[1]) : []),
        keys: mK && mK[1] ? mK[1].split('|||') : [],
      };
    },

    /** Live DOM read — source of truth after a section morph completes. */
    readFromDom: function () {
      var el = document.querySelector('.boom-tb[data-boom-expected-gifts]');
      if (!el) return null;
      var current = this._parseIdList(el.getAttribute('data-boom-current-gifts') || '');
      var cartVariantsAttr = el.getAttribute('data-boom-cart-variants');
      return {
        expected: this._parseIdList(el.getAttribute('data-boom-expected-gifts') || ''),
        current: current,
        cartVariants: cartVariantsAttr != null ? this._parseIdList(cartVariantsAttr) : current,
        keys: (el.getAttribute('data-boom-current-keys') || '').split('|||').filter(Boolean),
      };
    },

    /** Last-resort: re-render the section ourselves. */
    readFromSectionApi: async function () {
      var ids = this._sectionIds();
      if (!ids.length) return null;
      var self = this;
      try {
        var res = await self.bypass(function () {
          return fetch('/?section_id=' + ids[0] + '&_bgt=' + Date.now(), {
            credentials: 'same-origin',
            signal: self.abortCtrl && self.abortCtrl.signal,
          });
        });
        if (!res.ok) return null;
        var html = await res.text();
        var mE = html.match(/data-boom-expected-gifts="([^"]*)"/);
        var mC = html.match(/data-boom-current-gifts="([^"]*)"/);
        var mK = html.match(/data-boom-current-keys="([^"]*)"/);
        var mV = html.match(/data-boom-cart-variants="([^"]*)"/);
        var current = mC ? this._parseIdList(mC[1]) : [];
        return {
          expected: mE ? this._parseIdList(mE[1]) : [],
          current: current,
          cartVariants: mV ? this._parseIdList(mV[1]) : current,
          keys: mK && mK[1] ? mK[1].split('|||') : [],
        };
      } catch (e) { return null; }
    },

    _parseIdList: function (raw) {
      if (!raw) return [];
      return raw.split(',')
        .map(function (s) { return parseInt(s.trim(), 10); })
        .filter(function (n) { return n > 0; });
    },

    _sectionIds: function () {
      var ids = [];
      document.querySelectorAll('[data-cart-api-section]').forEach(function (el) {
        var sec = el.closest('.shopify-section');
        if (sec) {
          var id = sec.id.replace('shopify-section-', '');
          if (ids.indexOf(id) === -1) ids.push(id);
        }
      });
      return ids;
    },

    // ─────────────────────────────────────────────────────────
    //  Cart mutations
    // ─────────────────────────────────────────────────────────

    /**
     * Batch remove gifts via /cart/update.js (single round-trip).
     * Takes { lineKey: qty } updates map.
     */
    cartUpdate: async function (updates) {
      var self = this;
      var sections = this._sectionIds().join(',');
      var body = {
        updates: updates,
        // ask Shopify to return section HTML so we can morph in one go
        sections: sections || undefined,
        sections_url: window.location.pathname,
      };
      var res = await self.bypass(function () {
        return fetch('/cart/update.js', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: self.abortCtrl && self.abortCtrl.signal,
        });
      });
      if (!res.ok) throw new Error('update.js ' + res.status);
      return res.json();
    },

    /** Add gifts — single /cart/add.js call, also requests sections back. */
    cartAdd: async function (vids) {
      var self = this;
      var sections = this._sectionIds().join(',');
      var body = {
        items: vids.map(function (v) {
          return { id: v, quantity: 1, properties: { '_boom_gift': 'true' } };
        }),
        sections: sections || undefined,
        sections_url: window.location.pathname,
      };
      var res = await self.bypass(function () {
        return fetch('/cart/add.js', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: self.abortCtrl && self.abortCtrl.signal,
        });
      });
      if (!res.ok) {
        var err = await res.json().catch(function () { return {}; });
        throw new Error('add.js ' + (err.description || err.message || res.status));
      }
      return res.json();
    },

    /**
     * Ask the theme to refresh cart sections using the response's sections map.
     * Dispatching change:success (not add:success) avoids the
     * theme.events.js bug where add:success calls event.target.matches()
     * on a non-element target.
     */
    notifyTheme: function (responseDetail) {
      var host = document.querySelector('[data-cart-api-section]') || document.body;
      host.dispatchEvent(new CustomEvent('theme:cart:change:success', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: responseDetail || {},
      }));
    },

    // ─────────────────────────────────────────────────────────
    //  Optimistic sync state (runs instantly, no fetch needed)
    // ─────────────────────────────────────────────────────────

    showSyncState: function (expected, current) {
      var willAdd = expected.filter(function (id) { return current.indexOf(id) === -1; }).length;
      var willRemove = current.filter(function (id) { return expected.indexOf(id) === -1; }).length;

      // Only show the overlay if there's actual work to do
      if (willAdd === 0 && willRemove === 0) return;

      document.querySelectorAll('.boom-tb').forEach(function (el) {
        el.classList.add('boom-tb--syncing');
        if (willAdd > 0) el.setAttribute('data-boom-incoming-count', String(willAdd));
      });

      // Inject ghost rows near the end of any cart list — ~zero-cost DOM addition
      var syncingLabel = copy('syncing', 'Adding your gift…');
      document.querySelectorAll('[data-boom-cart-list]').forEach(function (list) {
        if (list.querySelector('.boom-ghost-row')) return;
        for (var i = 0; i < willAdd; i++) {
          var ghost = document.createElement('div');
          ghost.className = 'boom-ghost-row';
          ghost.setAttribute('aria-hidden', 'true');
          ghost.innerHTML =
            '<div class="boom-ghost-row__img"></div>' +
            '<div class="boom-ghost-row__body">' +
              '<div class="boom-ghost-row__line boom-ghost-row__line--title"></div>' +
              '<div class="boom-ghost-row__line boom-ghost-row__line--meta"></div>' +
            '</div>' +
            '<div class="boom-ghost-row__chip">🎁 ' + syncingLabel + '</div>';
          list.appendChild(ghost);
        }
      });
    },

    hideSyncState: function () {
      document.querySelectorAll('.boom-tb--syncing').forEach(function (el) {
        el.classList.remove('boom-tb--syncing');
        el.removeAttribute('data-boom-incoming-count');
      });
      document.querySelectorAll('.boom-ghost-row').forEach(function (el) {
        el.remove();
      });
    },

    // ─────────────────────────────────────────────────────────
    //  The sync loop
    // ─────────────────────────────────────────────────────────

    schedule: function (eventDetail) {
      if (this.busy) { this.pending = true; this.pendingDetail = eventDetail; return; }
      var self = this;
      clearTimeout(this._scheduleT);
      this._scheduleT = setTimeout(function () {
        self.exec(eventDetail);
      }, this.coalesceMs);
    },

    exec: async function (eventDetail) {
      if (this.busy) return;
      this.busy = true;
      this.pending = false;

      // Abort any stale in-flight requests
      if (this.abortCtrl) { try { this.abortCtrl.abort(); } catch (e) {} }
      this.abortCtrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;

      try {
        // ── 1. Find out what we need to sync ──
        var state =
          this.readFromEventSections(eventDetail) ||
          this.readFromDom() ||
          (await this.readFromSectionApi());

        if (!state) { log('no tier bar state available — skip'); return; }

        var expected     = state.expected;
        var current      = state.current;
        var cartVariants = state.cartVariants || current;
        var keys         = state.keys;
        var inFlight     = G.inFlightAdds || {};

        // ── 1b. Verify current cart contents against /cart.js (ground truth) ──
        // Section-HTML snapshots reflect the cart at the moment that response
        // was rendered and can be stale mid-burst (rapid qty clicks). Trusting
        // them for dedupe re-adds a gift whose add hasn't morphed in yet, and
        // Shopify merges the lines — free gifts ended up with quantity 2+.
        // `expected` stays from the Liquid state (tier logic is server-side);
        // everything about what's ACTUALLY in the cart comes from /cart.js.
        var giftQtyFixes = {};
        try {
          var self1 = this;
          var liveRes = await this.bypass(function () {
            return fetch('/cart.js', {
              credentials: 'same-origin',
              headers: { 'Accept': 'application/json' },
              signal: self1.abortCtrl && self1.abortCtrl.signal,
            });
          });
          if (liveRes.ok) {
            var liveCart = await liveRes.json();
            var giftLines = (liveCart.items || []).filter(function (it) {
              return it.properties && it.properties._boom_gift === 'true';
            });
            current = giftLines.map(function (it) { return it.variant_id; });
            keys = giftLines.map(function (it) { return it.key; });
            cartVariants = (liveCart.items || []).map(function (it) { return it.variant_id; });
            // Heal gift lines that already merged to quantity > 1
            giftLines.forEach(function (it) {
              if (expected.indexOf(it.variant_id) !== -1 && it.quantity > 1) {
                giftQtyFixes[it.key] = 1;
              }
            });
          }
        } catch (e) {
          if (e && e.name === 'AbortError') throw e;
          /* fall back to the snapshot state on network failure */
        }

        log('expected=', expected, 'current=', current, 'cartVariants=', cartVariants, 'inFlight=', Object.keys(inFlight));

        // ── 2. Compute deltas ──
        // ADD: a gift is "to add" only if (a) it's expected, (b) its variant is
        //      NOT already in the cart at all (regardless of whether it's tagged
        //      _boom_gift), and (c) it's not currently mid-add by another sync run.
        // REMOVE: gift-tagged items still use `current` so we never accidentally
        //      remove a manually-purchased product.
        var toAdd    = expected.filter(function (id) {
          return cartVariants.indexOf(id) === -1 && !inFlight[id];
        });
        var toRemove = current.filter(function (id) { return expected.indexOf(id) === -1; });

        // Map variant IDs to line keys (for the removal update call)
        // current[i] and keys[i] are index-aligned from the Liquid snippet.
        var removeKeys = toRemove.map(function (vid) {
          var idx = current.indexOf(vid);
          return idx >= 0 ? keys[idx] : null;
        }).filter(Boolean);

        var qtyFixKeys = Object.keys(giftQtyFixes);
        if (!toAdd.length && !removeKeys.length && !qtyFixKeys.length) {
          log('in sync');
          return;
        }

        // ── 3. Show sync state IMMEDIATELY — runs in the same tick as the diff ──
        this.showSyncState(expected, current);
        window.dispatchEvent(new CustomEvent('boom:gift-sync:start', {
          detail: { expected: expected, current: current, added: toAdd, removed: removeKeys }
        }));

        // ── 4. Fire the mutations in parallel ──
        //      /cart/update.js for removals, /cart/add.js for additions.
        //      Both are idempotent for their own scope, so ordering doesn't matter.
        var promises = [];
        if (removeKeys.length || qtyFixKeys.length) {
          var updates = {};
          qtyFixKeys.forEach(function (k) { updates[k] = giftQtyFixes[k]; });
          removeKeys.forEach(function (k) { updates[k] = 0; });
          promises.push(this.cartUpdate(updates));
        }
        if (toAdd.length) {
          // Mark these variants as in-flight so a re-entrant sync run that
          // happens before the morph completes doesn't queue them again.
          toAdd.forEach(function (id) { G.inFlightAdds[id] = true; });
          var addPromise = this.cartAdd(toAdd).then(
            function (resp) {
              toAdd.forEach(function (id) { delete G.inFlightAdds[id]; });
              return resp;
            },
            function (err) {
              toAdd.forEach(function (id) { delete G.inFlightAdds[id]; });
              throw err;
            }
          );
          promises.push(addPromise);
        }

        var responses = await Promise.all(promises);

        // ── 5. Pick the "most complete" response (the one with sections) and
        //       dispatch it to the theme for section morph.
        var finalResponse = responses.find(function (r) { return r && r.sections; })
                         || responses[responses.length - 1]
                         || {};

        // Cooldown suppresses the change:success re-entry we're about to cause
        this.cooldownUntil = Date.now() + 600;
        this.lastSyncTs = Date.now();
        this.notifyTheme(finalResponse);

        window.dispatchEvent(new CustomEvent('boom:gift-sync:end', {
          detail: { added: toAdd.length, removed: removeKeys.length }
        }));

      } catch (e) {
        if (e && e.name === 'AbortError') { log('aborted'); return; }
        log('ERROR:', e && e.message);
        window.dispatchEvent(new CustomEvent('boom:gift-sync:error', {
          detail: { error: e && e.message }
        }));
      } finally {
        this.hideSyncState();
        this.busy = false;
        if (this.pending) {
          this.pending = false;
          var d = this.pendingDetail;
          this.pendingDetail = null;
          this.schedule(d);
        }
      }
    },
  };

  // ── Event wiring ──
  function onCartEvent(e) {
    // Suppress reentry from our own notifyTheme() dispatch
    if (Date.now() < G.cooldownUntil) { log('cooldown — skip'); return; }
    G.schedule(e && e.detail);
  }

  window.addEventListener('theme:cart:add:success', onCartEvent);
  window.addEventListener('theme:cart:change:success', onCartEvent);

  // ── First sync on page load (handles reload with gifts already in cart) ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { G.schedule(null); });
  } else {
    G.schedule(null);
  }

  log('initialized');
})();
