import { Alpine as AlpineType } from 'alpinejs';
import { formatCurrency, convertCurrency } from '../utils/currency';
/**
 * Magics for money formatting in the browser.
 *
 * - $formatCurrency(amount, format?) - Formats an amount in cents as a money string via
 *   Intl.NumberFormat. Defaults for currency and locale come from window.theme.currency,
 *   then window.Shopify.currency.
 * - $convertCurrency(amount, rate?) - Multiplies an amount by a currency rate
 *   (default window.Shopify.currency.rate, the rate for the presented currency).
 *
 * Format options and edge cases live in utils/currency.ts, next to the formatters.
 *
 * @example
 * <span x-text="$formatCurrency(1999)"></span>
 * <span x-text="$formatCurrency(1999, {rounded: true, form: 'explicit'})"></span>
 */
declare module 'alpinejs' {
    interface Magics<T> {
        /** Formats cents with the theme's Liquid money format. */
        $formatCurrency: typeof formatCurrency;
        /** Converts an amount with the supplied rate, or the presented currency rate by default. */
        $convertCurrency: typeof convertCurrency;
    }
}
export default function (Alpine: AlpineType): void;
