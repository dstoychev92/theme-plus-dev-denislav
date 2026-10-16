/**
 * Tailwind Plugin for Advanced Staggered Animations and Transitions
 *
 * This plugin extends Tailwind CSS to provide utilities for creating staggered animations and transitions.
 * It supports both automatic and manual staggering of elements based on their order.
 *
 * ## Features:
 * - Automatic stagger for the first N child elements (configurable via `staggerChildrenCount`).
 * - Manual staggering by specifying the order.
 * - Customizable delay durations via theming.
 *
 * ## How to Use:
 *
 * ### Automatic Staggering (requires tailwind-children plugin)
 * - Use `.*:auto-stagger-animations` or `.*:auto-stagger-transitions` to automatically stagger child elements.
 *
 * ### Manual Staggering:
 * - Use `.stagger-animation` or `.stagger-transition` and set the `--stagger-order` or `--stagger-order` variable.
 *
 * ### Customizing Durations:
 * - Utilize Tailwind's `animationDuration` and `transitionDuration` in your theme configuration.
 *
 * ## Examples:
 *
 * ```html
 * <!-- Automatic Staggering -->
 * <div class="*:auto-stagger-animations *:animate-fade-in">
 *   <div>1</div>
 *   <div>2</div>
 *   <!-- ... -->
 * </div>
 * ```
 *
 * ```html
 * <!-- Manual Staggering -->
 * <div style="--stagger-order: 2;" class="stagger-animation">1</div>
 * <div style="--stagger-order: 1;" class="stagger-animation">2</div>
 * ```
 *
 * ## Customization:
 *
 * - `staggerChildrenCount`: Controls the maximum number of elements to stagger automatically. Change based on your performance needs.
 * - Theme's `animationDuration` and `transitionDuration`: Used for setting animation and transition durations.
 *
 */
declare const _default: {
    handler: import("tailwindcss/types/config").PluginCreator;
    config?: Partial<import("tailwindcss/types/config").Config> | undefined;
};
export default _default;
