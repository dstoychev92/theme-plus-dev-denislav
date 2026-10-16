var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { getSideAxis, getOppositePlacement, getAlignment, getSide, getAlignmentAxis } from '@floating-ui/utils';
import { isHtmlElement, isPlainObject } from '../utils';
import { getPixelModifierValue } from '../utils/modifiers';
import { warnMissingParentDirective } from '../utils/error';
const DEFAULT_MIN_FIT_HEIGHT = 100; // This is fairly arbitrary but works well for now. We can easily add a `.min.10px` modifier to allow customizing it later if need be
const DEFAULT_MIN_FIT_WIDTH = 0;
const DEFAULT_OFFSET = 20;
const DEFAULT_PADDING = 5;
/**
 * Make an element "float" relative to a reference element using Floating UI
 * https://floating-ui.com/
 * The expression is the reference element, or an options object. A falsey expression
 * disables floating — gate it on visibility (x-float="open && $refs.reference") to
 * avoid computing positions for hidden elements.
 *
 * Directives:
 * - x-float - The floating element. Modifiers:
 *   - .top / .bottom-start / .left-end / ... - Preferred placement, any Floating UI
 *     placement. With no placement modifier, auto placement picks the side with the
 *     most space.
 *   - .offset / .offset.10px - Distance from the reference (bare .offset = 20px).
 *   - .flip - Flip to the opposite side when out of space. Throws when combined with
 *     .auto https://floating-ui.com/docs/autoPlacement#conflict-with-flip
 *   - .auto / .auto-x / .auto-y - Pick the side with the most space (any side /
 *     left-right only / top-bottom only).
 *   - .shift / .shift-cross / .shift-both - Slide along the reference to stay in view
 *     (main axis / cross axis / both).
 *   - .cover - Position over the reference instead of beside it.
 *   - .fit-x / .fit-y - Cap max-width / max-height to the available space, measured
 *     after flip and shift.
 *   - .match - Match the reference's width (its height for left/right placements).
 *   - .pad / .pad.10px - Boundary padding used by flip, shift, and fit
 *     (bare .pad = 5px).
 *   - .update - Reposition on scroll and resize (Floating UI autoUpdate).
 *   - .absolute / .transform / .transform3d / .css - Positioning strategy. Default is
 *     fixed left/top; the transform strategies translate instead; css writes --float-x
 *     and --float-y custom properties (and --float-max-width/-height, --float-width/
 *     -height for fit and match) and leaves applying them to your stylesheet.
 * - x-float:arrow - An arrow element inside the floating element. Positioned on the
 *   edge facing the reference and rotated to point at it.
 *
 * An options object in the expression sets the same switches from state: referenceEl,
 * strategy, offset, padding, flip, shift, cover, autoPlacement, fitX, fitY, matchSize,
 * autoUpdate, initialUpdate, rootBoundary. The expression is reactive, so a getter on
 * an option updates the float when its state changes.
 *
 * The $float magic: referenceEl (get/set), isPositioned, the resolved placement /
 * side / alignment, matchSizeEnabled (get/set), updatePosition(), enableAutoUpdate(),
 * disableAutoUpdate(), reset(), middleware (get/set, custom Floating UI middleware).
 *
 * @example
 *
 * <div x-data="{ open: false }">
 *   <button x-ref="reference"></button>
 *   <div x-show="open" x-float.bottom.offset.10px.flip.shift.update="open && $refs.reference">
 *     I'm floating!
 *   </div>
 * </div>
 */
