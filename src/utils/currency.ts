export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', code: 'CHF' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
  TRY: { symbol: '₺', name: 'Turkish Lira', code: 'TRY' },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function formatCurrency(amount: number, currencyCode: CurrencyCode = 'USD'): string {
  const currency = CURRENCIES[currencyCode];
  
  if (!currency) {
    return `$${amount.toFixed(2)}`;
  }

  // For currencies that typically don't show decimals (like JPY)
  const decimals = currencyCode === 'JPY' ? 0 : 2;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function parseCurrency(value: string): number {
  // Remove currency symbols and spaces, then parse
  const cleanValue = value.replace(/[^\d.-]/g, '');
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

export function getCurrencySymbol(currencyCode: CurrencyCode): string {
  return CURRENCIES[currencyCode]?.symbol || '$';
}