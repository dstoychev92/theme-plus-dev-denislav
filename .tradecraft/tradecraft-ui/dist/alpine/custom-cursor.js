import { springValue, styleEffect } from 'motion';
import { getSpringModifierConfig } from '../utils/modifiers';
import { onFirstLayout } from '../utils/layout-measure';
import { isTouchOnlyDevice } from '../utils/dom';
import { warnMissingParentDirective } from '../utils/error';
const MIN_MASS = 0.01;
const SPRING_DEFAULT_CONFIG = {
    stiffness: 120,
    mass: MIN_MASS,
};
/**
 * Plugin to create a custom cursor that follows the mouse with spring physics,
 * snaps to snap points, and supports named cursor variants.
 *
 * Inspired by https://medium.com/14islands/developing-a-performant-custom-cursor-89f1688a02eb
 *
 * ## Touch devices
 *
 * On a device whose main pointer cannot hover (a phone or tablet) every directive below
 * does nothing at all — no state, no spring animations, no mouse listeners. `$customCursor`
 * still reads safely there, returning `undefined` for each value, so markup that binds to
 * it keeps working. Hide the cursor elements themselves with CSS for those devices.
 *
 * ## Directives
 *
 * - `x-custom-cursor` — Root element. Tracks mouse enter/leave/move.
 * - `x-custom-cursor:element` — Cursor element, positioned via spring-animated translateX/Y.
 *   Accepts an optional name (e.g. `x-custom-cursor:element="plus"`) for named cursors.
 *   Unnamed elements act as the default cursor.
 * - `x-custom-cursor:snap-point` — Snaps the cursor to this element's center on hover.
 *
 * ## Spring modifiers (on `x-custom-cursor:element`)
 *
 * - `.mass.<n>` — Spring mass (default: {@link SPRING_DEFAULT_CONFIG}). Higher = heavier/slower.
 * - `.stiffness.<n>` — Spring stiffness. Higher = snappier.
 * - `.damping.<n>` — Spring damping. Higher = less oscillation.
 *
 * ## Data attributes (on descendant elements inside the root)
 *
 * - `data-custom-cursor="<name>"` — Shows the named cursor when hovering this element.
 * - `data-hide-custom-cursor` — Hides all cursors when hovering this element.
 *
 * ## Reactive data attributes (set automatically on cursor/snap-point elements)
 *
 * - `data-active` — Present on a cursor element when it is the currently active cursor.
 * - `data-hidden` — Present when the cursor is over a `data-hide-custom-cursor` zone
 *   or when the cursor element would overflow the root bounds.
 * - `data-snapped` — Present when the cursor is snapped to a snap point.
 *
 * ## Magic: `$customCursor`
 *
 * - `$customCursor.isActive` — Whether the cursor is inside the root.
 * - `$customCursor.isSnapped` — Whether the cursor is snapped to a snap point.
 * - `$customCursor.isHidden` — Whether the cursor is in a hide zone.
 * - `$customCursor.targetPosition` — Current target `{x, y}` in viewport coordinates.
 * - `$customCursor.snap(el)` — Programmatically snap to an element.
 * - `$customCursor.unsnap()` — Programmatically unsnap.
 *
 * @example
 *
 * ```html
 * <div x-custom-cursor>
 *   <div x-custom-cursor:element class="fixed top-0 left-0 w-5 h-5 bg-red-500"></div>
 *   <div x-custom-cursor:element.mass.20="plus" class="fixed top-0 left-0 w-8 h-8 bg-blue-500"></div>
 *   <div x-custom-cursor:snap-point class="absolute top-1/2 left-1/2 w-12 h-12"></div>
 *   <div data-custom-cursor="plus">Hover for plus cursor</div>
 *   <div data-hide-custom-cursor>Hover to hide cursor</div>
 * </div>
 * ```
 */
