import { isLowPowerDevice } from '../utils/device';
import { cancelIdleCallback, requestIdleCallback } from '../utils/dom';
import { yieldToMain } from '../utils/yield-to-main';
export const LAZY_ALPINE_ATTR = 'data-lazy-alpine';
export const LAZY_ALPINE_ON_ATTR = 'data-lazy-alpine-on';
export const LAZY_ALPINE_TRIGGER_ATTR = 'data-lazy-alpine-trigger';
export const LAZY_ALPINE_LOAD_ATTR = 'data-lazy-alpine-module';
export const LAZY_ALPINE_LOADING_ATTR = 'data-alpine-loading';
// Derived so it cannot drift from the attribute an instance derives its own marker from
export const LAZY_ALPINE_INITIALIZED_ATTR = `${LAZY_ALPINE_ATTR}-initialized`;
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
export const lazyAlpineRuntimeAttributes = new Set([LAZY_ALPINE_LOADING_ATTR, LAZY_ALPINE_INITIALIZED_ATTR]);
// The shared fallback deadline. Kept short since a fast scroll outruns the intersection
// observer's 200px head start, and these inits only ever run in genuine idle time anyway.
const DEFAULT_LAZY_INIT_TIMEOUT_MS = 5000;
// A low-power device gets the old, patient deadline: idle time is scarce there, so a queue
// of background inits has to wait its turn behind work the shopper can see, and scrolling
// is slow enough that the intersection observer keeps up on its own.
const DEFAULT_LOW_POWER_LAZY_INIT_TIMEOUT_MS = 30000;
// How long an intersect- or interact-triggered init will wait for idle time before
// running anyway. Those roots are about to be seen or used, so a capped wait is the
// right trade. Fallback ('deferred') inits deliberately get no such cap — they are
// background pre-warming and must only ever run in genuine idle time.
const EAGER_INIT_IDLE_TIMEOUT_MS = 2000;
const DEFAULT_INTERSECTION_ROOT_MARGIN = '0px 0px 200px 0px';
// The listeners are on the document in the capture phase, so a root is initialized
// before the interaction reaches anything inside it — `pointerdown` and `click` mean a
// tap on a lazy root's own button finds a live component by the time it is handled.
const DEFAULT_INTERACT_EVENTS = [
    'touchstart',
    'pointerdown',
    'wheel',
    'mouseover',
    'keydown',
    'focusin',
    'click',
];
const DEFAULT_MEDIA_CONDITIONS = {
    desktop: '(min-width: 1024px)',
    mobile: '(max-width: 1023px)',
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
export default function lazyAlpine(Alpine, options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const defaultTimeoutMs = isLowPowerDevice() ? DEFAULT_LOW_POWER_LAZY_INIT_TIMEOUT_MS : DEFAULT_LAZY_INIT_TIMEOUT_MS;
    const lazyAlpineAttribute = (_a = options.lazyAlpineAttribute) !== null && _a !== void 0 ? _a : LAZY_ALPINE_ATTR;
    const config = {
        lazyAlpineAttribute,
        lazyAlpineOnAttribute: (_b = options.lazyAlpineOnAttribute) !== null && _b !== void 0 ? _b : LAZY_ALPINE_ON_ATTR,
        lazyAlpineTriggerAttribute: (_c = options.lazyAlpineTriggerAttribute) !== null && _c !== void 0 ? _c : LAZY_ALPINE_TRIGGER_ATTR,
        lazyAlpineModuleAttribute: (_d = options.lazyAlpineModuleAttribute) !== null && _d !== void 0 ? _d : LAZY_ALPINE_LOAD_ATTR,
        // Derived from this instance's own lazy attribute, so two instances on one page never
        // read each other's roots as already awake. The default pair is data-lazy-alpine and
        // data-lazy-alpine-initialized.
        lazyAlpineInitializedAttribute: (_e = options.lazyAlpineInitializedAttribute) !== null && _e !== void 0 ? _e : `${lazyAlpineAttribute}-initialized`,
        loadingAttribute: (_f = options.loadingAttribute) !== null && _f !== void 0 ? _f : LAZY_ALPINE_LOADING_ATTR,
        lazyInitTimeoutMs: (_g = options.lazyInitTimeoutMs) !== null && _g !== void 0 ? _g : defaultTimeoutMs,
        intersectionRootMargin: (_h = options.intersectionRootMargin) !== null && _h !== void 0 ? _h : DEFAULT_INTERSECTION_ROOT_MARGIN,
        interactEvents: (_j = options.interactEvents) !== null && _j !== void 0 ? _j : DEFAULT_INTERACT_EVENTS,
        mediaConditions: Object.assign(Object.assign({}, DEFAULT_MEDIA_CONDITIONS), options.mediaConditions),
    };
    // This instance's runtime attributes have to survive a DOM patch from server markup
    lazyAlpineRuntimeAttributes.add(config.loadingAttribute);
    lazyAlpineRuntimeAttributes.add(config.lazyAlpineInitializedAttribute);
    // Every lazy root, woken or not — data-lazy-alpine stays on the element for life since
    // it documents what is lazy and its media condition, and keeping it means the markup a
    // section morph brings in matches the live DOM.
    const lazyAlpineSelector = `[${config.lazyAlpineAttribute}]`;
    // Only the roots still waiting to initialize.
    const pendingLazyAlpineSelector = `${lazyAlpineSelector}:not([${config.lazyAlpineInitializedAttribute}])`;
    let intersectionObserver = null;
    const markedElements = new WeakSet();
    const initPromises = new WeakMap();
    const pendingIdleInits = new WeakMap();
    // The same waits again, iterable and keyed by root, so they can be cancelled: by
    // destroy(), and by giving up on a root that left the document. A WeakMap cannot be
    // walked, and the wait has to be findable by element.
    const scheduledIdleInits = new Map();
    // Elements that are marked lazy and still waiting to be initialized.
    const pendingElements = new WeakSet();
    let pendingElementCount = 0;
    // Marked elements awaiting their deferred mark work. The flush must be a microtask
    // (not a timer or rAF): the loading attribute has to land before the paint that
    // follows `alpine:initialized` removing `data-alpine-loading` from <html>, or
    // `prealpine`-styled content would flash un-styled for a frame.
    const unflushedMarks = [];
    let markFlushScheduled = false;
    // One shared timer covers every fallback deadline instead of a setTimeout per root.
    // Entries are kept deadline-ordered on insert, since `idle:<ms>` lets roots ask for
    // deadlines that don't follow the order they were marked in.
    const fallbackQueue = [];
    let fallbackTimer = null;
    let fallbackTimerDeadline = null;
    let drainingFallbackQueue = false;
    let interactListenersAttached = false;
    const triggerCache = new WeakMap();
    const defaultTriggers = {
        immediate: false,
        visible: true,
        interact: true,
        idle: true,
        idleMs: config.lazyInitTimeoutMs,
    };
    // Pending roots that wake on interaction. Kept as a real Set (not a WeakSet) so the
    // selector matching an outside control against every waiting root can iterate them.
    const interactRoots = new Set();
    let controlSelector = null;
    let controlSelectorStale = true;
    const mediaGates = new Map();
    function getMediaGate(condition) {
        let gate = mediaGates.get(condition);
        if (!gate) {
            const created = {
                mql: window.matchMedia(condition),
                pending: new Set(),
                onChange: (event) => {
                    if (event.matches)
                        activateMediaGate(created);
                },
            };
            created.mql.addEventListener('change', created.onChange);
            mediaGates.set(condition, created);
            gate = created;
        }
        return gate;
    }
    /** The element's media gate, or null when it has none (plain or unknown value). */
    function getMediaGateForElement(el) {
        var _a;
        const value = el.getAttribute(config.lazyAlpineAttribute);
        if (!value)
            return null;
        const condition = (_a = config.mediaConditions[value]) !== null && _a !== void 0 ? _a : (value.startsWith('(') ? value : null);
        if (condition == null) {
            debug('unknown media condition, treating as always eligible', value, el);
            return null;
        }
        return getMediaGate(condition);
    }
    function isMediaBlocked(el) {
        const gate = getMediaGateForElement(el);
        return gate && !gate.mql.matches ? gate : null;
    }
    function activateMediaGate(gate) {
        pruneDetachedPendingRoots();
        if (gate.pending.size === 0)
            return;
        debug('activateMediaGate', gate.mql.media, { count: gate.pending.size });
        const now = Date.now();
        for (const el of gate.pending) {
            if (!pendingElements.has(el))
                continue;
            armLazyAlpineTriggers(el, now);
        }
        gate.pending.clear();
        scheduleFallbackTimer(now);
    }
    /** The parsed `data-lazy-alpine-on` value for an element, worked out once per element. */
    function getLazyAlpineTriggers(el) {
        const cached = triggerCache.get(el);
        if (cached)
            return cached;
        const triggers = parseLazyAlpineTriggers(el);
        triggerCache.set(el, triggers);
        return triggers;
    }
    function parseLazyAlpineTriggers(el) {
        const value = el.getAttribute(config.lazyAlpineOnAttribute);
        if (value == null || value.trim() === '')
            return defaultTriggers;
        const triggers = {
            immediate: false,
            visible: false,
            interact: false,
            idle: false,
            idleMs: config.lazyInitTimeoutMs,
        };
        for (const token of value.trim().split(/[\s,]+/)) {
            const separator = token.indexOf(':');
            const name = separator === -1 ? token : token.slice(0, separator);
            const argument = separator === -1 ? '' : token.slice(separator + 1);
            switch (name) {
                case 'immediate':
                    triggers.immediate = true;
                    break;
                case 'visible':
                case 'intersect':
                    triggers.visible = true;
                    break;
                case 'interact':
                    triggers.interact = true;
                    break;
                case 'idle':
                case 'timeout': {
                    triggers.idle = true;
                    if (argument === '')
                        break;
                    const milliseconds = Number(argument);
                    if (Number.isFinite(milliseconds) && milliseconds >= 0) {
                        triggers.idleMs = milliseconds;
                    }
                    else {
                        debug('lazy trigger has an unreadable delay, using the shared deadline', token, el);
                    }
                    break;
                }
                default:
                    debug('unknown lazy trigger, ignoring', token, el);
            }
        }
        // A value naming nothing usable would strand the root forever, so fall back to the
        // usual set rather than silently never initializing.
        if (!triggers.immediate && !triggers.visible && !triggers.interact && !triggers.idle) {
            debug('no usable lazy triggers, falling back to the defaults', value, el);
            return defaultTriggers;
        }
        return triggers;
    }
    /**
     * Set up whatever should wake this root — or wake it here and now, for `immediate`.
     * Called once the root's deferred mark work runs, and again if a media gate it was
     * parked behind starts matching.
     */
    function armLazyAlpineTriggers(el, now) {
        const triggers = getLazyAlpineTriggers(el);
        if (triggers.visible)
            observeLazyAlpineElement(el);
        if (triggers.interact && !interactRoots.has(el)) {
            interactRoots.add(el);
            controlSelectorStale = true;
        }
        if (triggers.idle)
            queueFallback(el, now + triggers.idleMs);
        // Last, so that anything listed alongside it is already watching should this init
        // fail — a module that never arrives leaves the root retryable.
        if (triggers.immediate)
            wakeLazyAlpineElement(el, 'immediate');
    }
    /**
     * The selector that finds an element controlling one of the waiting roots. One
     * `closest()` call per interaction covers every waiting root; it is rebuilt only when
     * the set of roots changes.
     */
    function getControlSelector() {
        var _a;
        if (!controlSelectorStale)
            return controlSelector;
        pruneDetachedPendingRoots();
        controlSelectorStale = false;
        if (interactRoots.size === 0) {
            controlSelector = null;
            return null;
        }
        const selectors = new Set(['[aria-controls]']);
        for (const el of interactRoots) {
            const selector = (_a = el.getAttribute(config.lazyAlpineTriggerAttribute)) === null || _a === void 0 ? void 0 : _a.trim();
            if (selector)
                selectors.add(selector);
        }
        controlSelector = Array.from(selectors).join(', ');
        return controlSelector;
    }
    /** The waiting roots that `control` opens, whether by `aria-controls` or by selector. */
    function getRootsControlledBy(control, target) {
        var _a, _b, _c;
        const roots = [];
        for (const id of (_b = (_a = control.getAttribute('aria-controls')) === null || _a === void 0 ? void 0 : _a.split(/\s+/)) !== null && _b !== void 0 ? _b : []) {
            if (id === '')
                continue;
            const named = document.getElementById(id);
            if (!named)
                continue;
            // The named element may itself sit inside the lazy root (a <dialog> within its
            // wrapper)…
            const root = named.closest(pendingLazyAlpineSelector);
            if (root instanceof HTMLElement)
                roots.push(root);
            // …or contain lazy roots, when a live shell keeps only its contents asleep — a
            // button pointing at a drawer's dialog warms up the contents inside it.
            for (const inner of named.querySelectorAll(pendingLazyAlpineSelector)) {
                if (inner instanceof HTMLElement)
                    roots.push(inner);
            }
        }
        for (const el of interactRoots) {
            const selector = (_c = el.getAttribute(config.lazyAlpineTriggerAttribute)) === null || _c === void 0 ? void 0 : _c.trim();
            if (!selector)
                continue;
            // The selector names the root's own component: only an interaction inside the
            // root's closest match counts, so one select's button never wakes another's options.
            const scope = target.closest(selector);
            if (scope && scope.contains(el))
                roots.push(el);
        }
        return roots;
    }
    /** Initialize a waiting root now, because something asked for it. */
    function wakeLazyAlpineElement(el, source) {
        if (!pendingElements.has(el))
            return;
        // The viewport may not match the root's media condition; leave it parked on the gate.
        const blockedGate = isMediaBlocked(el);
        if (blockedGate) {
            debug('wake skipped, media condition does not match', source, el);
            blockedGate.pending.add(el);
            return;
        }
        if (intersectionObserver)
            intersectionObserver.unobserve(el);
        startLazyAlpineElementInit(el, source, { immediate: true });
    }
    function getLazyAlpineElements(root) {
        const elements = Array.from(root.querySelectorAll(pendingLazyAlpineSelector));
        if (root instanceof Element && root.matches(pendingLazyAlpineSelector)) {
            elements.unshift(root);
        }
        return elements;
    }
    function getLazyAlpineModuleSpecifiers(root) {
        const elements = [
            root,
            ...Array.from(root.querySelectorAll(`[${config.lazyAlpineModuleAttribute}]`)).filter((el) => {
                // Module declarations inside a nested lazy root belong to that root and load
                // when it initializes (it may be media-gated to a different viewport).
                const owner = el.closest(lazyAlpineSelector);
                return owner === root || owner === null;
            }),
        ];
        return Array.from(new Set(elements
            .map((el) => el.getAttribute(config.lazyAlpineModuleAttribute))
            .filter((value) => value != null && value.trim() !== '')
            .flatMap((value) => value.split(','))
            .map((value) => value.trim())
            .filter((value) => value !== '')));
    }
    async function loadLazyAlpineModules(specifiers) {
        if (specifiers.length === 0)
            return;
        await Promise.all(specifiers.map((specifier) => import(/* webpackIgnore: true */ specifier)));
    }
    function markLazyAlpineElement(el) {
        if (markedElements.has(el))
            return;
        markedElements.add(el);
        pendingElements.add(el);
        pendingElementCount++;
        // `_x_ignore` must be set synchronously so Alpine's current walk skips this subtree.
        el._x_ignore = true;
        unflushedMarks.push(el);
        if (!markFlushScheduled) {
            markFlushScheduled = true;
            queueMicrotask(flushMarkedElements);
        }
        debug('markLazyAlpineElement', el);
    }
    function flushMarkedElements() {
        markFlushScheduled = false;
        const elements = unflushedMarks.splice(0);
        if (elements.length === 0)
            return;
        attachInteractListeners();
        const now = Date.now();
        for (const el of elements) {
            // Skip elements that were already initialized between marking and this flush.
            if (!pendingElements.has(el))
                continue;
            el.setAttribute(config.loadingAttribute, '');
            const blockedGate = isMediaBlocked(el);
            if (blockedGate) {
                blockedGate.pending.add(el);
                continue;
            }
            armLazyAlpineTriggers(el, now);
        }
        scheduleFallbackTimer(now);
    }
    /**
     * Drop every reference the plugin holds to a root that is no longer waiting.
     *
     * interactRoots and a media gate's pending set are strong Sets, so a root left in them
     * after it leaves the page keeps that subtree alive and the pending count wrong.
     */
    function releaseLazyAlpineTracking(el) {
        intersectionObserver === null || intersectionObserver === void 0 ? void 0 : intersectionObserver.unobserve(el);
        if (interactRoots.delete(el))
            controlSelectorStale = true;
        for (const gate of mediaGates.values()) {
            gate.pending.delete(el);
        }
        const queuedIndex = fallbackQueue.findIndex((entry) => entry.el === el);
        if (queuedIndex !== -1)
            fallbackQueue.splice(queuedIndex, 1);
        if (pendingElements.delete(el)) {
            pendingElementCount--;
        }
    }
    function markLazyAlpineElementInitialized(el) {
        delete el._x_ignore;
        // data-lazy-alpine stays for life; the initialized attribute is what says "woken".
        el.setAttribute(config.lazyAlpineInitializedAttribute, '');
        releaseLazyAlpineTracking(el);
    }
    /**
     * Forget every parked root that has left the document.
     *
     * A root waiting on an interaction or on a media condition is held in a strong Set, and
     * no trigger ever fires for one that is no longer in the page — so without this sweep a
     * removed section's roots keep their subtrees alive and the pending count stays wrong.
     * Run it wherever those sets are already being walked.
     */
    function pruneDetachedPendingRoots() {
        for (const el of interactRoots) {
            if (!el.isConnected)
                abandonDetachedLazyAlpineElement(el);
        }
        for (const gate of mediaGates.values()) {
            for (const el of gate.pending) {
                if (!el.isConnected)
                    abandonDetachedLazyAlpineElement(el);
            }
        }
        // A root part-way through its init is held by the wait itself rather than by a trigger
        // set, and a background wait has no deadline to fall back on
        for (const el of Array.from(scheduledIdleInits.keys())) {
            if (!el.isConnected)
                abandonDetachedLazyAlpineElement(el);
        }
        for (const { el } of Array.from(fallbackQueue)) {
            if (!el.isConnected)
                abandonDetachedLazyAlpineElement(el);
        }
    }
    /**
     * Give up on a root that left the document before its init ran. The element is a
     * discarded copy — a section morph replaced it — so let go of it and stay retryable in
     * case the same node is ever put back.
     */
    function abandonDetachedLazyAlpineElement(el) {
        var _a;
        // An idle callback still queued for this root would hold the removed subtree until it
        // fires, and a background init waits for genuine idle time with no deadline at all
        (_a = scheduledIdleInits.get(el)) === null || _a === void 0 ? void 0 : _a.cancel();
        releaseLazyAlpineTracking(el);
        initPromises.delete(el);
        pendingIdleInits.delete(el);
        // Runtime state for a root nothing is waiting on any more. Put the node back in the
        // page and Alpine's walk marks it afresh.
        el.removeAttribute(config.loadingAttribute);
    }
    /** Add to the shared deadline queue, keeping it ordered by deadline. */
    function queueFallback(el, deadline) {
        let index = fallbackQueue.length;
        while (index > 0 && fallbackQueue[index - 1].deadline > deadline)
            index--;
        fallbackQueue.splice(index, 0, { el, deadline });
    }
    function scheduleFallbackTimer(now) {
        if (drainingFallbackQueue)
            return;
        const head = fallbackQueue[0];
        if (!head)
            return;
        if (fallbackTimer != null) {
            // Already waiting on a deadline no later than this one.
            if (fallbackTimerDeadline != null && fallbackTimerDeadline <= head.deadline)
                return;
            clearTimeout(fallbackTimer);
        }
        fallbackTimerDeadline = head.deadline;
        fallbackTimer = setTimeout(drainFallbackQueue, Math.max(0, head.deadline - now));
    }
    async function drainFallbackQueue() {
        fallbackTimer = null;
        fallbackTimerDeadline = null;
        drainingFallbackQueue = true;
        pruneDetachedPendingRoots();
        try {
            while (fallbackQueue.length > 0 && fallbackQueue[0].deadline <= Date.now()) {
                const entry = fallbackQueue.shift();
                if (!entry || !pendingElements.has(entry.el))
                    continue;
                // The viewport may have left the root's media condition since it was queued;
                // park it on the gate so a later match re-queues it.
                const blockedGate = isMediaBlocked(entry.el);
                if (blockedGate) {
                    blockedGate.pending.add(entry.el);
                    continue;
                }
                // Finish one root before starting the next, so background inits claim one
                // idle period at a time instead of queueing an idle callback for every
                // remaining root at once and running them as a back-to-back burst.
                await initLazyAlpineElement(entry.el, 'deferred').catch(() => {
                    // A failed module import leaves that root retryable; keep draining the rest.
                });
            }
        }
        finally {
            drainingFallbackQueue = false;
            scheduleFallbackTimer(Date.now());
        }
    }
    function initLazyAlpineElement(el, source, options = {}) {
        const existingPromise = initPromises.get(el);
        if (existingPromise) {
            // This root already started initializing and may still be sitting on an idle
            // callback — pre-warming in the background, or waiting out the capped deadline a
            // visibility wake gave it. Either way a later trigger can hurry it along.
            const pending = pendingIdleInits.get(el);
            if (pending) {
                // Something needs the root as part of handling what just happened, so no amount of
                // waiting is acceptable — not even the capped kind.
                if (options.immediate === true)
                    pending.runNow();
                else if (source !== 'deferred')
                    pending.cap();
            }
            return existingPromise;
        }
        if (!el.hasAttribute(config.lazyAlpineAttribute))
            return Promise.resolve();
        if (el.hasAttribute(config.lazyAlpineInitializedAttribute))
            return Promise.resolve();
        // A root can leave the document between its mark and its trigger — a section morph
        // replaces it, a media gate holds it while the DOM changes. initTree on a detached
        // root writes into component data the live tree may share, so never run it. The root
        // stays marked; the initTree that inserts a replacement marks that one itself.
        if (!el.isConnected) {
            debug('initLazyAlpineElement skipped, element is not in the document', source, el);
            abandonDetachedLazyAlpineElement(el);
            return Promise.resolve();
        }
        if (isMediaBlocked(el)) {
            debug('initLazyAlpineElement skipped, media condition does not match', source, el);
            return Promise.resolve();
        }
        const specifiers = getLazyAlpineModuleSpecifiers(el);
        const immediate = options.immediate === true;
        // An interaction or event that needs this root can't wait: the click following a tap
        // has to find a live component. With nothing to import there is no reason to yield at
        // all, so the whole init runs synchronously inside the handler that asked for it.
        if (immediate && specifiers.length === 0) {
            const initPromise = Promise.resolve();
            initPromises.set(el, initPromise);
            markLazyAlpineElementInitialized(el);
            debug('initLazyAlpineElement', source, el);
            try {
                Alpine.initTree(el);
            }
            finally {
                // A root whose own init threw must still not keep the page's prealpine styling.
                el.removeAttribute(config.loadingAttribute);
            }
            return initPromise;
        }
        const initPromise = (async () => {
            el.setAttribute(config.loadingAttribute, '');
            try {
                await loadLazyAlpineModules(specifiers);
            }
            catch (error) {
                initPromises.delete(el);
                el.removeAttribute(config.loadingAttribute);
                debug('initLazyAlpineElement failed', source, error, el);
                throw error;
            }
            debug('initLazyAlpineElement', source, el);
            // An interaction or event wake still must not wait for idle time: whatever asked
            // for this root needs it now, and the modules it was waiting on have just arrived.
            if (immediate) {
                // The module import above yielded — check again that the root is still in the document
                if (!el.isConnected) {
                    debug('initLazyAlpineElement skipped after module load, element is not in the document', source, el);
                    abandonDetachedLazyAlpineElement(el);
                    return;
                }
                markLazyAlpineElementInitialized(el);
                Alpine.initTree(el);
                el.removeAttribute(config.loadingAttribute);
                return;
            }
            // 'deferred' means nobody is waiting on this root, so only ever run it in
            // genuine idle time. Every other source means the shopper is about to see or
            // use it, so cap the wait and run anyway once the deadline passes. The root
            // stays marked until the init actually runs, so that a wait which turns out to
            // matter more than expected can still be found by the triggers and hurried along.
            await new Promise((resolve) => {
                let hasRun = false;
                let isCapped = source !== 'deferred';
                let idleCallbackId;
                // Declared before the wait is scheduled, since requestIdleCallback can run its
                // callback in the same tick
                const scheduled = {
                    cancel() {
                        if (hasRun)
                            return;
                        hasRun = true;
                        cancelIdleCallback(idleCallbackId);
                        pendingIdleInits.delete(el);
                        scheduledIdleInits.delete(el);
                        resolve();
                    },
                };
                const runInit = () => {
                    if (hasRun)
                        return;
                    hasRun = true;
                    pendingIdleInits.delete(el);
                    scheduledIdleInits.delete(el);
                    // The idle wait gives the DOM time to change under the root — a section morph
                    // can detach it before this runs, and initTree on a detached root writes into
                    // component data the live tree may share.
                    if (!el.isConnected) {
                        debug('initLazyAlpineElement skipped at run time, element is not in the document', source, el);
                        abandonDetachedLazyAlpineElement(el);
                        resolve();
                        return;
                    }
                    markLazyAlpineElementInitialized(el);
                    try {
                        Alpine.initTree(el);
                    }
                    finally {
                        // A root whose own init threw must still not keep the page's prealpine
                        // styling, and the caller awaiting this must not be left hanging.
                        el.removeAttribute(config.loadingAttribute);
                        resolve();
                    }
                };
                scheduledIdleInits.set(el, scheduled);
                idleCallbackId = requestIdleCallback(runInit, isCapped ? { timeout: EAGER_INIT_IDLE_TIMEOUT_MS } : undefined);
                pendingIdleInits.set(el, {
                    cap() {
                        if (isCapped)
                            return;
                        isCapped = true;
                        cancelIdleCallback(idleCallbackId);
                        idleCallbackId = requestIdleCallback(runInit, { timeout: EAGER_INIT_IDLE_TIMEOUT_MS });
                    },
                    runNow() {
                        cancelIdleCallback(idleCallbackId);
                        runInit();
                    },
                });
            });
        })();
        initPromises.set(el, initPromise);
        return initPromise;
    }
    /**
     * Start an init nobody is going to await, and contain anything it throws.
     *
     * An immediate wake runs `Alpine.initTree` synchronously, so a root whose own component
     * code throws would otherwise take the throw straight out to whoever asked — the mark
     * flush, a media gate opening, an event handler — and stop every remaining root there
     * from being set up. One bad root must only ever cost that root.
     */
    function startLazyAlpineElementInit(el, source, options) {
        try {
            void initLazyAlpineElement(el, source, options).catch(() => {
                // initLazyAlpineElement logs and leaves the root retryable when module loading fails.
            });
        }
        catch (error) {
            debug('initLazyAlpineElement threw', source, error, el);
        }
    }
    function getObserver() {
        if (!intersectionObserver) {
            intersectionObserver = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting)
                        continue;
                    const el = entry.target;
                    if (!(el instanceof HTMLElement))
                        continue;
                    intersectionObserver.unobserve(el);
                    const blockedGate = isMediaBlocked(el);
                    if (blockedGate) {
                        blockedGate.pending.add(el);
                        continue;
                    }
                    startLazyAlpineElementInit(el, 'intersect');
                }
            }, { rootMargin: config.intersectionRootMargin });
        }
        return intersectionObserver;
    }
    function observeLazyAlpineElement(el) {
        // IntersectionObserver ignores observe() for targets it already observes, so no
        // bookkeeping is needed — and media-gated roots can safely be re-observed after
        // their gate re-opens.
        getObserver().observe(el);
    }
    function observeLazyAlpineElements(root = document) {
        pruneDetachedPendingRoots();
        const elements = getLazyAlpineElements(root);
        elements.forEach((el) => {
            // Roots that asked not to wake on visibility are left alone.
            if (el instanceof HTMLElement && getLazyAlpineTriggers(el).visible)
                observeLazyAlpineElement(el);
        });
        if (elements.length) {
            debug('observeLazyAlpineElements', { root: root === document ? 'document' : root, count: elements.length });
        }
    }
    function handleInteract(event) {
        var _a;
        if (pendingElementCount === 0)
            return;
        const target = event.target instanceof Element ? event.target : null;
        if (!target)
            return;
        // The root the interaction happened inside.
        const enclosingRoot = (_a = target.closest) === null || _a === void 0 ? void 0 : _a.call(target, pendingLazyAlpineSelector);
        if (enclosingRoot instanceof HTMLElement && getLazyAlpineTriggers(enclosingRoot).interact) {
            wakeLazyAlpineElement(enclosingRoot, 'interact');
        }
        // Roots opened from elsewhere on the page, such as a drawer and its button.
        const selector = getControlSelector();
        if (!selector)
            return;
        const control = target.closest(selector);
        if (!control)
            return;
        for (const root of getRootsControlledBy(control, target)) {
            if (getLazyAlpineTriggers(root).interact)
                wakeLazyAlpineElement(root, 'interact-control');
        }
    }
    function attachInteractListeners() {
        if (interactListenersAttached)
            return;
        interactListenersAttached = true;
        config.interactEvents.forEach((type) => {
            document.addEventListener(type, handleInteract, { passive: true, capture: true });
        });
    }
    function detachInteractListeners() {
        if (!interactListenersAttached)
            return;
        interactListenersAttached = false;
        config.interactEvents.forEach((type) => {
            document.removeEventListener(type, handleInteract, { capture: true });
        });
    }
    /**
     * Initialize every root still waiting, whatever it was waiting for. This is the manual
     * escape hatch — `data-lazy-alpine-on` does not hold it back, though a media condition
     * that doesn't match still does.
     */
    async function initRemainingLazyAlpineElements() {
        const elements = Array.from(document.querySelectorAll(pendingLazyAlpineSelector));
        if (elements.length)
            debug('initRemainingLazyAlpineElements', { count: elements.length });
        for (const el of elements) {
            if (intersectionObserver)
                intersectionObserver.unobserve(el);
            await initLazyAlpineElement(el, 'deferred');
            await yieldToMain();
        }
    }
    Alpine.interceptInit((el) => {
        // This is a hot path - it runs for every element Alpine walks anything done here must be fast
        if (!el.hasAttribute(config.lazyAlpineAttribute))
            return;
        if (!(el instanceof HTMLElement))
            return;
        // A woken root keeps data-lazy-alpine, so a later walk over it must not re-defer it
        if (el.hasAttribute(config.lazyAlpineInitializedAttribute))
            return;
        // Alpine's morph walks the parsed incoming tree with the live component data attached
        // to it. Marking a detached root queues a later initTree that writes into the shared
        // data through directives like x-dialog's x-init, so leave it alone: it is a throwaway
        // copy, and the initTree that inserts a replacement marks that one instead.
        //
        // Write nothing on it either. Morph clones onto the incoming element and then copies
        // its attributes to the live one, so a marker put here lands on a root that is still
        // asleep and stops it ever waking.
        if (!el.isConnected)
            return;
        markLazyAlpineElement(el);
    });
    // Alpine seeds each morph copy with its live element's data stack, so the directives on
    // the copy evaluate against live state. That is how x-for and x-if stamp their rows into
    // the incoming tree for the diff. Alpine does not carry `_x_ignore` over, so the copy of
    // a root that is still asleep would run every directive with no state behind it, and an
    // init() that writes into a shared component, such as a carousel slide registering
    // itself, would reach the live data. Put the copy to sleep exactly when the live root
    // sleeps. The flag is an expando, so it never reaches the live root.
    Alpine.interceptClone((from, to) => {
        if (pendingElements.has(from))
            to._x_ignore = true;
    });
    function destroy() {
        intersectionObserver === null || intersectionObserver === void 0 ? void 0 : intersectionObserver.disconnect();
        intersectionObserver = null;
        if (fallbackTimer != null) {
            clearTimeout(fallbackTimer);
            fallbackTimer = null;
            fallbackTimerDeadline = null;
        }
        fallbackQueue.length = 0;
        unflushedMarks.length = 0;
        // Idle callbacks already queued would otherwise initialize roots after teardown
        for (const scheduled of Array.from(scheduledIdleInits.values()))
            scheduled.cancel();
        scheduledIdleInits.clear();
        for (const gate of mediaGates.values()) {
            gate.mql.removeEventListener('change', gate.onChange);
            gate.pending.clear();
        }
        mediaGates.clear();
        interactRoots.clear();
        controlSelectorStale = true;
        detachInteractListeners();
    }
    return {
        markLazyAlpineElement,
        observeLazyAlpineElements,
        initLazyAlpineElement,
        initRemainingLazyAlpineElements,
        destroy,
    };
}
function debug(...args) {
    if (window.debugMode) {
        console.log('[lazy-alpine]', ...args);
    }
}
