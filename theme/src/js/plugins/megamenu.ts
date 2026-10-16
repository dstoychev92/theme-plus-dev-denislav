import {AlpineComponent, Alpine as AlpineType, DirectiveData} from 'alpinejs';

import {animate, AnimationPlaybackControls} from 'motion';
import {unstable_animateLayout as animateLayout} from 'motion-plus/animate-layout';
import {isLowPowerDevice, isReducedMotion} from '@groupthought/tradecraft-ui/utils';

const OPEN_DURATION = 0.32;
const TRANSITION_DURATION = 0.3;
const CLOSE_DURATION = 0.26;

/** Clip closed = no visible height; opens with a top-to-bottom reveal */
const CLIP_CLOSED = 'inset(0% 0% 100% 0%)';
const CLIP_OPEN = 'inset(0% 0% 0% 0%)';

const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Space to leave between the megamenu panel bottom and the viewport bottom (px). */
const VIEWPORT_BOTTOM_BUFFER_PX = 24;

function useOpacityPanelReveal(): boolean {
  return isReducedMotion() || isLowPowerDevice();
}

function clearPanelClip(el: Element | null): void {
  if (!el || !(el instanceof HTMLElement)) return;
  el.style.removeProperty('clip-path');
  el.style.removeProperty('will-change');
}

function clearPanelOpacity(el: Element | null): void {
  if (!el || !(el instanceof HTMLElement)) return;
  el.style.removeProperty('opacity');
}

function setMegamenuVisible(el: unknown, visible: boolean): void {
  if (!(el instanceof HTMLElement)) return;
  if (visible) {
    el.setAttribute('data-megamenu-visible', '');
  } else {
    el.removeAttribute('data-megamenu-visible');
  }
}

type MegaMenuData = AlpineComponent<{
  /** Which flyout block is shown; may lag store briefly during close animation */
  displayedContentId: string | null;
  /** True while exit clip animation runs after store already left flyout */
  isClosingPanel: boolean;
  /** True while the megamenu is visible */
  isActive: boolean;
  activeContentId: string | null;

  panelRevealControls: AnimationPlaybackControls | null;
  panelEl: HTMLElement | null;
  contentEls: Map<string, HTMLElement>;

  init(): void;
  // syncPanelToStore(): void;
  openMegaMenu(id: string): Promise<void>;
  beginCloseMegaMenu(): Promise<void>;
  transitionMegaMenu(fromId: string, toId: string): Promise<void>;

  stopPanelRevealAnimation(): void;
}>;

/**
 * The header's megamenu: one shared panel that reveals, swaps, and closes flyout content
 * for the whole nav. Which flyout is open lives in the headerMenu store; this plugin
 * animates the panel to follow it.
 *
 * Directives:
 * - x-megamenu - The root. Watches the store's active flyout and runs the open, swap, and close animations
 * - x-megamenu:panel - The shared panel every flyout renders into. Carries data-megamenu-visible while shown;
 *   its max-height is capped to the visual viewport minus a 24px bottom buffer
 * - x-megamenu:content="menuId" - A flyout's content. Registers as the 'flyout' popup for that menu id
 *   and stays hidden unless it is the displayed content
 *
 * The panel opens with a top-to-bottom clip reveal and falls back to an opacity fade on
 * reduced-motion or low-power devices. Moving between two flyouts animates the panel between
 * the two layouts instead of closing and reopening.
 */
