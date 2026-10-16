import { ProductVariant } from './product-variant';
export type ProductImage = {
    alt: string;
    aspect_ratio: number;
    'attached_to_variant?': boolean;
    height: number;
    id: number;
    position: number;
    product_id: number;
    src: string;
    variants: ProductVariant[];
    width: number;
};
