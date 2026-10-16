import { Factory } from 'fishery';
import { Product, ProductOptionValue } from '../../types';
type OptionsParamValue = string | Partial<ProductOptionValue>;
type OptionsParam = Record<string, OptionsParamValue[]>;
type OptionPriceRulesParam = Record<string, number>;
export type ProductFactoryTransientParams = {
    /**
     * Options to generate product variants and options from
     *
     * @example
     *
     * {
     *   size: ['Small', 'Medium', 'Large'],
     *   color: ['Red', 'Blue']
     * }
     */
    options: OptionsParam;
    /**
     * Rules to set variant prices based on option values
     *
     * @example
     *
     * {
     *   // Match any variant with 'Small' option value
     *   'Small': 1999,
     *
     *   // Match any variant with 'Small' option value
     *   'Small,*': 1999,
     *
     *   // Match any variant with 'Blue' option value (wildcard for first option)
     *   '*,Blue': 2999,
     *
     *   // Match only the Small, Blue variant
     *   'Small,Blue': 3999,
     * }
     */
    optionPriceRules: OptionPriceRulesParam;
    /**
     * Selected options to set the selected variant
     *
     * @example
     *
     * ['Small', 'Blue']
     */
    selectedOptions: string[];
};
declare const productFactory: Factory<Product, ProductFactoryTransientParams, Product, import("fishery").DeepPartialObject<Product>>;
export { productFactory };
