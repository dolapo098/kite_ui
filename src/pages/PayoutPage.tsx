import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  getMarkPayoutFailedErrorMessage,
  useMarkPayoutFailedMutation,
} from "../hooks/useMarkPayoutFailedMutation";
import {
  getPayoutErrorMessage,
  usePayoutMutation,
} from "../hooks/usePayoutMutation";
import type {
  AdminMarkPayoutFailedResponse,
  PayoutRequest,
  PayoutResponse,
} from "../types";
import {
  validateAdminMarkPayoutFailedForm,
  type AdminMarkPayoutFailedFormErrors,
} from "../utils/adminMarkPayoutFailedValidation";
import { formatBalanceCentsForDisplay } from "../utils/formatBalance";
import type { PayoutFormErrors } from "../utils/payoutValidation";
import { validatePayoutForm } from "../utils/payoutValidation";

/** Snapshot from the last successful create on this page (for admin context). */
type LastCreatedPayoutSnapshot = {
  payout_id: string;
  account_name: string;
  account_number: string;
  bank_code: string;
  source_currency_code: string;
  amount_in_cents: number;
};

export function PayoutPage() {
  const payoutMutation = usePayoutMutation();
  const markFailedMutation = useMarkPayoutFailedMutation();

  const [sourceCurrencyCode, setSourceCurrencyCode] = useState("NGN");
  const [amountInCentsInput, setAmountInCentsInput] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const [reference, setReference] = useState<string>(() => crypto.randomUUID());
  const [errors, setErrors] = useState<PayoutFormErrors>({});
  const [successData, setSuccessData] = useState<PayoutResponse | null>(null);

  const [adminFailureReasonInput, setAdminFailureReasonInput] = useState("");
  const [adminErrors, setAdminErrors] =
    useState<AdminMarkPayoutFailedFormErrors>({});
  const [adminSuccessData, setAdminSuccessData] =
    useState<AdminMarkPayoutFailedResponse | null>(null);
  const [lastCreatedPayoutSnapshot, setLastCreatedPayoutSnapshot] =
    useState<LastCreatedPayoutSnapshot | null>(null);
  const [confirmReverseLastPayout, setConfirmReverseLastPayout] =
    useState(false);

  function clearFieldError(field: keyof PayoutFormErrors): void {
    setErrors((previousState) => ({ ...previousState, [field]: undefined }));
  }

  function clearAdminFieldError(
    field: keyof AdminMarkPayoutFailedFormErrors,
  ): void {
    setAdminErrors((previousState) => ({
      ...previousState,
      [field]: undefined,
    }));
  }

  function handleSourceCurrencyChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    setSourceCurrencyCode(event.target.value);
    clearFieldError("source_currency_code");
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
    setAmountInCentsInput(event.target.value);
    clearFieldError("amount_in_cents");
  }

  function handleAccountNumberChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
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

  function handleAdminFailureReasonChange(
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void {
    setAdminFailureReasonInput(event.target.value);
    clearAdminFieldError("failure_reason");
  }

  function handlePayoutSuccess(
    data: PayoutResponse,
    createPayload: PayoutRequest,
  ): void {
    setLastCreatedPayoutSnapshot({
      payout_id: data.payout_id,
      account_name: createPayload.account_name,
      account_number: createPayload.account_number,
      bank_code: createPayload.bank_code,
      source_currency_code: createPayload.source_currency_code,
      amount_in_cents: createPayload.amount_in_cents,
    });
    setSuccessData(data);
    setAmountInCentsInput("");
    setAccountNumber("");
    setBankCode("");
    setAccountName("");
    setReference(crypto.randomUUID());
    setConfirmReverseLastPayout(false);
  }

  function handleMarkFailedSuccess(data: AdminMarkPayoutFailedResponse): void {
    setAdminSuccessData(data);
    setAdminFailureReasonInput("");
    setLastCreatedPayoutSnapshot(null);
    setConfirmReverseLastPayout(false);
  }

  function handleConfirmReverseYes(): void {
    setAdminSuccessData(null);
    setAdminErrors({});
    markFailedMutation.reset();
    setConfirmReverseLastPayout(true);
  }

  function handleConfirmReverseNo(): void {
    setConfirmReverseLastPayout(false);
    setAdminFailureReasonInput("");
    setAdminErrors({});
    markFailedMutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSuccessData(null);

    const validationErrors = validatePayoutForm(
      sourceCurrencyCode,
      amountInCentsInput,
      accountNumber,
      bankCode,
      accountName,
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const payload: PayoutRequest = {
        source_currency_code: sourceCurrencyCode.trim().toUpperCase(),
        amount_in_cents: Number(amountInCentsInput),
        account_number: accountNumber.trim(),
        bank_code: bankCode.trim(),
        account_name: accountName.trim(),
        reference: reference.trim(),
      };
      payoutMutation.mutate(payload, {
        onSuccess: (responseData) => handlePayoutSuccess(responseData, payload),
      });
    }
  }

  function handleAdminSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setAdminSuccessData(null);

    const payoutIdForAdmin = lastCreatedPayoutSnapshot?.payout_id ?? "";
    const validationErrors = validateAdminMarkPayoutFailedForm(
      payoutIdForAdmin,
      adminFailureReasonInput,
    );
    setAdminErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      markFailedMutation.mutate(
        {
          payoutId: payoutIdForAdmin,
          failureReason: adminFailureReasonInput,
        },
        { onSuccess: handleMarkFailedSuccess },
      );
    }
  }

  const showPayoutMutationError = payoutMutation.isError;
  const payoutSuccessMessage =
    successData !== null
      ? `${successData.message} (${successData.status})`
      : null;
  const showPayoutSuccess = payoutSuccessMessage !== null;

  const showAdminMutationError = markFailedMutation.isError;
  const adminSuccessMessage =
    adminSuccessData !== null
      ? `${adminSuccessData.message} (${adminSuccessData.status})`
      : null;
  const showAdminSuccess = adminSuccessMessage !== null;

  return (
    <div className='page'>
      <header className='page-header'>
        <h3>Payout</h3>
        <p>
          Create a payout to a bank account. Operators can mark a successful
          payout failed (ledger reversal) using the admin tool on the right.
        </p>
      </header>

      <div className='split-grid'>
        <article className='card form-card'>
          <p className='card-label'>Create payout</p>
          <form className='auth-form' onSubmit={handleSubmit} noValidate>
            <label className='field'>
              <span>Source Currency</span>
              <select
                value={sourceCurrencyCode}
                onChange={handleSourceCurrencyChange}
              >
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
              <span>Amount (in cents)</span>
              <input
                type='number'
                placeholder='e.g. 5000'
                min='1'
                step='1'
                value={amountInCentsInput}
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
              <p className='error-text'>
                {getPayoutErrorMessage(payoutMutation.error)}
              </p>
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

        <article className='card form-card'>
          <p className='card-label'>Admin: mark payout failed</p>
          <p className='muted'>
            Only when the payout is currently successful. Same session as the
            rest of the app.
          </p>

          {lastCreatedPayoutSnapshot !== null ? (
            <div className='payout-admin-context'>
              <p className='payout-admin-context-title'>
                Last payout created here
              </p>
              <p className='payout-admin-context-detail'>
                <strong>{lastCreatedPayoutSnapshot.account_name}</strong>
                {" · "}
                account {lastCreatedPayoutSnapshot.account_number}
                {" · "}
                bank {lastCreatedPayoutSnapshot.bank_code}
                {" · "}
                {formatBalanceCentsForDisplay(
                  lastCreatedPayoutSnapshot.amount_in_cents,
                  lastCreatedPayoutSnapshot.source_currency_code,
                )}
              </p>
              <p className='payout-admin-context-foot'>
                Use only when this payout is successful, and you need a ledger
                reversal.
              </p>
            </div>
          ) : null}

          {lastCreatedPayoutSnapshot === null ? (
            <p className='field-hint'>
              Create a payout successfully on the left first. You will be asked
              to confirm before marking it failed.
            </p>
          ) : null}

          {lastCreatedPayoutSnapshot !== null && !confirmReverseLastPayout ? (
            <div className='payout-admin-confirm'>
              <p className='payout-admin-confirm-question'>
                Would you like to reverse the last payout to account{" "}
                <strong>{lastCreatedPayoutSnapshot.account_number}</strong> for{" "}
                <strong>{lastCreatedPayoutSnapshot.account_name}</strong>?
              </p>
              <div className='admin-confirm-actions'>
                <button
                  type='button'
                  className='primary-btn'
                  onClick={handleConfirmReverseYes}
                >
                  Yes
                </button>
                <button
                  type='button'
                  className='ghost-btn'
                  onClick={handleConfirmReverseNo}
                >
                  No
                </button>
              </div>
            </div>
          ) : null}

          {lastCreatedPayoutSnapshot !== null && confirmReverseLastPayout ? (
            <form className='auth-form' onSubmit={handleAdminSubmit} noValidate>
              {adminErrors.payout_id ? (
                <p className='error-text'>{adminErrors.payout_id}</p>
              ) : null}

              <label className='field'>
                <span>Failure reason</span>
                <textarea
                  rows={3}
                  placeholder='e.g. Beneficiary bank returned NIP reversal'
                  value={adminFailureReasonInput}
                  onChange={handleAdminFailureReasonChange}
                  aria-invalid={Boolean(adminErrors.failure_reason)}
                />
                {adminErrors.failure_reason ? (
                  <p className='error-text'>{adminErrors.failure_reason}</p>
                ) : null}
              </label>

              {showAdminMutationError ? (
                <p className='error-text'>
                  {getMarkPayoutFailedErrorMessage(markFailedMutation.error)}
                </p>
              ) : null}

              <div className='admin-confirm-actions'>
                <button
                  type='submit'
                  className='primary-btn'
                  disabled={markFailedMutation.isPending}
                >
                  {markFailedMutation.isPending
                    ? "Updating…"
                    : "Mark payout failed"}
                </button>
                <button
                  type='button'
                  className='ghost-btn'
                  disabled={markFailedMutation.isPending}
                  onClick={handleConfirmReverseNo}
                >
                  Back
                </button>
              </div>
            </form>
          ) : null}

          {showAdminSuccess ? (
            <p className='success-text'>{adminSuccessMessage}</p>
          ) : null}
        </article>
      </div>
    </div>
  );
}
