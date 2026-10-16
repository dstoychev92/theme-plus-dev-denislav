import plugin from 'tailwindcss/plugin';

export default plugin(({matchComponents, theme}) => {
  // Font variables - just the basic font properties
  matchComponents(
    {
      'vars-font-family': (value) => ({
        '--font-family': `var(--root-font-stack-${value})`,
        '--font-style': `var(--root-font-style-${value})`,
        '--font-weight-normal': `var(--root-font-weight-normal-${value})`,
        '--font-weight-bold': `var(--root-font-weight-bold-${value})`,
        '--font-family-adjust': `var(--root-font-adjust-${value})`,
        '--font-caps-tracking': `var(--root-font-caps-tracking-${value})`,
        '--font-baseline-ratio': `var(--root-font-baseline-ratio-${value})`,
      }),
    },
    {
      values: theme('fontFamily'), // e.g., heading, body, subheading, accent
    },
  );

  // Element variables - includes font properties plus transform and spacing
  matchComponents(
    {
      'vars-type': (value) => ({
        '--font-family': `var(--root-font-stack-${value})`,
        '--font-style': `var(--root-font-style-${value})`,
        '--font-weight-normal': `var(--root-font-weight-normal-${value})`,
        '--font-weight-bold': `var(--root-font-weight-bold-${value})`,
        '--font-caps-tracking': `var(--root-font-caps-tracking-${value})`,
        '--font-baseline-ratio': `var(--root-font-baseline-ratio-${value})`,
        '--font-size-xs': `var(--root-font-size-${value}-xs)`,
        '--font-size-sm': `var(--root-font-size-${value}-sm)`,
        '--font-size-md': `var(--root-font-size-${value}-md)`,
        '--font-size-lg': `var(--root-font-size-${value}-lg)`,
        '--font-size-xl': `var(--root-font-size-${value}-xl)`,
        '--font-size-calc': `calc(var(--font-size, var(--font-size-md)) * var(--font-family-adjust) * var(--caps-adjust))`,
        '--font-family-adjust': `var(--root-font-adjust-${value})`,
        '--caps-adjust': `var(--root-caps-adjust-${value})`,
        '--caps-transform': `var(--root-caps-transform-${value})`,
        '--caps-tracking': `var(--root-caps-tracking-${value})`,
        '--leading-prose': `var(--root-leading-prose-${value})`,
        '--leading-block': `var(--root-leading-block-${value})`,
      }),
    },
    {
      values: theme('type'), // e.g., button, accordion, tab, badge
    },
  );

  matchComponents(
    {
      text: (value) => ({
        '--leading-prose': `var(--leading-prose-${value})`,
        '--leading-block': `var(--leading-block-${value})`,
        '--font-size': `var(--font-r${value})`,
        '--font-size-calc': `calc(var(--font-size) * var(--font-family-adjust) * var(--caps-adjust))`,
        fontSize: `calc(var(--font-r${value}) * var(--font-family-adjust) * var(--caps-adjust))`,
        lineHeight: 'max(var(--leading-floor, 0), var(--leading, var(--leading-block)))',
      }),
    },
    {
      values: theme('typeSize'), // e.g., r1, r2, etc
    },
  );

  // Style applications
  matchComponents(
    {
      'font-family': (value) => ({
        '--font-family': `var(--root-font-stack-${value})`,
        '--font-style': `var(--root-font-style-${value})`,
        '--font-weight-normal': `var(--root-font-weight-normal-${value})`,
        '--font-weight-bold': `var(--root-font-weight-bold-${value})`,
        '--font-family-adjust': `var(--root-font-adjust-${value})`,
        '--font-caps-tracking': `var(--root-font-caps-tracking-${value})`,
        '--font-baseline-ratio': `var(--root-font-baseline-ratio-${value})`,
        fontFamily: 'var(--font-family)',
        fontStyle: 'var(--font-style)',
        fontWeight: 'var(--font-weight, var(--font-weight-normal))',
      }),
      type: (value) => ({
        '--font-family': `var(--root-font-stack-${value})`,
        '--font-style': `var(--root-font-style-${value})`,
        '--font-weight-normal': `var(--root-font-weight-normal-${value})`,
        '--font-weight-bold': `var(--root-font-weight-bold-${value})`,
        '--font-caps-tracking': `var(--root-font-caps-tracking-${value})`,
        '--font-baseline-ratio': `var(--root-font-baseline-ratio-${value})`,
        '--font-size-xs': `var(--root-font-size-${value}-xs)`,
        '--font-size-sm': `var(--root-font-size-${value}-sm)`,
        '--font-size-md': `var(--root-font-size-${value}-md)`,
        '--font-size-lg': `var(--root-font-size-${value}-lg)`,
        '--font-size-xl': `var(--root-font-size-${value}-xl)`,
        '--font-size-calc': `calc(var(--font-size, var(--font-size-md)) * var(--font-family-adjust) * var(--caps-adjust))`,
        '--font-family-adjust': `var(--root-font-adjust-${value})`,
        '--caps-adjust': `var(--root-caps-adjust-${value})`,
        '--caps-transform': `var(--root-caps-transform-${value})`,
        '--caps-tracking': `var(--root-caps-tracking-${value})`,
        '--leading-prose': `var(--root-leading-prose-${value})`,
        '--leading-block': `var(--root-leading-block-${value})`,
        fontFamily: 'var(--font-family)',
        fontStyle: 'var(--font-style)',
        fontSize: 'calc(var(--font-size, var(--font-size-md)) * var(--font-family-adjust) * var(--caps-adjust))',
        lineHeight: 'max(var(--leading-floor, 0), var(--leading, var(--leading-block)))',
        fontWeight: 'var(--font-weight, var(--font-weight-normal))',
        textTransform: 'var(--caps-transform)',
        letterSpacing: 'var(--caps-tracking)',
      }),
    },
    {
      values: {
        ...theme('fontFamily'),
        ...theme('type'),
      },
    },
  );
});
