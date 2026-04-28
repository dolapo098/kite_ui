import { CONVERSION_AMOUNT_DISPLAY_SEPARATOR } from "../constants/formatting";
import { TRANSACTION_TYPE_CONVERSION } from "../constants/transactions";
import type { TransactionItemResponse } from "../types";
import { formatBalanceCentsForDisplay } from "./formatBalance";

export function formatTransactionAmountSummary(
  item: TransactionItemResponse,
): string {
  if (
    item.type === TRANSACTION_TYPE_CONVERSION &&
    item.amount &&
    item.amount_out
  ) {
    return `${item.amount}${CONVERSION_AMOUNT_DISPLAY_SEPARATOR}${item.amount_out}`;
  }

  if (item.amount) {
    return item.amount;
  }

  if (
    item.type === TRANSACTION_TYPE_CONVERSION &&
    item.amount_out_cents != null &&
    item.target_currency_code != null
  ) {
    return `${formatBalanceCentsForDisplay(item.amount_in_cents, item.source_currency_code)}${CONVERSION_AMOUNT_DISPLAY_SEPARATOR}${formatBalanceCentsForDisplay(item.amount_out_cents, item.target_currency_code)}`;
  }

  return formatBalanceCentsForDisplay(
    item.amount_in_cents,
    item.source_currency_code,
  );
}

export function formatTransactionDate(createdAt: string): string {
  const parsed = new Date(createdAt);
  return Number.isNaN(parsed.getTime()) ? createdAt : parsed.toLocaleString();
}
