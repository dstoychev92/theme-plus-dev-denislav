// @ts-nocheck
import Alpine from 'alpinejs';
// @ts-ignore
import collapse from '@alpinejs/collapse';
import focus from '@alpinejs/focus';
// @ts-ignore
import morph from '@alpinejs/morph';
// @ts-ignore
import intersect from '@alpinejs/intersect';
// @ts-ignore
import persist from '@alpinejs/persist';
// @ts-ignore
import resize from '@alpinejs/resize';
// @ts-nocheck
export * from 'tabbable';

import {
  cache,
  photoswipe,
  sectionApi,
  popup,
  float,
  listbox,
  select,
  dialog,
  animationUtils,
  disclosure,
  ensemble,
  overflow,
  readMore,
  hold,
  tabs,
  notification,
  section,
  rovingTab,
  focusMatch,
  scrollList,
  parallax,
  asyncLink,
  asyncForm,
  slideshow,
  range,
  tooltip,
  productForm,
  imageLoadingPlaceholder,
  stepper,
  hover,
  focusInState,
  focusState,
  clone,
  submittableTextarea,
  predictiveSearch,
  media,
  scrollLock,
  clipboard,
  keyboardActive,
  focusPark,
  focusReturn,
  countdown,
  currency,
  listState,
  popover,
  utils,
  stickyColumns,
  pan,
  cartForm,
  cartItem,
  cartApiSection,
  pageLayout,
  press,
  sharedLayout,
  lazyAlpine,
  carousel,
  animatedWheel,
  cursorPosition,
  gradientFollow,
  linkArea,
  selectionGroup,
} from '@groupthought/tradecraft-ui/alpine';

import headerMenu from './plugins/header-menu';
import headerDropdown from './plugins/header-dropdown';
import productCard from './plugins/product-card';
import sectionDisclosureGroup from './plugins/section-disclosure-group';
import sectionIntersectionManager from './plugins/section-intersection-manager';
import sectionSlideshow from './plugins/section-slideshow';
import sectionTabs from './plugins/section-tabs';
import standardEvents from './plugins/standard-events';
import video from './plugins/video';

import './directives';
import './stores';

import {isShopifyAppBlock, isShopifyElement, onDocumentReady, requestIdleCallback} from '@theme/utils';

/* Method UI plugins */
Alpine.plugin([
  collapse,
  focus as any,
  morph,
  intersect,
  persist,
  resize,
  rovingTab,
  focusMatch,
  parallax,
  popup,
  float,
  overflow,
  readMore,
  hold,
  tabs,
  listbox,
  select,
  scrollList,
  animationUtils,
  range,
  disclosure,
  dialog,
  section,
  cache,
  asyncLink,
  asyncForm,
  slideshow,
  notification,
  productForm,
  imageLoadingPlaceholder,
  tooltip,
  stepper,
  hover,
  focusState,
  focusInState,
  clone,
  submittableTextarea,
  predictiveSearch,
  scrollLock,
  countdown,
  currency,
  listState,
  popover,
  clipboard,
  keyboardActive,
  focusPark,
  focusReturn,
  utils,
  stickyColumns,
  pan,
  cartForm,
  cartItem,
  cartApiSection,
  pageLayout,
  press,
  photoswipe({
    pswpModule: () => import('photoswipe'),
    // Plugin requires a container element to be present in the DOM preferably at the end of the body tag
    appendToEl: document.querySelector<HTMLElement>('[data-photoswipe-container]') || undefined,
  }),
  ensemble,
  carousel,
  productCard,
  sharedLayout,
  animatedWheel,
  cursorPosition,
  gradientFollow,
  linkArea,
  selectionGroup,
  sectionIntersectionManager,
  sectionSlideshow,
  sectionTabs,
  sectionDisclosureGroup,
  headerMenu,
  headerDropdown,
  standardEvents,
  video,
  (Alpine) =>
    lazyAlpine(Alpine, {
      // Named viewport conditions for media-gated lazy roots (data-lazy-alpine="desktop"),
      // matching the theme's CSS breakpoints.
      mediaConditions: {
        desktop: `(min-width: ${window.theme.screen.md}px)`,
        mobile: `(max-width: ${window.theme.screen.md - 1}px)`,
        // For markup that renders one copy per breakpoint band, where `desktop` is too
        // wide because it also covers the tablet copy's range.
        tablet: `(min-width: ${window.theme.screen.md}px) and (max-width: ${window.theme.screen.lg - 1}px)`,
        wide: `(min-width: ${window.theme.screen.lg}px)`,
      },
    }),
  sectionApi({
    morphConfig: {
      // Customize theme-wide section morphing behaviour here

      updating(el: HTMLElement, toEl: HTMLElement, childrenOnly: () => void, skip: () => void) {
        // Call `skip()` to prevent an element from being removed
        // Call `childrenOnly()` to prevent an element from being updated but allow it's children to be updated

        // Skip any built-in shopify elements
        if (isShopifyElement(el)) {
          skip();
        }

        // Skip updating app blocks to prevent breaking apps like Recharge. You may want to update or remove this logic depending on your theme's needs
        if (isShopifyAppBlock(el)) {
          skip();
        }
      },
      removing(el: HTMLElement, skip: () => void) {
        // Call `skip()` to prevent an element from being removed

        if (isShopifyElement(el)) {
          skip();
        }

        if (isShopifyAppBlock(el)) {
          skip();
        }
      },
    } as any,
  }),
]);

Alpine.store('cache').addResource('models');

Alpine.plugin(
  // These breakpoints should match the CSS breakpoint values
  media({
    sm: `(max-width: ${window.theme.screen.md - 1}px)`,
    md: `(min-width: ${window.theme.screen.md}px) and (max-width: ${window.theme.screen.lg - 1}px)`,
    lg: `(min-width: ${window.theme.screen.lg}px) and (max-width: ${window.theme.screen.xl - 1}px)`,
    xl: `(min-width: ${window.theme.screen.xl}px) and (max-width: ${window.theme.screen['2xl'] - 1}px)`,
    '2xl': `(min-width: ${window.theme.screen['2xl']}px)`,
    touch: '(pointer: coarse) and (hover: none)',
  }),
);

// Allow global access to Alpine in case things like Alpine.bind or Alpine.store are needed
window.Alpine = Alpine;

// Wait until DOM has loaded before starting Alpine so that any script tags that add plugins, data, stores, etc. have all run
onDocumentReady(() => {
  // Reduce the risk of blocking the main thread by yielding to the main thread after the DOM has loaded before starting Alpine
  requestIdleCallback(
    () => {
      Alpine.start();
    },
    {
      timeout: 2000,
    },
  );
});
