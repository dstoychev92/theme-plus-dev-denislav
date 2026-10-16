/* custom.locations-map.js — BOOM locations section (vanilla, progressive enhancement) */
(function () {
  if (window.__boomLocations) {
    window.__boomLocations.scan();
    return;
  }

  var instances = {};
  var gmapsPromise = null;

  function loadGoogleMaps(apiKey) {
    if (window.google && window.google.maps) return Promise.resolve(window.google.maps);
    if (gmapsPromise) return gmapsPromise;
    gmapsPromise = new Promise(function (resolve, reject) {
      window.__boomMapsReady = function () { resolve(window.google.maps); };
      var sc = document.createElement('script');
      sc.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        encodeURIComponent(apiKey) +
        '&loading=async&callback=__boomMapsReady';
      sc.async = true;
      sc.onerror = function () { reject(new Error('maps load failed')); };
      document.head.appendChild(sc);
    });
    return gmapsPromise;
  }

  // ── i18n ──
  // Strings come from the [data-locations-i18n] JSON the section renders. The
  // English values below are only a last-resort fallback if that blob is missing.
  var I18N_FALLBACK = {
    open: 'Open',
    closed: 'Closed',
    closesAt: 'Closes at __TIME__',
    opensAt: 'Opens at __TIME__',
    everyDay: 'Every day',
    weekdays: 'Mon-Fri',
    weekend: 'Sat-Sun',
    dayOff: 'closed',
    close: 'Close',
    call: 'Call',
    mapError: 'The map could not load. Check the API key.',
  };

  function readI18n(root) {
    var el = root.querySelector('[data-locations-i18n]');
    var t = {};
    if (el) {
      try { t = JSON.parse(el.textContent) || {}; } catch (e) { t = {}; }
    }
    var out = {};
    Object.keys(I18N_FALLBACK).forEach(function (k) {
      out[k] = t[k] || I18N_FALLBACK[k];
    });
    return out;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function toMinutes(s) {
    var m = String(s).trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }

  function parseRange(str) {
    if (!str) return null;
    var parts = String(str).replace(/–/g, '-').split('-');
    if (parts.length !== 2) return null;
    var o = toMinutes(parts[0]);
    var c = toMinutes(parts[1]);
    if (o == null || c == null) return null;
    return { open: o, close: c };
  }

  function fmt(min) {
    var h = Math.floor(min / 60);
    var m = min % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  function statusFor(loc, i18n, now) {
    now = now || new Date();
    var day = now.getDay();
    var weekend = day === 0 || day === 6;
    var range = parseRange(weekend ? loc.hoursWeekend : loc.hoursWeekday);
    if (!range) return { open: false, label: i18n.closed, note: '' };
    var mins = now.getHours() * 60 + now.getMinutes();
    // A range that closes past midnight (e.g. 10:00–02:00) has close <= open,
    // so treat it as "open from `open` through end of day OR before `close`".
    var overnight = range.close <= range.open;
    var open = overnight
      ? mins >= range.open || mins < range.close
      : mins >= range.open && mins < range.close;
    var note = open
      ? i18n.closesAt.replace('__TIME__', fmt(range.close))
      : mins < range.open
      ? i18n.opensAt.replace('__TIME__', fmt(range.open))
      : '';
    return { open: open, label: open ? i18n.open : i18n.closed, note: note };
  }

  function hoursLines(loc, i18n) {
    var wd = loc.hoursWeekday;
    var we = loc.hoursWeekend;
    if (wd && we && wd === we) return esc(i18n.everyDay) + ' ' + esc(wd);
    return (
      esc(i18n.weekdays) + ' ' + esc(wd || i18n.dayOff) +
      '<br>' +
      esc(i18n.weekend) + ' ' + esc(we || i18n.dayOff)
    );
  }

  function makePin(maps, accent) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">' +
      '<path d="M17 0C7.6 0 0 7.6 0 17c0 12 17 25 17 25s17-13 17-25C34 7.6 26.4 0 17 0z" fill="' +
      accent +
      '"/><circle cx="17" cy="16" r="6" fill="#FFFFFF"/></svg>';
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new maps.Size(34, 42),
      anchor: new maps.Point(17, 42),
    };
  }

  function initRoot(root) {
    if (root.dataset.lmReady === '1') return;

    var apiKey = root.dataset.apiKey;
    var i18n = readI18n(root);
    var dataEl = root.querySelector('[data-locations-data]');
    var data = [];
    try { data = JSON.parse(dataEl.textContent); } catch (e) { data = []; }

    var cards = Array.prototype.slice.call(root.querySelectorAll('.boom-loc__card'));
    var byId = {};
    data.forEach(function (d) { byId[d.id] = d; });

    // Status pills work without the map (progressive enhancement).
    cards.forEach(function (card) {
      var d = byId[card.dataset.id];
      if (!d) return;
      var st = statusFor(d, i18n);
      var el = card.querySelector('[data-status]');
      if (el) {
        el.textContent = '● ' + st.label;
        el.setAttribute('data-open', st.open);
      }
    });

    if (!apiKey) return; // section already shows a "missing key" note
    root.dataset.lmReady = '1';

    var sectionId = root.dataset.sectionId;
    var accent = (getComputedStyle(root).getPropertyValue('--accent') || '#FF4E16').trim();
    var focusZoom = parseInt(root.dataset.focusZoom, 10) || 15;
    var overviewZoom = parseInt(root.dataset.overviewZoom, 10) || 11;
    var brandLogo = root.dataset.brandLogo;
    var mapStyle = null;
    if (root.dataset.mapStyle) {
      try { mapStyle = JSON.parse(root.dataset.mapStyle); } catch (e) { mapStyle = null; }
    }

    var mapEl = root.querySelector('[data-map]');
    var infoEl = root.querySelector('[data-info]');
    var pills = Array.prototype.slice.call(root.querySelectorAll('.boom-loc__pill'));

    loadGoogleMaps(apiKey)
      .then(function (maps) {
        var map = new maps.Map(mapEl, {
          zoom: overviewZoom,
          center: { lat: 42.73, lng: 25.48 },
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: maps.ControlPosition.RIGHT_BOTTOM },
          styles: mapStyle || undefined,
          gestureHandling: 'cooperative',
        });

        var dotIcon = {
          path: maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          strokeColor: accent,
          strokeWeight: 4,
        };
        var pinIcon = makePin(maps, accent);
        var markers = {};

        data.forEach(function (d) {
          if (!d.lat || !d.lng) return;
          var marker = new maps.Marker({
            position: { lat: d.lat, lng: d.lng },
            map: map,
            title: d.name,
            icon: dotIcon,
          });
          marker.addListener('click', function () { select(d.id, true); });
          markers[d.id] = marker;
        });

        function fitVisible() {
          var positions = [];
          Object.keys(markers).forEach(function (id) {
            if (markers[id].getMap()) positions.push(markers[id].getPosition());
          });
          if (!positions.length) return;
          if (positions.length === 1) {
            map.setCenter(positions[0]);
            map.setZoom(focusZoom);
            return;
          }
          var b = new maps.LatLngBounds();
          positions.forEach(function (p) { b.extend(p); });
          map.fitBounds(b, 60);
          maps.event.addListenerOnce(map, 'idle', function () {
            if (map.getZoom() > focusZoom) map.setZoom(focusZoom);
          });
        }

        function renderInfo(d) {
          var st = statusFor(d, i18n);
          var logoHtml = d.logo
            ? '<img src="' + esc(d.logo) + '" alt="">'
            : brandLogo
            ? '<img src="' + esc(brandLogo) + '" alt="">'
            : '<span class="boom-loc__badge"><span class="boom-loc__badge-b">boom</span></span>';
          var phoneHref = d.phone ? 'tel:' + d.phone.replace(/\s+/g, '') : '';
          infoEl.innerHTML =
            '<button type="button" class="boom-loc__info-close" data-info-close aria-label="' + esc(i18n.close) + '">' +
            '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
            '</button>' +
            '<div class="boom-loc__info-head">' +
            '<span class="boom-loc__info-logo">' + logoHtml + '</span>' +
            '<span class="boom-loc__info-titles"><span class="boom-loc__info-name">' + esc(d.name) + '</span>' +
            (d.type ? '<span class="boom-loc__info-type">' + esc(d.type) + '</span>' : '') +
            '</span></div>' +
            (d.address
              ? '<div class="boom-loc__info-addr"><span class="boom-loc__pin" aria-hidden="true">◦</span>' +
                esc(d.address) +
                '</div>'
              : '') +
            '<div class="boom-loc__info-hours">' +
            hoursLines(d, i18n) +
            ' · <span class="boom-loc__info-status" data-open="' +
            st.open +
            '">' +
            st.label +
            (st.note ? ' · ' + st.note : '') +
            '</span></div>' +
            (d.phone
              ? '<a class="boom-loc__call" href="' + phoneHref + '">' + esc(i18n.call) + ' · ' + esc(d.phone) + '</a>'
              : '');
          infoEl.hidden = false;
          var closeBtn = infoEl.querySelector('[data-info-close]');
          if (closeBtn) closeBtn.addEventListener('click', clearSelection);
        }

        function select(id, pan) {
          var d = byId[id];
          Object.keys(markers).forEach(function (mid) {
            markers[mid].setIcon(mid === id ? pinIcon : dotIcon);
            markers[mid].setZIndex(mid === id ? 5 : 1);
          });
          cards.forEach(function (card) {
            var on = card.dataset.id === id;
            card.classList.toggle('is-selected', on);
            card.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (on) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          });
          if (d) renderInfo(d);
          if (pan && d && d.lat && d.lng) {
            map.panTo({ lat: d.lat, lng: d.lng });
            map.setZoom(focusZoom);
          }
        }

        function clearSelection() {
          Object.keys(markers).forEach(function (mid) {
            markers[mid].setIcon(dotIcon);
            markers[mid].setZIndex(1);
          });
          cards.forEach(function (card) {
            card.classList.remove('is-selected');
            card.setAttribute('aria-pressed', 'false');
          });
          infoEl.hidden = true;
          infoEl.innerHTML = '';
        }

        cards.forEach(function (card) {
          card.addEventListener('click', function () { select(card.dataset.id, true); });
        });

        pills.forEach(function (pill) {
          pill.addEventListener('click', function () {
            var city = pill.dataset.city;
            pills.forEach(function (p) {
              var on = p === pill;
              p.classList.toggle('is-active', on);
              p.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            cards.forEach(function (card) {
              card.style.display = !city || card.dataset.city === city ? '' : 'none';
            });
            data.forEach(function (d) {
              var m = markers[d.id];
              if (m) m.setMap(!city || d.city === city ? map : null);
            });
            clearSelection();
            fitVisible();
          });
        });

        fitVisible();

        instances[sectionId] = {
          cleanup: function () {
            Object.keys(markers).forEach(function (mid) { markers[mid].setMap(null); });
          },
        };
      })
      .catch(function () {
        mapEl.innerHTML =
          '<div class="boom-loc__map-note">' + esc(i18n.mapError) + '</div>';
      });
  }

  function scan() {
    Array.prototype.slice
      .call(document.querySelectorAll('[data-locations-root]'))
      .forEach(initRoot);
  }

  // Mirror the theme's scroll direction onto <html> so the mobile sticky map can
  // align with the reveal-on-scroll-up header (avoids a gap when it hides).
  var docEl = document.documentElement;
  document.addEventListener('theme:scroll:up', function () {
    docEl.setAttribute('data-boom-scrolldir', 'up');
  });
  document.addEventListener('theme:scroll:down', function () {
    docEl.setAttribute('data-boom-scrolldir', 'down');
  });

  window.__boomLocations = { scan: scan };

  if (document.readyState !== 'loading') {
    scan();
  } else {
    document.addEventListener('DOMContentLoaded', scan);
  }

  document.addEventListener('shopify:section:load', function (e) {
    var inst = instances[e.detail.sectionId];
    if (inst) { inst.cleanup(); delete instances[e.detail.sectionId]; }
    scan();
  });

  document.addEventListener('shopify:section:unload', function (e) {
    var inst = instances[e.detail.sectionId];
    if (inst) { inst.cleanup(); delete instances[e.detail.sectionId]; }
  });
})();
