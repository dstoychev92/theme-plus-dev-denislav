import { unstable_animateLayout as animateLayout } from 'motion-plus/animate-layout';
import { getMillisecondsModifierValue, getPositiveNumberModifierValue } from '../utils/modifiers';
import { isLowPowerDevice, isReducedMotion } from '../utils/device';
import { warnMissingParentDirective } from '../utils/error';
const DEFAULT_DURATION = 0.3;
const DEFAULT_EASE = [0.4, 0, 0.2, 1];
/**
 * Wires named sets of candidate elements so that, within each set, exactly
 * one element at a time owns a shared `data-layout-id`. Handoffs are wrapped
 * in a motion-plus `animateLayout()` call, producing a FLIP animation
 * between the previous and new owner's bounds.
 *
 * Visibility is driven entirely by `x-show` — this plugin only cares about
 * which element currently owns the layout id. It overrides `_x_doShow` and
 * `_x_doHide` on each candidate so the bounds snapshot, attribute swap, and
 * display toggle all happen inside one `updateDom` callback; motion-plus
 * correlates the before/after snapshots via the `data-layout-id` attribute.
 *
 * A single `x-shared-layout` subtree can host multiple independent groups —
 * each distinct name passed to `x-shared-layout:element` is its own set with
 * its own generated layout id.
 *
 * ## Directives
 *
 * - `x-shared-layout` (root) — establishes the group registry on the Alpine
 *   scope. Descendants share the same scope.
 * - `x-shared-layout:element="<name>"` (candidate) — the expression text is
 *   used verbatim as the group name, not evaluated. All candidates with the
 *   same name form one set and share one generated `data-layout-id`. Pair
 *   with `x-show` to control which one is active.
 *
 * ## Root modifiers
 *
 * All animation settings are configured on the root and apply to every
 * handoff within the subtree.
 *
 * - `.duration.<n>ms` — Tween duration. Defaults to `300ms`. Ignored when
 *   `.spring` is set.
 * - `.spring` — Use a spring animation instead of the default tween.
 * - `.mass.<n>` — Spring mass. Only applied when `.spring` is set.
 * - `.stiffness.<n>` — Spring stiffness. Only applied when `.spring` is set.
 * - `.damping.<n>` — Spring damping. Only applied when `.spring` is set.
 * - `.reducemotion` — Disable shared layout animations when the user has
 *   `prefers-reduced-motion: reduce` set. Reduced motion is not checked unless
 *   this modifier is present.
 *
 * @example Pill-style tab background that hops between tabs
 *
 * <div class="inline-flex gap-2 p-1 bg-gray-100 rounded-full"
 *      x-shared-layout
 *      x-data="{ selected: 0 }">
 *   <button class="relative" @click="selected = 0">
 *     Apples
 *     <span class="absolute inset-0 -z-10 bg-white rounded-full"
 *           x-show="selected === 0"
 *           x-shared-layout:element="pill"></span>
 *   </button>
 *   <button class="relative" @click="selected = 1">
 *     Oranges
 *     <span class="absolute inset-0 -z-10 bg-white rounded-full"
 *           x-show="selected === 1"
 *           x-shared-layout:element="pill"></span>
 *   </button>
 * </div>
 *
 * @example Two independent groups in the same subtree
 *
 * <nav x-shared-layout>
 *   <a>Home <span x-show="active === 'home'" x-shared-layout:element="hover"></span></a>
 *   <a>About <span x-show="active === 'about'" x-shared-layout:element="hover"></span></a>
 *   <!-- Separate set — its own generated layout id -->
 *   <a>Home <span x-show="current === 'home'" x-shared-layout:element="current"></span></a>
 *   <a>About <span x-show="current === 'about'" x-shared-layout:element="current"></span></a>
 * </nav>
 *
 * @example Spring animation with custom stiffness
 *
 * <nav x-shared-layout.spring.stiffness.240.damping.30>
 *   ...
 * </nav>
 */
export default function sharedLayout(Alpine) {
    Alpine.directive('shared-layout', ($el, data) => {
        if (data.value === null) {
            handleRoot($el, Alpine, data);
        }
        else if (data.value === 'element') {
            handleElement($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-shared-layout:${data.value}`);
        }
    }).before('bind');
}
function handleRoot($el, Alpine, data) {
    const animationOptions = parseAnimationOptions(data.modifiers);
    const shouldRespectReducedMotion = data.modifiers.includes('reducemotion');
    Alpine.bind($el, {
        'x-data'() {
            return {
                __sharedLayout_isRoot: true,
                __sharedLayout_rootEl: $el,
                __sharedLayout_groups: {},
                __sharedLayout_animationOptions: animationOptions,
                __sharedLayout_shouldAnimate: !isLowPowerDevice() && !(shouldRespectReducedMotion && isReducedMotion()),
            };
        },
    });
}
function handleElement($el, Alpine, { expression }) {
    const name = expression;
    if (typeof name !== 'string' || name === '') {
        throw new Error(`x-shared-layout:element expression must evaluate to a non-empty string, got ${JSON.stringify(name)}`);
    }
    const scope = Alpine.$data($el);
    if (!scope.__sharedLayout_isRoot) {
        warnMissingParentDirective('x-shared-layout:element', 'x-shared-layout', $el);
        return;
    }
    // Guaranteed present once the root marker is set.
    const rootEl = scope.__sharedLayout_rootEl;
    const groups = scope.__sharedLayout_groups;
    const animationOptions = scope.__sharedLayout_animationOptions;
    const shouldAnimate = scope.__sharedLayout_shouldAnimate;
    if (!groups[name]) {
        groups[name] = {
            layoutId: `${name}-${Math.random().toString(36).slice(2, 10)}`,
            activeEl: null,
        };
    }
    const group = groups[name];
    $el._x_doShow = () => {
        if (group.activeEl === $el)
            return;
        const previousEl = group.activeEl;
        group.activeEl = $el;
        const updateDom = () => {
            if (previousEl) {
                previousEl.removeAttribute('data-layout-id');
                previousEl.style.setProperty('display', 'none');
            }
            $el.setAttribute('data-layout-id', group.layoutId);
            $el.removeAttribute('hidden');
            $el.style.removeProperty('display');
        };
        if (!shouldAnimate) {
            updateDom();
            return;
        }
        void animateLayout(rootEl, updateDom, animationOptions);
    };
    $el._x_doHide = () => {
        // Defer the hide so that a peer's synchronous show in the same tick can
        // snapshot this element's current bounds before committing display:none.
        // If no peer claims the layout id, we commit the hide ourselves.
        queueMicrotask(() => {
            if (group.activeEl === $el) {
                group.activeEl = null;
                $el.removeAttribute('data-layout-id');
                $el.style.setProperty('display', 'none');
            }
        });
    };
}
function parseAnimationOptions(modifiers) {
    if (modifiers.includes('spring')) {
        const options = { type: 'spring' };
        const mass = getPositiveNumberModifierValue(modifiers, 'mass');
        const stiffness = getPositiveNumberModifierValue(modifiers, 'stiffness');
        const damping = getPositiveNumberModifierValue(modifiers, 'damping');
        if (mass !== null)
            options.mass = mass;
        if (stiffness !== null)
            options.stiffness = stiffness;
        if (damping !== null)
            options.damping = damping;
        return options;
    }
    const durationMs = getMillisecondsModifierValue(modifiers, 'duration');
    return {
        type: 'tween',
        duration: durationMs !== null ? durationMs / 1000 : DEFAULT_DURATION,
        ease: DEFAULT_EASE,
    };
}
