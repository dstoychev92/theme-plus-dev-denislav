import { Alpine as AlpineType } from 'alpinejs';
declare module 'alpinejs' {
    interface Magics<T> {
        $prefetch: () => void;
    }
}
/**
 * Improve page load times by prefetching links using [rel="prefetch"](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/prefetch)
 *
 * ## `x-prefetch` directive
 *
 * @example Using the x-prefetch directive will be default wait until the element is in view before prefetching the link. When the link is clicked the browser will already have the page loaded and the navigation will be instant.
 *
 * <a href="/about" x-prefetch>Go to about</a>
 *
 * @example You can also use the `eager` modifier to prefetch the link immediately before the element is in view
 *
 * <a href="/about" x-prefetch.eager>Go to about</a>
 *
 * @example You can also use the `intent` modifier to prefetch the link when the user mouses over or focuses on the element
 *
 * <a href="/about" x-prefetch.intent>Go to about</a>
 *
 * ## `$prefetch` magic method
 *
 * @example You can also use the `$prefetch` magic method to prefetch a link manually
 *
 * <button @click="$prefetch('/about')">Prefetch about page</button>
 *
 * @example You can also pass an options object to the `$prefetch` method
 *
 * <button @click="$prefetch('/about.json', {priority: 'high', as: 'json'})">Prefetch about page</button>
 */
export default function (Alpine: AlpineType): void;
