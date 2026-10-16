import { Alpine as AlpineType } from 'alpinejs';
declare module 'alpinejs' {
    interface Magics<T> {
        /** True when the pointer is over the element (or nearest x-hover ancestor). */
        $isHovering: boolean;
    }
}
/**
 * Plugin for managing hover states on elements. Automatically adds/removes event listeners, ignores touch events,
 * and optionally adds a delay before evaluating the expression for cases like tooltips.
 * Use $isHovering in templates for reactive hover state (boolean).
 *
 * @example
 * <div x-hover:start="console.log('hover started')"></div>
 * <div x-hover:end="console.log('hover ended')"></div>
 * <div x-hover:start.delay.300ms="console.log('hover started with delay')"></div>
 * @example
 * <div x-hover :class="{ 'bg-primary': $isHovering }">Hover me</div>
 * @example
 * <div x-hover="$isHovering ? console.log('hover') : console.log('unhover')">Hover me</div>
 */
declare const _default: (Alpine: AlpineType) => void;
export default _default;
