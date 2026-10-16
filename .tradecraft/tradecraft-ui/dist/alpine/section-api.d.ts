import { Alpine as AlpineType, AlpineMorphConfig } from 'alpinejs';
import { SectionApiController, type SectionApiState, type SectionApiLoadOptions, type SectionApiUpdateOptions } from '../section-api/controller';
declare global {
    interface Window {
        debugSectionApi?: boolean;
        _x_router_initialized?: boolean;
    }
}
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * State and actions of the enclosing x-section-api root, including the plain
         * TypeScript `controller` for direct request/cache control. Every shopify-section
         * element is bound automatically, so `$sectionApi.update()` works inside any section.
         */
        $sectionApi: ThemeSectionMagic;
    }
}
export type ThemeSectionState = SectionApiState;
/**
 * Represents the context of a theme section.
 */
export type ThemeSectionContext = {
    /**
     * The root element of the theme section.
     */
    rootEl: HTMLElement;
    /**
     * The state of the theme section.
     */
    state: ThemeSectionState;
    /**
     * True when a section update remains busy past the configured delayed-loading threshold.
     */
    isDelayedLoading: boolean;
    /**
     * The error message associated with the theme section.
     */
    error: string | null;
    /**
     * The ID of the section.
     */
    sectionId: string;
    /**
     * The URL of the currently request (if any)
     */
    pendingUrl: string | null;
    /**
     * Build URL for the theme section.
     */
    buildUrl(options?: {
        baseUrl?: string;
        sectionId?: string;
    }): string;
    /**
     * The abort controller for the theme section.
     */
    abortController: AbortController | null;
    /**
     * Framework-independent controller for direct request, cache, and state control.
     */
    controller: SectionApiController<ThemeSectionSetHtmlOptions>;
    /**
     * Loads HTML and then updates the theme section
     * @param options - The options to update the theme section.
     * @returns A promise that resolves when the update is complete.
     */
    update(options?: ThemeSectionUpdateOptions): Promise<string | undefined>;
    /**
     * The morph configuration for the theme section.
     */
    morphConfig: AlpineMorphConfig;
    /**
     * Loads the theme section from the network and populates the cache.
     * Does not update the DOM or return any value.
     * By default, only fetches if there's no cache entry. Use `force: true` to always fetch.
     * @param options - The options to load the theme section.
     * @returns A promise that resolves when the load is complete.
     */
    load(options?: ThemeSectionLoadOptions): Promise<void>;
    /**
     * Loads HTML, updates the theme section,and then updates the page history with pushState or replaceState
     * @param url - The URL to navigate to
     * @param historyMode - How to update the browser history: 'push', 'replace', or 'none'
     * @returns A promise that resolves with the updated HTML content (or undefined)
     */
    navigate(url: string, historyMode?: 'replace' | 'push' | 'none'): Promise<string | undefined>;
    /**
     * Updates the HTML content of the theme section.
     * @param html - The new HTML content.
     * @param options - The options for updating the HTML content.
     */
    setHtml(html: string, options?: ThemeSectionSetHtmlOptions): Promise<void>;
    /**
     * Cleans up when the section component is destroyed (e.g. aborts pending fetches).
     */
    destroy(): void;
};
export type ThemeSectionMagic = Pick<ThemeSectionContext, 'state' | 'isDelayedLoading' | 'error' | 'sectionId' | 'pendingUrl' | 'abortController' | 'controller' | 'update' | 'load' | 'navigate' | 'morphConfig' | 'setHtml'>;
export type ThemeSectionApiCacheMagic = {
    set(sectionId: string, html: string, options?: {
        baseUrl?: string;
    }): void;
    get(sectionId: string, options?: {
        baseUrl?: string;
    }): string | null;
};
export type ThemeSectionLoadOptions = SectionApiLoadOptions;
/**
 * Options for updating a theme section.
 */
export type ThemeSectionUpdateOptions = Omit<SectionApiUpdateOptions, 'renderOptions'> & {
    /**
     * Whether to update the HTML content of the theme section using Alpine.morph or just straight replacing the innerHTML
     */
    htmlMode?: 'morph' | 'replace';
    /**
     * The morph configuration for _this_ morph
     */
    morphConfig?: AlpineMorphConfig;
    /** Only update these named render regions. All owned regions update when omitted. */
    regions?: string[];
    /**
     * When section has [data-morph-root] elements, only morph roots whose value is in this list.
     * Use when a partial update (e.g. one block's content) should not overwrite other blocks.
     * @deprecated Use regions instead.
     */
    onlyRoots?: string[];
};
/**
 * Options for setHtml when updating section DOM.
 */
