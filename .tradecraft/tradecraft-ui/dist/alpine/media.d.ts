import { Alpine as AlpineType } from 'alpinejs';
export type Queries = Record<string, string>;
export type Media = {
    queries: Record<string, string>;
    matches: Record<string, boolean>;
};
declare module 'alpinejs' {
    interface Stores {
        media: Media;
    }
}
declare module 'alpinejs' {
    interface Magics<T> {
        $media: Media;
    }
}
/**
 * Plugin which provides various directives and magics for working with responsive design.
 *
 * ## `x-screen:*` directives
 *
 * Runs an expression when a named media query matches. Without a name, the expression
 * runs on every change with the full `$matches` record in scope.
 *
 * @example
 *
 * Setup the plugin by passing your screen sizes to the plugin fn. You can pass both pixel values and CSS variables
 *
 * ```js
 * import {screen} from '@groupthought/tradecraft-ui/alpine';
 *
 * Alpine.plugin(screen({
 *   sm: '(max-width: 1023px)',
 *   md: '(min-width: 1024px) and (max-width: 1156px)',
 *   // ...
 * }))
 * ```
 *
 * Use the directive to conditionally run code based on the current screen size
 *
 * ```html
 * <div
 *  x-screen:sm="console.log('screen sizes matches small')"
 *  x-screen:md="console.log('screen size matches medium')"
 * >
 * </div>
 * ```
 */
declare const _default: (queries: Queries) => (Alpine: AlpineType) => void;
export default _default;
