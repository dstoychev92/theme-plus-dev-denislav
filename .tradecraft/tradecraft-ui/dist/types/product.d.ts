import { ProductImage } from './product-image';
import { ProductMedia } from './product-media';
import { Metafield } from './metafield';
import { ProductVariant } from './product-variant';
export type ProductMetafields = {
    theme?: Record<string, Metafield<any, any>>;
};
export type ProductOption = {
    name: string;
    position: number;
    selected_value: ProductOptionValue | null;
    values: ProductOptionValue[];
};
export type ProductOptionValue = {
    available: boolean;
    id: number;
    name: string;
    product_url: string | null;
    selected: boolean;
    swatch: Swatch | null;
    variant: ProductVariant | null;
};
export type Swatch = {
    color?: Color;
    image?: ProductImage;
};
export type Color = {
    alpha: number;
    blue: number;
    green: number;
    hue: number;
    lightness: number;
    red: number;
    rgb: string;
    rgba: string;
    saturation: number;
};
export type SellingPlanAllocation = {
    checkout_charge_amount: string;
    compare_at_price: string;
    per_delivery_price: string;
    price: string;
    price_adjustments: SellingPlanPriceAdjustment[];
    remaining_balance_charge_amount: string;
    selling_plan: SellingPlan;
    selling_plan_group_id: string;
    unit_price: number | null;
};
export type SellingPlanGroup = {
    app_id: string;
    id: string;
    name: string;
    options: SellingPlanOption[];
    selling_plan_selected: boolean;
    selling_plans: SellingPlan[];
};
export type SellingPlanOption = {
    name: string;
    position: number;
    selected_value: string | null;
    values: string[];
};
export type SellingPlanCheckoutCharge = {
    value: number;
    value_type: 'percentage' | 'price';
};
export type SellingPlanPriceAdjustment = {
    value: number;
    value_type: 'percentage' | 'price';
    order_count: number | null;
    position: number;
};
export type SellingPlan = {
    checkout_charge: SellingPlanCheckoutCharge;
    description: string | null;
    group_id: string;
    id: number;
    name: string;
    options: SellingPlanOption[];
    price_adjustments: SellingPlanPriceAdjustment[];
    recurring_deliveries: boolean;
    selected: boolean;
};
export type ProductOptionsKeys = [
] | [key1: string] | [key1: string, key2: string] | [key1: string, key2: string, key3: string];
export type Product<TOptions extends ProductOptionsKeys = ProductOptionsKeys, TMetafields extends ProductMetafields = ProductMetafields> = {
    available: boolean;
    collections: unknown[];
    compare_at_price: number;
    compare_at_price_max: number;
    compare_at_price_min: number;
    compare_at_price_varies: boolean;
    content: string;
    created_at: string;
    description: string;
    featured_image: ProductImage;
    featured_media: ProductMedia;
    first_available_variant: ProductVariant | null;
    'gift_card?': boolean;
    handle: string;
    has_only_default_variant: boolean;
    id: number;
    images: ProductImage[];
    media: ProductMedia[];
    metafields: TMetafields;
    options: TOptions;
    options_by_name: Record<string, ProductOption>;
    options_with_values: ProductOption[];
    price: number;
    price_max: number;
    price_min: number;
    price_varies: boolean;
    published_at: string;
    requires_selling_plan: boolean;
    selected_or_first_available_selling_plan_allocation: SellingPlanAllocation | null;
    selected_or_first_available_variant: ProductVariant | null;
    selected_selling_plan: SellingPlan | null;
    selected_selling_plan_allocation: SellingPlanAllocation | null;
    selected_variant: ProductVariant | null;
    selling_plan_groups: SellingPlanGroup[];
    tags: string[];
    template_suffix: string;
    title: string;
    type: string;
    url: string;
    variants: ProductVariant[];
    vendor: string;
};
