import { Factory } from 'fishery';
import { productImageFactory } from './product-image';
export const productMediaFactory = Factory.define(({ sequence, associations }) => ({
    id: sequence,
    alt: 'Dandelion milk',
    media_type: 'image',
    position: sequence,
    preview_image: associations.preview_image || productImageFactory.build(),
}));
