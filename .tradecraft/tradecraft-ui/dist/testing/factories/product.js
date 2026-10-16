import { Factory } from 'fishery';
import { productMediaFactory } from './product-media';
import { productVariantFactory } from './product-variant';
import { productOptionFactory } from './product-option';
import { productOptionValueFactory, swatchFactory } from './product-option-value';
import { isString } from '../../utils';
function assignOptionValueVariants(options, variants) {
    options.forEach((option, optionIndex) => {
        option.values.forEach((value) => {
            // Find the variant corresponding to the option value
            const correspondingVariant = variants.find((variant) => {
                return variant.options.every((variantValue, variantOptionValueIndex) => {
                    var _a;
                    if (variantOptionValueIndex == optionIndex) {
                        // Check if the variant value matches the option value for this index
                        return variantValue === value.name;
                    }
                    else {
                        if (options[variantOptionValueIndex].selected_value) {
                            // If there is a selected value for the option, only match if the variant value matches the selected value
                            return variantValue === ((_a = options[variantOptionValueIndex].selected_value) === null || _a === void 0 ? void 0 : _a.name);
                        }
                        else {
                            // If there is no selected value for the option, match any variant value since we want the
                            // _first_ variant that matches the option value
                            return true;
                        }
                    }
                });
            });
            if (correspondingVariant) {
                value.variant = Object.assign(Object.assign({}, correspondingVariant), { product: {
                        id: correspondingVariant.product.id,
                    } });
            }
        });
    });
}
// Select option values and update product variants
function selectOptionValue(selectedOptionValues, product) {
    product.options_with_values.forEach((option) => {
        let selectedValue = null;
        option.values.forEach((value) => {
            if (value.name === selectedOptionValues[option.position - 1]) {
                value.selected = true;
                selectedValue = value;
            }
            else {
                value.selected = false;
            }
        });
        option.selected_value = selectedValue;
    });
    product.variants.forEach((variant) => {
        if (variant.options.every((value, index) => value === selectedOptionValues[index])) {
            if (variant) {
                variant.selected = true;
                product.selected_variant = variant;
                product.selected_or_first_available_variant = variant;
            }
        }
        else {
            variant.selected = false;
        }
    });
    assignOptionValueVariants(product.options_with_values, product.variants);
}
const productFactory = Factory.define(({ sequence, afterBuild, associations, transientParams }) => {
    let builtOptions = [];
    let builtVariants = [];
    if (transientParams.options) {
        const getOptionCombos = (values) => {
            if (values.length === 0)
                return [[]];
            const [first, ...rest] = values;
            const permsWithoutFirst = getOptionCombos(rest);
            return first.flatMap((value) => permsWithoutFirst.map((perm) => [value, ...perm].map((v) => (isString(v) ? v : v.name))));
        };
        // Generate all variant permutations from options
        builtVariants = getOptionCombos(Object.values(transientParams.options)).map((values) => {
            var _a;
            const existingVariant = (_a = associations.variants) === null || _a === void 0 ? void 0 : _a.find((variant) => variant.options.every((value, index) => value === values[index]));
            if (existingVariant) {
                return existingVariant;
            }
            else {
                return productVariantFactory.build({
                    options: values,
                    selected: false,
                });
            }
        });
        // Generate all options and option values
        builtOptions = Object.entries(transientParams.options).map(([name, values], optionIndex) => {
            const selectedOptionValues = values.map((value) => {
                let valueParams;
                if (isString(value)) {
                    valueParams = productOptionValueFactory.build({
                        name: value,
                        selected: false,
                        swatch: name.match(/Color/i) ? swatchFactory.build() : null,
                    });
                }
                else {
                    valueParams = value;
                }
                return productOptionValueFactory.build(valueParams);
            });
            return productOptionFactory.build({
                name,
                position: optionIndex + 1,
                get selected_value() {
                    return (selectedOptionValues || []).find((v) => v.selected);
                },
                values: selectedOptionValues,
            });
        });
        assignOptionValueVariants(builtOptions, builtVariants);
        // Find the variant corresponding to the selected options
        const selectedOptionValues = builtOptions.map((option) => { var _a; return (_a = option.selected_value) === null || _a === void 0 ? void 0 : _a.name; });
        const selectedVariant = builtVariants.find((variant) => variant.options.every((value, index) => selectedOptionValues[index] === value));
        if (selectedVariant) {
            selectedVariant.selected = true;
        }
    }
    afterBuild((product) => {
        // Set default variant if only one variant
        if (product.has_only_default_variant == null) {
            product.has_only_default_variant = product.options.length === 0;
        }
        if (transientParams.optionPriceRules !== undefined) {
            // Parse { 'option1,option2': 100 } into [{ options: ['option1', 'option2'], price: 100 }]
            const parsedRules = Object.entries(transientParams.optionPriceRules).map(([selectedOptionValues, price]) => {
                return { options: selectedOptionValues.split(','), price };
            });
            product.variants.forEach((variant) => {
                const matchingRule = parsedRules.find((rule) => {
                    return variant.options.every((option, index) => { var _a, _b, _c; return ((_a = rule.options) === null || _a === void 0 ? void 0 : _a[index]) == option || ((_b = rule.options) === null || _b === void 0 ? void 0 : _b[index]) == '*' || ((_c = rule.options) === null || _c === void 0 ? void 0 : _c[index]) == undefined; });
                });
                if (matchingRule) {
                    variant.price = matchingRule.price;
                }
            });
        }
        // Set selected variant based on option values
        if (transientParams.selectedOptions !== undefined) {
            selectOptionValue(transientParams.selectedOptions, product);
        }
        // Set various price fields
        const uniquePrices = [...new Set(product.variants.map((v) => v.price))];
        if (product.price_varies == null) {
            product.price_varies = uniquePrices.length > 1;
        }
        if (product.price_min == null && uniquePrices.length > 0) {
            product.price_min = Math.min(...uniquePrices);
        }
        if (product.price_max == null && uniquePrices.length > 0) {
            product.price_max = Math.max(...uniquePrices);
        }
        if (product.price == null) {
            product.price = product.price_min;
        }
        const uniqueCompareAtPrices = [
            ...new Set(product.variants.map((v) => v.compare_at_price).filter(Boolean)),
        ];
        if (product.compare_at_price_varies == null) {
            product.compare_at_price_varies = uniqueCompareAtPrices.length > 1;
        }
        if (product.compare_at_price_min == null && uniqueCompareAtPrices.length > 0) {
            product.compare_at_price_min = Math.min(...uniqueCompareAtPrices);
        }
        if (product.compare_at_price_max == null && uniqueCompareAtPrices.length > 0) {
            product.compare_at_price_max = Math.max(...uniqueCompareAtPrices);
        }
        if (product.compare_at_price == null) {
            product.compare_at_price = product.compare_at_price_min;
        }
        // Set product media
        if (product.media == null) {
            product.media = [
                // Add one media that is unattached to a variant
                productMediaFactory.build(),
                // Add media for each variant that has one
                ...product.variants
                    .map((variant) => {
                    return variant.featured_media;
                })
                    .filter(Boolean),
            ];
        }
        // Make sure product media positions are correct
        product.media = product.media.map((media, index) => {
            return Object.assign(Object.assign({}, media), { position: index + 1, preview_image: Object.assign(Object.assign({}, media.preview_image), { position: index + 1 }) });
        });
        // Setup product images from product media
        if (product.images == null) {
            product.images = product.media.filter((m) => m.media_type === 'image').map((m) => m.preview_image);
        }
        // Setup product featured media and featured image
        if (product.media.length > 0) {
            if (product.featured_media == null) {
                product.featured_media = product.media[0];
            }
            if (product.featured_image == null) {
                product.featured_image = product.featured_media.preview_image;
            }
        }
        // Set product handle if none set already
        if (product.url == null) {
            product.url = `/products/${product.handle || 'my-product'}`;
        }
        // Omit variants from product association to avoid infinite loop
        const productWithoutVariants = Object.assign(Object.assign({}, product), { variants: [], first_available_variant: null, selected_variant: null, selected_or_first_available_variant: null, options_with_values: product.options_with_values.map((option) => (Object.assign(Object.assign({}, option), { values: option.values.map((value) => (Object.assign(Object.assign({}, value), { variant: Object.assign(Object.assign({}, value.variant), { product: null }) }))) }))) });
        // Ensure all product variants have a reference to the product without an infinite loop
        product.variants.forEach((variant) => {
            variant.product = productWithoutVariants;
        });
        if (product.first_available_variant) {
            product.first_available_variant.product = productWithoutVariants;
        }
        if (product.selected_variant) {
            product.selected_variant.product = productWithoutVariants;
        }
        if (product.selected_or_first_available_variant) {
            product.selected_or_first_available_variant.product = productWithoutVariants;
        }
    });
    return {
        id: sequence,
        available: true,
        collections: [], // unknown[] type, so using an empty array
        compare_at_price: null,
        compare_at_price_max: null,
        compare_at_price_min: null,
        compare_at_price_varies: false,
        content: 'Product content here',
        created_at: '2023-01-01T00:00:00Z',
        description: 'Product description here',
        title: `My Product`,
        featured_media: null,
        featured_image: null,
        get first_available_variant() {
            return this.variants.find((v) => v.available) || null;
        },
        'gift_card?': false,
        handle: `product-${sequence}`,
        get has_only_default_variant() {
            return this.options.length == 0 && this.variants.length == 1;
        },
        media: associations.media || null,
        images: null,
        metafields: {
            theme: {},
        },
        get options() {
            return this.options_with_values.map((o) => o.name);
        },
        get options_with_values() {
            return builtOptions;
        },
        get options_by_name() {
            return builtOptions.reduce((optionsByName, option) => (Object.assign(Object.assign({}, optionsByName), { [option.name]: option })), {});
        },
        price: null,
        price_max: null,
        price_min: null,
        price_varies: null,
        published_at: '2023-01-01T00:00:00Z',
        requires_selling_plan: false,
        selected_or_first_available_selling_plan_allocation: null,
        get selected_or_first_available_variant() {
            return this.selected_variant || this.first_available_variant || null;
        },
        selected_selling_plan: null,
        selected_selling_plan_allocation: null,
        get selected_variant() {
            return this.variants.find((v) => v.selected) || null;
        },
        selling_plan_groups: [],
        tags: ['tag1', 'tag2'],
        template_suffix: '',
        url: null,
        type: 'Apparel',
        variants: associations.variants || builtVariants || productVariantFactory.build(),
        vendor: 'ExampleVendor',
    };
});
export { productFactory };
