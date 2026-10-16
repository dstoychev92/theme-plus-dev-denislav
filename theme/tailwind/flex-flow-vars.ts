import plugin from 'tailwindcss/plugin';

/**
 * Plugin to automatically set --flow-row and --flow-column CSS variables
 * based on flex direction utilities while preserving default Tailwind behavior
 * that sets 'flex-direction'
 */
export default plugin(function ({addUtilities}) {
  const flowUtilities = {
    '.flex-row': {
      'flex-direction': 'row',
      '--flex-direction': 'row',
      '--flex-across': '1',
      '--flex-down': '0',
    },
    '.flex-col': {
      'flex-direction': 'column',
      '--flex-direction': 'column',
      '--flex-across': '0',
      '--flex-down': '1',
    },
    '.flex-row-reverse': {
      'flex-direction': 'row-reverse',
      '--flex-direction': 'row-reverse',
      '--flex-across': '1',
      '--flex-down': '0',
    },
    '.flex-col-reverse': {
      'flex-direction': 'column-reverse',
      '--flex-direction': 'column-reverse',
      '--flex-across': '0',
      '--flex-down': '1',
    },
  };

  addUtilities(flowUtilities);
});
