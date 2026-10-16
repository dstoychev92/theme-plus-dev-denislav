import plugin from 'tailwindcss/plugin';

export default plugin(function ({addVariant}) {
  addVariant('intersected', [`&[data-has-intersected='true']`, `[data-has-intersected='true'] &`]);
  addVariant('intersecting', [`&[data-is-intersecting='true']`, `[data-is-intersecting='true'] &`]);
});
