import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authenticationService } from "../services";
import type { PayoutRequest } from "../types";

function extractPayoutErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || "Payout request failed";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Payout request failed";
}

export function usePayoutMutation() {
  return useMutation({
    mutationFn: (payload: PayoutRequest) => authenticationService.createPayout(payload),
    onError: (error) => {
      console.error("Payout mutation failed:", error);
    },
  });
}

export function getPayoutErrorMessage(error: unknown): string {
  return extractPayoutErrorMessage(error);
}
