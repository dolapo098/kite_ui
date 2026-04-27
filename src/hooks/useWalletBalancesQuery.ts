import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { WALLET_BALANCES_QUERY_KEY_ROOT, WALLET_SUPPORTED_CURRENCIES } from "../constants/wallet";
import { authenticationService } from "../services";
import type { BalanceResponse } from "../types";

export { WALLET_SUPPORTED_CURRENCIES as WALLET_CURRENCIES } from "../constants/wallet";

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
    queryKey: [WALLET_BALANCES_QUERY_KEY_ROOT, ...WALLET_SUPPORTED_CURRENCIES],
    queryFn: (): Promise<BalanceResponse[]> =>
      Promise.all(
        WALLET_SUPPORTED_CURRENCIES.map((code) => authenticationService.getBalanceByCurrency(code)),
      ),
  });
}

export function getWalletBalancesErrorMessage(error: unknown): string {
  return extractWalletBalancesErrorMessage(error);
}
