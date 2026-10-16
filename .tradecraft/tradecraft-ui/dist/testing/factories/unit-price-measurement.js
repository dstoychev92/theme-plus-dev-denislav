import { Factory } from 'fishery';
export const unitPriceMeasurementFactory = Factory.define(() => ({
    measured_type: 'weight', // other options: 'volume', 'dimension'
    quantity_value: 500,
    quantity_unit: 'g', // depends on measured_type, e.g., 'ml' for volume, 'cm' for dimension
    reference_value: 1000,
    reference_unit: 'g',
}));
