import { ProductImage } from './product-image';
export type ProductMedia = {
    alt: string;
    id: number;
    media_type: 'image' | 'video' | 'model' | 'external_video';
    position: number;
    preview_image: ProductImage;
};
