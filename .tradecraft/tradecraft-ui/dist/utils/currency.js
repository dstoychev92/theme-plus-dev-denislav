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
export function formatCurrency(amount, format = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // Set up defaults
    let defaultCurrency = 'USD'; // Fallback if nothing is available
    let defaultLocale = 'en-US'; // Fallback if locale isn't provided
    let defaultFreeTranslation;
    // Retrieve defaults from theme/Shopify if present
    if (typeof window !== 'undefined') {
        defaultCurrency = ((_b = (_a = window.theme) === null || _a === void 0 ? void 0 : _a.currency) === null || _b === void 0 ? void 0 : _b.currencyCode) || ((_d = (_c = window.Shopify) === null || _c === void 0 ? void 0 : _c.currency) === null || _d === void 0 ? void 0 : _d.active) || defaultCurrency;
        defaultLocale = ((_f = (_e = window.theme) === null || _e === void 0 ? void 0 : _e.currency) === null || _f === void 0 ? void 0 : _f.locale) || ((_g = window.Shopify) === null || _g === void 0 ? void 0 : _g.locale) || defaultLocale;
        defaultFreeTranslation = (_k = (_j = (_h = window.theme) === null || _h === void 0 ? void 0 : _h.translations) === null || _j === void 0 ? void 0 : _j.other) === null || _k === void 0 ? void 0 : _k.free;
    }
    // Destructure format options, applying defaults
    const { form = 'short', rounded, currency = defaultCurrency, locale = defaultLocale, legacyFormat } = format;
    // Handle null, undefined, or NaN amount
    if (amount == null || isNaN(amount)) {
        return 'x.xx'; // Fallback to generic price with no language context
    }
    // Handle 'Free' case or zero
    if (amount === 0 && form === 'short' && rounded === true && defaultFreeTranslation) {
        return defaultFreeTranslation;
    }
    // Liquid returns cents for all currencies including YEN
    const amountInDollars = amount / 100;
    // Use legacy formatting if specified
    let amountWithSymbol;
    if (legacyFormat) {
        amountWithSymbol = formatCurrencyLegacy(amountInDollars, {
            currency,
            legacyFormat,
            rounded: format.rounded,
        });
    }
    else {
        amountWithSymbol = formatCurrencyNew(amountInDollars, { currency, locale, rounded: format.rounded });
    }
    // Append currency code if explicit form is specified
    const codeString = form === 'explicit' ? ` ${currency}` : '';
    return `${amountWithSymbol}${codeString}`;
}
function formatCurrencyNew(amount, format) {
    // Configure Intl.NumberFormat options
    const options = {
        style: 'currency',
        currency: format.currency,
        currencyDisplay: 'symbol', // Default to symbol for short form
    };
    // Adjust fraction digits based on the amount and rounding option
    if (format.rounded) {
        options.maximumFractionDigits = 0;
    }
    // Use Intl.NumberFormat to format the currency
    let price = new Intl.NumberFormat(format.locale, options).format(amount);
    // Remove decimals if they are zeros and rounding is not specified
    if (typeof format.rounded === 'undefined') {
        // ([.,]00) – matches “.00” or “,00”
        // (?=\D*$) – ensures that only non-digits follow the decimals”
        price = price.replace(/([.,]00)(?=\D*$)/g, '');
    }
    return price;
}
/**
 * Deprecated liquid Currency Helpers
 * -----------------------------------------------------------------------------
 * Based on @shopify/theme-currency but updated with new liquid currency options.
 * This function should be phased out in favor of the new `formatCurrency`.
 */
export function formatCurrencyLegacy(amount, format) {
    var _a;
    // Destructure format options, applying defaults
    const legacyFormat = (_a = format.legacyFormat) !== null && _a !== void 0 ? _a : '${{amount}}';
    let precision = 2;
    if (format.rounded)
        precision = 0;
    // Helper to format numbers with thousands and decimal separators
    const formatWithDelimiters = (number, precision = 2, thousands = ',', decimal = '.') => {
        if (isNaN(number) || number == null) {
            return '0';
        }
        number = parseFloat(number.toFixed(precision));
        const parts = number.toFixed(precision).split('.');
        const dollarsAmount = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousands}`); // regex adds a ',' for thousands(every 3 digits - 1,234,567)
        const centsAmount = parts[1] ? decimal + parts[1] : '';
        return dollarsAmount + centsAmount;
    };
    // Regex for extracting liquid format placeholder - {{ something }}
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const match = legacyFormat.match(placeholderRegex);
    let formattedValue = '';
    if (match) {
        // Handle different liquid-like formats
        switch (match[1]) {
            case 'amount':
                formattedValue = formatWithDelimiters(amount, precision);
                break;
            case 'amount_no_decimals':
                formattedValue = formatWithDelimiters(amount, precision);
                break;
            case 'amount_with_comma_separator':
                formattedValue = formatWithDelimiters(amount, precision, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                formattedValue = formatWithDelimiters(amount, precision, '.', ',');
                break;
            case 'amount_with_apostrophe_separator':
                formattedValue = formatWithDelimiters(amount, precision, "'", '.');
                break;
            case 'amount_no_decimals_with_space_separator':
                formattedValue = formatWithDelimiters(amount, precision, ' ');
                break;
            case 'amount_with_space_separator':
                formattedValue = formatWithDelimiters(amount, precision, ' ', ',');
                break;
            case 'amount_with_period_and_space_separator':
                formattedValue = formatWithDelimiters(amount, precision, ' ', '.');
                break;
            default:
                throw new Error(`Unknown format type: ${match[1]}`);
        }
        // Replace the placeholder in format string with the formatted value
        formattedValue = legacyFormat.replace(placeholderRegex, formattedValue);
        // Remove decimals if they are zeros and rounding is not specified
        if (typeof format.rounded === 'undefined' && legacyFormat.includes('no_decimals')) {
            // ([.,]00) – matches “.00” or “,00”
            // (?=\D*$) – ensures that only non-digits follow the decimals”
            formattedValue = formattedValue.replace(/([.,]00)(?=\D*$)/g, '');
        }
    }
    // Append currency if provided
    return formattedValue;
}
/**
 * Calculates currency for rate
 * -----------------------------------------------------------------------------
 */
export function convertCurrency(amount, rate) {
    var _a, _b;
    const currencyRate = rate || ((_b = (_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.currency) === null || _b === void 0 ? void 0 : _b.rate) || 1;
    // Handle null, undefined, or NaN amount
    if (amount == null || isNaN(amount)) {
        amount = 0;
    }
    return amount * currencyRate;
}
