const FX_RATE_DISPLAY_MAX_FRACTION_DIGITS = 6;

export function formatFxRate(value: number): string {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: FX_RATE_DISPLAY_MAX_FRACTION_DIGITS,
  }).format(value);
}
