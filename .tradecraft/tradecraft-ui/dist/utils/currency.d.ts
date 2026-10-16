/**
 * Formats a number as currency based on locale and currency settings.
 * Supports displaying currency symbol, code, or name. Allows optional rounding and customization of display.
 * Utilizes the Intl.NumberFormat API to manage currency formatting complexities, providing better consistency
 * across different markets, locales, and currencies, in contrast to Shopify's Liquid limitations.
 *
 * Expects the following code in theme.liquid:
 *  window.theme.currency: {
 *    currencyCode: '{{ cart.currency.iso_code }}',
 *    locale:  '{{ request.locale.iso_code }}'
 *  };
 *  window.theme.translations: {
 *    other: {
 *      free: {{ 'other.free' | t | json }},
 *    }
 *  };
 *
 *
 * Using money_with_trailing_zeros with CurrencyFormat={rounded: true | false | undefined}
 * - true matches `money | rounded`
 * - undefined matches `money_without_trailing_zeros`
 * - false matches `money`
 *
 * References:
 * - ISO 4217 currency codes via Unicode CLDR for currency translation.
 * - Uses browser’s Intl.NumberFormat for better handling across locales, removing Liquid inconsistencies.
 */
export type CurrencyFormat = {
    currency?: string;
    locale?: string;
    rounded?: boolean;
    form?: 'explicit' | 'short';
    legacyFormat?: string;
};
export declare function formatCurrency(amount: number | null | undefined, format?: CurrencyFormat): string;
/**
 * Deprecated liquid Currency Helpers
 * -----------------------------------------------------------------------------
 * Based on @shopify/theme-currency but updated with new liquid currency options.
 * This function should be phased out in favor of the new `formatCurrency`.
 */
export declare function formatCurrencyLegacy(amount: number, format: CurrencyFormat): string;
/**
 * Calculates currency for rate
 * -----------------------------------------------------------------------------
 */
export declare function convertCurrency(amount: number | null | undefined, rate?: number): number;
