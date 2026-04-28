export interface AuthFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface DepositFormErrors {
  currency_code?: string;
  amount_in_cents?: string;
}

export interface PayoutFormErrors {
  source_currency_code?: string;
  amount_in_cents?: string;
  account_number?: string;
  bank_code?: string;
  account_name?: string;
}

export interface ConversionFormErrors {
  source_currency_code?: string;
  target_currency_code?: string;
  amount_in_cents?: string;
}

export function validateEmail(email: string): string | null {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return "Enter a valid email address";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required";
  }
  if (!password.trim()) {
    return "Password cannot be empty";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
}

export function validateLoginForm(email: string, password: string): AuthFormErrors {
  const errors: AuthFormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateSignupForm(
  email: string,
  password: string,
  confirmPassword: string,
): AuthFormErrors {
  const errors = validateLoginForm(email, password);

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validateDepositForm(
  currencyCode: string,
  amountInput: string,
): DepositFormErrors {
  const errors: DepositFormErrors = {};

  if (!currencyCode.trim()) {
    errors.currency_code = "Currency is required";
  }

  if (!amountInput.trim()) {
    errors.amount_in_cents = "Amount is required";
  } else {
    const amountMajorValue = Number(amountInput.trim().replace(/,/g, ""));
    if (!Number.isFinite(amountMajorValue) || amountMajorValue <= 0) {
      errors.amount_in_cents = "Amount must be greater than 0";
    }
  }

  return errors;
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
    const amountMajorValue = Number(amountInput.trim().replace(/,/g, ""));
    if (!Number.isFinite(amountMajorValue) || amountMajorValue <= 0) {
      errors.amount_in_cents = "Amount must be greater than 0";
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
    const amountMajorValue = Number(amountInput.trim().replace(/,/g, ""));
    if (!Number.isFinite(amountMajorValue) || amountMajorValue <= 0) {
      errors.amount_in_cents = "Amount must be greater than 0";
    }
  }

  return errors;
}
