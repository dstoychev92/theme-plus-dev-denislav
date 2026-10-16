import plugin from 'tailwindcss/plugin';
export default plugin(({ matchUtilities }) => {
    matchUtilities({
        'clip-path-shape': (value) => {
            return {
                'clip-path': `${value}`,
            };
        },
    });
});
