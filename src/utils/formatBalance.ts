export function formatBalanceCentsForDisplay(balanceCents: number, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).format(balanceCents / 100);
}
