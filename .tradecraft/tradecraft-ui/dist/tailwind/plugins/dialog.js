import plugin from 'tailwindcss/plugin';
export default plugin(({ addVariant }) => {
    // Utility to add the ability to style a "closed" modal e.g. `closed:hidden`
    addVariant('closed', '&:not([open])');
});
