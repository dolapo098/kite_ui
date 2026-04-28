import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { getPayoutErrorMessage, usePayoutMutation } from "../hooks/usePayoutMutation";
import type { PayoutRequest, PayoutResponse } from "../types";
import type { PayoutFormErrors } from "../utils/validation";
import { validatePayoutForm } from "../utils/validation";

export function PayoutPage() {
  const payoutMutation = usePayoutMutation();

  const [sourceCurrencyCode, setSourceCurrencyCode] = useState("NGN");
  const [amountMajorInput, setAmountMajorInput] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [reference, setReference] = useState<string>(() => crypto.randomUUID());
  const [errors, setErrors] = useState<PayoutFormErrors>({});
  const [successData, setSuccessData] = useState<PayoutResponse | null>(null);

  function clearFieldError(field: keyof PayoutFormErrors): void {
    setErrors((previousState) => ({ ...previousState, [field]: undefined }));
  }

  function handleSourceCurrencyChange(event: ChangeEvent<HTMLSelectElement>): void {
    setSourceCurrencyCode(event.target.value);
    clearFieldError("source_currency_code");
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
    setAmountMajorInput(event.target.value);
    clearFieldError("amount_in_cents");
  }

  function handleAccountNumberChange(event: ChangeEvent<HTMLInputElement>): void {
    setAccountNumber(event.target.value);
    clearFieldError("account_number");
  }

  function handleBankCodeChange(event: ChangeEvent<HTMLInputElement>): void {
    setBankCode(event.target.value);
    clearFieldError("bank_code");
  }

  function handleAccountNameChange(event: ChangeEvent<HTMLInputElement>): void {
    setAccountName(event.target.value);
    clearFieldError("account_name");
  }

  function handlePayoutSuccess(data: PayoutResponse): void {
    setSuccessData(data);
    setAmountMajorInput("");
    setAccountNumber("");
    setBankCode("");
    setAccountName("");
    setReference(crypto.randomUUID());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSuccessData(null);

    const validationErrors = validatePayoutForm(
      sourceCurrencyCode,
      amountMajorInput,
      accountNumber,
      bankCode,
      accountName,
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const payload: PayoutRequest = {
        source_currency_code: sourceCurrencyCode.trim().toUpperCase(),
        amount: amountMajorInput.trim(),
        account_number: accountNumber.trim(),
        bank_code: bankCode.trim(),
        account_name: accountName.trim(),
        reference: reference.trim(),
      };
      payoutMutation.mutate(payload, {
        onSuccess: handlePayoutSuccess,
      });
    }
  }

  const showPayoutMutationError = payoutMutation.isError;
  const payoutSuccessMessage =
    successData !== null
      ? `${successData.message} (${successData.status})`
      : null;
  const showPayoutSuccess = payoutSuccessMessage !== null;

  return (
    <div className='page'>
      <header className='page-header'>
        <h3>Payout</h3>
        <p>Create a payout to a bank account.</p>
      </header>

      <article className='card form-card'>
        <form className='auth-form' onSubmit={handleSubmit} noValidate>
          <label className='field'>
            <span>Source Currency</span>
            <select value={sourceCurrencyCode} onChange={handleSourceCurrencyChange}>
              <option value='NGN'>NGN</option>
              <option value='KES'>KES</option>
              <option value='USD'>USD</option>
              <option value='GBP'>GBP</option>
              <option value='EUR'>EUR</option>
            </select>
            {errors.source_currency_code ? (
              <p className='error-text'>{errors.source_currency_code}</p>
            ) : null}
          </label>

          <label className='field'>
            <span>Amount ({sourceCurrencyCode})</span>
            <input
              type='number'
              placeholder='e.g. 5000.00'
              min='0.01'
              step='0.01'
              value={amountMajorInput}
              onChange={handleAmountChange}
              aria-invalid={Boolean(errors.amount_in_cents)}
            />
            {errors.amount_in_cents ? (
              <p className='error-text'>{errors.amount_in_cents}</p>
            ) : null}
          </label>

          <label className='field'>
            <span>Account Number</span>
            <input
              type='text'
              placeholder='0123456789'
              value={accountNumber}
              onChange={handleAccountNumberChange}
              aria-invalid={Boolean(errors.account_number)}
            />
            {errors.account_number ? (
              <p className='error-text'>{errors.account_number}</p>
            ) : null}
          </label>

          <label className='field'>
            <span>Bank Code</span>
            <input
              type='text'
              placeholder='Bank code'
              value={bankCode}
              onChange={handleBankCodeChange}
              aria-invalid={Boolean(errors.bank_code)}
            />
            {errors.bank_code ? (
              <p className='error-text'>{errors.bank_code}</p>
            ) : null}
          </label>

          <label className='field'>
            <span>Account Name</span>
            <input
              type='text'
              placeholder='Recipient full name'
              value={accountName}
              onChange={handleAccountNameChange}
              aria-invalid={Boolean(errors.account_name)}
            />
            {errors.account_name ? (
              <p className='error-text'>{errors.account_name}</p>
            ) : null}
          </label>

          {showPayoutMutationError ? (
            <p className='error-text'>{getPayoutErrorMessage(payoutMutation.error)}</p>
          ) : null}

          {showPayoutSuccess ? (
            <p className='success-text'>{payoutSuccessMessage}</p>
          ) : null}

          <button
            type='submit'
            className='primary-btn'
            disabled={payoutMutation.isPending}
          >
            {payoutMutation.isPending ? "Processing..." : "Submit Payout"}
          </button>
        </form>
      </article>
    </div>
  );
}
