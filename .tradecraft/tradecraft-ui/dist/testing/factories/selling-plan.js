import { Factory } from 'fishery';
export const sellingPlanFactory = Factory.define(() => ({
    checkout_charge: {
        value: 100,
        value_type: 'percentage',
    },
    description: 'Test Description',
    group_id: 'test_group',
    id: 1,
    name: 'Test Selling Plan',
    options: sellingPlanOptionFactory.buildList(2),
    price_adjustments: sellingPlanPriceAdjustmentFactory.buildList(2),
    recurring_deliveries: true,
    selected: false,
}));
export const sellingPlanPriceAdjustmentFactory = Factory.define(() => ({
    order_count: 0,
    position: 1,
    value: 100,
    value_type: 'percentage',
}));
export const sellingPlanGroupFactory = Factory.define(() => ({
    app_id: 'test_app',
    id: 'test_group',
    name: 'Test Selling Plan Group',
    options: sellingPlanOptionFactory.buildList(2),
    selling_plan_selected: false,
    selling_plans: sellingPlanFactory.buildList(2),
}));
export const sellingPlanOptionFactory = Factory.define(() => ({
    name: 'Test Selling Plan Option',
    position: 1,
    selected_value: null,
    values: [],
}));
export const sellingPlanCheckoutChargeFactory = Factory.define(() => ({
    value: 100,
    value_type: 'percentage',
}));
export const sellingPlanAllocationFactory = Factory.define(() => ({
    checkout_charge_amount: '100',
    compare_at_price: '100',
    per_delivery_price: '100',
    price: '100',
    price_adjustments: sellingPlanPriceAdjustmentFactory.buildList(2),
    remaining_balance_charge_amount: '100',
    selling_plan: sellingPlanFactory.build(),
    selling_plan_group_id: 'test_group',
    unit_price: 100,
}));
