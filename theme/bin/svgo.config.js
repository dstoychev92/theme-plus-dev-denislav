/*
SVG config for use with package json -- used for compressing many icons at once.
Use same defaults as /bin/config.js for consistency.

To install:
npm install -g svgo

run recursively through icons folder:
svgo -r -f icons/input/ -o icons/output --config bin/svgo.config.js

run with single file:
svgo .idea/icons/name.svg --config bin/svgo.config.js

TODO: Create an SVGO plugin to move needed attributes that are icon-specific out of the svg tag and into an inner g tag.

Note: you will need to install with npm install -g svgo --
** This file and global NPM is using V3 and our gulp system is locked to < 2.3.0 **

Social:
attrs: '(class|id|data-name|style|stroke|color)', },
classNames: ['icon-social'],

Manual rename colors to fill="currentColor"
*/

const movePropertiesToGroup = require('./svgo-move-properties-to-group-plugin.js');
const preserveClass = require('./svgo-preserve-class-plugin.js');

module.exports = {
  plugins: [
    movePropertiesToGroup,
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: '(class|id|data-name|style|fill|color|stroke-width)',
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: '^stroke$', // Only exact "stroke" attribute, not stroke-linecap or stroke-linejoin
      },
    },
    preserveClass,
  ],
};
