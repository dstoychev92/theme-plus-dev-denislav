import { Alpine as AlpineType } from 'alpinejs';
export type TooltipOptions = {
    isOpen?: boolean;
    isInitiallyOpen?: boolean;
};
/**
 * Enables the creation of tooltip components.
 * The 'x-tooltip' directive builds on the 'x-popup' and 'x-float' directives.
 *
 * Directives:
 * - x-tooltip - The root element. Holds the popup state ($popup) for the child directives
 * - x-tooltip:trigger - The element the tooltip describes. Opens on hover with a 300ms delay, on focus
 *   within, and on click or tap. Closes on escape, on focus moving out, and on mousedown outside
 * - x-tooltip:panel - The element that floats next to the trigger with the tooltip content. Position modifiers
 *   pass through to x-popup; with no modifiers it uses absolute.bottom.offset.10px.flip.update.pad.5px
 * - x-tooltip:arrow - The arrow element. Place it inside the panel
 *
 * @example
 *
  <div x-tooltip class="relative">
    <div x-tooltip:trigger></div>

    <div x-tooltip:panel.fixed.bottom.offset.16px.flip.update.pad.5px x-cloak>
      <div x-tooltip:arrow></div>

      <span>lorem ipsum</span>
    </div>
  </div>
 */
export default function (Alpine: AlpineType): void;
