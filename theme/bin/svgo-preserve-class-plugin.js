/**
 * Converts `data-preserve` attributes to `class` attributes to preserve classes used by header icons
 * during SVGO optimization (which normally removes class attributes).
 *
 * Example: <path data-preserve="hover-effect"/> → <path class="hover-effect"/>
 */
module.exports = {
  name: 'preserveClass',
  description: 'Moves data-preserve to class and removes data-preserve',
  fn: () => {
    return {
      element: {
        enter: (node, parentNode) => {
          if (node.attributes && node.attributes['data-preserve']) {
            const preserveClassValue = node.attributes['data-preserve'];

            if (node.attributes.class) {
              node.attributes.class += ` ${preserveClassValue}`;
            } else {
              node.attributes.class = preserveClassValue;
            }

            delete node.attributes['data-preserve'];
          }
        },
      },
    };
  },
};
