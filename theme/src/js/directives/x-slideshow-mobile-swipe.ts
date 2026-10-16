import Alpine, {AlpineComponent, Magics} from 'alpinejs';
import type {MotionValue} from 'motion';
import {motionValue, styleEffect} from 'motion';

type SlideshowTransitionComponent = AlpineComponent<{
  transitionProgress: MotionValue<number>;
  styleEffect: VoidFunction | null;
  width: number;
}>;

Alpine.directive('slideshow-mobile-swipe', ($el) => {
  Alpine.bind($el, {
    ['x-data'](this: any): SlideshowTransitionComponent {
      return {
        width: 0,
        transitionProgress: motionValue(0),
        styleEffect: null,
        init() {
          if (!this.$media.matches.touch) return;

          this.styleEffect = styleEffect($el, {
            '--slideshow-mobile-swipe-progress': this.transitionProgress as MotionValue<number>,
          });
        },
        destroy() {
          this.styleEffect?.();
          this.styleEffect = null;
          this.transitionProgress.set(0);
        },
      };
    },
    'x-pan': '',
    '@panstart'(this: Magics<any> & SlideshowTransitionComponent & {$event: any}) {
      if (!this.$media.matches.touch) return;
      this.transitionProgress.set(0);
    },
    '@panmove'(this: Magics<any> & SlideshowTransitionComponent & {$event: any}) {
      if (!this.$media.matches.touch || this.width === 0) return;

      const deltaX = this.$event.detail.panSession.panDeltaX;
      const swipeDistance = this.width / 2;
      const maxProgress = 0.5;

      // Map panDeltaX from [-threshold, 0, threshold] to [maxProgress, 0, maxProgress]
      // This creates a symmetric mapping where swiping in either direction increases progress
      const progress = Math.min(maxProgress, (Math.abs(deltaX) / swipeDistance) * maxProgress);

      this.transitionProgress.set(progress);
    },
    '@panend'(this: Magics<any> & SlideshowTransitionComponent & {$event: any}) {
      if (!this.$media.matches.touch) return;

      // Threshold for swipe to trigger next or previous slide
      const swipeThreshold = this.width / 4;

      if (this.$event.detail.panSession.panDeltaX > swipeThreshold) {
        this.$nextTick(() => {
          this.$slideshow.pause();
          this.$slideshow.prev();
          this.transitionProgress.set(0);
        });
      } else if (this.$event.detail.panSession.panDeltaX < -swipeThreshold) {
        this.$nextTick(() => {
          this.$slideshow.pause();
          this.$slideshow.next();
          this.transitionProgress.set(0);
        });
      } else {
        this.transitionProgress.set(0);
      }
    },
    'x-resize'(this: Magics<any> & SlideshowTransitionComponent & {$width: number}) {
      this.width = this.$width;
    },
  });
});
