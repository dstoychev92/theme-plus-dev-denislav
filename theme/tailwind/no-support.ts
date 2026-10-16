import plugin from 'tailwindcss/plugin';

export default plugin(function ({matchVariant, theme}) {
  matchVariant(
    'no',
    (feature) => {
      return `@supports not (${feature})`;
    },
    {
      values: theme('supports'),
    },
  );
});
