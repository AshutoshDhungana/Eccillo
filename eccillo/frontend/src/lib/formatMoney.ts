export function formatMoney(amount_minor: number, currency = "NPR"): string {
  const amount = amount_minor / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMoneyShort(amount_minor: number, currency = "NPR"): string {
  const amount = amount_minor / 100;
  if (amount >= 100000) return `${currency} ${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${currency} ${(amount / 1000).toFixed(0)}K`;
  return `${currency} ${amount.toFixed(0)}`;
}
