export interface DepositFormErrors {
  currency_code?: string;
  amount_in_cents?: string;
}

export function validateDepositForm(currencyCode: string, amountInput: string): DepositFormErrors {
  const errors: DepositFormErrors = {};

  if (!currencyCode.trim()) {
    errors.currency_code = "Currency is required";
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
