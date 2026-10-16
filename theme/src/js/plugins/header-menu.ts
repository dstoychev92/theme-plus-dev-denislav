import {Alpine as AlpineType, AlpineComponent, DirectiveData} from 'alpinejs';
import {tabbable} from 'tabbable';
import {requestIdleCallback} from '@theme/utils';

export type HeaderMenuNavItemMagic = {
  readonly hasMegaMenu: boolean;
  readonly hasSubLinks: boolean;
  readonly hasPopup: boolean;
  readonly hasActivePopup: boolean;
  readonly buttonEl: HTMLElement | null;
  openPopup(options?: {focus?: boolean}): void;
  closePopup(): void;
  togglePopup(options?: {focus?: boolean}): void;
};

export type HeaderMenuPopupMagic = {
  readonly isVisible: boolean;
  readonly referenceEl: HTMLElement | null;
  /** Store `activeFloatTargetEl` only while this popup is the active one; otherwise `null`. */
  readonly floatTargetEl: HTMLElement | null;
  close(): void;
  cancelClose(): void;
  scheduleClose(delay?: number): void;
};

/** Store shape for `Alpine.store('headerMenu')` (alias for global.d.ts / consumers). */
export type HeaderMenuStore = {
  activePopupId: string | null;
  activePopupType: 'flyout' | 'dropdown' | null;
  activeReferenceEl: HTMLElement | null;
  /** First `[data-float-target]` inside the active nav item (`#header-menu-nav-item-{id}`), if any. */
  activeFloatTargetEl: HTMLElement | null;
  get activePopup(): HTMLElement | null;
  isHoveringPopup: boolean;
  pendingFocus: boolean;
  popups: Map<string, {el: HTMLElement; type: 'flyout' | 'dropdown'}>;
  prevActivePopupId: string | null;
  prevActivePopupType: 'flyout' | 'dropdown' | null;
  themeEditorSelectedPopupId: string | null;
  open(menuId: string, referenceEl: HTMLElement | null, options?: {focus?: boolean}): void;
  close(): void;
  scheduleClose(delay?: number): void;
  cancelClose(): void;
};

export type HeaderMenu = HeaderMenuStore;

declare module 'alpinejs' {
  interface Magics<T> {
    $headerMenuPopup: HeaderMenuPopupMagic;
    $headerMenuNavItem: HeaderMenuNavItemMagic;
  }
}

let closeTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Resolve the float target from the element that opened the popup, since same-titled
 * duplicates share a menuId and the id lookup alone would anchor every duplicate's
 * dropdown to the first match. The menuId lookup stays as the fallback for callers
 * that open with no reference element (the theme editor's megamenu path).
 */
function findActiveFloatTargetEl(menuId: string, referenceEl: HTMLElement | null): HTMLElement | null {
  const navItem = referenceEl?.closest<HTMLElement>('[data-header-menu-nav-item]') ?? findNavItemEl(menuId);
  return navItem?.querySelector<HTMLElement>('[data-float-target]') ?? null;
}

/**
 * Same-titled links share a menu id by design, but their element ids carry a uniqueness
 * suffix — so nav items are matched by their data-menu-id attribute instead of the id.
 * Returns the first match, like the getElementById lookup this replaces.
 */
function findNavItemEl(menuId: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-header-menu-nav-item][data-menu-id="${CSS.escape(menuId)}"]`);
}

export type HeaderMenuNavigationItemData = AlpineComponent<{
  __headerMenuNavItem_megaMenu: Element | null;
  __headerMenuNavItem_buttonEl: HTMLElement | null;
  __headerMenuNavItem_linkEl: HTMLElement | null;
  get __headerMenuNavItem_hasMegaMenu(): boolean;
  get __headerMenuNavItem_hasSubLinks(): boolean;
  get __headerMenuNavItem_hasPopup(): boolean;
  get __headerMenuNavItem_hasActivePopup(): boolean;
  __headerMenuNavItem_openPopup(options?: {focus?: boolean}): void;
  __headerMenuNavItem_closePopup(): void;
  __headerMenuNavItem_togglePopup(options?: {focus?: boolean}): void;
}>;

export type HeaderMenuPopupData = AlpineComponent<{
  get __headerMenuPopup_menuId(): string;
  get __headerMenuPopup_isVisible(): boolean;
  get __headerMenuPopup_referenceEl(): HTMLElement | null;
  get __headerMenuPopup_floatTargetEl(): HTMLElement | null;
  __headerMenuPopup_close(): void;
  __headerMenuPopup_cancelClose(): void;
  __headerMenuPopup_scheduleClose(delay?: number): void;
  __headerMenuPopup_handleEscape(): void;
  __headerMenuPopup_handleFocusOut(event: FocusEvent): void;
}>;

const headerMenuStore = new Proxy<HeaderMenuStore>(
  {
    prevActivePopupId: null as string | null,
    prevActivePopupType: null as 'flyout' | 'dropdown' | null,
    activePopupId: null,
    popups: new Map<string, {el: HTMLElement; type: 'flyout' | 'dropdown'}>(),
    themeEditorSelectedPopupId: null,
    activeReferenceEl: null,
    activeFloatTargetEl: null,
    isHoveringPopup: false,
    pendingFocus: false,

    get activePopup(): HTMLElement | null {
      if (this.activePopupId == null) return null;
      return this.popups.get(this.activePopupId)?.el || null;
    },
    get activePopupType(): 'flyout' | 'dropdown' | null {
      if (this.activePopupId == null) return null;
      return this.popups.get(this.activePopupId)?.type || null;
    },

    open(menuId: string, referenceEl: HTMLElement | null, options?: {focus?: boolean; fromThemeEditor?: boolean}) {
      this.cancelClose();
      if (options?.focus) {
        this.pendingFocus = true;
      }
      if (options?.fromThemeEditor) {
        this.themeEditorSelectedPopupId = menuId;
      }
      this.activeReferenceEl = referenceEl;
      this.activeFloatTargetEl = findActiveFloatTargetEl(menuId, referenceEl);
      this.activePopupId = menuId;
    },

    close() {
      this.cancelClose();
      this.themeEditorSelectedPopupId = null;
      this.pendingFocus = false;
      this.activePopupId = null;
      this.activeReferenceEl = null;
      this.activeFloatTargetEl = null;
    },

    scheduleClose(delay = 200) {
      this.cancelClose();
      closeTimer = setTimeout(() => {
        closeTimer = null;
        this.pendingFocus = false;
        this.activePopupId = null;
        this.activeReferenceEl = null;
        this.activeFloatTargetEl = null;
      }, delay);
    },

    cancelClose() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    },
  },
  {
    set(target, prop, value) {
      if (prop === 'activePopupId' && value !== target.activePopupId) {
        target.prevActivePopupId = target.activePopupId;
        target.prevActivePopupType = target.activePopupType;
      }

      if (prop !== 'prevActivePopupId' && prop !== 'prevActivePopupType') {
        Reflect.set(target, prop, value);
      }

      return true;
    },
  },
);

/**
 * State and wiring for the desktop nav: the 'headerMenu' store tracks which popup
 * (dropdown or megamenu flyout) is open, and these directives open and close it.
 *
 * Directives:
 * - x-header-menu-nav-item="menuId" - A top-level nav item. Opens its popup on hover with a 100ms delay
 *   and schedules a close 200ms after the pointer leaves; mousedown outside closes it. Use the .sublinks
 *   modifier when the link has sub-links, so the item counts as having a popup before any megamenu registers
 * - x-header-menu-nav-item:link="menuId" - A link that toggles the popup instead of navigating (role="button",
 *   click / enter / space)
 * - x-header-menu-nav-item:button="menuId" - The keyboard disclosure button. Down arrow opens with focus
 *   moved into the popup, up arrow and escape close
 * - x-header-menu-popup="menuId" - Registers a popup panel with the store. Type is 'flyout' by default;
 *   use the .dropdown modifier for dropdowns. Escape closes and returns focus to the nav item, tabbing out
 *   closes and moves focus to the next item in the header, page scroll closes while the pointer is elsewhere
 *
 * Magics: $headerMenuNavItem and $headerMenuPopup (shapes above).
 *
 * Popups register into the store's popups Map keyed by menuId. A later registration for the
 * same menuId replaces the default panel, which is how a custom megamenu block claims a link.
 */
export default function headerMenu(Alpine: AlpineType) {
  Alpine.store('headerMenu', headerMenuStore);

  Alpine.directive('header-menu-nav-item', ($el: HTMLElement, data: DirectiveData) => {
    if (data.value === 'button') {
      handleHeaderMenuNavItemButton($el, Alpine, data);
    } else if (data.value === 'link') {
      handleHeaderMenuNavItemLink($el, Alpine, data);
    } else if (data.value === null) {
      handleHeaderMenuNavItemRoot($el, Alpine, data);
    } else {
      throw new Error(`Unknown directive: x-header-menu-nav-item:${String(data.value)}`);
    }
  }).before('bind');

  Alpine.directive('header-menu-popup', ($el: HTMLElement, data: DirectiveData) => {
    handleHeaderMenuPopup($el, Alpine, data);
  }).before('bind');

  Alpine.magic('headerMenuPopup', ($el) => {
    const $data = Alpine.$data($el) as HeaderMenuPopupData;
    return {
      get menuId() {
        return $data.__headerMenuPopup_menuId;
      },
      get isVisible() {
        return $data.__headerMenuPopup_isVisible;
      },
      get referenceEl() {
        return $data.__headerMenuPopup_referenceEl;
      },
      get floatTargetEl() {
        return $data.__headerMenuPopup_floatTargetEl;
      },
      close() {
        $data.__headerMenuPopup_close();
      },
      cancelClose() {
        $data.__headerMenuPopup_cancelClose();
      },
      scheduleClose(delay?: number) {
        $data.__headerMenuPopup_scheduleClose(delay);
      },
    };
  });

  Alpine.magic('headerMenuNavItem', ($el) => {
    const $data = Alpine.$data($el) as HeaderMenuNavigationItemData;
    return {
      get hasMegaMenu() {
        return $data.__headerMenuNavItem_hasMegaMenu;
      },
      get hasSubLinks() {
        return $data.__headerMenuNavItem_hasSubLinks;
      },
      get hasPopup() {
        return $data.__headerMenuNavItem_hasPopup;
      },
      get hasActivePopup() {
        return $data.__headerMenuNavItem_hasActivePopup;
      },
      get buttonEl() {
        return $data.__headerMenuNavItem_buttonEl;
      },
      openPopup(options?: {focus?: boolean}) {
        $data.__headerMenuNavItem_openPopup(options);
      },
      closePopup() {
        $data.__headerMenuNavItem_closePopup();
      },
      togglePopup(options?: {focus?: boolean}) {
        $data.__headerMenuNavItem_togglePopup(options);
      },
    };
  });
}

function handleHeaderMenuNavItemLink($el: HTMLElement, Alpine: AlpineType, {expression: menuId}: DirectiveData) {
  Alpine.bind($el, {
    'x-init'() {
      (this as any).__headerMenuNavItem_linkEl = $el;
    },
    role: 'button',
    ':aria-controls'() {
      return (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_hasPopup
        ? `header-menu-popup-${menuId}`
        : null;
    },
    ':aria-expanded'() {
      return (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_hasActivePopup;
    },
    ':aria-haspopup'() {
      return (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_hasPopup ? 'true' : null;
    },
    '@click.stop.prevent'() {
      if ((this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_hasPopup) {
        (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_togglePopup({focus: true});
      }
    },
    '@keydown.enter.stop.prevent'() {
      if ((this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_hasPopup) {
        (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_togglePopup({focus: true});
      }
    },
    '@keydown.space.stop.prevent'() {
      if ((this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_hasPopup) {
        (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_togglePopup({focus: true});
      }
    },
  });
}

function handleHeaderMenuNavItemButton($el: HTMLElement, Alpine: AlpineType, {expression: menuId}: DirectiveData) {
  Alpine.bind($el, {
    'x-init': '__headerMenuNavItem_buttonEl = $el',
    // Only reference the popup once it exists — custom megamenu blocks can claim a link
    // after load, and links without any popup never render one
    ':aria-controls'() {
      return (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_hasPopup
        ? `header-menu-popup-${menuId}`
        : null;
    },
    ':aria-expanded'() {
      return (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_hasActivePopup;
    },
    ':aria-haspopup'() {
      return 'true';
    },
    '@click'() {
      (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_togglePopup({focus: true});
    },
    '@keydown.down.stop.prevent'() {
      (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_openPopup({focus: true});
    },
    '@keydown.up.stop.prevent'() {
      (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_closePopup();
    },
    '@keydown.escape.stop.prevent'() {
      (this as unknown as HeaderMenuNavigationItemData).__headerMenuNavItem_closePopup();
    },
  });
}

function handleHeaderMenuNavItemRoot($el: HTMLElement, Alpine: AlpineType, {expression, modifiers}: DirectiveData) {
  const menuId = expression;
  const hasSubLinks = modifiers.includes('sublinks');

  Alpine.bind($el, {
    'x-data'(): HeaderMenuNavigationItemData {
      return {
        __headerMenuNavItem_megaMenu: null,
        __headerMenuNavItem_buttonEl: null,
        __headerMenuNavItem_linkEl: null,
        init() {
          requestIdleCallback(
            () => {
              this.__headerMenuNavItem_megaMenu = document.querySelector(`[data-megamenu="${menuId}"]`);
            },
            {
              timeout: 1000,
            },
          );
        },
        get __headerMenuNavItem_hasMegaMenu() {
          return this.__headerMenuNavItem_megaMenu !== null;
        },
        get __headerMenuNavItem_hasSubLinks() {
          return hasSubLinks;
        },
        get __headerMenuNavItem_hasPopup() {
          return this.__headerMenuNavItem_hasMegaMenu || this.__headerMenuNavItem_hasSubLinks;
        },
        get __headerMenuNavItem_hasActivePopup() {
          return this.$store.headerMenu.activePopupId === menuId;
        },
        __headerMenuNavItem_openPopup(options) {
          const referenceEl = (this.__headerMenuNavItem_linkEl ??
            this.__headerMenuNavItem_buttonEl) as HTMLElement | null;
          $el.scrollIntoView({behavior: 'smooth', block: 'nearest'});
          const headerMenuStoreRef = this.$store.headerMenu;
          if (options?.focus) {
            headerMenuStoreRef.open(menuId, referenceEl, options);
          } else {
            headerMenuStoreRef.pendingFocus = false;
            headerMenuStoreRef.open(menuId, referenceEl);
          }
          // scrollIntoView can reorder layout and fire x-hover:end → scheduleClose after open();
          // cancel again so a click-driven open is not torn down before the next toggle.
          headerMenuStoreRef.cancelClose();
        },
        __headerMenuNavItem_closePopup() {
          this.$store.headerMenu.close();
        },
        __headerMenuNavItem_togglePopup(options) {
          this.$store.headerMenu.cancelClose();
          if (this.__headerMenuNavItem_hasActivePopup) {
            this.__headerMenuNavItem_closePopup();
          } else {
            this.__headerMenuNavItem_openPopup(options);
          }
        },
      };
    },
    'x-hover:start.delay.100ms'() {
      const data = (this as unknown as {$data: HeaderMenuNavigationItemData}).$data;
      if (!data.__headerMenuNavItem_hasPopup) return;
      const store = Alpine.store('headerMenu');
      // Duplicate-titled nav items share a menuId, so `hasActivePopup` can't tell them apart.
      // Containment check is the tiebreaker: re-open to retarget the popup to this nav item.
      if (data.__headerMenuNavItem_hasActivePopup && $el.contains(store.activeReferenceEl)) return;
      data.__headerMenuNavItem_openPopup();
    },
    'x-hover:end.delay.200ms'() {
      const data = (this as unknown as {$data: HeaderMenuNavigationItemData}).$data;
      const store = Alpine.store('headerMenu');

      if (store.themeEditorSelectedPopupId === menuId) return;

      if (!data.__headerMenuNavItem_hasActivePopup || store.isHoveringPopup) return;

      // Only the nav item that currently owns the popup should schedule a close — otherwise a sibling
      // with the same menuId would tear down the popup after the user moved over to this item.
      if (!$el.contains(store.activeReferenceEl)) return;

      store.scheduleClose();
    },
    '@mousedown.window'() {
      const data = (this as unknown as {$data: HeaderMenuNavigationItemData}).$data;
      if (!data.__headerMenuNavItem_hasActivePopup) return;
      const event = (this as unknown as {$event: MouseEvent}).$event;
      const target = event.target as HTMLElement;
      if ($el.contains(target)) return;
      const store = Alpine.store('headerMenu');
      if (store.themeEditorSelectedPopupId === menuId) return;
      const activePopup = store.activePopup;
      if (activePopup?.contains(target)) return;
      data.__headerMenuNavItem_closePopup();
    },
  });
}

/** Shared implementation for `x-header-menu-popup` (also registered from `header-dropdown` / `megamenu` for lazy bundles). */
export function handleHeaderMenuPopup(
  $el: HTMLElement,
  Alpine: AlpineType,
  {expression: menuId, modifiers}: DirectiveData,
) {
  const type = modifiers.includes('dropdown') ? 'dropdown' : 'flyout';

  Alpine.bind($el, {
    'x-data'(): HeaderMenuPopupData {
      return {
        init() {
          const store = this.$store.headerMenu;
          const existing = store.popups.get(menuId);
          // Two panels can register for the same menuId: the auto-generated default and a
          // block-authored megamenu. The later one wins and we remove the previous so they don't
          // stack. `data-custom-megamenu` marks block-authored panels: only ever remove the default,
          // never a custom panel — otherwise a double-init (e.g. a section-morph re-running init)
          // would tear a custom megamenu out of the DOM.
          if (existing?.type === type && existing.el !== $el && !existing.el.hasAttribute('data-custom-megamenu')) {
            existing.el.remove();
          }
          store.popups.set(menuId, {type, el: $el});

          const tryFocusPending = () => {
            if (!store.pendingFocus) return;
            if (store.activePopupId !== menuId || store.activePopupType !== type) return;
            this.$nextTick(() => {
              window.requestAnimationFrame(() => {
                if (!store.pendingFocus) return;
                const [first] = tabbable($el);
                first?.focus();
                store.pendingFocus = false;
              });
            });
          };

          this.$watch('__headerMenuPopup_isVisible', (visible: boolean) => {
            if (visible) tryFocusPending();
          });
        },
        get __headerMenuPopup_menuId() {
          return menuId;
        },
        get __headerMenuPopup_isVisible() {
          return this.$store.headerMenu.activePopupId === menuId && this.$store.headerMenu.activePopupType === type;
        },
        get __headerMenuPopup_referenceEl() {
          if (!this.__headerMenuPopup_isVisible) return null;
          return (this.$store.headerMenu as HeaderMenuStore).activeReferenceEl;
        },
        get __headerMenuPopup_floatTargetEl() {
          if (!this.__headerMenuPopup_isVisible) return null;
          return (this.$store.headerMenu as HeaderMenuStore).activeFloatTargetEl;
        },
        __headerMenuPopup_close() {
          this.$store.headerMenu.close();
        },
        __headerMenuPopup_cancelClose() {
          this.$store.headerMenu.cancelClose();
        },
        __headerMenuPopup_scheduleClose(delay?: number) {
          this.$store.headerMenu.scheduleClose(delay);
        },
        __headerMenuPopup_handleEscape() {
          const headerMenu = this.$store.headerMenu as HeaderMenuStore;
          const activePopupId = headerMenu.activePopupId;
          const referenceEl = headerMenu.activeReferenceEl;
          headerMenu.close();
          if (activePopupId && referenceEl) {
            referenceEl.focus();
          }
        },

        __headerMenuPopup_handleFocusOut(event: FocusEvent) {
          const relatedTarget = event.relatedTarget as HTMLElement | null;
          if ($el.contains(relatedTarget)) return;
          if (
            this.__headerMenuPopup_referenceEl?.contains(relatedTarget) ||
            relatedTarget === this.__headerMenuPopup_referenceEl
          )
            return;

          const headerMenu = this.$store.headerMenu as HeaderMenuStore;
          if (headerMenu.activePopupId !== menuId || headerMenu.activePopupType !== type) return;

          const mid = headerMenu.activePopupId;
          const referenceEl = headerMenu.activeReferenceEl;
          headerMenu.close();

          if (!mid) return;

          const focusables = tabbable($el);
          const wasFirst = focusables.length > 0 && event.target === focusables[0];

          if (wasFirst && referenceEl) {
            referenceEl.focus();
            return;
          }

          if (!referenceEl) return;
          // Resolve from the reference element so tabbing out of a duplicate's popup lands
          // after the nav item that opened it, not after the first same-titled item
          const navItem = referenceEl.closest<HTMLElement>('[data-header-menu-nav-item]') ?? findNavItemEl(mid);
          if (!navItem) return;

          const header = navItem.closest('nav');
          if (!header) return;
          const headerFocusables = tabbable(header as HTMLElement);
          const lastInItem = tabbable(navItem).pop();
          const idx = lastInItem ? headerFocusables.indexOf(lastInItem) : -1;
          if (idx >= 0 && headerFocusables[idx + 1]) {
            headerFocusables[idx + 1].focus();
          }
        },
      };
    },
    '@keydown.escape.stop.prevent': '__headerMenuPopup_handleEscape',
    '@focusout': '__headerMenuPopup_handleFocusOut',
    '@scroll.window.throttle.750ms'(this: {$store: {headerMenu: unknown}}) {
      const headerMenu = this.$store.headerMenu as any;
      if (headerMenu.activePopupId === menuId && !headerMenu.isHoveringPopup) {
        headerMenu.close();
      }
    },
    'x-hover:start'(this: {$store: {headerMenu: unknown}}) {
      const headerMenu = this.$store.headerMenu as any;
      if (headerMenu.activePopupId === menuId) {
        headerMenu.isHoveringPopup = true;
      }
    },
    'x-hover:end.delay.200ms'(this: any) {
      if (this.$store.headerMenu.themeEditorSelectedPopupId === menuId) return;
      const headerMenu = this.$store.headerMenu as any;
      if (headerMenu.activePopupId !== menuId || !headerMenu.isHoveringPopup) return;

      // Pointer has left the popup — reset before any other early return, otherwise the flag goes
      // stale and the nav item's x-hover:end (which also gates on isHoveringPopup) refuses to close.
      headerMenu.isHoveringPopup = false;

      // Ensures the megamenu stays open when we hover from one duplicate-titled nav item to another
      // or when hovering in this order: duplicate-titled nav item -> megamenu -> another duplicate-titled nav item
      const relatedTarget = (this.$event as PointerEvent).relatedTarget as Element | null;
      if (relatedTarget?.closest(`[data-header-menu-nav-item][data-menu-id="${CSS.escape(menuId)}"]`)) return;

      headerMenu.scheduleClose();
    },
  });
}
