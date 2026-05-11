export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export function formatDate(value?: string) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: value.includes('T') ? 'short' : undefined
  }).format(new Date(value));
}
