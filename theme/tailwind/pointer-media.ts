import plugin from 'tailwindcss/plugin';

export default plugin(function ({addVariant}) {
  // Target devices where the primary pointer is not a hover capable device.
  // Note: There is a bug in Chrome on Ubuntu that causes (hover: none) to always be trigged whether there's a mouse or not so we add the (pointer: coarse) to ensure that the device is a touch device.
  addVariant('touch', `@media (pointer: coarse) and (hover: none)`);
  addVariant('mouse', `@media (pointer: fine) and (hover: hover)`);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer
  addVariant('any-fine', `@media (any-pointer: fine)`);
  addVariant('any-coarse', `@media (any-pointer: coarse)`);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
  addVariant('fine', `@media (pointer: fine)`);
  addVariant('coarse', `@media (pointer: coarse)`);
});
