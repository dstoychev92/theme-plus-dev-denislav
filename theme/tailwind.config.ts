import {Config} from 'tailwindcss';
/*
Tailwind docs: https://tailwindcss.com/docs/installation
See default config: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
*/

import {
  maskImagePlugin,
  dialogPlugin,
  colSpanPlugin,
  animationsPlugin,
  staggerPlugin,
  containPlugin,
  backfaceVisibilityPlugin,
  clipPathPlugin,
  rangePlugin,
  numberInputResetPlugin,
  javascriptPlugin,
} from '@groupthought/tradecraft-ui/tailwind';

import quantities from 'tailwindcss-quantity-queries';

// @ts-ignore
import scrollbarHide from 'tailwind-scrollbar-hide';
import containerQueries from '@tailwindcss/container-queries';
import {PluginUtils} from 'tailwindcss/types/config';
import placeholderShown from './tailwind/placeholder-shown';
import maskBorder from './tailwind/mask-border';
import themeColors from './tailwind/theme-colors';
import themeScreenSizes from './tailwind/theme-screen-sizes';
import translateZ from './tailwind/translate-z';
import fontVars from './tailwind/font-vars';
import responsiveSpacing from './tailwind/responsive-spacing';
import hitArea from './tailwind/hit-area';
import textShimmer from './tailwind/text-shimmer';
import animateWiggle from './tailwind/animate-wiggle';
import animateBounce from './tailwind/animate-bounce';
import animatePulse from './tailwind/animate-pulse';
import animateLoaderStroke from './tailwind/animate-loader-stroke';
import revserseZStack from './tailwind/reverse-z-stack';
import hideSearchClear from './tailwind/hide-search-clear';
import webkitAutofill from './tailwind/webkit-autofill';
import formReset from './tailwind/form-reset';
import pointerMedia from './tailwind/pointer-media';
import textStroke from './tailwind/text-stroke';
import popover from './tailwind/popover';
import borderGradient from './tailwind/border-gradient';
import gridStack from './tailwind/grid-stack';
import keyboardActive from './tailwind/keyboard-active';
import alpine from './tailwind/alpine';
import flexFlowVars from './tailwind/flex-flow-vars';
import intersection from './tailwind/intersection';
import fonts from './tailwind/fonts';
import gridArea from './tailwind/grid-area';
import textAlign from './tailwind/text-align';
import layoutGapPadMargin from './tailwind/layout-gap-pad-margin';
import flexLayout from './tailwind/flex-layout';
import scroll from './tailwind/scroll';
import noSupport from './tailwind/no-support';

const packagePlugins = [
  quantities,
  scrollbarHide,
  containerQueries,
  maskImagePlugin,
  dialogPlugin,
  colSpanPlugin,
  animationsPlugin,
  staggerPlugin,
  containPlugin,
  backfaceVisibilityPlugin,
  clipPathPlugin,
  rangePlugin,
  numberInputResetPlugin,
  javascriptPlugin,
];

const customPlugins = [
  themeColors,
  themeScreenSizes,
  placeholderShown,
  maskBorder,
  fontVars,
  responsiveSpacing,
  hitArea,
  translateZ,
  textShimmer,
  animateWiggle,
  animateBounce,
  animatePulse,
  animateLoaderStroke,
  revserseZStack,
  hideSearchClear,
  webkitAutofill,
  formReset,
  pointerMedia,
  textStroke,
  popover,
  borderGradient,
  gridStack,
  keyboardActive,
  alpine,
  flexFlowVars,
  intersection,
  fonts,
  gridArea,
  textAlign,
  layoutGapPadMargin,
  flexLayout,
  scroll,
  noSupport,
];

// @ts-ignore
const isProduction = process.env.NODE_ENV === 'production';

