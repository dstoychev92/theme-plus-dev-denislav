import plugin from 'tailwindcss/plugin';

export default plugin(function ({addVariant}) {
  addVariant('placeholder-shown', `&:placeholder-shown`);
});