export type ThemeSectionSetHtmlOptions = {
    mode?: 'morph' | 'replace';
    morphConfig?: AlpineMorphConfig;
    regions?: string[];
    /** @deprecated Use regions instead. */
    onlyRoots?: string[];
};
/**
 * Allow populating a DOM element with the contents of HTML returned from the Section Rendering API.
 * Content that is fetched from the section rendering API is "morphed" into the existing
 * DOM using [Alpine.morph](https://alpinejs.dev/plugins/morph#alpine-morph).
 *
 * Note: requires '@alpinejs/morph' plugin
 *
 * ## Basic usage
 *
 * ```
 * <div x-section-api="my-section" x-effect="isVisible && $sectionApi.update()"></div>
 * ```
 *
 * which will load from '/?section_id=my-section' and update the element with the contents of the response
 *
 * or when a section requires a specific URL
 *
 * ```
 * <div x-section-api="my-section" x-init="$sectionApi.update({ baseUrl: '/products/123' })"></div>
 * ```
 *
 * which will load from '/products/123?section_id=my-section' once $sectionApi.update() is called
 *
 * Note: all Shopify sections on the page (elements with class 'shopify-section') will automatically be bound to x-section-api
 *
 * This means that inside of any section you can just call `$sectionApi.update()` to reload that section.
 *
 * ## Delayed loading
 *
 * `$sectionApi.isDelayedLoading` becomes true only when an update without cached content is still loading after 750ms.
 * Background refreshes of cached content never enable it.
 * Configure the threshold when registering the plugin with
 * `sectionApi({ delayedLoadingThreshold: 750 })`.
 *
 * ## Preloading content
 *
 * To make for a snappier UI, you can preload section rendering API content using `$sectionApi.load()`and cache it so that when
 * you actually need the content it will render instantly.
 *
 * Example
 *
 * ```
 * <div x-section-api="my-section" x-init="window.requestIdleCallback(() => $sectionApi.load())">
 *   <button @click='$sectionApi.update()'>Render</button>
 * </div>
 * ```
 *
 * ## Controlling DOM updates
 *
 * Sometimes morphing doesn't behave the way you want. There are several ways to control exactly which elements are added/removed/updated during a morph.
 *
 * - Use `data-morph-update="all|attributes|children|none|regions"` to choose whether a morph updates both parts of an element, only its attributes, only its children, neither, or only nested render regions through separate updates.
 * - To have the server HTML drive the form control state (`.value`, `.checked`, `.indeterminate`) of inputs and textareas after a morph, add `data-morph-form-state="server"`. By default Alpine.morph only updates attributes; this opts into syncing the live properties so the server is the source of truth.
 * - The deprecated `data-morph-skip`, `data-morph-children-only`, `data-morph-skip-children`, and `data-morph-sync` attributes remain supported as aliases.
 *
 * If you need more control than these data attrs give you, you can also pass a `morphConfig` object to the `sectionApi` plugin when you import it.
 * This gives you node-by-node fine grain control over what is added/removed/updated during a morph as well as being able notified when an element is added/removed/updated.
 *
 * Note: by default any elements with `data-shopify` are skipped for updating and removing, if you customize
 * morph options you will wipe out this behavior and have to add it yourself if that is what your theme requires.
 *
 * ```
 * import Alpine from 'alpinejs'
 * import {sectionApi} from '@groupthought/tradecraft-ui`
 *
 * Alpine.plugin(sectionApi({
 *   updating(el, toEl, childrenOnly, skip) {
 *     // Call `skip()` to prevent an element from being removed
 *     // Call `childrenOnly()` to prevent an element from being updated but allow it's children to be updated
 *   },
 *   updated(el) {
 *     // Do something after an element was updated
 *   },
 *   removing(el, skip) {
 *     // Call `skip()` to prevent an element from being removed
 *   },
 *   removed(el) {
 *     // Do something after an element was removed
 *   },
 *   adding(el, skip) {
 *     // Call `skip()` to prevent a new element from being added
 *   },
 *   added(el) {
 *     // Do something after a new element was added
 *   }
 * }))
 *
 * Or if you only want to change the morph options for a single section:
 *
 * ```
 * <div x-init="
 *   $sectionApi.morphConfig = {
 *     // (same functions as above)
 *   }
 * ">
 * </div>
 * ```
 *
 * Or if you only want to change the morph options for a single morph
 *
 * ```
 * <button @click='$sectionApi.update({
 *   morphConfig: {
 *     // (same functions as above)
 *   }
 * })'>Update</button>
 * ```
 *
 * ## Render regions
 *
 * Named render regions divide one Section API response into independently updated regions.
 * Regions morph by default; add `data-render-mode="replace"` when the server should replace
 * and reinitialize a region's contents instead.
 *
 * ```
 * <section x-section-api="collection">
 *   <aside data-render-region="sidebar">...</aside>
 *   <div data-render-region="cards" data-render-mode="replace">...</div>
 * </section>
 * ```
 *
 * The presence of any owned render region changes the boundary for the whole update: only
 * render regions update. Content outside them is never morphed or replaced. With no `regions`
 * option, every owned leaf region that also appears in the response updates; a conditional
 * region missing from the response does not block its siblings. Passing `regions` narrows
 * that set further and makes the requested set atomic. The plugin only falls back to
 * rendering the whole section when the controller has no regions.
 * This is useful when a section contains client-owned DOM. For example, a product form can
 * put its server-rendered fields in a region while leaving inputs or widgets injected by apps
 * outside it; Section API updates then cannot remove or rewrite that app-owned HTML.
 *
 * The live and response regions pair by name. All selected regions are validated before
 * rendering, and regions belonging to nested x-section-api controllers are ignored. When
 * regions nest within one controller, only the deepest regions update.
 *
 * To update only a subset, pass their names through `regions`:
 *
 * ```
 * $sectionApi.update({ url: '...', regions: ['sidebar'] })
 * ```
 *
 * `data-morph-root` and `onlyRoots` remain supported as deprecated aliases.
 *
 * ## Events
 *
 * All dispatched on `window` with `{sectionId, url}` as the event detail:
 *
 * - `theme:section:load` - A fetch for the section's HTML started.
 * - `theme:section:loaded` - The fetch finished and the HTML was written to the cache.
 * - `theme:section:update` - The section's DOM was updated with new HTML. The detail also
 *   carries that HTML as `html`, so a listener can read an element that the update skipped.
 * - `theme:section:navigate` - `navigate()` finished updating history and content.
 */
export interface ThemeSectionPlugin {
    (alpine: AlpineType): void;
}
declare const _default: (options?: {
    morphConfig?: AlpineMorphConfig;
    delayedLoadingThreshold?: number;
}) => (Alpine: AlpineType) => void;
export default _default;
export declare function bindAllThemeSections(Alpine: AlpineType, cb: (el: HTMLElement) => void): void;