// The `type-resize-*` helpers (defined in src/css/type.css) must always ship,
// even if no template references them as a literal. They live in
// `@layer components`, so `safelist` can't protect them — safelist only
// force-generates utilities. Content scanning is what keeps `@layer components`
// rules, so we feed the literals to the scanner via a `raw` content entry.
const alwaysKeepClasses = {
  raw: [
    'type-resize-all-xs type-resize-all-sm type-resize-all-md type-resize-all-lg type-resize-all-xl',
    'type-resize-xs type-resize-sm type-resize-md type-resize-lg type-resize-xl',
  ].join(' '),
};

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: isProduction
    ? ['./src/**/!(*.spec|*.component.spec|*.unit.spec|*.oldspec).{liquid,js,ts,svg,json}', alwaysKeepClasses]
    : ['./src/**/*.{liquid,js,ts,svg,json}', alwaysKeepClasses],

  theme: {
    /*
      Replace default Tailwind config values
      */

    containers: ({theme}: PluginUtils) => theme('screens'),

    supports: {
      subgrid: 'grid-template-columns: subgrid',
      container: 'container-type: inline-size',
      'color-mix': 'color: color-mix(in hsl, black 10%, white)',
      'oklch-from': 'color: oklch(from white l c h)',
      popover: 'selector(:popover-open)',
      svh: 'height: 100svh',
      aspect: 'aspect-ratio: 1.0',
    },

    fontWeight: {
      DEFAULT: 'var(--font-weight-normal)',
      normal: 'var(--font-weight-normal)',
      bold: 'var(--font-weight-bold)',
    },

    fontFamily: {
      heading: 'heading',
      body: 'body',
      subheading: 'subheading',
      accent: 'accent',
    },
    type: {
      p: 'p',
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      btn: 'button',
      accordion: 'accordion',
      tab: 'tab',
      section: 'section',
      kicker: 'kicker',
      micro: 'micro',
    },
    fontSize: {
      'size-input': ['var(--input-font-size)', {lineHeight: 'var(--leading, var(--leading-control))'}],
      'size-control': ['var(--control-font-size)', {lineHeight: 'var(--leading, var(--leading-control))'}],
      'size-apply': [
        'calc(var(--font-size, var(--font-size-md)) * var(--font-family-adjust) * var(--caps-adjust))',
        {lineHeight: 'max(var(--leading-floor, 0), var(--leading, var(--leading-block)))'},
      ],
    },
    typeSize: {
      r1: '1',
      r2: '2',
      r3: '3',
      r4: '4',
      r5: '5',
      r6: '6',
      r7: '7',
      r8: '8',
      r9: '9',
      r10: '10',
      r11: '11',
      r12: '12',
      r13: '13',
      r14: '14',
      r15: '15',
    },
    transitionTimingFunction: {
      DEFAULT: 'var(--ease-in-out)',
      'in-out': 'var(--ease-in-out)',
      'in-out-sharp': 'var(--ease-in-out-sharp)',
      linear: 'linear',
    },

    transitionDelay: {
      0: '0s',
      10: '10ms',
      25: '25ms',
      50: '50ms',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      225: '225ms',
      300: '300ms',
      400: '400ms',
      500: '500ms',
      600: '600ms',
      700: '700ms',
      1000: '1000ms',
      1500: '1500ms',
      2000: '2000ms',
      3000: '3000ms',
    },

    transitionDuration: {
      DEFAULT: '300ms',
      0: '0s',
      50: '50ms',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      225: '225ms',
      300: '300ms',
      400: '400ms',
      500: '500ms',
      600: '600ms',
      700: '700ms',
      800: '800ms',
      900: '900ms',
      1000: '1000ms',
      1500: '1500ms',
      2000: '2000ms',
      3000: '3000ms',
    },

    borderRadius: {
      none: '0px',
      full: '9999px',
      pill: 'var(--radius-pill)',
      btn: 'var(--radius-btn)',
      tab: 'var(--radius-tab)',
      element: 'var(--radius-element-default)',
      banner: 'var(--radius-banner-default)',
      'form-field': 'var(--radius-form-field)',
      DEFAULT: 'var(--radius-sm)',
      xs: 'var(--radius-sm)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
    },

    boxShadow: {
      none: 'none',
      'inset-glow': 'inset 0 0 2px rgba(255, 255, 255, 0.05)',
      low: `
        0px 1.6px 2px -1.6px oklch(var(--shadow-oklch) / 0.05);
      `,
      DEFAULT: `
        0px 2.5px 4px -0.5px oklch(var(--shadow-oklch) / 0.04),
        0px 6.8px 7px -1.6px oklch(var(--shadow-oklch) / 0.05);
      `,
      high: `
       0px 5px 6.3px -0.5px oklch(var(--shadow-oklch) / 0.04),
       0px 12.7px 16px -1.1px oklch(var(--shadow-oklch) / 0.07),
       0px 30.3px 38.2px -1.6px oklch(var(--shadow-oklch) / 0.1);
      `,
    },
    dropShadow: {
      none: 'none',
      low: [
        `calc(sin(var(--light-source-angle)) * var(--light-source-distance) * 0.8) calc(cos(var(--light-source-angle)) * var(--light-source-distance) * 0.8) 1px rgb(0 0 0 / 0.05)`,
      ],
      DEFAULT: [
        'calc(sin(var(--light-source-angle)) * var(--light-source-distance) * 0.8) calc(cos(var(--light-source-angle)) * var(--light-source-distance) * 0.8) 2px rgb(0 0 0 / 0.1)',
        '0 1px 1px rgb(0 0 0 / 0.06)',
      ],
      high: [
        'calc(sin(var(--light-source-angle)) * var(--light-source-distance) * 0.8) calc(cos(var(--light-source-angle)) * var(--light-source-distance) * 0.8) 8px rgb(0 0 0 / 0.04)',
        '0 4px 3px rgb(0 0 0 / 0.1)',
      ],
    },
    animation: {
      none: 'none',
      spin: `spin var(--spin-duration,700ms) linear infinite`,
    },

    staggerOffset: {
      DEFAULT: '50ms',
    },

    keyframes: {
      spin: {
        to: {
          transform: 'rotate(360deg)',
        },
      },
    },

    textAlign: {
      content: 'var(--content-align)',
    },

    // Sizes for hit area
    hitArea: ({theme}: PluginUtils) => theme('spacing'),

    blur: {
      0: '0',
      none: '',
      sm: '4px',
      DEFAULT: '8px',
      md: '10px',
      lg: '14px',
      xl: '16px',
    },

    extend: {
      willChange: {
        opacity: 'opacity',
        filter: 'filter',
        'backdrop-filter': 'backdrop-filter',
      },
      /*
      Extend default Tailwind config values here
      */

      spacing: {
        0: '0px',
        px: '1px',

        'root-buffer': 'var(--root-buffer)',

        'layout-buffer': 'var(--layout-buffer)',
        'layout-buffer-x': 'var(--layout-buffer-x)',
        'layout-buffer-y': 'var(--layout-buffer-y)',

        'layout-gutter': 'var(--layout-gutter)',
        'layout-gutter-x': 'var(--layout-gutter-x)',
        'layout-gutter-y': 'var(--layout-gutter-y)',

        // Row height spacing system
        'row-xs': 'var(--row-xs)',
        'row-sm': 'var(--row-sm)',
        'row-md': 'var(--row-md)',
        'row-lg': 'var(--row-lg)',
        'row-xl': 'var(--row-xl)',

        // Things using the row height system
        'btn-padding': 'var(--btn-padding)',
        'btn-padding-x': 'calc(var(--btn-padding) * 2)',
        'btn-height': 'var(--btn-height)',

        'control-padding': 'var(--control-padding)',
        'control-height': 'var(--control-height)',
        'control-icon-size': 'var(--control-icon-size)',

        // Theme spacing system
        sm: 'var(--root-space-sm)',
        md: 'var(--root-space-md)',
        lg: 'var(--root-space-lg)',
        'min-buffer': 'var(--text-buffer)',
        'min-buffer-safe': 'var(--card-text-buffer)',

        // Icons
        'icon-size': 'var(--icon-size)',
        'icon-height': 'var(--icon-height, var(--icon-size))',
        'icon-width': 'var(--icon-width, var(--icon-size))',

        // Cards
        'card-lg-media-padding': 'var(--card-lg-media-padding)',
        'card-lg-text-padding': 'var(--card-lg-text-padding)',
        'card-lg-text-gap': 'var(--card-lg-text-gap)',
      },
      padding: {
        btn: 'var(--btn-padding)',
        'btn-x': 'var(--btn-padding-x, calc(var(--btn-padding) * 2))',
        control: 'var(--control-padding)',
        'control-x': 'var(--control-padding-x)',
        'card-lg-media': 'var(--card-lg-media-padding)',
        'card-lg-text': 'var(--card-lg-text-padding)',
      },
      flexGrow: {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
      },
      flexBasis: {
        equal: '0',
      },
      scale: {
        200: '2.0',
      },
      transitionProperty: {
        padding: 'padding',
        border: 'border',
        swatch: 'padding, transform, box-shadow',
        fill: 'fill',
        stroke: 'stroke',
      },
      backgroundColor: {
        btn: 'var(--btn-bg-color)',
        custom: 'var(--color-custom-bg)',
      },
      textColor: {
        btn: 'var(--btn-text-color)',
        custom: 'var(--color-custom-text)',
      },
      borderColor: {
        btn: 'var(--btn-border-color)',
      },
      fill: {
        btn: 'var(--btn-bg-color)',
      },
      height: {
        'screen-dynamic': '100dvh',
        'screen-small': '100svh',
        'screen-large': '100vh',
        btn: 'var(--btn-height)',
        control: 'var(--control-height)',
      },
      minHeight: ({theme}: PluginUtils) => {
        return {
          ...theme('spacing'),
          btn: 'var(--btn-height)',
          control: 'var(--control-height)',
        };
      },
      maxHeight: {
        'screen-dynamic': '100dvh',
        'screen-small': '100svh',
        'screen-large': '100vh',
        btn: 'var(--btn-height)',
        control: 'var(--control-height)',
      },
      width: {
        'screen-dynamic': '100dvw',
        'screen-small': '100svw',
        'screen-large': '100vw',
        icon: 'var(--icon-width, var(--icon-size))',
        control: 'var(--control-height)',
      },
      minWidth: ({theme}: PluginUtils) => {
        return {
          ...theme('spacing'),
          control: 'var(--control-height)',
        };
      },
      maxWidth: {
        'screen-dynamic': '100dvw',
        'screen-small': '100svw',
        'screen-large': '100vw',
        screen: '100vw',
        '1/2': '50%',
      },
      size: {
        btn: 'var(--btn-height)',
        icon: 'var(--icon-size)',
        control: 'var(--control-height)',
        'control-icon': 'var(--control-icon-size)',
      },
      gridTemplateColumns: {
        even: 'minmax(0,1fr) minmax(0,1fr)',
        'first-wide': 'minmax(0,7fr) minmax(0,5fr)',
        'second-wide': 'minmax(0,5fr) minmax(0,7fr)',
      },
      gridRow: {
        'section-content': 'var(--section-content-row-start)/var(--section-content-row-end)',
        'section-bg': 'var(--section-background-row-start)/var(--section-background-row-end)',
      },
      gridColumn: {
        section: 'section-start/section-end',
        'section-content': 'var(--section-content-col-start)/var(--section-content-col-end)',
        'section-bg': 'var(--section-background-col-start)/var(--section-background-col-end)',
        fullbleed: 'fullbleed-start/fullbleed-end',
      },
      gridColumnStart: {
        section: 'section-start',
        'section-content': 'var(--section-content-col-start)',
        'section-bg': 'var(--section-background-col-start,1)',
        fullbleed: 'fullbleed-start',
      },
      gridColumnEnd: {
        section: 'section-end',
        'section-content': 'var(--section-content-col-end)',
        'section-bg': 'var(--section-background-col-end,-1)',
        fullbleed: 'fullbleed-end',
      },
      gridRowStart: {
        'section-content': 'var(--section-content-row-start)',
        'section-bg': 'var(--section-background-row-start,1)',
        fullbleed: 'fullbleed-start',
      },
      gridRowEnd: {
        'section-content': 'var(--section-content-row-end)',
        'section-bg': 'var(--section-background-row-end,-1)',
        fullbleed: 'fullbleed-end',
      },
      translate: () => ({
        '1/5': '20%',
        '1/16': '6.25%',
        '1/8': '12.5%',
        '3/8': '37.5%',
        '5/8': '62.5%',
        '7/8': '87.5%',
        '3/2': '150%',
        '7/4': '175%',
      }),

      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [...packagePlugins, ...customPlugins],

  corePlugins: {
    // This doesn't play nice with our custom layered, HSL-coloured box shadows
    boxShadowColor: false,
    // Disable default flexDirection to prevent conflicts with flex-flow-vars plugin
    flexDirection: false,
    // Disable text align since we've implemented our own that supports arbitrary values
    textAlign: false,
  },

  // TODO: make these more explicit so we can reason about our baseline css bundle size and
  // we don't risk major css expansion if something changes upstream in tailwind
  safelist: [
    {
      pattern: /^text-(left|right|start|end|center)/,
      variants: ['lg', 'md', 'sm'],
    },
    {
      pattern: /^text-r(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15)$/,
    },
    {
      pattern: /^font-family-(heading|subheading|body|accent)/,
    },
    {
      pattern: /^type-(p|h1|h2|h3|h4|h5|h6|button|accordion|tab|section|kicker|micro)/,
    },
    {
      pattern: /font-(normal|bold)/,
    },

    {
      pattern: /rounded-(sm|md|lg)/,
    },

    // Whitelist all vars- classes are they're often used with settings
    {
      pattern: /^vars-(.*)/,
    },

    // Whitelist all color classes so they are usable by merchants
    {
      pattern: /^bg-(canvas|content|secondary|primary|muted|sale|custom)$/,
    },
    {
      pattern: /^bg-(canvas|content)-mix-(\d+)$/,
    },
    {
      pattern: /^text-(canvas|content|secondary|primary|muted|sale|custom)$/,
    },
    {
      pattern: /^text-(canvas|content)-mix-(\d+)$/,
    },
  ],
};

export default config;
