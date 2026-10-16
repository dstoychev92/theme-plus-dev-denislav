import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
import { MotionValue, AnimationPlaybackControls } from 'motion';
export type SliderRevealComponent = AlpineComponent<{
    __sliderReveal_isRoot: boolean;
    __sliderReveal_rootEl: HTMLElement | null;
    __sliderReveal_handle: HTMLElement | null;
    __sliderReveal_reveal: HTMLElement | null;
    __sliderReveal_progressValue: MotionValue<number>;
    __sliderReveal_progressSpringValue: MotionValue<number> | null;
    __sliderReveal_startProgress: number;
    __sliderReveal_startAnimationFn: AnimationPlaybackControls | null;
    __sliderReveal_enableScroll(): void;
    __sliderReveal_disableScroll(): void;
    __sliderReveal_animateToStartProgress(): Promise<void>;
    __sliderReveal_cancelFirstLayout: VoidFunction | null;
    __sliderReveal_scrollAnimationFn: VoidFunction | null;
    __sliderReveal_stopHandleStyleEffect: VoidFunction | null;
    __sliderReveal_stopRevealStyleEffect: VoidFunction | null;
    __sliderReveal_getEffectiveProgress(progress: number): number;
}>;
/**
 * Plugin to create an animated before/after slider reveal with optional scroll control.
 *
 * ## Directives
 *
 * - `x-slider-reveal` - Root element. Creates the reactive reveal state.
 * - `x-slider-reveal:handle` - Handle element translated by the reveal progress.
 * - `x-slider-reveal:reveal` - Reveal element clipped by the reveal progress.
 *
 * ## Root modifiers
 *
 * - `.vertical` - Uses vertical instead of horizontal movement.
 * - `.progress.<n>%` - Sets the resting reveal progress.
 * - `.from.<n>%` - Sets the animation's starting progress before it settles to `.progress`.
 * - `.mass.<n>` - Spring mass scale for the reveal spring. `.mass.50` equals `0.5`.
 * - `.stiffness.<n>` - Spring stiffness. Higher values settle faster.
 * - `.damping.<n>` - Spring damping. Higher values reduce overshoot.
 * - `.edge-buffer.<n>px` - Keeps the handle this many pixels away from the root edge. Defaults to `2px`.
 *
 * ## Magic
 *
 * - `$sliderReveal.progress` - The reveal progress, 0-100. Settable; values clamp to the handle's allowed range.
 * - `$sliderReveal.progressValue` - The underlying MotionValue.
 * - `$sliderReveal.enableScroll()` / `$sliderReveal.disableScroll()` - Start and stop driving the progress
 *   from page scroll. `enableScroll` first animates from `.from` to `.progress`, and does nothing when the
 *   user prefers reduced motion or the device reports low power.
 *
 * @example
 *
 * ```html
 * <div x-slider-reveal.progress.65%.from.10%.stiffness.240.damping.35.mass.50.edge-buffer.4px>
 *   <div x-slider-reveal:reveal>After</div>
 *   <div x-slider-reveal:handle></div>
 * </div>
 * ```
 */
export default function (Alpine: AlpineType): void;
/**
 * Creates a reactive motion value that updates Alpine state when the motion value changes.
 * Used by slider-reveal for before-after progress.
 */
export declare function reactiveMotionValue<T>(_Alpine: AlpineType, initialMotionValue: T): MotionValue<T>;
