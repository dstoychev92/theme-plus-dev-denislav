import { Alpine as AlpineType } from 'alpinejs';
/**
 * Coordinates sticky behaviour between sibling columns. The root measures all
 * registered items and only enables sticky positioning when the column group
 * needs it. When multiple columns overflow the viewport, shorter overflowing
 * columns can scroll independently via a CSS offset.
 *
 * The plugin writes state, not `position: sticky`. The root gets
 * `data-sticky-columns-root`; each column gets `data-enable-sticky`,
 * `data-enable-smart-offset`, and `data-fits-in-viewport` attributes plus a
 * `--sticky-columns-offset` custom property. The theme's `sticky-columns.css`
 * applies the sticky positioning, keyed off those attributes.
 *
 * Measurements run inside ResizeObserver (layout is already clean). Reads are
 * batched before any DOM writes so attribute/style updates cannot force a
 * synchronous reflow in the same pass.
 *
 * @usage
 *
 * Add `x-sticky-columns` to the shared layout root and `x-sticky-columns:column`
 * to each participating column.
 *
 * @example
 *
 * <div x-sticky-columns class="flex flex-row">
 *   <div x-sticky-columns:column>... Media ...</div>
 *   <div x-sticky-columns:column>... Details ...</div>
 * </div>
 */
export default function (Alpine: AlpineType): void;
