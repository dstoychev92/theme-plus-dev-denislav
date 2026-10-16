import plugin from 'tailwindcss/plugin';

export function maskBorder(value: string) {
  return {
    '--mask-border-width': value,
    borderRadius: 'inherit',
    padding: `var(--mask-border-width)`,
    mask: 'linear-gradient(#FFF 0 0) content-box, linear-gradient(#FFF 0 0)',
    maskComposite: 'exclude',
  };
}

export default plugin(function ({matchUtilities, theme, addVariant, e}) {
  matchUtilities<string>(
    {
      'mask-border': maskBorder,
    },
    {
      values: {
        ...theme('space'),
        DEFAULT: '1px',
      },
    },
  );
});
