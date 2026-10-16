import plugin from 'tailwindcss/plugin';
export default plugin(({ matchComponents, theme }) => {
    // Utility to set up a group of font properties for a give typography style
    matchComponents({
        type: (value) => (Object.assign(Object.assign({}, value), { fontFamily: 'var(--font-family)', fontStyle: 'var(--font-style)', fontWeight: 'var(--font-weight, var(--font-weight-normal))', textTransform: 'var(--font-transform)', letterSpacing: 'var(--font-letter-spacing)' })),
    }, {
        values: theme('type'),
    });
});
