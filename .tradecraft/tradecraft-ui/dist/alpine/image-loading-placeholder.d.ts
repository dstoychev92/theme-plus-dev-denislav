import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type ImageLoadingPlaceholderComponent = AlpineComponent<{
    __imgLoadingPlaceholder_showPlaceholder: boolean;
    __imgLoadingPlaceholder_targetImage: HTMLImageElement | null;
}>;
/**
 * Plugin to show a loading placeholder for an image until it has loaded
 *
 * To use:
 * 1. Create a smaller sized version of your image and place it next to (before or after) the original
 * 2. Style it to be the same size as the original and absolutely positioned above or below the original
 * 3. Add the x-img-loading-placeholder directive on the placeholder image
 *
 * <div class="relative">
 *   <img src="/test?width=1000&height=100.png" class="relative z-10" width="1000" height="1000">
 *   <img src="/test.png?width=4&height=4.png" x-img-loading-placeholder class="absolute inset-0 z-0" role="presentation">
 * </div>
 *
 * Or you can pass a reference directly to the directive
 *
 * <div class="relative">
 *   <img x-ref="original" src="/test?width=1000&height=100.png" class="relative z-10" width="1000" height="1000">
 *   <div>
 *    <img src="/test.png?width=4&height=4.png" x-img-loading-placeholder="$refs.original" class="absolute inset-0 z-0" role="presentation">
 *   </div>
 * </div>
 *
 * With no expression, the target is the next or previous element sibling when that sibling
 * is an <img>. Without a target the placeholder hides itself. The directive shows the
 * placeholder until the target's load event fires (or immediately hides it when the target
 * already loaded), and sets aria-hidden="true" and role="presentation" for you.
 */
declare const _default: (Alpine: AlpineType) => void;
export default _default;
