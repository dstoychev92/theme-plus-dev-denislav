/**
 * Moves style attributes from the root <svg> element to an inner <g> element.
 * This allows our liquid code to create the SVG attributes wrapping the G tag
 *
 * Example: <svg stroke="#000"><path/></svg> → <svg><g stroke="#000"><path/></g></svg>
 * Enables: <svg class="stroke-blue-500"><g>...</g></svg>
 */

module.exports = {
  name: 'movePropertiesToGroup',
  type: 'perItem',
  description: 'Move stroke-linecap and stroke-linejoin from svg to g element',
  fn: (array) => {
    const items = array.children;
    // TODO: Do we really want to cover all these style attributes or just a few of them?
    const styleAttributes = [
      'stroke',
      // 'stroke-width',
      'stroke-linecap',
      'stroke-linejoin',
      'stroke-miterlimit',
      'stroke-dasharray',
      'stroke-dashoffset',
      'stroke-opacity',
      'fill',
      'fill-rule',
      'fill-opacity',
      'color',
      'opacity',
      'stop-color',
      'stop-opacity',
      'font',
      'font-family',
      'font-size',
      'font-size-adjust',
      'font-stretch',
      'font-style',
      'font-variant',
      'font-weight',
      'text-anchor',
      'text-decoration',
      'letter-spacing',
      'word-spacing',
      'writing-mode',
      'glyph-orientation-horizontal',
      'glyph-orientation-vertical',
      'kerning',
      'alignment-baseline',
      'baseline-shift',
      'direction',
      'dominant-baseline',
      'unicode-bidi',
      'image-rendering',
      'shape-rendering',
      'text-rendering',
      'vector-effect',
      'clip',
      'clip-path',
      'clip-rule',
      'mask',
      'filter',
      'flood-color',
      'flood-opacity',
      'lighting-color',
      'display',
      'visibility',
      'cursor',
      'pointer-events',
    ];

    // Remove the 'stroke-width' attribute - we are using TW class to handle it
    const removeStrokeAttribute = (item) => (item.attributes['stroke-width'] = '');

    items.forEach((item) => {
      let hasStyleAttributes = false;

      if (item.type === 'element' && item.name === 'svg') {
        // Check SVG for style attributes
        let attributesToMove = {};

        removeStrokeAttribute(item);

        styleAttributes.forEach((attr) => {
          if (item.attributes[attr]) {
            hasStyleAttributes = true;
            // store the <svg> attribute in a variable
            attributesToMove[attr] = item.attributes[attr];
            // remove <svg> attribute
            delete item.attributes[attr];
          }
        });

        let group = item.children?.find((child) => child.name === 'g' && child.type === 'element');

        if (group) {
          removeStrokeAttribute(group);
          group.children.forEach((child) => removeStrokeAttribute(child));
        }

        if (hasStyleAttributes) {
          if (!group) {
            group = {
              type: 'element',
              name: 'g',
              attributes: {},
              children: item.children,
            };
          }

          Object.assign(group.attributes, attributesToMove);
          item.children = [group];
        }
      }
    });
  },
};
