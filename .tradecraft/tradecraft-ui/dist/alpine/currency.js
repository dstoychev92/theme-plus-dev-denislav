import { formatCurrency, convertCurrency } from '../utils/currency';
export default function (Alpine) {
    Alpine.magic('formatCurrency', () => {
        return formatCurrency;
    });
    Alpine.magic('convertCurrency', () => {
        return convertCurrency;
    });
}
