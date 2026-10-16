import { Factory } from 'fishery';
import { productOptionValueFactory } from './product-option-value';
export const productOptionFactory = Factory.define(({ sequence, associations }) => ({
    name: 'Size',
    position: sequence,
    selected_value: productOptionValueFactory.build({
        name: 'Small',
        selected: true,
    }),
    values: associations.values || [
        productOptionValueFactory.build({
            name: 'Small',
            selected: true,
        }),
        productOptionValueFactory.build({
            name: 'Medium',
        }),
        productOptionValueFactory.build({
            name: 'Large',
        }),
    ],
}));
