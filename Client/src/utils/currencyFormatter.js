export const formatCurrency = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatCurrencyWithoutSymbol = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 2
  }).format(amount);
};