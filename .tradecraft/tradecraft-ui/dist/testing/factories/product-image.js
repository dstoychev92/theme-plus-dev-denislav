import { Factory } from 'fishery';
export const productImageFactory = Factory.define(({ sequence }) => ({
    id: sequence,
    alt: 'Charcoal',
    aspect_ratio: 1.50016818028927,
    'attached_to_variant?': false,
    height: 2973,
    position: sequence,
    product_id: 6790277595201,
    src: `product-image-${sequence}.jpg`,
    variants: [],
    width: 4460,
}));
