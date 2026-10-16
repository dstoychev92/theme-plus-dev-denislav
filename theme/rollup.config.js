const {getBaseRollupConfig} = require('@groupthought/tradecraft-build');
const {visualizer} = require('rollup-plugin-visualizer');

const externalPackages = [
  'photoswipe',
  'photoswipe/lightbox',
  'photoswipe-video-plugin',
  'alpinejs',
  'tabbable',
  'motion',
  'motion-plus',
  'motion-plus/animate-layout',
  '@floating-ui',
  '@floating-ui/dom',
  // Import-mapped to vendor.popover-polyfill.js in head-scripts.liquid
  'popover-polyfill',
  // Shopify-hosted, never installed: the import map in head-scripts.liquid
  // points this bare specifier at their CDN copy
  '@shopify/events',
];

const baseRollupConfig = getBaseRollupConfig({externalPackages});

// Add --vis to a pnpm zip command to view a size map of all JS depenedencies
if (process.argv.includes('--vis')) {
  baseRollupConfig.forEach((config, index) => {
    config.plugins.push(
      visualizer({
        template: 'treemap', // (treemap, sunburst, network, raw-data, list)
        open: true,
        gzipSize: true,
        filename: `stats/stats-${index}.html`,
      }),
    );
  });
}

module.exports = baseRollupConfig;
