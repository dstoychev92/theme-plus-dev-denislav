import type { Alpine as AlpineType, AlpineMorphConfig } from 'alpinejs';
export declare const MORPH_ROOT_ATTR = "data-morph-root";
export declare const RENDER_REGION_ATTR = "data-render-region";
export declare const RENDER_REGION_MODE_ATTR = "data-render-mode";
export declare const RENDER_REGION_SELECTOR = "[data-render-region], [data-morph-root]";
export type RenderRegionMode = 'morph' | 'replace';
export type RenderRegionPair = {
    name: string;
    mode: RenderRegionMode;
    current: HTMLElement;
    replacement: HTMLElement;
};
export type RenderRegionSelection = {
    strategy: 'render-section';
} | {
    strategy: 'render-regions';
    regions: RenderRegionPair[];
} | {
    strategy: 'skip';
    reason: 'missing-response-root' | 'no-matching-regions' | 'missing-response-regions';
    regionNames?: string[];
};
export type SelectRenderRegionsOptions = {
    regions?: string[];
    defaultMode?: RenderRegionMode;
};
export declare function sanitizeSectionHtml(html: string): string;
export declare function parseSectionRoot(html: string): HTMLElement | null;
/** Section API responses usually contain the existing section wrapper. */
export declare function getReplacementContent(sanitizedHtml: string, responseRoot: HTMLElement | null): string;
/**
 * Return the deepest regions owned by this Section API controller. A
 * `data-morph-update="regions"` boundary explicitly keeps a morph-mode ancestor
 * eligible while its nested region updates in a separate pass. Regions in a
 * nested controller belong to that controller and must not affect its parent.
 */
export declare function findOwnedLeafRenderRegions(root: HTMLElement, defaultMode?: RenderRegionMode): HTMLElement[];
/**
 * Pair corresponding live and response regions before any DOM is changed.
 * `data-morph-root` participates as a compatibility alias for
 * `data-render-region`; new markup can additionally choose morph or replace per
 * region through `data-render-mode`. Explicit region requests are atomic, while
 * an implicit all-region update can continue when conditional regions disappear.
 */
export declare function selectRenderRegions(currentRoot: HTMLElement, responseRoot: HTMLElement | null, { regions: requestedRegions, defaultMode }?: SelectRenderRegionsOptions): RenderRegionSelection;
/** Replace a section's contents and restore the Alpine and focus lifecycle around the DOM swap. */
export declare function replaceSectionHtml(Alpine: AlpineType, root: HTMLElement, html: string): void;
/**
 * Replace a render region, including its root element. Unlike a whole-section
 * replacement, a region has no controller state that must survive on its root.
 * Destroying the outgoing Alpine tree before initializing the incoming one
 * prevents stale refs, effects, and plugin state from leaking across the swap.
 */
export declare function replaceRegionHtml(Alpine: AlpineType, root: HTMLElement, replacement: HTMLElement): void;
/** Morph one already-paired render region without re-running section target selection. */
export declare function morphRegionHtml(root: HTMLElement, replacement: HTMLElement, morphConfig: AlpineMorphConfig, shouldUpdate?: () => boolean): Promise<boolean>;
/** Morph a complete section after region selection has chosen the fallback. */
export declare function morphSectionHtml(root: HTMLElement, html: string, morphConfig: AlpineMorphConfig, shouldUpdate?: () => boolean): Promise<boolean>;
