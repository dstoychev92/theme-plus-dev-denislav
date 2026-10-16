import { Alpine as AlpineType } from 'alpinejs';
declare module 'alpinejs' {
    interface Magics<T> {
        /** True when the element (or nearest x-press ancestor) is being pressed. */
        $isPressing: boolean;
    }
}
/**
 * Plugin for managing press state on elements. Listens to pointer down/up/cancel and keydown/keyup
 * (Enter/Space) when focused. Only the primary pointer is used (left mouse or primary touch); right-click
 * and secondary touches are ignored. Pointer up/cancel are listened for on window so release is detected
 * even outside the element. x-press:end and expression callbacks receive $success (true if released over
 * the element or a child, false on pointercancel or release outside). Non-focusable elements get tabIndex=0
 * so they can receive keyboard press. Use $isPressing in templates for reactive press state (boolean).
 *
 * @example
 * <button x-press:start="console.log('press started')">Press me</button>
 * @example
 * <button x-press:end="console.log('press ended')">Press me</button>
 * @example
 * <button x-press :class="{ 'scale-95': $isPressing }">Press me</button>
 * @example
 * <button x-press="$isPressing ? console.log('pressing') : console.log('released')">Press me</button>
 */
declare const _default: (Alpine: AlpineType) => void;
export default _default;