export default function (Alpine) {
    const lazyFloatingUIDomImport = import('@floating-ui/dom');
    async function buildMiddleware(state) {
        const dom = await lazyFloatingUIDomImport;
        const { offset, autoPlacement, flip, shift, size, arrow } = dom;
        function cover() {
            return offset((offsetState) => {
                const axis = getSideAxis(offsetState.placement);
                let o = 0;
                if (axis === 'x')
                    o = -offsetState.rects.reference.width;
                else if (axis === 'y')
                    o = -offsetState.rects.reference.height;
                return o;
            });
        }
        function fitY(strategy, options) {
            return size(Object.assign(Object.assign({}, options), { apply({ availableHeight, elements }) {
                    var _a;
                    const minHeight = (_a = options === null || options === void 0 ? void 0 : options.minHeight) !== null && _a !== void 0 ? _a : DEFAULT_MIN_FIT_HEIGHT;
                    if (availableHeight >= minHeight) {
                        if (strategy === 'css') {
                            elements.floating.style.setProperty('--float-max-height', `${availableHeight}px`);
                        }
                        else {
                            Object.assign(elements.floating.style, { maxHeight: `${availableHeight}px` });
                        }
                    }
                } }));
        }
        function fitX(strategy, options) {
            return size(Object.assign(Object.assign({}, options), { apply({ availableWidth, elements }) {
                    var _a;
                    const minWidth = (_a = options === null || options === void 0 ? void 0 : options.minWidth) !== null && _a !== void 0 ? _a : DEFAULT_MIN_FIT_WIDTH;
                    if (availableWidth >= minWidth) {
                        if (strategy === 'css') {
                            elements.floating.style.setProperty('--float-max-width', `${availableWidth}px`);
                        }
                        else {
                            Object.assign(elements.floating.style, { maxWidth: `${availableWidth}px` });
                        }
                    }
                } }));
        }
        function matchSize(strategy, options) {
            return size(Object.assign({ apply: (_a) => {
                    var { rects, elements } = _a, other = __rest(_a, ["rects", "elements"]);
                    const mainAxisPlacement = getAlignmentAxis(other.placement);
                    if (mainAxisPlacement === 'x') {
                        if (strategy === 'css') {
                            elements.floating.style.setProperty('--float-width', `${rects.reference.width}px`);
                        }
                        else {
                            Object.assign(elements.floating.style, { width: `${rects.reference.width}px` });
                        }
                    }
                    else {
                        if (strategy === 'css') {
                            elements.floating.style.setProperty('--float-height', `${rects.reference.height}px`);
                        }
                        else {
                            Object.assign(elements.floating.style, { height: `${rects.reference.height}px` });
                        }
                    }
                } }, options));
        }
        let middleware = [offset(state.__float_offset), ...state.__float_customMiddleware];
        if (state.__float_coverEnabled)
            middleware.push(cover());
        if (state.__float_autoPlacementEnabled === true) {
            middleware.push(autoPlacement({
                rootBoundary: state.__float_rootBoundary,
                alignment: state.__float_alignment,
            }));
        }
        else if (state.__float_autoPlacementEnabled === 'y') {
            middleware.push(autoPlacement({
                rootBoundary: state.__float_rootBoundary,
                alignment: state.__float_alignment,
                allowedPlacements: ['top', 'bottom'],
            }));
        }
        else if (state.__float_autoPlacementEnabled === 'x') {
            middleware.push(autoPlacement({
                rootBoundary: state.__float_rootBoundary,
                alignment: state.__float_alignment,
                allowedPlacements: ['left', 'right'],
            }));
        }
        if (state.__float_flipEnabled) {
            middleware.push(flip({
                padding: state.__float_padding,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        if (state.__float_shiftEnabled === true) {
            middleware.push(shift({
                padding: state.__float_padding,
                mainAxis: true,
                crossAxis: false,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        else if (state.__float_shiftEnabled === 'both') {
            middleware.push(shift({
                padding: state.__float_padding,
                mainAxis: true,
                crossAxis: true,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        else if (state.__float_shiftEnabled === 'cross') {
            middleware.push(shift({
                padding: state.__float_padding,
                mainAxis: false,
                crossAxis: true,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        // Fit after flip and shift, since Floating UI measures the available space at the
        // final placement and gives the full clipping width once shift has run
        // https://floating-ui.com/docs/size
        if (state.__float_fitYEnabled) {
            middleware.push(fitY(state.__float_strategy, {
                padding: state.__float_padding,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        if (state.__float_fitXEnabled) {
            middleware.push(fitX(state.__float_strategy, {
                padding: state.__float_padding,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        if (state.__float_matchSizeEnabled) {
            middleware.push(matchSize(state.__float_strategy, { rootBoundary: state.__float_rootBoundary }));
        }
        if (state.__float_arrowEl !== null) {
            middleware.push(arrow({ element: state.__float_arrowEl }));
        }
        return { dom, middleware };
    }
    Alpine.directive('float', ($el, { value, modifiers, expression }, { evaluateLater, effect }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (value == 'arrow') {
            const $data = Alpine.$data($el);
            if (!$data.__float_isRoot) {
                warnMissingParentDirective('x-float:arrow', 'x-float', $el);
                return;
            }
            $data.__float_arrowEl = $el;
            // Keep the last styles through the close, since the popup resets the arrow data
            // while the panel's leave transition still shows the arrow
            let lastArrowStyles = {};
            Alpine.bind($el, {
                ':style'() {
                    // Dont return styles if the strategy is "css" because the styles are applied via CSS variables
                    if (this.__float_strategy == 'css')
                        return {};
                    if (this.__float_arrowData == null)
                        return lastArrowStyles;
                    const side = this.__float_side;
                    const { x, y } = this.__float_arrowData;
                    const oppositeSide = {
                        top: 'bottom',
                        right: 'left',
                        bottom: 'top',
                        left: 'right',
                    }[side];
                    const rotation = {
                        top: '0deg',
                        right: '90deg',
                        bottom: '180deg',
                        left: '-90deg',
                    }[oppositeSide];
                    lastArrowStyles = {
                        position: 'absolute',
                        // Position arrow at the edge of the floating element
                        left: x != null ? `${roundByDPR(x || 0)}px` : '',
                        top: y != null ? `${roundByDPR(y || 0)}px` : '',
                        // Force arrow over to the positioned side
                        [side]: '100%',
                        // Adjust rotation to point to the target
                        transform: `
                rotate(${rotation})
              `,
                    };
                    return lastArrowStyles;
                },
            });
        }
        else if (value == null) {
            const getOptions = evaluateLater(expression);
            let initialPlacement = getPlacementModifier(modifiers);
            ensureFlipAndAutoPlacementAreNotUsedTogether(modifiers);
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        __float_isRoot: true,
                        __float_arrowEl: null,
                        __float_positionData: null,
                        __float_arrowData: null,
                        __float_referenceEl: null,
                        __float_initialPlacement: hasCoverModifier(modifiers) && initialPlacement
                            ? getOppositePlacement(initialPlacement)
                            : initialPlacement,
                        __float_cancelAutoUpdate: null,
                        __float_isPositioned: false,
                        __float_placement: null,
                        __float_alignment: null,
                        __float_side: null,
                        __float_rootBoundary: 'viewport',
                        __float_strategy: getStrategyModifier(modifiers) || 'fixed',
                        __float_autoUpdateEnabled: hasAutoUpdateModifier(modifiers),
                        __float_initialUpdate: true,
                        __float_offset: getOffsetModifier(modifiers) || 0,
                        __float_coverEnabled: hasCoverModifier(modifiers),
                        __float_autoPlacementEnabled: getAutoPlacementModifier(modifiers) || initialPlacement == undefined,
                        __float_flipEnabled: hasFlipModifier(modifiers),
                        __float_fitXEnabled: hasFitXModifier(modifiers),
                        __float_fitYEnabled: hasFitYModifier(modifiers),
                        __float_shiftEnabled: getShiftModifier(modifiers),
                        __float_matchSizeEnabled: hasMatchSizeModifier(modifiers),
                        __float_padding: getPaddingModifier(modifiers) || 0,
                        __float_customMiddleware: [],
                        async __float_updatePosition() {
                            if (this.__float_referenceEl == null)
                                return;
                            try {
                                const { dom, middleware } = await buildMiddleware(this);
                                const data = await dom.computePosition(this.__float_referenceEl, $el, {
                                    placement: this.__float_initialPlacement,
                                    strategy: this.__float_strategy == 'absolute' ? 'absolute' : 'fixed',
                                    middleware,
                                });
                                const { placement, middlewareData } = data;
                                this.__float_positionData = data;
                                this.__float_placement = placement;
                                this.__float_alignment = getAlignment(placement) || null;
                                this.__float_side = getSide(placement);
                                if (middlewareData.arrow && this.__float_arrowEl !== null) {
                                    this.__float_arrowData = middlewareData.arrow;
                                }
                            }
                            catch (error) {
                                console.error('Error importing @floating-ui/dom', error);
                            }
                        },
                        async __float_startAutoUpdate() {
                            var _a;
                            if (!this.__float_referenceEl)
                                return;
                            try {
                                const dom = await lazyFloatingUIDomImport;
                                if (this.__float_referenceEl == null)
                                    return;
                                (_a = this.__float_cancelAutoUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                                await this.__float_updatePosition();
                                if (this.__float_referenceEl == null)
                                    return;
                                this.__float_cancelAutoUpdate = dom.autoUpdate(this.__float_referenceEl, $el, () => {
                                    void this.__float_updatePosition();
                                });
                            }
                            catch (error) {
                                console.error('Error importing @floating-ui/dom', error);
                            }
                        },
                        __float_getStyles() {
                            // If we're not positioned and not floating then reset the styles
                            if (this.__float_positionData == null || !this.__float_referenceEl) {
                                return {};
                            }
                            switch (this.__float_strategy) {
                                case 'absolute':
                                    return {
                                        position: 'absolute',
                                        left: `${this.__float_positionData.x}px`,
                                        top: `${this.__float_positionData.y}px`,
                                    };
                                case 'transform':
                                    return {
                                        transform: `translate(${roundByDPR(this.__float_positionData.x)}px, ${roundByDPR(this.__float_positionData.y)}px)`,
                                        left: '0',
                                        top: '0',
                                    };
                                case 'transform3d':
                                    return {
                                        transform: `translate3d(${roundByDPR(this.__float_positionData.x)}px, ${roundByDPR(this.__float_positionData.y)}px, 0)`,
                                        left: '0',
                                        top: '0',
                                    };
                                case 'fixed':
                                    return {
                                        position: 'fixed',
                                        left: `${this.__float_positionData.x}px`,
                                        top: `${this.__float_positionData.y}px`,
                                    };
                            }
                        },
                        __float_reset() {
                            // Cancel auto-update if active
                            this.__float_autoUpdateEnabled = false;
                            // Reset position data
                            this.__float_positionData = null;
                            this.__float_arrowData = null;
                            this.__float_isPositioned = false;
                            this.__float_placement = null;
                            this.__float_alignment = null;
                            this.__float_side = null;
                        },
                        init() {
                            this.$watch('__float_autoUpdateEnabled', (autoUpdateEnabled) => {
                                var _a;
                                if (autoUpdateEnabled) {
                                    this.__float_startAutoUpdate();
                                }
                                else {
                                    // If the expression does not result in an html element, reset
                                    (_a = this.__float_cancelAutoUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                                }
                            });
                            this.$watch('__float_positionData', (positionData) => {
                                if (positionData === null)
                                    return;
                                if (this.__float_strategy == 'css') {
                                    if (positionData !== null) {
                                        const { x, y } = positionData;
                                        requestAnimationFrame(() => {
                                            var _a, _b;
                                            this.$el.style.setProperty('--float-x', `${x}px`);
                                            this.$el.style.setProperty('--float-y', `${y}px`);
                                            (_a = this.__float_arrowEl) === null || _a === void 0 ? void 0 : _a.style.setProperty('--float-arrow-x', `${roundByDPR(x || 0)}px`);
                                            (_b = this.__float_arrowEl) === null || _b === void 0 ? void 0 : _b.style.setProperty('--float-arrow-y', `${roundByDPR(y || 0)}px`);
                                            this.__float_isPositioned = true;
                                        });
                                    }
                                }
                                else {
                                    this.__float_isPositioned = true;
                                    Object.assign(this.$el.style, this.__float_getStyles());
                                }
                            });
                            effect(() => {
                                getOptions(async (optionsOrRefererenceEl) => {
                                    let newReferenceEl = null;
                                    let options = {};
                                    // Check whether the expression evaluates to an html element or an options object
                                    if (optionsOrRefererenceEl != null && optionsOrRefererenceEl != false) {
                                        if (isHtmlElement(optionsOrRefererenceEl)) {
                                            newReferenceEl = optionsOrRefererenceEl;
                                        }
                                        else if (isPlainObject(optionsOrRefererenceEl)) {
                                            options = optionsOrRefererenceEl;
                                            if (options.rootBoundary !== undefined) {
                                                this.__float_rootBoundary = options.rootBoundary;
                                            }
                                            if (options.strategy !== undefined) {
                                                this.__float_strategy = options.strategy;
                                            }
                                            if (options.autoUpdate !== undefined) {
                                                this.__float_autoUpdateEnabled = options.autoUpdate;
                                            }
                                            if (options.offset !== undefined) {
                                                this.__float_offset = options.offset;
                                            }
                                            if (options.cover !== undefined) {
                                                this.__float_coverEnabled = options.cover || hasCoverModifier(modifiers) || false;
                                            }
                                            if (options.autoPlacement !== undefined) {
                                                this.__float_autoPlacementEnabled = options.autoPlacement;
                                            }
                                            if (options.flip !== undefined) {
                                                this.__float_flipEnabled = options.flip;
                                            }
                                            if (options.fitX !== undefined) {
                                                this.__float_fitXEnabled = options.fitX;
                                            }
                                            if (options.fitY !== undefined) {
                                                this.__float_fitYEnabled = options.fitY;
                                            }
                                            if (options.shift !== undefined) {
                                                this.__float_shiftEnabled = options.shift;
                                            }
                                            if (options.matchSize !== undefined) {
                                                this.__float_matchSizeEnabled = options.matchSize;
                                            }
                                            if (options.padding !== undefined) {
                                                this.__float_padding = options.padding;
                                            }
                                            if (options.referenceEl !== undefined) {
                                                newReferenceEl = options.referenceEl;
                                            }
                                            if (options.initialUpdate !== undefined) {
                                                this.__float_initialUpdate = options.initialUpdate;
                                            }
                                        }
                                    }
                                    // Wait for next tick until arrow element is available and we can calculate the position
                                    this.$nextTick(() => {
                                        var _a;
                                        if (this.__float_referenceEl && !newReferenceEl) {
                                            // If the reference el has been removed, cancel any auto updating and reset the position
                                            (_a = this.__float_cancelAutoUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                                            this.__float_isPositioned = false;
                                        }
                                        else if (this.__float_referenceEl != newReferenceEl) {
                                            // If a reference el has been provided, set it and update the position
                                            this.__float_referenceEl = newReferenceEl;
                                            if (this.__float_autoUpdateEnabled) {
                                                this.__float_startAutoUpdate();
                                            }
                                            else if (this.__float_initialUpdate) {
                                                this.__float_updatePosition();
                                            }
                                        }
                                    });
                                });
                            });
                        },
                        destroy() {
                            var _a;
                            (_a = this.__float_cancelAutoUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                        },
                    };
                },
            });
        }
        else {
            throw new Error(`Unknown directive: x-float:${value}`);
        }
    }).before('bind');
    Alpine.magic('float', handleFloatMagic(Alpine));
}
export function handleFloatMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get referenceEl() {
                return $data.__float_referenceEl;
            },
            set referenceEl(el) {
                $data.__float_referenceEl = el;
            },
            get isPositioned() {
                return $data.__float_isPositioned;
            },
            get placement() {
                return $data.__float_placement;
            },
            get side() {
                return $data.__float_side;
            },
            get alignment() {
                return $data.__float_alignment;
            },
            get matchSizeEnabled() {
                return $data.__float_matchSizeEnabled;
            },
            set matchSizeEnabled(value) {
                $data.__float_matchSizeEnabled = value;
            },
            updatePosition() {
                $data.__float_updatePosition();
            },
            enableAutoUpdate() {
                $data.__float_autoUpdateEnabled = true;
            },
            disableAutoUpdate() {
                $data.__float_autoUpdateEnabled = false;
            },
            reset() {
                var _a;
                (_a = $data.__float_reset) === null || _a === void 0 ? void 0 : _a.call($data);
            },
            get middleware() {
                return $data.__float_customMiddleware;
            },
            set middleware(middleware) {
                $data.__float_customMiddleware = middleware;
            },
        };
    };
}
function getOffsetModifier(modifiers) {
    var _a;
    if (!modifiers.includes('offset'))
        return 0;
    return (_a = getPixelModifierValue(modifiers, 'offset')) !== null && _a !== void 0 ? _a : DEFAULT_OFFSET;
}
function getPlacementModifier(modifiers) {
    return modifiers.find((modifier) => modifier.match(/^(top|right|bottom|left)(-(start|end))?$/));
}
function hasFlipModifier(modifiers) {
    return modifiers.includes('flip');
}
function getPaddingModifier(modifiers) {
    var _a;
    if (!modifiers.includes('pad'))
        return 0;
    return (_a = getPixelModifierValue(modifiers, 'pad')) !== null && _a !== void 0 ? _a : DEFAULT_PADDING;
}
function hasCoverModifier(modifiers) {
    return modifiers.includes('cover');
}
function hasFitYModifier(modifiers) {
    return modifiers.includes('fit-y');
}
function hasFitXModifier(modifiers) {
    return modifiers.includes('fit-x');
}
function hasMatchSizeModifier(modifiers) {
    return modifiers.includes('match');
}
function getAutoPlacementModifier(modifiers) {
    if (modifiers.includes('auto'))
        return true;
    if (modifiers.includes('auto-x'))
        return 'x';
    if (modifiers.includes('auto-y'))
        return 'y';
    return false;
}
function getShiftModifier(modifiers) {
    if (modifiers.includes('shift'))
        return true;
    if (modifiers.includes('shift-cross'))
        return 'cross';
    if (modifiers.includes('shift-both'))
        return 'both';
    return false;
}
function hasAutoUpdateModifier(modifiers) {
    return modifiers.includes('update');
}
function getStrategyModifier(modifiers) {
    if (modifiers.includes('css'))
        return 'css';
    if (modifiers.includes('transform'))
        return 'transform';
    if (modifiers.includes('transform3d'))
        return 'transform3d';
    if (modifiers.includes('absolute'))
        return 'absolute';
}
function ensureFlipAndAutoPlacementAreNotUsedTogether(modifiers) {
    if (hasFlipModifier(modifiers) && getAutoPlacementModifier(modifiers)) {
        throw new Error(`The \`flip\` and \`auto\` modifiers cannot be used together. Use either \`auto\` or \`flip\`. See https://floating-ui.com/docs/autoPlacement#conflict-with-flip`);
    }
}
function roundByDPR(value) {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(value * dpr) / dpr;
}
export { getOffsetModifier, getPlacementModifier };
