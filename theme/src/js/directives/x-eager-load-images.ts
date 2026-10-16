import Alpine, {Magics} from 'alpinejs';
import {requestIdleCallback} from '@theme/utils';

/**
 * On viewport intersection, upgrades lazy `<img>` descendants to `loading="eager"`.
 * The first image, currently-visible carousel slides (when used inside an
 * `x-carousel:track` scope), and anything passing `checkVisibility()` also get
 * `fetchpriority="high"` so the browser fetches them sooner.
 *
 * Intended for slider tracks where lazy-loading the visible slides delays
 * paint as soon as the track scrolls into view.
 *
 * Usage:
 *   <card-list-track x-carousel:track x-eager-load-images>...</card-list-track>
 */
Alpine.directive('eager-load-images', ($el) => {
  Alpine.bind($el, {
    'x-intersect:enter.once'(this: Magics<any>) {
      this.$nextTick(() => {
        requestIdleCallback(
          () => {
            const visibleIndices: number[] | undefined = (this as any).$carousel?.visibleIndices;
            $el.querySelectorAll<HTMLImageElement>('img').forEach((img, index) => {
              if (img.loading !== 'lazy') return;
              img.loading = 'eager';
              const isVisible = typeof img.checkVisibility === 'function' && img.checkVisibility();
              if (index === 0 || visibleIndices?.includes(index) || isVisible) {
                img.fetchPriority = 'high';
              }
            });
          },
          {
            timeout: 1000,
          },
        );
      });
    },
  });
}).before('bind');
