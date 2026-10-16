import { Product, ProductVariant, ProductVariantOptions } from '../types';
/**
 * Return the variant for the given variant ID
 */
export declare function getVariantById(product: Product, variantId: number): ProductVariant | null;
/**
 * Return any variants who's options match the given options (including a subset of the options)
 */
export declare function getVariantsForOptions(product: Product, options: ProductVariantOptions): ProductVariant[];
