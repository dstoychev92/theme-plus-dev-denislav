import plugin from 'tailwindcss/plugin';

export default plugin(function ({matchUtilities, theme, addVariant, e}) {
  matchUtilities<string>(
    {
      'translate-z': (value) => ({
        '--tw-translate-z': value,
        transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
      }),
    },
    {
      values: {
        ...theme('space'),
        DEFAULT: '1px',
      },
    },
  );
});
