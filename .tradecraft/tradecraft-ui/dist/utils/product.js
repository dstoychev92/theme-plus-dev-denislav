/**
 * Return the variant for the given variant ID
 */
export function getVariantById(product, variantId) {
    const variant = product.variants.find((variant) => variant.id === variantId);
    if (!variant)
        return null;
    return variant;
}
/**
 * Return any variants who's options match the given options (including a subset of the options)
 */
export function getVariantsForOptions(product, options) {
    if (options.length === 0)
        return [];
    return product.variants.filter((variant) => {
        return options.every((option, index) => option === variant.options[index]);
    }, null);
}
