import plugin from 'tailwindcss/plugin';
import {loadConstants} from '@groupthought/tradecraft-build';

const constants = loadConstants();

export default plugin(
  function ({addBase}) {
    addBase({
      ':root': {
        '--screen-sm': `${constants.screen_sm}px`,
        '--screen-md': `${constants.screen_md}px`,
        '--screen-lg': `${constants.screen_lg}px`,
        '--screen-xl': `${constants.screen_xl}px`,
        '--screen-2xl': `${constants.screen_2xl}px`,
      },
    });
  },
  {
    theme: {
      screens: {
        sm: `${constants.screen_sm}px`,
        md: `${constants.screen_md}px`,
        lg: `${constants.screen_lg}px`,
        xl: `${constants.screen_xl}px`,
        '2xl': `${constants.screen_2xl}px`,
      },
    },
  },
);
