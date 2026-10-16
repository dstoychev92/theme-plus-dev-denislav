import { warnMissingParentDirective } from '../utils/error';
const DEFAULT_OFFSET = 10;
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
export default function (Alpine) {
    Alpine.directive('tooltip', ($el, data, utilities) => {
        if (data.value == 'trigger') {
            handleTrigger($el, Alpine);
        }
        else if (data.value == 'panel') {
            handlePanel($el, Alpine, data, utilities);
        }
        else if (data.value == 'arrow') {
            handleArrow($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-tooltip:${data.value}`);
        }
    }).before('bind');
}
function handleTrigger($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__tooltip_isRoot) {
                warnMissingParentDirective('x-tooltip:trigger', 'x-tooltip', this.$el);
            }
        },
        'x-hover:start.delay.300ms': '$popup.isOpen = true',
        'x-hover:end.delay.300ms': '$popup.isOpen = false',
        // focusin-state, since the trigger often wraps the focusable control and focus does not bubble
        'x-focusin-state': '$popup.isOpen = $hasFocusIn',
        // Click covers touch and keyboard activation, since x-hover ignores touch pointers
        '@click': '$popup.isOpen = true',
        '@keydown.escape.stop.prevent': `$popup.close()`,
        'x-popup:target': '',
        '@mousedown.outside': '$popup.close()',
        '@focusin.window': '!$el.contains($event.target) && $popup.close()',
        ':aria-describedby'() {
            var _a;
            return (_a = this.__tooltip_tooltipEl) === null || _a === void 0 ? void 0 : _a.id;
        },
    });
}
function handlePanel($el, Alpine, { modifiers, expression }, {}) {
    Alpine.bind($el, Object.assign(Object.assign({}, (modifiers.length
        ? {
            [`x-popup:popup.${modifiers.join('.')}`]: expression || '',
        }
        : {
            [`x-popup:popup.absolute.bottom.offset.${DEFAULT_OFFSET}px.flip.update.pad.5px`]: expression || '',
        })), { role: 'tooltip', 'x-init'() {
            if (!this.__tooltip_isRoot) {
                warnMissingParentDirective('x-tooltip:panel', 'x-tooltip', this.$el);
                return;
            }
            this.__tooltip_tooltipEl = $el;
        } }));
}
function handleArrow($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__tooltip_isRoot) {
                warnMissingParentDirective('x-tooltip:arrow', 'x-tooltip', this.$el);
            }
        },
        'x-float:arrow': '',
    });
}
function handleRoot($el, Alpine, { modifiers, expression }) {
    Alpine.bind($el, {
        [`x-popup.${modifiers.join('.')}`]: expression || '',
        ['x-id']: "['tooltip', 'tooltip-trigger']",
        'x-data'() {
            return {
                __tooltip_isRoot: true,
                __tooltip_triggerEl: null,
                __tooltip_tooltipEl: null,
            };
        },
    });
}
