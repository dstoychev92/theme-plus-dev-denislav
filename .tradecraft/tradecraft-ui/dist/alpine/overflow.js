import { isHtmlElement, mergeProperties, readLayoutAfterPaint } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
/**
 * Monitors a scrollable container and exposes reactive overflow state via `$overflow`.
 *
 * Use it to show/hide arrow buttons, edge fades, and similar UI that depends on whether
 * the shopper can still scroll in a given direction.
 *
 * ## Which mode to use: default vs `.scroll`
 *
 * Pick based on **what “at the edge” means for your markup**, not on performance alone.
 * Both modes are cheap when used correctly; they answer different questions.
 *
 * | | Default (IntersectionObserver) | `.scroll` |
 * |---|---|---|
 * | **How it works** | Watches named boundary elements (or first/last children with `.autoregister`) for visibility inside the viewport | Reads `scrollLeft` / `scrollWidth` / `clientWidth` on the viewport |
 * | **`$overflow.start` / `.end` mean** | That named boundary is not fully visible | The viewport can still scroll toward that edge |
 * | **Best when** | You have discrete items and care whether the *first* or *last* item is fully on screen (tab lists, chip rows, card carousels) | You care whether the *scrollport* is at its start/end — continuous tracks, mixed content, or “is there more to scroll?” arrows |
 * | **Supports** | Named boundaries (`x-overflow:left`), `.autoregister`, `.ratio` (partial visibility 0–1) | Horizontal `start` / `end` only; no boundary elements, no `.ratio` |
 * | **Avoid when** | First/last children are not meaningful edges (spacers, clones, a single wrapping flex row of mixed blocks) | You need per-element visibility, gradual `.ratio` fades, or non-`start`/`end` boundary names |
 *
 * **Rule of thumb**
 * - Tab list, thumbnail strip, “scroll until the last chip is fully visible” → default / `.autoregister`
 * - Header toolbar, content row with prev/next chevrons, “fade the edge while there’s overflow” → `.scroll`
 *
 * Do **not** hand-roll `scrollLeft` checks + `x-resize` + `offsetWidth` in section Liquid.
 * That pattern forces layout on resize; `.scroll` already does the performant version
 * (passive scroll listener, ResizeObserver, Alpine writes only when start/end change).
 *
 * ## Basic Usage
 *
 * **Simplest usage**: Just add `x-overflow` (or `x-overflow.autoregister`) to an element, and it will act as both viewport and container:
 *
 * ```html
 * <div x-overflow.autoregister class="overflow-scroll">
 *   <div>First item</div>
 *   <div>Second item</div>
 *   <div>Last item</div>
 * </div>
 * ```
 *
 * **Advanced usage**: Use `x-overflow:viewport` and/or `x-overflow:container` to specify different elements:
 *
 * 1. Add `x-overflow` to the root container element
 * 2. (Optional) Add `x-overflow:viewport` to the scrollable container element
 * 3. (Optional) Add `x-overflow:container` to specify which element's children to watch for `.autoregister`
 * 4. Register boundaries using `x-overflow:{name}` on elements you want to monitor, or use `.autoregister` modifier
 * 5. Access overflow state via `$overflow.{name}` in your template
 *
 * ## Directives
 *
 * - `x-overflow` - Root directive that initializes the overflow detection system. By default, the element with `x-overflow` acts as both the viewport and container. Use `x-overflow:viewport` and/or `x-overflow:container` to override this behavior.
 * - `x-overflow:viewport` - (Optional) Marks the scrollable container element (the element with overflow CSS). If not specified, the root `x-overflow` element is used as the viewport.
 * - `x-overflow:container` - (Optional) Specifies an alternative container element for `.autoregister` to watch for first/last children. If not specified, the root `x-overflow` element (or viewport if specified) is used as the container.
 * - `x-overflow:{name}` - Registers a named boundary element to monitor (e.g., `x-overflow:start`, `x-overflow:end`, `x-overflow:left`, `x-overflow:right`). Ignored in `.scroll` mode.
 *
 * ## Modifiers
 *
 * - `.autoregister` - Automatically registers the first and last direct children of the container (or viewport if no container is specified) as 'start' and 'end' boundaries. Ignored in `.scroll` mode.
 * - `.ratio` - Enables ratio mode, where boundaries return numeric values (0.0-1.0) instead of booleans. Ignored in `.scroll` mode.
 * - `.scroll` - Uses scroll position + ResizeObserver instead of IntersectionObserver. Auto-provides
 *   `$overflow.start` / `$overflow.end` from the viewport's scroll metrics (no boundary elements needed).
 *   See “Which mode to use” above. Incompatible with `.autoregister`, `.ratio`, and named `x-overflow:{name}` boundaries — those are ignored.
 *
 * ## $overflow Magic Property
 *
 * The `$overflow` magic provides:
 * - Boolean properties for each registered boundary name (e.g., `$overflow.start`, `$overflow.end`)
 *   - `true` = can scroll that way / boundary is overflowing (not fully visible)
 *   - `false` = at that edge / boundary is fully visible
 *   - When content fits with no overflow, both `start` and `end` are `false`
 *
 * With the `.ratio` modifier, boundaries return numeric values (0.0-1.0):
 *   - `1.0` = boundary element is fully visible within the viewport
 *   - `0.0` = boundary element is fully hidden/outside the viewport
 *   - Values between 0.0 and 1.0 = partially visible (e.g., `0.5` = 50% visible)
 *
 * - `registerBoundary(name: string, el: HTMLElement)` - Programmatically register a boundary element (no-op in `.scroll` mode)
 *
 * ## Overflow Detection
 *
 * **Default mode:** The intersection ratio is continuously tracked as elements scroll, providing smooth transitions.
 * Use the ratio value for gradual opacity, mask effects, or other smooth UI transitions.
 * The observer uses granular thresholds (0.1 steps) to provide smooth updates during scrolling.
 *
 * **`.scroll` mode:** A passive `scroll` listener, a ResizeObserver (viewport + content children), and a
 * MutationObserver all ask for the same update. The measurement runs through `readLayoutAfterPaint`, so
 * `scrollWidth` / `clientWidth` never force a synchronous layout, and Alpine state is rewritten only when
 * the booleans change.
 *
 * @example Manual boundary registration with custom names
 *
 * <div x-overflow class="relative">
 *   <div x-overflow:viewport class="w-[100px] h-[100px] overflow-scroll">
 *     <div class="w-[1000px] h-[100px] relative">
 *       <!-- Place boundary markers at the edges you want to monitor -->
 *       <div x-overflow:left class="absolute inset-0 right-auto w-[1px] h-full"></div>
 *       <div x-overflow:right class="absolute inset-0 left-auto w-[1px] h-full"></div>
 *     </div>
 *   </div>
 *   <div>
 *     <button x-show="$overflow.left" @click="scrollLeft()">←</button>
 *     <button x-show="$overflow.right" @click="scrollRight()">→</button>
 *   </div>
 * </div>
 *
 * @example Automatic boundary registration with .autoregister modifier
 *
 * The `.autoregister` modifier automatically registers the first and last direct children of the container
 * (or viewport if no container is specified) as 'start' and 'end' boundaries. A MutationObserver watches
 * for changes to the DOM and updates boundaries when children are added or removed.
 *
 * Prefer this when “can scroll left” means “the first item is not fully visible” — e.g. a tab list.
 *
 * <div x-overflow.autoregister class="relative">
 *   <div x-overflow:viewport class="w-[100px] h-[100px] overflow-scroll flex">
 *     <div class="w-[100px] flex-shrink-0">First item</div>
 *     <div class="w-[100px] flex-shrink-0">Second item</div>
 *     <div class="w-[100px] flex-shrink-0">Last item</div>
 *   </div>
 *   <div>
 *     <button x-show="$overflow.start" @click="scrollToStart()">← Previous</button>
 *     <span x-text="$overflow.start ? 'Can scroll left' : 'At start'"></span>
 *     <span x-text="$overflow.end ? 'Can scroll right' : 'At end'"></span>
 *     <button x-show="$overflow.end" @click="scrollToEnd()">Next →</button>
 *     <!-- Edge mask -->
 *     <div :class="{ 'edge-mask-l': $overflow.start }"></div>
 *   </div>
 * </div>
 *
 * @example Using with dynamic content (x-for)
 *
 * Template elements created by Alpine's x-for directive are automatically filtered out when using `.autoregister`.
 * The mutation observer will automatically update boundaries when items are added or removed.
 *
 * <div x-overflow.autoregister x-data="{ items: [1, 2, 3] }">
 *   <div x-overflow:viewport class="overflow-x-auto">
 *     <template x-for="item in items" :key="item">
 *       <div class="w-[100px] flex-shrink-0" x-text="item"></div>
 *     </template>
 *   </div>
 *   <button @click="items.push(items.length + 1)">Add Item</button>
 *   <div x-show="$overflow.end">More items available</div>
 * </div>
 *
 * @example Ratio mode with gradual transitions
 *
 * Use `.ratio` modifier when you need numeric values for smooth transitions:
 *
 * <div x-overflow.ratio.autoregister class="relative">
 *   <div x-overflow:viewport class="w-[100px] h-[100px] overflow-scroll flex">
 *     <div class="w-[100px] flex-shrink-0">First item</div>
 *     <div class="w-[100px] flex-shrink-0">Second item</div>
 *     <div class="w-[100px] flex-shrink-0">Last item</div>
 *   </div>
 *   <div>
 *     <button x-show="$overflow.start < 1.0" @click="scrollToStart()">← Previous</button>
 *     <!-- Gradual edge mask fade using ratio -->
 *     <div :style="`opacity: ${1 - $overflow.start}`" class="edge-mask-l"></div>
 *   </div>
 * </div>
 *
 * @example Programmatic boundary registration
 *
 * You can also register boundaries programmatically using the `$overflow.registerBoundary()` method:
 *
 * <div x-overflow>
 *   <div x-overflow:viewport class="overflow-scroll">
 *     <div x-init="$overflow.registerBoundary('custom', $el)" class="custom-boundary">
 *       Custom boundary element
 *     </div>
 *   </div>
 *   <div x-text="$overflow.custom ? 'Custom boundary is overflowing' : 'Custom boundary is visible'"></div>
 * </div>
 *
 * @example Scroll-position mode with .scroll modifier
 *
 * Use `.scroll` when “at the edge” means the scrollport’s own scroll metrics — not whether a
 * particular child is intersecting. Typical theme cases: header toolbar, row groups with
 * chevron buttons. Put `x-overflow:viewport` on the element that actually scrolls.
 *
 * <div x-overflow.scroll class="relative">
 *   <button :disabled="!$overflow.start" @click="$refs.track.scrollBy({ left: -200, behavior: 'smooth' })">←</button>
 *   <div x-overflow:viewport x-ref="track" class="overflow-x-auto flex">
 *     <div class="shrink-0">Item 1</div>
 *     <div class="shrink-0">Item 2</div>
 *     <div class="shrink-0">Item 3</div>
 *   </div>
 *   <button :disabled="!$overflow.end" @click="$refs.track.scrollBy({ left: 200, behavior: 'smooth' })">→</button>
 *   <div :class="{ 'edge-mask-l': $overflow.start, 'edge-mask-r': $overflow.end }"></div>
 * </div>
 *
 * ## Notes
 *
 * - The viewport element should have `overflow: auto` or `overflow: scroll` CSS for scrolling to work
 * - Boundary elements should be positioned within the scrollable content area (default mode only)
 * - When using `.autoregister`, only direct children of the container are considered (not nested children)
 * - Elements with `data-overflow-ignore` attribute are excluded from autoregistration boundary detection
 * - If you just use `x-overflow`, it acts as both viewport and container by default
 * - If `x-overflow:viewport` is specified, it overrides the viewport (but container still defaults to the root element unless `x-overflow:container` is also specified)
 * - If `x-overflow:container` is specified, it overrides the container for `.autoregister` boundary detection
 * - Template elements (from x-for) are automatically excluded from boundary detection
 * - The intersection observer uses granular thresholds (0.1 steps) to provide smooth ratio updates during scrolling
 * - Use boolean values directly: `:class="{ 'edge-mask-l': $overflow.start }"`
 * - With `.ratio` modifier, use numeric values for smooth transitions: `:style="\`opacity: ${1 - $overflow.start}\`"`
 * - With `.scroll`, `$overflow.start` / `$overflow.end` keep the same polarity as IntersectionObserver
 *   mode (`true` = more content that way, so show the arrow). Content that fits sets both to `false`.
 */
