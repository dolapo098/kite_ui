export interface ConversionFormErrors {
  source_currency_code?: string;
  target_currency_code?: string;
  amount_in_cents?: string;
}

export function validateConversionQuoteForm(
  sourceCurrencyCode: string,
  targetCurrencyCode: string,
  amountInput: string,
): ConversionFormErrors {
  const errors: ConversionFormErrors = {};

  if (!sourceCurrencyCode.trim()) {
    errors.source_currency_code = "Source currency is required";
  }

  if (!targetCurrencyCode.trim()) {
    errors.target_currency_code = "Target currency is required";
  }

  if (
    sourceCurrencyCode.trim() &&
    targetCurrencyCode.trim() &&
    sourceCurrencyCode.trim().toUpperCase() === targetCurrencyCode.trim().toUpperCase()
  ) {
    errors.target_currency_code = "Target must differ from source";
  }

  if (!amountInput.trim()) {
    errors.amount_in_cents = "Amount is required";
  } else {
    const parsedAmount = Number(amountInput);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      errors.amount_in_cents = "Amount must be greater than 0";
    } else if (!Number.isInteger(parsedAmount)) {
      errors.amount_in_cents = "Amount must be an integer (in cents)";
    }
  }

  return errors;
}
