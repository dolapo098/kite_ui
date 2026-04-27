import {
  CONVERSION_AMOUNT_DISPLAY_SEPARATOR,
  CONVERSION_EXECUTE_SUCCESS_SUMMARY_SEPARATOR,
} from "../constants/formatting";
import type { ConversionExecuteResponse } from "../types";
import { formatBalanceCentsForDisplay } from "./formatBalance";
import { formatTransactionDate } from "./formatTransaction";

export function formatConversionExecuteSuccessMessage(data: ConversionExecuteResponse): string {
  const amountIn = formatBalanceCentsForDisplay(data.amount_in_cents, data.source_currency_code);
  const amountOut = formatBalanceCentsForDisplay(data.amount_out_cents, data.target_currency_code);

  return `${data.message}${CONVERSION_EXECUTE_SUCCESS_SUMMARY_SEPARATOR}${amountIn}${CONVERSION_AMOUNT_DISPLAY_SEPARATOR}${amountOut} (${formatTransactionDate(data.executed_at)})`;
}
