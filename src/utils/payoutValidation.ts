export interface PayoutFormErrors {
  source_currency_code?: string;
  amount_in_cents?: string;
  account_number?: string;
  bank_code?: string;
  account_name?: string;
}

export function validatePayoutForm(
  sourceCurrencyCode: string,
  amountInput: string,
  accountNumber: string,
  bankCode: string,
  accountName: string,
): PayoutFormErrors {
  const errors: PayoutFormErrors = {};

  if (!sourceCurrencyCode.trim()) {
    errors.source_currency_code = "Source currency is required";
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

  if (!accountNumber.trim()) {
    errors.account_number = "Account number is required";
  }

  if (!bankCode.trim()) {
    errors.bank_code = "Bank code is required";
  }

  if (!accountName.trim()) {
    errors.account_name = "Account name is required";
  }

  return errors;
}
