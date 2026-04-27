import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  TRANSACTION_LIST_DEFAULT_LIMIT,
  TRANSACTIONS_QUERY_KEY_ROOT,
} from "../constants/transactions";
import { authenticationService } from "../services";

export const TRANSACTIONS_PAGE_SIZE = TRANSACTION_LIST_DEFAULT_LIMIT;

function extractTransactionsErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || "Failed to load transactions";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to load transactions";
}

export function useTransactionsQuery(page: number, limit: number = TRANSACTIONS_PAGE_SIZE) {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY_ROOT, page, limit],
    queryFn: () => authenticationService.listTransactions({ page, limit }),
    placeholderData: keepPreviousData,
  });
}

export function getTransactionsErrorMessage(error: unknown): string {
  return extractTransactionsErrorMessage(error);
}
