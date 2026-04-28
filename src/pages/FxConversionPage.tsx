import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TRANSACTIONS_QUERY_KEY_ROOT } from "../constants/transactions";
import {
  WALLET_BALANCES_QUERY_KEY_ROOT,
  WALLET_SUPPORTED_CURRENCIES,
} from "../constants/wallet";
import {
  getConversionExecuteErrorMessage,
  getConversionQuoteErrorMessage,
  useConversionExecuteMutation,
  useConversionQuoteMutation,
} from "../hooks/useConversionMutations";
import type {
  ConversionExecuteResponse,
  ConversionQuoteResponse,
} from "../types";
import { validateConversionQuoteForm } from "../utils/validation";
import type { ConversionFormErrors } from "../utils/validation";
import { formatConversionExecuteSuccessMessage } from "../utils/formatConversionExecute";
import { formatBalanceCentsForDisplay } from "../utils/formatBalance";
import { formatFxRate } from "../utils/formatFxRate";
import { formatTransactionDate } from "../utils/formatTransaction";

export function FxConversionPage() {
  const queryClient = useQueryClient();
  const quoteMutation = useConversionQuoteMutation();
  const executeMutation = useConversionExecuteMutation();

  const [sourceCurrencyCode, setSourceCurrencyCode] = useState("USD");
  const [targetCurrencyCode, setTargetCurrencyCode] = useState("NGN");
  const [amountMajorInput, setAmountMajorInput] = useState("");
  const [errors, setErrors] = useState<ConversionFormErrors>({});
  const [activeQuote, setActiveQuote] =
    useState<ConversionQuoteResponse | null>(null);
  const [executeSuccessData, setExecuteSuccessData] =
    useState<ConversionExecuteResponse | null>(null);
  const [, setExpiryTick] = useState(0);

  const isQuoteExpired =
    activeQuote !== null &&
    Date.now() >= new Date(activeQuote.expires_at).getTime();

  const executeSuccessMessage =
    executeSuccessData !== null
      ? formatConversionExecuteSuccessMessage(executeSuccessData)
      : null;
  const showExecuteSuccess = executeSuccessMessage !== null;

  const showQuoteMutationError = quoteMutation.isError;
  const showExecuteMutationError = executeMutation.isError;
  const showQuoteDetails = activeQuote !== null && !showExecuteSuccess;
  const showQuotePlaceholder = !showQuoteDetails && !showExecuteSuccess;
  const showExecuteButton = showQuoteDetails && !isQuoteExpired;

  useEffect(() => {
    if (!activeQuote) {
      return;
    }
    const intervalId = window.setInterval(() => {
      setExpiryTick((previous) => previous + 1);
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [activeQuote?.quote_id]);

  function clearFieldError(field: keyof ConversionFormErrors): void {
    setErrors((previousState) => ({ ...previousState, [field]: undefined }));
  }

  function handleSourceCurrencyChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    setSourceCurrencyCode(event.target.value);
    clearFieldError("source_currency_code");
    clearFieldError("target_currency_code");
  }

  function handleTargetCurrencyChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    setTargetCurrencyCode(event.target.value);
    clearFieldError("target_currency_code");
    clearFieldError("source_currency_code");
  }

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
    setAmountMajorInput(event.target.value);
    clearFieldError("amount_in_cents");
  }

  function handleQuoteSuccess(data: ConversionQuoteResponse): void {
    setActiveQuote(data);
    setExecuteSuccessData(null);
    executeMutation.reset();
  }

  function handleExecuteSuccess(data: ConversionExecuteResponse): void {
    setExecuteSuccessData(data);
    setActiveQuote(null);
    void queryClient.invalidateQueries({
      queryKey: [WALLET_BALANCES_QUERY_KEY_ROOT],
    });
    void queryClient.invalidateQueries({
      queryKey: [TRANSACTIONS_QUERY_KEY_ROOT],
    });
  }

  function handleQuoteSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setExecuteSuccessData(null);

    const validationErrors = validateConversionQuoteForm(
      sourceCurrencyCode,
      targetCurrencyCode,
      amountMajorInput,
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const amountMajorValue = Number(
        amountMajorInput.trim().replace(/,/g, ""),
      );
      if (!Number.isFinite(amountMajorValue) || amountMajorValue <= 0) {
        return;
      }
      quoteMutation.mutate(
        {
          source_currency_code: sourceCurrencyCode.trim().toUpperCase(),
          target_currency_code: targetCurrencyCode.trim().toUpperCase(),
          amount_in_cents: Math.round(
            (amountMajorValue + Number.EPSILON) * 100,
          ),
        },
        { onSuccess: handleQuoteSuccess },
      );
    }
  }

  function handleExecuteClick(): void {
    if (!activeQuote) {
      return;
    }
    executeMutation.mutate(
      { quote_id: activeQuote.quote_id },
      { onSuccess: handleExecuteSuccess },
    );
  }

  return (
    <div className='page'>
      <header className='page-header'>
        <h3>FX Conversion</h3>
        <p>
          Request a quote, review rates and expiry, then execute before the
          quote window closes.
        </p>
      </header>

      {showExecuteSuccess ? (
        <p className='success-text'>{executeSuccessMessage}</p>
      ) : null}

      <div className='split-grid'>
        <article className='card form-card'>
          <p className='card-label'>Step 1: Get quote</p>
          <form className='auth-form' onSubmit={handleQuoteSubmit} noValidate>
            <label className='field'>
              <span>From (source)</span>
              <select
                value={sourceCurrencyCode}
                onChange={handleSourceCurrencyChange}
              >
                {WALLET_SUPPORTED_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              {errors.source_currency_code ? (
                <p className='error-text'>{errors.source_currency_code}</p>
              ) : null}
            </label>

            <label className='field'>
              <span>To (target)</span>
              <select
                value={targetCurrencyCode}
                onChange={handleTargetCurrencyChange}
              >
                {WALLET_SUPPORTED_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              {errors.target_currency_code ? (
                <p className='error-text'>{errors.target_currency_code}</p>
              ) : null}
            </label>

            <label className='field'>
              <span>Amount ({sourceCurrencyCode})</span>
              <input
                type='number'
                placeholder='e.g. 100.00'
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

            {showQuoteMutationError ? (
              <p className='error-text'>
                {getConversionQuoteErrorMessage(quoteMutation.error)}
              </p>
            ) : null}

            <button
              type='submit'
              className='primary-btn'
              disabled={quoteMutation.isPending}
            >
              {quoteMutation.isPending ? "Getting quote…" : "Get quote"}
            </button>
          </form>
        </article>

        <article className='card'>
          <p className='card-label'>Step 2: Review and execute</p>

          {showQuotePlaceholder ? (
            <p className='muted'>
              Quote details, rates, spread, and expiry appear here after step 1.
            </p>
          ) : null}

          {showQuoteDetails ? (
            <div className='auth-form'>
              <p className='muted'>
                You send{" "}
                <strong>
                  {formatBalanceCentsForDisplay(
                    activeQuote.amount_in_cents,
                    activeQuote.source_currency_code,
                  )}
                </strong>
                {" → "}
                <strong>
                  {formatBalanceCentsForDisplay(
                    activeQuote.amount_out_cents,
                    activeQuote.target_currency_code,
                  )}
                </strong>
              </p>
              <p className='muted'>
                Market rate: {formatFxRate(activeQuote.market_rate)} · Your
                rate: {formatFxRate(activeQuote.quoted_rate)} · Difference from
                market price: {(activeQuote.spread_bps / 100).toFixed(2)}%
              </p>
              <p className='muted'>
                Expires: {formatTransactionDate(activeQuote.expires_at)}
                {isQuoteExpired ? (
                  <span className='error-text'>
                    {" "}
                    (expired — request a new quote)
                  </span>
                ) : null}
              </p>

              {showExecuteMutationError ? (
                <p className='error-text'>
                  {getConversionExecuteErrorMessage(executeMutation.error)}
                </p>
              ) : null}

              {showExecuteButton ? (
                <button
                  type='button'
                  className='primary-btn'
                  disabled={executeMutation.isPending}
                  onClick={handleExecuteClick}
                >
                  {executeMutation.isPending
                    ? "Executing…"
                    : "Confirm conversion"}
                </button>
              ) : null}

              {showQuoteDetails && isQuoteExpired ? (
                <p className='error-text'>
                  This quote has expired. Adjust amounts or currencies and get a
                  new quote.
                </p>
              ) : null}
            </div>
          ) : null}

          {showExecuteSuccess ? (
            <p className='muted'>
              You can request another quote on the left when you are ready.
            </p>
          ) : null}
        </article>
      </div>
    </div>
  );
}
