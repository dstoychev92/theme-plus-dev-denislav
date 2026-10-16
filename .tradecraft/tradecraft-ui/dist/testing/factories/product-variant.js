import { Factory } from 'fishery';
import { productMediaFactory } from './product-media';
import { productImageFactory } from './product-image';
import { productFactory } from './product';
export const productVariantFactory = Factory.define(({ sequence, associations, afterBuild }) => {
    afterBuild((variant) => {
        var _a, _b, _c, _d;
        if ((_a = variant.featured_media) === null || _a === void 0 ? void 0 : _a.preview_image) {
            variant.featured_image = (_b = variant.featured_media) === null || _b === void 0 ? void 0 : _b.preview_image;
            variant.image = (_c = variant.featured_media) === null || _c === void 0 ? void 0 : _c.preview_image;
        }
        // Omit media properties from variant association to avoid infinite loop
        const variantWithoutMedia = Object.assign(Object.assign({}, variant), { featured_media: null, featured_image: null, image: null, media: null });
        (_d = variant.featured_media) === null || _d === void 0 ? void 0 : _d.preview_image.variants.push(variantWithoutMedia);
        if (variant.product == null) {
            variant.product = productFactory.build({ variants: [variant] });
        }
        if (variant.url == null) {
            variant.url = `${variant.product.url || '/products/my-product'}?variant=${variant.id}`;
        }
        if (variant.title == null) {
            variant.title = variant.options.join(' / ');
        }
    });
    return {
        id: sequence,
        available: true,
        barcode: '1234567890123',
        compare_at_price: null,
        featured_image: null,
        featured_media: associations.featured_media ||
            productMediaFactory.build({
                preview_image: productImageFactory.build({
                    'attached_to_variant?': true,
                }),
            }),
        image: null,
        incoming: false,
        inventory_management: 'shopify',
        inventory_policy: 'deny',
        inventory_quantity: 50,
        matched: false,
        metafields: {},
        next_incoming_date: '2023-12-01',
        get option1() {
            return this.options[0] || null;
        },
        get option2() {
            return this.options[1] || null;
        },
        get option3() {
            return this.options[2] || null;
        },
        options: associations.options || [],
        price: 1999,
        product: associations.product || null,
        quantity_rule: {},
        requires_selling_plan: false,
        requires_shipping: true,
        selected: false,
        selected_selling_plan_allocation: null,
        selling_plan_allocations: [],
        sku: `SKU${sequence}`,
        store_availabilities: [],
        taxable: true,
        title: null,
        unit_price: null,
        unit_price_measurement: null,
        url: null,
        weight: 200,
        weight_in_unit: 0.2,
        weight_unit: 'kg',
    };
});
