import plugin from 'tailwindcss/plugin';

export default plugin(function ({matchUtilities, theme}) {
  matchUtilities(
    {
      area: (value) => ({
        gridArea: value,
      }),
    },
    {values: theme('gridTemplateAreas')},
  );
});
