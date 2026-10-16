import plugin from 'tailwindcss/plugin';

const inputs = [
  "[type='text']",
  'input:where(:not([type]))',
  "[type='email']",
  "[type='url']",
  "[type='password']",
  "[type='number']",
  "[type='date']",
  "[type='datetime-local']",
  "[type='month']",
  "[type='search']",
  "[type='tel']",
  "[type='time']",
  "[type='week']",
  '[multiple]',
  'textarea',
  'select',
];

export default plugin(function ({addBase}) {
  addBase({
    [[inputs].join(', ')]: {
      outline: 'none',
      appearance: 'none',
      '&:focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        outline: 'none',
      },
    },
    "[type='checkbox'],[type='radio']": {
      outline: 'none',
      '&:focus': {
        outline: 'none',
      },
      '&:focus-visible': {
        outline: 'none',
      },
    },
  });
});
