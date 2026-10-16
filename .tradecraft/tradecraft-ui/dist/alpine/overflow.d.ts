import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * Magic property for interacting with the enclosing `x-overflow` directive.
         *
         * Provides reactive boolean properties for each overflow edge:
         * - `true` = can scroll that way (boundary not fully visible / not at that scroll edge)
         * - `false` = at that edge (boundary fully visible / cannot scroll further)
         *
         * Default mode watches named boundary elements via IntersectionObserver.
         * With `.scroll`, `start` / `end` come from the viewport’s scroll metrics instead —
         * see the `x-overflow` plugin docs (“Which mode to use”) for when to pick each.
         *
         * With the `.ratio` modifier, provides reactive numeric properties (0.0-1.0):
         * - `1.0` = fully visible within the viewport
         * - `0.0` = fully hidden/outside the viewport
         * - Values between 0.0 and 1.0 = partially visible
         *
         * @example
         * ```html
         * <div x-overflow>
         *   <div x-overflow:viewport>...</div>
         *   <div x-overflow:start>...</div>
         *   <div x-overflow:end>...</div>
         *   <!-- Access overflow state -->
         *   <button x-show="$overflow.start">Show when start is overflowing</button>
         *   <span x-text="$overflow.end ? 'Can scroll' : 'At end'"></span>
         *   <div :class="{ 'edge-mask-l': $overflow.start }">Edge mask</div>
         * </div>
         * ```
         *
         * @example Ratio mode with .ratio modifier
         * ```html
         * <div x-overflow.ratio>
         *   <div x-overflow:viewport>...</div>
         *   <div x-overflow:start>...</div>
         *   <div x-overflow:end>...</div>
         *   <!-- Access overflow state -->
         *   <button x-show="$overflow.start < 1.0">Show when start is overflowing</button>
         *   <span x-text="$overflow.end < 1.0 ? 'Can scroll' : 'At end'"></span>
         *   <!-- Use for gradual transitions -->
         *   <div :style="`opacity: ${1 - $overflow.start}`">Fade mask</div>
         * </div>
         * ```
         *
         * @example Scroll mode with .scroll modifier
         * ```html
         * <div x-overflow.scroll>
         *   <div x-overflow:viewport class="overflow-x-auto">...</div>
         *   <button :disabled="!$overflow.start">←</button>
         *   <button :disabled="!$overflow.end">→</button>
         * </div>
         * ```
         *
         * @property {boolean|number} [boundaryName] - Boolean (default) or number 0.0-1.0 (with .ratio modifier) indicating overflow state.
         *   - `undefined` if the boundary hasn't been registered
         *
         * @method registerBoundary - Programmatically register a boundary element (no-op in `.scroll` mode)
         * @param {string} name - The name to use for this boundary (e.g., 'start', 'end', 'left', 'right')
         * @param {HTMLElement} el - The element to monitor for overflow
         *
         * @example Programmatic registration
         * ```html
         * <div x-overflow>
         *   <div x-overflow:viewport>
         *     <div x-init="$overflow.registerBoundary('myBoundary', $el)">...</div>
         *   </div>
         *   <div x-text="$overflow.myBoundary ? 'Overflowing' : 'Visible'"></div>
         * </div>
         * ```
         */
        $overflow: OverflowMagic;
    }
}
export type OverflowComponent = AlpineComponent<{
    __overflow_isRoot: boolean;
    __overflow_intersectionObserver: IntersectionObserver | null;
    __overflow_intersectionEntries: IntersectionObserverEntry[];
    __overflow_viewportEl: HTMLElement | null;
    __overflow_containerEl: HTMLElement | null;
    __overflow_boundaryEls: Map<Element, string>;
    __overflow_targetEl: HTMLElement | null;
    __overflow_overflows: Record<string, number | boolean | undefined>;
    __overflow_ratioMode: boolean;
    __overflow_scrollMode: boolean;
    __overflow_resizeObserver: ResizeObserver | null;
    __overflow_onScroll: (() => void) | null;
    __overflow_isMeasurementScheduled: boolean;
    __overflow_onIntersect: IntersectionObserverCallback;
    __overflow_registerBoundary(name: string, el: HTMLElement): void;
    __overflow_unregisterBoundary(el: HTMLElement): void;
    __overflow_getBoundaryElement?(name: string): HTMLElement | null;
    __overflow_itemsMutationObserver?: MutationObserver | null;
    __overflow_setupItemsMutationObserver?(): void;
    __overflow_updateOverflowBoundaries?(): void;
    __overflow_setupScrollMode?(): void;
    __overflow_syncContentObservers?(): void;
    __overflow_requestEdgeUpdate?(): void;
    __overflow_teardownScrollMode?(): void;
}>;
export type OverflowMagic = Record<string, boolean | number> & {
    registerBoundary(name: string, el: HTMLElement): void;
};
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
export default function (Alpine: AlpineType): void;
