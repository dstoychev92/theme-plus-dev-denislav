import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * Magic for the enclosing `x-read-more` directive.
         *
         * @property isExpanded - Whether the truncated content has been expanded
         * @method expand - Expand the content (no-op if already expanded)
         */
        $readMore: ReadMoreMagic;
    }
}
export type ReadMoreMagic = {
    readonly isExpanded: boolean;
    expand(): void;
};
type ExpandOptions = {
    /** When false, skip the height FLIP animation (print, find-in-page, hash). Default true. */
    animate?: boolean;
};
export type ReadMoreComponent = AlpineComponent<{
    __read_more_isRoot: boolean;
    __read_more_isExpanded: boolean;
    __read_more_collapsedHeight: number | null;
    __read_more_transition: string;
    __read_more_cancelFirstLayout: VoidFunction | null;
    __read_more_rafIds: number[];
    __read_more_skipAnimation: boolean;
    __read_more_wasExpandedBeforePrint: boolean;
    __read_more_contentEl: HTMLElement | null;
    __read_more_expand(options?: ExpandOptions): void;
    __read_more_collapse(): void;
    __read_more_animateExpand(): void;
    __read_more_syncContentHidden(): void;
    __read_more_expandIfHashTarget(): void;
    __read_more_onBeforePrint(): void;
    __read_more_onAfterPrint(): void;
    __read_more_onHashChange(): void;
}>;
/**
 * Truncated "read more" content with a smooth height expand animation.
 *
 * Owns expanded state, animates height when expanding (FLIP), and expands when:
 * - the read-more button is clicked
 * - focus enters the truncated content (e.g. tabbing to a link inside)
 * - the page is printed (`beforeprint`)
 * - the URL hash / `:target` points at something inside the root
 * - find-in-page or fragment navigation hits `x-read-more:content` (`beforematch`)
 *
 * ## Directives
 *
 * - `x-read-more` — Root. Holds expanded state and runs the height animation.
 * - `x-read-more:button` — Click expands the content.
 * - `x-read-more:preview` — Optional. Line-clamped preview shown while collapsed.
 *   Strips `id` attributes so a paired `x-read-more:content` can keep the real ids.
 * - `x-read-more:content` — Optional. Full content marked `hidden="until-found"` while
 *   collapsed so find-in-page / text fragments can reveal it via `beforematch`.
 *
 * ## Find-in-page hybrid
 *
 * Line-clamp alone cannot receive `beforematch`. Pair a clamped preview with a full
 * copy on `x-read-more:content`:
 *
 * ```html
 * <div x-read-more class="overflow-clip">
 *   <div x-read-more:preview class="line-clamp-3">…</div>
 *   <!-- hidden must be in the HTML (not only set by JS) to avoid a flash of full text -->
 *   <div x-read-more:content hidden="until-found">…</div>
 *   <button type="button" x-read-more:button x-show="!$readMore.isExpanded">Read more</button>
 * </div>
 * ```
 *
 * ## $readMore Magic
 *
 * - `$readMore.isExpanded` — Whether the content is expanded
 * - `$readMore.expand()` — Expand programmatically
 *
 * @example Basic usage (no find-in-page)
 *
 * ```html
 * <div x-read-more class="overflow-clip">
 *   <div
 *     class="line-clamp-[--truncate-lines]"
 *     :style="{ '--truncate-lines': $readMore.isExpanded ? 'none' : 3 }"
 *   >
 *     Long content…
 *   </div>
 *   <button type="button" x-read-more:button x-show="!$readMore.isExpanded">
 *     Read more
 *   </button>
 * </div>
 * ```
 */
export default function (Alpine: AlpineType): void;
export {};
