import { CENTS_PER_MAJOR_CURRENCY_UNIT } from "../constants/money";

export function formatBalanceCentsForDisplay(balanceCents: number, currencyCode: string): string {
  const majorUnits = balanceCents / CENTS_PER_MAJOR_CURRENCY_UNIT;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).format(majorUnits);
}
