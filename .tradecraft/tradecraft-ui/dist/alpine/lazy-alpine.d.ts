import { Alpine as AlpineType } from 'alpinejs';
declare module 'alpinejs' {
    interface Alpine {
        /** Runs for each live element and its morph copy, before Alpine seeds and walks the copy. */
        interceptClone(callback: (from: ElementWithXAttributes, to: ElementWithXAttributes) => void): void;
    }
}
export declare const LAZY_ALPINE_ATTR = "data-lazy-alpine";
export declare const LAZY_ALPINE_ON_ATTR = "data-lazy-alpine-on";
export declare const LAZY_ALPINE_TRIGGER_ATTR = "data-lazy-alpine-trigger";
export declare const LAZY_ALPINE_LOAD_ATTR = "data-lazy-alpine-module";
export declare const LAZY_ALPINE_LOADING_ATTR = "data-alpine-loading";
export declare const LAZY_ALPINE_INITIALIZED_ATTR = "data-lazy-alpine-initialized";
/**
 * The attribute names that hold a lazy root's runtime state, across every live instance.
 *
 * Server markup never carries these — they are written by the plugin as a root moves
 * through its life — so anything that patches the DOM from server markup has to leave
 * them on the live element. The rest of the lazy attributes are server-owned
 * configuration and follow the incoming markup as usual.
 *
 * @example Keep them through a DOM patch
 * ```ts
 * for (const name of lazyAlpineRuntimeAttributes) {
 *   // copy the live element's value onto the incoming one
 * }
 * ```
 */
