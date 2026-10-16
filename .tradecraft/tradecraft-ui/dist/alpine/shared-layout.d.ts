/// <reference path="../../src/motion-plus.d.ts" />
import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
import { AnimateLayoutOptions } from 'motion-plus/animate-layout';
type SharedLayoutGroup = {
    layoutId: string;
    activeEl: HTMLElement | null;
};
export type SharedLayoutComponent = AlpineComponent<{
    __sharedLayout_isRoot: boolean;
    __sharedLayout_rootEl: HTMLElement;
    __sharedLayout_groups: Record<string, SharedLayoutGroup>;
    __sharedLayout_animationOptions: AnimateLayoutOptions;
    __sharedLayout_shouldAnimate: boolean;
}>;
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
export default function sharedLayout(Alpine: AlpineType): void;
export {};
