import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authenticationService } from "../services";
import type { DepositRequest } from "../types";

function extractDepositErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || "Deposit request failed";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Deposit request failed";
}

export function useDepositMutation() {
  return useMutation({
    mutationFn: (payload: DepositRequest) => authenticationService.createDeposit(payload),
    onError: (error) => {
      console.error("Deposit mutation failed:", error);
    },
  });
}

export function getDepositErrorMessage(error: unknown): string {
  return extractDepositErrorMessage(error);
}
