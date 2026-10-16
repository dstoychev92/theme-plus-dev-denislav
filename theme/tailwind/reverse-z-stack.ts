import plugin from 'tailwindcss/plugin';

/**
 * Plugin to generate a utility class to reverse the z-index stack order for the children of an element
 */
export default plugin(function ({addUtilities}) {
  const zIndexChildrenCount = 20;

  addUtilities({
    '.reverse-z-stack': [...Array(zIndexChildrenCount).keys()].reduce(
      (m, i) => ({
        ...m,
        [`> *:nth-child(${i + 1})`]: {
          zIndex: zIndexChildrenCount - i,
        },
      }),
      {},
    ),
    '.-reverse-z-stack': [...Array(zIndexChildrenCount).keys()].reduce(
      (m, i) => ({
        ...m,
        [`> *:nth-child(${i + 1})`]: {
          zIndex: -(zIndexChildrenCount + i),
        },
      }),
      {},
    ),
  });
});