export default function (Alpine) {
    Alpine.directive('overflow', ($el, { value, modifiers }, { Alpine, evaluate }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        // TODO when x-overflow:foo elements are destroyed, unset their value so we can use this with e.g. multi carousels per x-overflow
        if (value == 'viewport') {
            Alpine.bind($el, {
                'x-init'() {
                    if (!this.__overflow_isRoot) {
                        warnMissingParentDirective('x-overflow:viewport', 'x-overflow', $el);
                        return;
                    }
                    this.__overflow_viewportEl = $el;
                },
            });
        }
        else if (value == 'container') {
            Alpine.bind($el, {
                'x-init'() {
                    if (!this.__overflow_isRoot) {
                        warnMissingParentDirective('x-overflow:container', 'x-overflow', $el);
                        return;
                    }
                    this.__overflow_containerEl = $el;
                },
            });
        }
        else if (value == null) {
            const hasAutoregister = modifiers.includes('autoregister');
            const hasRatioMode = modifiers.includes('ratio');
            const hasScrollMode = modifiers.includes('scroll');
            // If using ratio mode, use granular thresholds (0.1 steps) for smooth ratio updates during scrolling
            // This provides 11 thresholds: [0, 0.1, 0.2, ..., 1.0]
            const threshold = hasRatioMode ? Array.from({ length: 11 }, (_, i) => i / 10) : 0.99;
            Alpine.bind($el, {
                ['x-data']() {
                    const component = {
                        __overflow_isRoot: true,
                        __overflow_intersectionObserver: null,
                        __overflow_intersectionEntries: [],
                        __overflow_viewportEl: null,
                        __overflow_containerEl: null,
                        __overflow_boundaryEls: new Map(),
                        __overflow_targetEl: null,
                        __overflow_overflows: hasScrollMode ? { start: false, end: false } : {},
                        __overflow_ratioMode: hasRatioMode && !hasScrollMode,
                        __overflow_scrollMode: hasScrollMode,
                        __overflow_resizeObserver: null,
                        __overflow_onScroll: null,
                        __overflow_isMeasurementScheduled: false,
                        init() {
                            this.$nextTick(() => {
                                // Default: use the root element as both viewport and container
                                // x-overflow:viewport and x-overflow:container directives will override these if specified
                                if (!this.__overflow_viewportEl) {
                                    this.__overflow_viewportEl = $el;
                                }
                                if (!this.__overflow_containerEl) {
                                    this.__overflow_containerEl = $el;
                                }
                                if (hasScrollMode) {
                                    // Second tick: child x-overflow:viewport / :container x-inits may land after the first.
                                    this.$nextTick(() => {
                                        var _a;
                                        if (this.__overflow_viewportEl !== $el && this.__overflow_containerEl === $el) {
                                            this.__overflow_containerEl = this.__overflow_viewportEl;
                                        }
                                        (_a = this.__overflow_setupScrollMode) === null || _a === void 0 ? void 0 : _a.call(this);
                                    });
                                    return;
                                }
                                this.__overflow_intersectionObserver = new IntersectionObserver(this.__overflow_onIntersect.bind(this), {
                                    root: this.__overflow_viewportEl,
                                    rootMargin: '0px',
                                    threshold,
                                });
                                if (hasAutoregister) {
                                    this.__overflow_itemsMutationObserver = null;
                                    // Wait for next tick to allow x-overflow:viewport and x-overflow:container directives to initialize
                                    this.$nextTick(() => {
                                        // Re-check container default after late viewport/container inits
                                        if (this.__overflow_viewportEl !== $el && this.__overflow_containerEl === $el) {
                                            this.__overflow_containerEl = this.__overflow_viewportEl;
                                        }
                                        if (this.__overflow_setupItemsMutationObserver) {
                                            this.__overflow_setupItemsMutationObserver();
                                        }
                                        // Wait for next tick and then use requestAnimationFrame to ensure DOM is ready
                                        this.$nextTick(() => {
                                            requestAnimationFrame(() => {
                                                var _a;
                                                (_a = this.__overflow_updateOverflowBoundaries) === null || _a === void 0 ? void 0 : _a.call(this);
                                            });
                                        });
                                    });
                                }
                            });
                        },
                        __overflow_setupScrollMode() {
                            var _a, _b, _c;
                            const viewport = this.__overflow_viewportEl;
                            if (!viewport)
                                return;
                            this.__overflow_onScroll = () => {
                                var _a;
                                (_a = this.__overflow_requestEdgeUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                            };
                            viewport.addEventListener('scroll', this.__overflow_onScroll, { passive: true });
                            this.__overflow_resizeObserver = new ResizeObserver(() => {
                                var _a;
                                (_a = this.__overflow_requestEdgeUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                            });
                            this.__overflow_resizeObserver.observe(viewport);
                            (_a = this.__overflow_syncContentObservers) === null || _a === void 0 ? void 0 : _a.call(this);
                            this.__overflow_itemsMutationObserver = new MutationObserver(() => {
                                var _a, _b;
                                (_a = this.__overflow_syncContentObservers) === null || _a === void 0 ? void 0 : _a.call(this);
                                (_b = this.__overflow_requestEdgeUpdate) === null || _b === void 0 ? void 0 : _b.call(this);
                            });
                            this.__overflow_itemsMutationObserver.observe((_b = this.__overflow_containerEl) !== null && _b !== void 0 ? _b : viewport, {
                                childList: true,
                            });
                            (_c = this.__overflow_requestEdgeUpdate) === null || _c === void 0 ? void 0 : _c.call(this);
                        },
                        __overflow_syncContentObservers() {
                            var _a;
                            const observer = this.__overflow_resizeObserver;
                            const container = (_a = this.__overflow_containerEl) !== null && _a !== void 0 ? _a : this.__overflow_viewportEl;
                            if (!observer || !container)
                                return;
                            // Content growth changes scrollWidth without resizing the viewport box —
                            // observe children so those size changes still trigger an update.
                            for (const child of container.children) {
                                if (child instanceof Element) {
                                    observer.observe(child);
                                }
                            }
                        },
                        // Scroll, resize, and mutation all request an update. The read runs through
                        // readLayoutAfterPaint so it lands in the shared read batch and never forces
                        // a synchronous layout, and repeat requests in the same frame coalesce into one.
                        __overflow_requestEdgeUpdate() {
                            if (this.__overflow_isMeasurementScheduled)
                                return;
                            this.__overflow_isMeasurementScheduled = true;
                            readLayoutAfterPaint(() => {
                                this.__overflow_isMeasurementScheduled = false;
                                const el = this.__overflow_viewportEl;
                                // The component may have been removed from the page while this was pending
                                if (!(el === null || el === void 0 ? void 0 : el.isConnected))
                                    return null;
                                return {
                                    maxScroll: el.scrollWidth - el.clientWidth,
                                    left: el.scrollLeft,
                                };
                            }).then((measurement) => {
                                if (measurement == null)
                                    return;
                                const guard = 1;
                                // Same polarity as IntersectionObserver mode:
                                // true = overflowing (not at that edge / can scroll that way)
                                const start = measurement.left > guard;
                                const end = measurement.maxScroll > guard && measurement.left < measurement.maxScroll - guard;
                                // Only write Alpine state when start/end actually change (avoids reactive churn)
                                if (this.__overflow_overflows.start === start && this.__overflow_overflows.end === end) {
                                    return;
                                }
                                this.__overflow_overflows = Object.assign(Object.assign({}, this.__overflow_overflows), { start,
                                    end });
                            });
                        },
                        __overflow_teardownScrollMode() {
                            var _a, _b;
                            const viewport = this.__overflow_viewportEl;
                            if (viewport && this.__overflow_onScroll) {
                                viewport.removeEventListener('scroll', this.__overflow_onScroll);
                            }
                            this.__overflow_onScroll = null;
                            (_a = this.__overflow_resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                            this.__overflow_resizeObserver = null;
                            (_b = this.__overflow_itemsMutationObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
                            this.__overflow_itemsMutationObserver = null;
                            // A pending readLayoutAfterPaint sees the null viewport and no-ops
                            this.__overflow_viewportEl = null;
                        },
                        __overflow_registerBoundary(name, el) {
                            if (this.__overflow_scrollMode)
                                return;
                            if (this.__overflow_boundaryEls.has(el))
                                return;
                            this.__overflow_boundaryEls.set(el, name);
                            // Initialize based on mode: 1.0 (fully visible) for ratio mode, false for normal mode
                            // Will update on first intersection callback
                            this.__overflow_overflows[name] = this.__overflow_ratioMode ? 1.0 : false;
                            this.$nextTick(() => {
                                this.__overflow_intersectionObserver.observe(el);
                                el.setAttribute(`data-overflow-${name}`, '');
                            });
                        },
                        __overflow_unregisterBoundary(el) {
                            var _a;
                            if (!this.__overflow_boundaryEls.has(el))
                                return;
                            const name = this.__overflow_boundaryEls.get(el);
                            this.__overflow_boundaryEls.delete(el);
                            // Create new object to trigger reactivity
                            const newOverflows = Object.assign({}, this.__overflow_overflows);
                            delete newOverflows[name];
                            this.__overflow_overflows = newOverflows;
                            (_a = this.__overflow_intersectionObserver) === null || _a === void 0 ? void 0 : _a.unobserve(el);
                            // Remove data attributes if this was an autoregistered boundary
                            el.removeAttribute(`data-overflow-${name}`);
                        },
                        __overflow_getBoundaryElement(name) {
                            for (const [boundaryEl, boundaryName] of this.__overflow_boundaryEls) {
                                if (boundaryName === name) {
                                    return boundaryEl;
                                }
                            }
                            return null;
                        },
                        __overflow_onIntersect(entries) {
                            this.__overflow_intersectionEntries = entries;
                            // Store the intersection ratio or convert to boolean based on mode
                            for (const entry of entries) {
                                if (this.__overflow_boundaryEls.has(entry.target)) {
                                    const name = this.__overflow_boundaryEls.get(entry.target);
                                    let value;
                                    if (this.__overflow_ratioMode) {
                                        // Ratio mode: round up to 2 decimal places (0.956 => 0.96, 0.823 => 0.82, etc.)
                                        value = Math.ceil(entry.intersectionRatio * 100) / 100;
                                    }
                                    else {
                                        // Normal mode: convert to boolean (true when overflowing, false when fully visible)
                                        value = !entry.isIntersecting;
                                    }
                                    // Store the value (ratio or boolean)
                                    // Need to create a new object for reactive effects to fire
                                    this.__overflow_overflows = Object.assign(Object.assign({}, this.__overflow_overflows), { [name]: value });
                                }
                            }
                            evaluate(() => { }, { scope: { $entries: entries }, params: [entries] });
                        },
                        __overflow_setupItemsMutationObserver() {
                            if (!this.__overflow_containerEl)
                                return;
                            this.__overflow_itemsMutationObserver = new MutationObserver(() => {
                                // Use requestAnimationFrame to ensure DOM has settled after mutation
                                requestAnimationFrame(() => {
                                    var _a;
                                    (_a = this.__overflow_updateOverflowBoundaries) === null || _a === void 0 ? void 0 : _a.call(this);
                                });
                            });
                            this.__overflow_itemsMutationObserver.observe(this.__overflow_containerEl, {
                                childList: true,
                                subtree: true,
                            });
                        },
                        __overflow_updateOverflowBoundaries() {
                            var _a, _b;
                            if (!this.__overflow_containerEl)
                                return;
                            // Find first and last direct child elements, filtering out template elements and ignored elements
                            const children = Array.from(this.__overflow_containerEl.children).filter((child) => child instanceof HTMLElement &&
                                child.tagName !== 'TEMPLATE' &&
                                !child.hasAttribute('data-overflow-ignore'));
                            const firstItem = children[0] || null;
                            const lastItem = children[children.length - 1] || null;
                            const currentStartBoundary = ((_a = this.__overflow_getBoundaryElement) === null || _a === void 0 ? void 0 : _a.call(this, 'start')) || null;
                            const currentEndBoundary = ((_b = this.__overflow_getBoundaryElement) === null || _b === void 0 ? void 0 : _b.call(this, 'end')) || null;
                            if (firstItem === null || firstItem === void 0 ? void 0 : firstItem.isSameNode(lastItem)) {
                                // If there's only one item, unregister both boundaries
                                if (currentStartBoundary) {
                                    this.__overflow_unregisterBoundary(currentStartBoundary);
                                }
                                if (currentEndBoundary) {
                                    this.__overflow_unregisterBoundary(currentEndBoundary);
                                }
                                return;
                            }
                            // Unregister old boundaries if they changed
                            if (currentStartBoundary && currentStartBoundary !== firstItem) {
                                this.__overflow_unregisterBoundary(currentStartBoundary);
                            }
                            if (currentEndBoundary && currentEndBoundary !== lastItem) {
                                this.__overflow_unregisterBoundary(currentEndBoundary);
                            }
                            // Register new boundaries
                            if (firstItem && currentStartBoundary !== firstItem && !firstItem.isSameNode(lastItem)) {
                                this.__overflow_registerBoundary('start', firstItem);
                            }
                            if (lastItem && currentEndBoundary !== lastItem && !firstItem.isSameNode(lastItem)) {
                                this.__overflow_registerBoundary('end', lastItem);
                            }
                        },
                        destroy() {
                            var _a, _b, _c, _d, _e;
                            if (this.__overflow_scrollMode) {
                                (_a = this.__overflow_teardownScrollMode) === null || _a === void 0 ? void 0 : _a.call(this);
                                return;
                            }
                            (_b = this.__overflow_intersectionObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
                            (_c = this.__overflow_itemsMutationObserver) === null || _c === void 0 ? void 0 : _c.disconnect();
                            const currentStartBoundary = ((_d = this.__overflow_getBoundaryElement) === null || _d === void 0 ? void 0 : _d.call(this, 'start')) || null;
                            const currentEndBoundary = ((_e = this.__overflow_getBoundaryElement) === null || _e === void 0 ? void 0 : _e.call(this, 'end')) || null;
                            if (currentStartBoundary) {
                                this.__overflow_unregisterBoundary(currentStartBoundary);
                            }
                            if (currentEndBoundary) {
                                this.__overflow_unregisterBoundary(currentEndBoundary);
                            }
                        },
                    };
                    return component;
                },
            });
        }
        else {
            // Handle x-overflow:foo directives so users can register named boundaries for overflow detection
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        init() {
                            this.$nextTick(() => {
                                if (!this.__overflow_isRoot) {
                                    warnMissingParentDirective(`x-overflow:${value}`, 'x-overflow', $el);
                                    return;
                                }
                                this.__overflow_registerBoundary(value, $el);
                            });
                        },
                        destroy() {
                            if (!this.__overflow_isRoot) {
                                return;
                            }
                            this.__overflow_unregisterBoundary($el);
                        },
                    };
                },
            });
        }
    }).before('bind');
    Alpine.magic('overflow', (el) => {
        let $data = Alpine.$data(el);
        // Convert overflow values based on mode for the magic property
        const overflowValues = {};
        if ($data.__overflow_overflows) {
            for (const [name, value] of Object.entries($data.__overflow_overflows)) {
                if (value === undefined) {
                    overflowValues[name] = undefined;
                }
                else if ($data.__overflow_ratioMode) {
                    // Ratio mode: return numeric value as-is (should already be number)
                    overflowValues[name] = typeof value === 'number' ? value : value ? 0.0 : 1.0;
                }
                else {
                    // Normal mode: ensure boolean (should already be boolean, but ensure type safety)
                    overflowValues[name] = typeof value === 'boolean' ? value : value < 1.0;
                }
            }
        }
        return mergeProperties({
            registerBoundary(name, el) {
                if (!$data.__overflow_isRoot) {
                    warnMissingParentDirective('$overflow.registerBoundary()', 'x-overflow', el);
                    return;
                }
                $data.__overflow_registerBoundary(name, el);
            },
        }, overflowValues);
    });
}
