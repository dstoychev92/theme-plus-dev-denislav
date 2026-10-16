import { isHtmlElement, mergeProperties } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
import { handlePopupMagic } from './popup';
const selectors = {
    menu: '[role="menu"]',
    menuOption: '[role="menuitem"]',
    enabledMenuOption: '[role="menuitem"]:not([aria-disabled=true])',
};
/**
 * Plugin for building dropdown menus that follow the ARIA menu-button pattern
 * https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 * Builds on x-popup for the open state and positioning, x-roving-tab for arrow-key
 * focus, and x-focus-match for type-ahead. Does not support submenus yet.
 *
 * Directives:
 * - x-menu - The root element.
 * - x-menu:button - The button that toggles the menu (aria-haspopup="menu"). ArrowDown
 *   opens the menu and focuses the first item; ArrowUp opens it and focuses the last.
 * - x-menu:popup - The floating panel around the menu. Modifiers are x-float positioning
 *   modifiers (default: bottom-start.flip.update.shift).
 * - x-menu:menu - The list itself (role="menu"). Arrow keys move focus through enabled
 *   items and wrap; typing a character focuses the next item that starts with it.
 * - x-menu:item - A menu item (role="menuitem"). Items with aria-disabled="true" are
 *   skipped in keyboard navigation.
 *
 * The $menu magic: everything on $popup, plus bindButton(el) to register a button that
 * is not a child of the x-menu element.
 *
 * @example
 *
 * <div x-menu>
 *   <button x-menu:button>Actions</button>
 *   <div x-menu:popup x-cloak>
 *     <ul x-menu:menu>
 *       <li><button x-menu:item>Duplicate</button></li>
 *       <li><button x-menu:item>Delete</button></li>
 *     </ul>
 *   </div>
 * </div>
 */
export default function (Alpine) {
    Alpine.directive('menu', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'item') {
            handleItem($el, Alpine);
        }
        else if (data.value === 'popup') {
            handlePopup($el, Alpine, data);
        }
        else if (data.value === 'button') {
            handleButton($el, Alpine);
        }
        else if (data.value === 'menu') {
            handleMenu($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-menu:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('menu', handleMenuMagic(Alpine));
}
function handleMenuMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return mergeProperties({}, {
            bindButton(el) {
                Alpine.nextTick(() => {
                    Alpine.addScopeToNode(el, {}, $data.__menu_rootEl);
                    handleButton(el, Alpine);
                });
            },
        }, handlePopupMagic(Alpine)($el));
    };
}
function handleItem($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__menu_isRoot) {
                warnMissingParentDirective('x-menu:item', 'x-menu', this.$el);
            }
        },
        role: 'menuitem',
    });
}
function handleButton($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__menu_isRoot) {
                warnMissingParentDirective('x-menu:button', 'x-menu', this.$el);
                return;
            }
            this.__menu_buttonEl = this.$el;
        },
        'x-popup:target': '',
        'x-popup:button': '',
        ':tabindex': '0',
        ':id': "$el.id || $id('menu-button')",
        ':aria-haspopup': "'menu'",
        '@keydown.down.stop.prevent': `
      $data.__menu_openingKey = $event.key;
      $disclosure.expand();
    `,
        '@keydown.up.stop.prevent': `
      $data.__menu_openingKey = $event.key;
      $disclosure.expand();
    `,
    });
}
function handlePopup($el, Alpine, data) {
    Alpine.bind($el, Object.assign(Object.assign({}, (data.modifiers.length
        ? {
            [`x-popup:popup.${data.modifiers.join('.')}`]: '',
        }
        : {
            [`x-popup:popup.bottom-start.flip.update.shift`]: '',
        })), { 'x-init'() {
            if (!this.__menu_isRoot) {
                warnMissingParentDirective('x-menu:popup', 'x-menu', this.$el);
                return;
            }
            this.__menu_popupEl = this.$el;
        } }));
}
function handleMenu($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.__menu_isRoot) {
                        warnMissingParentDirective('x-menu:menu', 'x-menu', this.$el);
                        return;
                    }
                    this.$nextTick(() => {
                        this.$watch('$disclosure.isExpanded', async (open) => {
                            // Bail early if menu isn't open
                            if (!open)
                                return;
                            await this.$disclosure.waitForAnimations();
                            if (this.$data.__menu_openingKey == 'ArrowUp') {
                                this.$rovingTab.focusLast();
                            }
                            else {
                                this.$rovingTab.focusFirst();
                            }
                        });
                    });
                },
                __menu_getEnabledOptions() {
                    // Find all enabled menu items which are part of this menu, not a nested menu
                    // This is most definitley not super fast but I'm unaware of a better way to do it right now. Suggestions please!!
                    return [...this.$el.querySelectorAll(`${selectors.enabledMenuOption}`)].filter((el) => {
                        return el.closest(selectors.menu) == this.$el;
                    });
                },
            };
        },
        role: 'menu',
        ':id'() {
            return this.__menu_id;
        },
        'x-init'() {
            // The x-data init() above already warns when __menu_isRoot is missing; just guard the assignment here.
            if (!this.__menu_isRoot)
                return;
            this.__menu_menuEl = this.$el;
        },
        'x-roving-tab.vertical.wrap': `__menu_getEnabledOptions`,
        'x-roving-tab:list': ``,
        'x-focus-match': `__menu_getEnabledOptions()`,
        'x-focus-match:list': ``,
        ':tabindex': '-1',
        ':aria-labelledby'() {
            var _a;
            return (_a = this.__menu_buttonEl) === null || _a === void 0 ? void 0 : _a.id;
        },
    });
}
function handleRoot($el, Alpine, { modifiers }) {
    const popupModifiers = modifiers.filter((modifier) => ['open', 'debug'].includes(modifier));
    Alpine.bind($el, Object.assign(Object.assign({}, (popupModifiers.length
        ? {
            [`x-popup.${popupModifiers.join('.')}`]: '',
        }
        : {
            'x-popup': '',
        })), { 'x-id': "['menu-button']", ['x-data']() {
            return {
                __menu_isRoot: true,
                __menu_id: null,
                __menu_rootEl: null,
                __menu_buttonEl: null,
                __menu_popupEl: null,
                __menu_menuEl: null,
                __menu_openingKey: null,
                init() {
                    this.$watch('$disclosure.isExpanded', async (open) => {
                        if (!open) {
                            await this.$disclosure.waitForAnimations();
                            this.__menu_openingKey = null;
                        }
                    });
                },
                destroy() {
                    // TODO test me
                    this.__menu_openingKey = null;
                },
            };
        }, 'x-init': '__menu_rootEl = $el' }));
}
