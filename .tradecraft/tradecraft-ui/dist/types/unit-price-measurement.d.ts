export type UnitPriceMeasurement = {
    measured_type: 'weight' | 'volume' | 'dimension';
    quantity_value: number;
    quantity_unit: string;
    reference_value: number | string;
    reference_unit: string;
};
