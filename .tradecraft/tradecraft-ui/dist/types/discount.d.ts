export type DiscountAllocation = {
    amount: string;
    discount_application: DiscountApplication;
};
export type DiscountApplication = {
    target_selection: string;
    target_type: string;
    title: string;
    total_allocated_amount: string;
    type: string;
    value: string;
    value_type: string;
};