export default function (Alpine) {
    Alpine.directive('custom-cursor', ($el, data) => {
        // A custom cursor exists only to stand in for a mouse pointer, so there is nothing
        // for it to do on a touch device. Every part of the directive bails out here, before
        // any of them set up spring animations, style effects, layout reads or mouse
        // listeners. Themes already hide the cursor elements themselves on touch devices
        // with CSS, so nothing becomes visible as a result.
        if (isTouchOnlyDevice())
            return;
        if (data.value === 'element') {
            handleElement($el, Alpine, data);
        }
        else if (data.value === 'snap-point') {
            handleSnapPoint($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-custom-cursor:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('customCursor', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get isSnapped() {
                return $data.__customCursor_isSnapped;
            },
            get isHidden() {
                return $data.__customCursor_isHidden;
            },
            get isActive() {
                return $data.__customCursor_isActive;
            },
            get targetPosition() {
                return $data.__customCursor_targetPosition;
            },
            snap(el) {
                $data.__customCursor_setCurrentSnapPoint(el);
            },
            unsnap() {
                $data.__customCursor_unsetCurrentSnapPoint();
            },
        };
    });
}
function handleElement($el, Alpine, data) {
    const cursorName = data.expression || null;
    const springConfig = getSpringModifierConfig(data.modifiers, SPRING_DEFAULT_CONFIG, MIN_MASS);
    Alpine.bind($el, {
        'aria-hidden': 'true',
        'x-data'() {
            return {
                __customCursor_cursorEl_xValue: null,
                __customCursor_cursorEl_yValue: null,
                __customCursor_cursorEl_stopStyleEffect: null,
                __customCursor_cursorEl_dimensions: null,
                __customCursor_cursorEl_cancelFirstLayout: null,
                init() {
                    if (!this.$data.__customCursor_rootEl) {
                        warnMissingParentDirective('x-custom-cursor:element', 'x-custom-cursor', this.$el);
                        return;
                    }
                    // onFirstLayout fires post-layout, pre-paint: reads are free and the styleEffect
                    // below still applies in the same frame's paint.
                    this.__customCursor_cursorEl_cancelFirstLayout = onFirstLayout(this.$el, () => {
                        this.__customCursor_cursorEl_cancelFirstLayout = null;
                        this.__customCursor_cursorEl_dimensions = { width: this.$el.clientWidth, height: this.$el.clientHeight };
                        const xValue = springValue(0, springConfig);
                        const yValue = springValue(0, springConfig);
                        this.__customCursor_cursorEl_xValue = xValue;
                        this.__customCursor_cursorEl_yValue = yValue;
                        this.__customCursor_cursorEl_stopStyleEffect = styleEffect(this.$el, { x: xValue, y: yValue });
                        this.$watch('__customCursor_targetPosition', (targetPosition, previousTargetPosition) => {
                            if (targetPosition == null) {
                                xValue.stop();
                                yValue.stop();
                                return;
                            }
                            const { width, height } = this.__customCursor_cursorEl_dimensions;
                            const x = targetPosition.x - width / 2;
                            const y = targetPosition.y - height / 2;
                            if (previousTargetPosition == null) {
                                xValue.jump(x);
                                yValue.jump(y);
                            }
                            else {
                                xValue.set(x);
                                yValue.set(y);
                            }
                        });
                    });
                },
                destroy() {
                    var _a, _b, _c, _d;
                    (_a = this.__customCursor_cursorEl_cancelFirstLayout) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__customCursor_cursorEl_cancelFirstLayout = null;
                    (_b = this.__customCursor_cursorEl_xValue) === null || _b === void 0 ? void 0 : _b.stop();
                    (_c = this.__customCursor_cursorEl_yValue) === null || _c === void 0 ? void 0 : _c.stop();
                    (_d = this.__customCursor_cursorEl_stopStyleEffect) === null || _d === void 0 ? void 0 : _d.call(this);
                },
                get __customCursor_isAtEdge() {
                    const rootData = this.$data;
                    const targetPosition = rootData.__customCursor_targetPosition;
                    const dimensions = this.__customCursor_cursorEl_dimensions;
                    // Use the root's cached rect — never getBoundingClientRect here. Alpine
                    // re-runs this getter on every targetPosition change (each mousemove), and a
                    // layout read after `:style` writes would force a reflow every frame.
                    const rootRect = rootData.__customCursor_rootRect;
                    if (!targetPosition || !dimensions || !rootRect)
                        return false;
                    const halfW = dimensions.width / 2;
                    const halfH = dimensions.height / 2;
                    return (targetPosition.x - halfW < rootRect.left ||
                        targetPosition.x + halfW > rootRect.right ||
                        targetPosition.y - halfH < rootRect.top ||
                        targetPosition.y + halfH > rootRect.bottom);
                },
            };
        },
        ':data-active'() {
            const rootData = this.$data;
            const isNameMatch = cursorName == null
                ? rootData.__customCursor_activeCursorName == null
                : rootData.__customCursor_activeCursorName === cursorName;
            if (!rootData.__customCursor_isActive || !isNameMatch)
                return null;
            return '';
        },
        ':data-hidden'() {
            const rootData = this.$data;
            return rootData.__customCursor_isHidden;
        },
        ':data-edge'() {
            return this.__customCursor_isAtEdge;
        },
        ':data-snapped'() {
            const rootData = this.$data;
            return rootData.__customCursor_isSnapped;
        },
        ':style'() {
            const rootData = this.$data;
            const isNameMatch = cursorName == null
                ? rootData.__customCursor_activeCursorName == null
                : rootData.__customCursor_activeCursorName === cursorName;
            if (this.__customCursor_cursorEl_xValue == null ||
                this.__customCursor_cursorEl_dimensions == null ||
                !rootData.__customCursor_isActive ||
                !isNameMatch) {
                return {
                    contain: 'layout',
                    visibility: 'hidden',
                    'pointer-events': 'none',
                };
            }
            return {
                transformOrigin: '50% 50% 0',
                'will-change': 'transform',
                contain: 'layout',
                'pointer-events': 'none',
            };
        },
    });
}
function handleSnapPoint($el, Alpine) {
    // Bail early if we're not inside of x-custom-cursor
    if (!Alpine.$data($el).__customCursor_rootEl) {
        warnMissingParentDirective('x-custom-cursor:snap-point', 'x-custom-cursor', $el);
        return;
    }
    Alpine.bind($el, {
        'x-data'() {
            return {
                __customCursor_snapPoint_handleMouseEnter() {
                    this.$data.__customCursor_setCurrentSnapPoint(this.$el);
                },
                __customCursor_snapPoint_handleMouseLeave() {
                    this.$data.__customCursor_unsetCurrentSnapPoint();
                },
            };
        },
        ':data-snapped'() {
            const rootData = this.$data;
            return rootData.__customCursor_currentSnapPointEl === this.$el;
        },
        'x-hover:start': '__customCursor_snapPoint_handleMouseEnter',
        'x-hover:end': '__customCursor_snapPoint_handleMouseLeave',
    });
}
function buildPosition(x, y) {
    return {
        x,
        y,
    };
}
function handleRoot($el, Alpine, data) {
    Alpine.bind($el, {
        'x-data'() {
            return {
                __customCursor_rootEl: $el,
                __customCursor_rootRect: null,
                __customCursor_isActive: false,
                __customCursor_isHidden: false,
                __customCursor_activeCursorName: null,
                __customCursor_cursorEl: null,
                __customCursor_cursorEl_dimensions: null,
                __customCursor_currentSnapPointEl: null,
                __customCursor_currentSnapPointRect: null,
                __customCursor_targetPosition: null,
                __customCursor_abortController: null,
                init() {
                    // Fire events if the pointer is already inside the `$el` on mount
                    if ($el.matches(':hover')) {
                        this.__customCursor_attachActiveListeners();
                    }
                },
                destroy() {
                    var _a;
                    (_a = this.__customCursor_abortController) === null || _a === void 0 ? void 0 : _a.abort();
                },
                // Safe in pointer / scroll / ResizeObserver handlers — layout is clean at those
                // times. Kept off the Alpine render path so `:data-edge` never forces a reflow.
                __customCursor_updateRootRect() {
                    const { left, right, top, bottom } = $el.getBoundingClientRect();
                    this.__customCursor_rootRect = { left, right, top, bottom };
                },
                __customCursor_setCurrentSnapPoint(el) {
                    const { x, y, width, height } = el.getBoundingClientRect();
                    this.__customCursor_currentSnapPointEl = el;
                    this.__customCursor_currentSnapPointRect = { x, y, width, height };
                },
                __customCursor_unsetCurrentSnapPoint() {
                    this.__customCursor_currentSnapPointEl = null;
                    this.__customCursor_currentSnapPointRect = null;
                },
                __customCursor_handleMouseOver(e) {
                    const target = e.target;
                    const hideEl = target.closest('[data-hide-custom-cursor]');
                    const customCursorEl = target.closest('[data-custom-cursor]');
                    if (hideEl) {
                        this.__customCursor_isHidden = true;
                        this.__customCursor_activeCursorName = null;
                    }
                    else if (customCursorEl) {
                        this.__customCursor_isHidden = false;
                        this.__customCursor_activeCursorName = customCursorEl.getAttribute('data-custom-cursor');
                    }
                    else {
                        this.__customCursor_isHidden = false;
                        this.__customCursor_activeCursorName = null;
                    }
                },
                __customCursor_handleMouseEnter(e) {
                    // Cache the root rect before writing targetPosition so the first `:data-edge`
                    // evaluation never measures layout on the Alpine render path.
                    this.__customCursor_attachActiveListeners();
                    this.__customCursor_targetPosition = buildPosition(e.clientX, e.clientY);
                },
                __customCursor_attachActiveListeners() {
                    if (this.__customCursor_abortController)
                        return;
                    const ac = new AbortController();
                    this.__customCursor_abortController = ac;
                    this.__customCursor_updateRootRect();
                    // Viewport-relative bounds move on scroll without a size change, so
                    // ResizeObserver alone is not enough.
                    window.addEventListener('scroll', () => this.__customCursor_updateRootRect(), {
                        signal: ac.signal,
                        capture: true,
                        passive: true,
                    });
                    // Catches the root's own size changes (window resize, content, layout).
                    // ResizeObserver callbacks run after layout — reads are free.
                    const resizeObserver = new ResizeObserver(() => this.__customCursor_updateRootRect());
                    resizeObserver.observe($el);
                    ac.signal.addEventListener('abort', () => resizeObserver.disconnect());
                    let lastMoveTime = 0;
                    $el.addEventListener('mousemove', (e) => {
                        const now = Date.now();
                        if (now - lastMoveTime < 16)
                            return;
                        lastMoveTime = now;
                        this.__customCursor_handleMouseMove(e);
                    }, { signal: ac.signal });
                    $el.addEventListener('mouseover', (e) => this.__customCursor_handleMouseOver(e), {
                        signal: ac.signal,
                    });
                    $el.addEventListener('mouseleave', (e) => this.__customCursor_handleMouseLeave(e), {
                        signal: ac.signal,
                    });
                },
                __customCursor_handleMouseMove(e) {
                    this.__customCursor_isActive = true;
                    if (this.__customCursor_currentSnapPointEl) {
                        const { x: snapX, y: snapY, width: snapWidth, height: snapHeight, } = this.__customCursor_currentSnapPointRect;
                        const snapPosition = {
                            x: snapX + snapWidth / 2,
                            y: snapY + snapHeight / 2,
                        };
                        this.__customCursor_targetPosition = snapPosition;
                    }
                    else {
                        this.__customCursor_targetPosition = buildPosition(e.clientX, e.clientY);
                    }
                },
                __customCursor_handleMouseLeave(e) {
                    var _a;
                    (_a = this.__customCursor_abortController) === null || _a === void 0 ? void 0 : _a.abort();
                    this.__customCursor_abortController = null;
                    this.__customCursor_isActive = false;
                    this.__customCursor_isHidden = false;
                    this.__customCursor_activeCursorName = null;
                    this.__customCursor_currentSnapPointEl = null;
                    this.__customCursor_targetPosition = null;
                    this.__customCursor_rootRect = null;
                },
                get __customCursor_isSnapped() {
                    return !!this.__customCursor_currentSnapPointEl;
                },
            };
        },
        '@mouseenter': '__customCursor_handleMouseEnter',
    });
}
