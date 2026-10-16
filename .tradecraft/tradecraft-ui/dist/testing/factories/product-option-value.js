import { Factory } from 'fishery';
export const swatchFactory = Factory.define(({ sequence, afterBuild }) => {
    return {
        color: {
            alpha: 1,
            blue: 180,
            green: 79,
            hue: 227,
            lightness: 45,
            red: 51,
            rgb: '51 79 180',
            rgba: '51 79 180 / 1.0',
            saturation: 56,
        },
    };
});
export const productOptionValueFactory = Factory.define(({ sequence, associations }) => {
    return {
        available: true,
        id: sequence,
        name: 'Red',
        product_url: null,
        selected: false,
        swatch: associations.swatch || null,
        variant: associations.variant || null,
    };
});
