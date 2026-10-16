import {AlpineComponent, Alpine as AlpineType, DirectiveData} from 'alpinejs';

/**
 * Analog wrapper around `x-slider-reveal` for the before/after snippet.
 *
 * `x-before-after-slider-reveal` forwards its modifiers to `x-slider-reveal` unchanged
 * and ties scroll control to section visibility from `$store.sections`: it calls
 * `$sliderReveal.enableScroll()` while the section intersects the viewport and
 * `$sliderReveal.disableScroll()` when it scrolls out, so offscreen sliders do no
 * scroll work.
 *
 * @example
 * <before-after x-before-after-slider-reveal.vertical.from.0%.progress.50%>…</before-after>
 */
export default function beforeAfterSliderReveal(Alpine: AlpineType) {
  Alpine.directive('before-after-slider-reveal', ($el: HTMLElement, data: DirectiveData) => {
    Alpine.bind($el, {
      [`x-slider-reveal${data.modifiers.length ? `.${data.modifiers.join('.')}` : ''}`]: '',
      ['x-data'](): AlpineComponent<{
        isIntersecting: boolean;
      }> {
        return {
          get isIntersecting() {
            return this.$store.sections.isIntersecting(this.$sectionId!);
          },
          init(this: any) {
            this.$nextTick(() => {
              if (this.isIntersecting) {
                this.$sliderReveal.enableScroll();
              }

              this.$watch('isIntersecting', (isVisible: boolean) => {
                if (this.$store.sections.hasIntersected(this.$sectionId)) {
                  if (isVisible) {
                    this.$sliderReveal.enableScroll();
                  } else {
                    this.$sliderReveal.disableScroll();
                  }
                }
              });
            });
          },
        };
      },
    });
  }).before('bind');
}
