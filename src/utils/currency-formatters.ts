export const toCOPCurrency = Intl.NumberFormat('es', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
}).format;
