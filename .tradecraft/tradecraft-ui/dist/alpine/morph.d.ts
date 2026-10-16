import { AlpineMorphConfig } from 'alpinejs';
/**
 * Morph rootEl with html, merging default data-morph policies
 * with morphOptions. When rootEl is the element being updated, only its children are morphed.
 * A `data-morph-update="none"` or `data-morph-update="regions"` policy on rootEl itself does not
 * apply, because these policies guard the subtree from an ancestor's morph, not from a morph the
 * caller aims at rootEl.
 *
 * A descendant carrying `data-morph-view-transition` scopes a view transition to that element,
 * rather than capturing the document. Its first incoming image is decoded before the update and
 * the connected replacement finishes decoding before the browser captures the new scoped frame.
 * Browsers without element-scoped transitions keep the old image painted until that point and
 * swap without animation; this never falls back to a document transition.
 *
 * A descendant carrying `data-morph-keep-id` keeps its live id through the morph. Use it when
 * the server response renders with less context than the page render and its id can collide
 * across instances that show the same resource.
 *
 * @param rootEl - The root element to morph
 * @param html - The new HTML string to morph into
 * @param morphOptions - Optional AlpineMorphConfig to merge with default behavior
 * @param shouldUpdate - Checked immediately before changing the DOM
 * @returns Whether this morph still owned and updated the DOM
 */
export declare function morph(rootEl: HTMLElement, html: string, morphOptions?: AlpineMorphConfig, shouldUpdate?: () => boolean): Promise<boolean>;
