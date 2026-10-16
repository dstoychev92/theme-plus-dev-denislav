import plugin from 'tailwindcss/plugin';

export default plugin(function ({addVariant}) {
  addVariant('prealpine', `[data-alpine-loading] &`);
});
