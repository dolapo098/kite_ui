import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { getDepositErrorMessage, useDepositMutation } from "../hooks/useDepositMutation";
import { validateDepositForm } from "../utils/depositValidation";
import type { DepositFormErrors } from "../utils/depositValidation";
import type { DepositResponse } from "../types";

export function DepositPage() {
  const depositMutation = useDepositMutation();
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [amountInCentsInput, setAmountInCentsInput] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => crypto.randomUUID());
  const [errors, setErrors] = useState<DepositFormErrors>({});
  const [successData, setSuccessData] = useState<DepositResponse | null>(null);

  function clearFieldError(field: keyof DepositFormErrors): void {
    setErrors((previousState) => ({ ...previousState, [field]: undefined }));
  }

  function handleCurrencyChange(event: ChangeEvent<HTMLSelectElement>): void {
    setCurrencyCode(event.target.value);
    clearFieldError("currency_code");
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
    setAmountInCentsInput(event.target.value);
    clearFieldError("amount_in_cents");
  }

  function handleDepositSuccess(data: DepositResponse): void {
    setSuccessData(data);
    setAmountInCentsInput("");
    setIdempotencyKey(crypto.randomUUID());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSuccessData(null);

    const validationErrors = validateDepositForm(currencyCode, amountInCentsInput);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      depositMutation.mutate(
        {
          currency_code: currencyCode.trim().toUpperCase(),
          amount_in_cents: Number(amountInCentsInput),
          idempotency_key: idempotencyKey.trim(),
        },
        { onSuccess: handleDepositSuccess },
      );
    }
  }

  const showDepositMutationError = depositMutation.isError;
  const depositSuccessMessage =
    successData !== null ? `${successData.message} (${successData.status})` : null;
  const showDepositSuccess = depositSuccessMessage !== null;

  return (
    <div className="page">
      <header className="page-header">
        <h3>Deposit</h3>
        <p>Simulate an inbound wallet funding event.</p>
      </header>

      <article className="card form-card">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Currency</span>
            <select value={currencyCode} onChange={handleCurrencyChange}>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
              <option value="NGN">NGN</option>
              <option value="KES">KES</option>
            </select>
            {errors.currency_code ? <p className="error-text">{errors.currency_code}</p> : null}
          </label>

          <label className="field">
            <span>Amount (in cents)</span>
            <input
              type="number"
              placeholder="e.g. 5000"
              min="1"
              step="1"
              value={amountInCentsInput}
              onChange={handleAmountChange}
              aria-invalid={Boolean(errors.amount_in_cents)}
            />
            {errors.amount_in_cents ? (
              <p className="error-text">{errors.amount_in_cents}</p>
            ) : null}
          </label>

          {showDepositMutationError ? (
            <p className="error-text">{getDepositErrorMessage(depositMutation.error)}</p>
          ) : null}

          {showDepositSuccess ? <p className="success-text">{depositSuccessMessage}</p> : null}

          <button type="submit" className="primary-btn" disabled={depositMutation.isPending}>
            {depositMutation.isPending ? "Processing..." : "Create Deposit"}
          </button>
        </form>
      </article>
    </div>
  );
}
