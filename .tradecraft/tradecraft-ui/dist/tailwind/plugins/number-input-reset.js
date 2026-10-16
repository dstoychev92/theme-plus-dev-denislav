import plugin from 'tailwindcss/plugin';
/**
 * Utility to remove the default styles of an <input type="number">
 */
export default plugin(function ({ addBase }) {
    addBase({
        'input[type="number"]': {
            '-moz-appearance': 'textfield',
            '&::-webkit-inner-spin-button': {
                margin: '0',
                appearance: 'none',
            },
            '&::-webkit-outer-spin-button': {
                margin: '0',
                appearance: 'none',
            },
        },
    });
});