export default function megamenu(Alpine: AlpineType) {
  const waitNextTick = () => new Promise<void>((resolve) => Alpine.nextTick(() => resolve()));

  Alpine.directive('megamenu', ($el: HTMLElement, {value, expression}: DirectiveData) => {
    if (value === 'content') {
      const menuId = expression;
      Alpine.bind($el, {
        'x-header-menu-popup.flyout': menuId,
        ':hidden': 'displayedContentId !== $headerMenuPopup.menuId',
      });
      return;
    }

    if (value === 'panel') {
      Alpine.bind($el, {
        'x-init'() {
          const data = Alpine.$data($el) as unknown as MegaMenuData;
          data.panelEl = $el;
        },
        'x-show'(this: any) {
          const data = Alpine.$data($el) as unknown as MegaMenuData;
          const store = Alpine.store('headerMenu') as any;
          return store.activePopupType === 'flyout' || data.isClosingPanel;
        },
      });
      return;
    }

    Alpine.bind($el, {
      'x-data'(): MegaMenuData {
        return {
          panelRevealControls: null,
          contentEls: new Map(),
          displayedContentId: null,
          panelEl: null,
          isClosingPanel: false,

          get isActive() {
            return this.$store.headerMenu.activePopupType === 'flyout';
          },
          get activeContentId() {
            if (this.$store.headerMenu.activePopupType !== 'flyout') return null;
            return this.$store.headerMenu.activePopupId;
          },

          init() {
            this.$watch('activeContentId', (activeContentId: string, prevActiveContentId: string) => {
              if (activeContentId !== null && prevActiveContentId == null) {
                this.openMegaMenu(activeContentId);
              } else if (activeContentId !== null && prevActiveContentId !== null) {
                this.transitionMegaMenu(prevActiveContentId, activeContentId);
              } else if (activeContentId == null && prevActiveContentId !== null) {
                this.beginCloseMegaMenu();
              }
            });
          },

          stopPanelRevealAnimation(): void {
            if (!this.panelRevealControls?.stop) return;
            this.panelRevealControls.stop();
            this.panelRevealControls = null;
          },

          async openMegaMenu(id: string): Promise<void> {
            if (!this.panelEl) return;
            this.stopPanelRevealAnimation();
            setMegamenuVisible(this.panelEl, true);

            await new Promise<void>((r) => window.requestAnimationFrame(() => r()));

            const rect = this.panelEl.getBoundingClientRect()!;
            const maxHeight = Math.max(0, this.$store.page.visualViewportHeight - rect.top - VIEWPORT_BOTTOM_BUFFER_PX);

            const el = this.panelEl as unknown as HTMLElement;
            const fadeReveal = useOpacityPanelReveal();

            el.style.maxHeight = `${maxHeight}px`;

            if (fadeReveal) {
              clearPanelClip(el);
              el.style.willChange = 'opacity';
              el.style.opacity = '0';
            } else {
              el.style.willChange = 'clip-path';
              el.style.clipPath = CLIP_CLOSED;
            }

            this.displayedContentId = id;

            // Wait for content to update
            await waitNextTick();

            const controls = fadeReveal
              ? animate(el, {opacity: 1}, {duration: OPEN_DURATION, ease: REVEAL_EASE})
              : animate(el, {clipPath: CLIP_OPEN} as Parameters<typeof animate>[1], {
                  duration: OPEN_DURATION,
                  ease: REVEAL_EASE,
                });
            this.panelRevealControls = controls;
            try {
              await controls.finished;
            } catch {
              /* stopped via stopPanelRevealAnimation */
            } finally {
              if (this.panelRevealControls === controls) {
                this.panelRevealControls = null;
              }
              el.style.removeProperty('will-change');
              const store = Alpine.store('headerMenu') as any;
              if (store.activePopupType === 'flyout' && store.activePopupId === id) {
                if (fadeReveal) {
                  el.style.removeProperty('opacity');
                } else {
                  el.style.clipPath = CLIP_OPEN;
                }
              }
            }
          },

          async beginCloseMegaMenu(): Promise<void> {
            this.stopPanelRevealAnimation();
            this.isClosingPanel = true;

            if (!this.panelEl) {
              this.displayedContentId = null;
              this.isClosingPanel = false;
              return;
            }

            const el = this.panelEl as unknown as HTMLElement;
            const fadeReveal = useOpacityPanelReveal();

            if (fadeReveal) {
              clearPanelClip(el);
              el.style.willChange = 'opacity';

              const controls = animate(el, {opacity: 0}, {duration: CLOSE_DURATION, ease: REVEAL_EASE});
              this.panelRevealControls = controls;
              try {
                await controls.finished;
              } catch {
                /* stopped */
              } finally {
                if (this.panelRevealControls === controls) {
                  this.panelRevealControls = null;
                }
                el.style.removeProperty('will-change');
                const store = Alpine.store('headerMenu') as any;
                if (store.activePopupType !== 'flyout') {
                  this.displayedContentId = null;
                  setMegamenuVisible(el, false);
                }
                this.isClosingPanel = false;
                clearPanelOpacity(el);
                clearPanelClip(el);
                el.style.removeProperty('max-height');
              }
              return;
            }

            el.style.willChange = 'clip-path';

            const controls = animate(el, {clipPath: CLIP_CLOSED} as Parameters<typeof animate>[1], {
              duration: CLOSE_DURATION,
              ease: REVEAL_EASE,
            });
            this.panelRevealControls = controls;
            try {
              await controls.finished;
            } catch {
              /* stopped */
            } finally {
              if (this.panelRevealControls === controls) {
                this.panelRevealControls = null;
              }
              el.style.removeProperty('will-change');
              const store = Alpine.store('headerMenu') as any;
              if (store.activePopupType !== 'flyout') {
                this.displayedContentId = null;
                setMegamenuVisible(el, false);
              }
              this.isClosingPanel = false;
              clearPanelClip(el);
              el.style.removeProperty('max-height');
            }
          },

          async transitionMegaMenu(_fromId: string, toId: string): Promise<void> {
            if (isLowPowerDevice()) {
              this.displayedContentId = toId;
              await waitNextTick();
              return;
            }

            await animateLayout(
              this.panelEl as unknown as HTMLElement,
              () => {
                this.displayedContentId = toId;
              },
              {duration: TRANSITION_DURATION},
            );
            await waitNextTick();
          },
        };
      },
    });
  }).before('bind');
}