export declare const lazyAlpineRuntimeAttributes: Set<string>;
export type LazyAlpineOptions = {
    lazyAlpineAttribute?: string;
    lazyAlpineOnAttribute?: string;
    lazyAlpineTriggerAttribute?: string;
    lazyAlpineModuleAttribute?: string;
    lazyAlpineInitializedAttribute?: string;
    loadingAttribute?: string;
    /**
     * The shared fallback deadline. Left unset, it is 5000 on a normal device and 30000 on a
     * low-power one (`isLowPowerDevice()`). Set it and that one value covers every device.
     */
    lazyInitTimeoutMs?: number;
    intersectionRootMargin?: string;
    interactEvents?: readonly string[];
    /** Named media conditions usable as `data-lazy-alpine` values (e.g. `desktop`). */
    mediaConditions?: Record<string, string>;
};
export type LazyAlpineInitOptions = {
    /**
     * Initialize without waiting for an idle moment. Used for interaction wakes, where the
     * root is needed as part of handling what the shopper just did.
     */
    immediate?: boolean;
};
export type LazyAlpineController = {
    markLazyAlpineElement(el: HTMLElement): void;
    observeLazyAlpineElements(root?: Document | Element): void;
    initLazyAlpineElement(el: HTMLElement, source?: string, options?: LazyAlpineInitOptions): Promise<void>;
    initRemainingLazyAlpineElements(): Promise<void>;
    destroy(): void;
};
/**
 * Defers Alpine initialization for elements marked with `data-lazy-alpine`.
 *
 * Lazy roots are ignored during the initial Alpine tree walk, then initialized when
 * they approach the viewport, on user interaction, or after a fallback timeout.
 * Optional `data-lazy-alpine-module` values are imported before the lazy root is
 * initialized, allowing feature bundles to register directives just in time.
 *
 * A woken root keeps `data-lazy-alpine` for life — it documents what is lazy and its
 * media condition, and it keeps the live DOM matching the markup a section morph brings
 * in — and gains `data-lazy-alpine-initialized` to say it is awake.
 *
 * The init itself is scheduled with `requestIdleCallback`, and how patient it is
 * depends on why it was triggered. Viewport and interaction inits may force
 * themselves onto a busy main thread after a short deadline, because the shopper is
 * about to see or use that root. Fallback-timeout inits are pure background
 * pre-warming: they wait for genuine idle time with no deadline, and run one root
 * at a time, so they never compete with page rendering or shopper input. If the
 * shopper reaches a root while its background init is still waiting, the wait is
 * upgraded to the capped one.
 *
 * The fallback deadline itself depends on the device: 5000 milliseconds normally, and
 * 30000 on a low-power one, since a fast phone can be scrolled quicker than the
 * intersection observer's head start covers while a slow one cannot.
 *
 * Marking runs inside Alpine's synchronous tree walk, so it is kept as cheap as
 * possible: only `_x_ignore` is set inline, while the loading attribute, intersection
 * observation, and fallback scheduling for all roots are batched into a single
 * microtask flush.
 *
 * ## Choosing when a root initializes
 *
 * `data-lazy-alpine-on` narrows the list of things that will wake a root. Give it any
 * combination of these, separated by spaces or commas:
 *
 * | Value | Wakes the root when |
 * |---|---|
 * | `immediate` | straight away — see below |
 * | `visible` | it scrolls close to the viewport (the default `intersectionRootMargin` gives it a head start) — or is revealed any other way, such as a drawer opening around it |
 * | `interact` | someone touches, hovers, clicks, or types on the root — or on an element that controls it (see below) |
 * | `idle` | the fallback deadline passes (`lazyInitTimeoutMs`) |
 * | `idle:2000` | 2000 milliseconds have passed instead of the usual deadline |
 *
 * Leave the attribute off and a root behaves as it always has: `visible interact idle`.
 *
 * An element that controls a root is one whose `aria-controls` names the root, names
 * anything inside it, or names an element the root sits inside — so a button pointing at
 * a `<dialog>` warms up a lazy root nested in that dialog. A root can also name its own
 * component's element with a CSS selector in `data-lazy-alpine-trigger`: interactions
 * anywhere inside the root's closest match wake it, which is how a popup's contents wake
 * from the button beside them.
 *
 * Interaction wakes initialize the root straight away rather than waiting for an idle
 * moment, and when the root has no `data-lazy-alpine-module` to import that happens
 * synchronously — so a root woken by `pointerdown` (or, at the latest, by the
 * capture-phase `click`) is live before the button's own click handler runs.
 *
 * `immediate` is the one trigger that waits for nothing at all: the root initializes as
 * soon as it is eligible, which for a media-gated root means the moment its condition
 * starts matching. That work lands in the same task as Alpine's own startup, so
 * `immediate` on its own buys nothing — it is for pairing with a media condition, where
 * the point is that the *other* viewport never pays for the root at all.
 *
 * The intended shape for drawers and selects is a live component shell around lazy
 * contents: the shell — a drawer's dialog, a select's button — initializes with the page
 * and handles opening, however it is asked to open, while the expensive contents wait to
 * be revealed or reached for. Nothing outside the shell needs to know its contents were
 * asleep.
 *
 * @example Navigation that is only ever used on desktop, and starts up there as usual
 * ```html
 * <nav data-lazy-alpine="desktop" data-lazy-alpine-on="immediate">…</nav>
 * ```
 *
 * @example A drawer whose contents wait to be revealed or reached for
 * ```html
 * <div x-dialog.modal>
 *   <dialog id="filter-drawer" x-dialog:dialog>
 *     <div data-lazy-alpine data-lazy-alpine-on="visible interact">…</div>
 *   </dialog>
 * </div>
 * <button aria-controls="filter-drawer">Filters</button>
 * ```
 *
 * @example A popup's options wake from anywhere in their own component
 * ```html
 * <custom-select x-select>
 *   <button x-select:button>…</button>
 *   <custom-select-popup data-lazy-alpine data-lazy-alpine-on="interact" data-lazy-alpine-trigger="custom-select">
 *     …
 *   </custom-select-popup>
 * </custom-select>
 * ```
 *
 * @example Give a below-the-fold section its own deadline in place of the shared one
 * ```html
 * <section data-lazy-alpine data-lazy-alpine-on="visible idle:10000">…</section>
 * ```
 *
 * ## Media-gated roots
 *
 * The attribute value can restrict a root to a media condition, e.g.
 * `data-lazy-alpine="desktop"` (named condition, see `mediaConditions`) or
 * `data-lazy-alpine="(min-width: 1024px)"` (raw media query). While the condition
 * doesn't match, the root never initializes at all — no `data-lazy-alpine-module`
 * imports, no `Alpine.initTree`, no observers, no fallback timer. If the viewport
 * later crosses into the condition, the root becomes eligible and initializes through
 * the usual intersection/fallback flow. Unknown values behave like a plain lazy root.
 *
 * Module declarations nested inside a *different* lazy root belong to that root: they
 * load when it initializes, so a desktop-only nested root's modules never load on
 * mobile even when an ancestor root initializes.
 *
 * Media conditions and `data-lazy-alpine-on` stack: a `desktop` root that only wakes on
 * interaction stays inert on a phone no matter how much it is prodded.
 */
export default function lazyAlpine(Alpine: AlpineType, options?: LazyAlpineOptions): LazyAlpineController;
