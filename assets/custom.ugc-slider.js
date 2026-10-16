/* UGC Video Slider — Alpine component
   Registered on alpine:init; consumed by section-ugc-video-slider.liquid. */
document.addEventListener('alpine:init', () => {
  Alpine.data('ugcSlider', (i18n = {}) => ({
    // Strings passed in from the section; `__NAME__` / `__ROLE__` are sentinels.
    i18n: {
      testimonialBy: '__NAME__, __ROLE__',
      ...i18n,
    },
    blocks: [],
    count: 0,
    active: 0,
    visibleRadius: 2,
    inView: false,
    inViewportNow: false,
    muted: true,
    userPaused: false,
    progress: 0,
    videoReady: false,
    _io: null,

    init() {
      const tags = this.$root.querySelectorAll('.ugc-testimonial-data');
      this.blocks = [];
      tags.forEach((tag) => {
        try { this.blocks.push(JSON.parse(tag.textContent)); }
        catch (_) { /* skip malformed */ }
      });
      this.count = this.blocks.length;
      if (this.count < 1) return;
      this.visibleRadius = Math.min(2, Math.floor((this.count - 1) / 2));
      this._observeViewport();
      this._attachKeyboard();
      this._attachSwipe();
      this._announce();
    },

    destroy() {
      if (this._io) this._io.disconnect();
    },

    _observeViewport() {
      if (!('IntersectionObserver' in window)) {
        this.inView = true;
        this.inViewportNow = true;
        return;
      }
      this._io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          this.inViewportNow = entry.isIntersecting;
          if (entry.isIntersecting) {
            this.inView = true;
            const v = this.$refs.video;
            if (v && v.paused && !this.userPaused) {
              v.play().catch(() => {});
            }
          } else {
            const v = this.$refs.video;
            if (v && !v.paused) v.pause();
          }
        }
      }, { rootMargin: '0px', threshold: 0.15 });
      this._io.observe(this.$root);
    },

    _attachKeyboard() {
      this.$root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); this.prev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); this.next(); }
      });
    },

    _attachSwipe() {
      const SWIPE_THRESHOLD = 40;
      const DIRECTION_THRESHOLD = 8;
      let startX = 0, startY = 0;
      let tracking = false;
      let isHorizontal = null;

      const getPoint = (e) => {
        if (e.touches && e.touches.length) return e.touches[0];
        if (e.changedTouches && e.changedTouches.length) return e.changedTouches[0];
        return e;
      };
      const onStart = (e) => {
        const p = getPoint(e);
        tracking = true;
        isHorizontal = null;
        startX = p.clientX;
        startY = p.clientY;
      };
      const onMove = (e) => {
        if (!tracking || isHorizontal !== null) return;
        const p = getPoint(e);
        const dx = Math.abs(p.clientX - startX);
        const dy = Math.abs(p.clientY - startY);
        if (dx > DIRECTION_THRESHOLD || dy > DIRECTION_THRESHOLD) {
          isHorizontal = dx > dy;
        }
      };
      const onEnd = (e) => {
        if (!tracking) return;
        tracking = false;
        if (!isHorizontal) return;
        const p = getPoint(e);
        const dx = p.clientX - startX;
        if (Math.abs(dx) < SWIPE_THRESHOLD) return;
        this._justSwiped = true;
        setTimeout(() => { this._justSwiped = false; }, 350);
        if (dx < 0) this.next();
        else this.prev();
      };
      const onCancel = () => { tracking = false; };

      const root = this.$root;
      root.addEventListener('touchstart',  onStart,  { passive: true });
      root.addEventListener('touchmove',   onMove,   { passive: true });
      root.addEventListener('touchend',    onEnd,    { passive: true });
      root.addEventListener('touchcancel', onCancel, { passive: true });
    },

    _announce() {
      this.$watch('active', () => {
        const live = this.$refs.live;
        if (!live) return;
        const b = this.activeBlock();
        if (!b.name) return;
        live.textContent = this.testimonialLabel(b);
      });
    },

    testimonialLabel(b) {
      return this.i18n.testimonialBy
        .replace('__NAME__', (b && b.name) || '')
        .replace('__ROLE__', (b && b.role) || '');
    },

    next() { this.jumpTo((this.active + 1) % this.count); },
    prev() { this.jumpTo((this.active - 1 + this.count) % this.count); },

    jumpTo(i) {
      if (this._justSwiped) return;
      if (i === this.active) return;
      this.active = i;
      this.progress = 0;
      this.videoReady = false;
      this.$nextTick(() => this._syncVideo());
    },

    relativeOffset(blockIndex) {
      let diff = blockIndex - this.active;
      const half = this.count / 2;
      if (diff > half)  diff -= this.count;
      if (diff < -half) diff += this.count;
      return diff;
    },

    isVisible(blockIndex) {
      return Math.abs(this.relativeOffset(blockIndex)) <= this.visibleRadius;
    },
    isActive(blockIndex) { return blockIndex === this.active; },

    cardStyle(blockIndex) {
      const offset = this.relativeOffset(blockIndex);
      const abs = Math.abs(offset);
      const translate = offset * (this._mobile() ? 115 : 180);
      const rotateY = offset * -22;
      const scale = abs === 0 ? 1 : (abs === 1 ? 0.85 : 0.7);
      const z = 10 - abs;
      const op = abs > 1 ? 0.4 : 1;
      return `transform: translateX(${translate}px) scale(${scale}) rotateY(${rotateY}deg);
              z-index: ${z}; opacity: ${op};
              --ugc-g1: ${this.blocks[blockIndex].gradient_1};
              --ugc-g2: ${this.blocks[blockIndex].gradient_2};`;
    },

    _mobile() { return window.matchMedia('(max-width: 720px)').matches; },

    activeBlock() { return this.blocks[this.active] || {}; },

    activeVideoStyle() {
      const b = this.activeBlock();
      return `--ugc-active-g1: ${b.gradient_1}; --ugc-active-g2: ${b.gradient_2};`;
    },

    starsArray(rating) {
      const r = Math.max(0, Math.min(5, parseInt(rating, 10) || 0));
      return [1,2,3,4,5].map(i => i <= r);
    },

    _syncVideo() {
      const v = this.$refs.video;
      if (!v) return;
      try {
        v.currentTime = 0;
        v.muted = this.muted;
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch (_) { /* noop */ }
    },

    onTimeUpdate(event) {
      const v = event.target;
      if (!v || !v.duration) return;
      this.progress = (v.currentTime / v.duration) * 100;
    },

    onCanPlay() { this.videoReady = true; },

    onLoadedMetadata(event) {
      this._syncVideo();
    },

    toggleMute(event) {
      if (event) event.stopPropagation();
      this.muted = !this.muted;
      const v = this.$refs.video;
      if (v) v.muted = this.muted;
    },

    togglePlay(event) {
      if (event) event.stopPropagation();
      if (this._justSwiped) return;
      const v = this.$refs.video;
      if (!v) return;
      // First tap on a muted video turns the sound on rather than pausing —
      // users tap the video expecting to unmute, not seeing the mute button.
      if (this.muted) {
        this.muted = false;
        v.muted = false;
        this.userPaused = false;
        if (v.paused) v.play().catch(() => {});
        return;
      }
      if (v.paused) {
        this.userPaused = false;
        v.play().catch(() => {});
      } else {
        this.userPaused = true;
        v.pause();
      }
    },
  }));
});
