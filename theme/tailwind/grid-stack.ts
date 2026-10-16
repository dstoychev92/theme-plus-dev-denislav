import plugin from 'tailwindcss/plugin';

// Allows stacking children over top of eachother in the z-axis while streching the parent to fit the children
// This is similar to using position: absolute, except that the parent will stretch to fit the children rather than collapsing to zero height
export default plugin(function ({addUtilities}) {
  addUtilities({
    '.grid-stack': {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr',

      '> *': {
        gridArea: '1/1',
      },
    },

    '.grid-stack-item': {
      gridArea: '1/1',
    },
  });
});
