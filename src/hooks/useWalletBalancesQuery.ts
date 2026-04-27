import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authenticationService } from "../services";
import type { BalanceResponse } from "../types";

export const WALLET_CURRENCIES = ["USD", "GBP", "EUR", "NGN", "KES"] as const;

function extractWalletBalancesErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || "Failed to load balances";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to load balances";
}

export function useWalletBalancesQuery() {
  return useQuery({
    queryKey: ["walletBalances", ...WALLET_CURRENCIES],
    queryFn: (): Promise<BalanceResponse[]> =>
      Promise.all(
        WALLET_CURRENCIES.map((code) => authenticationService.getBalanceByCurrency(code)),
      ),
  });
}

export function getWalletBalancesErrorMessage(error: unknown): string {
  return extractWalletBalancesErrorMessage(error);
}
