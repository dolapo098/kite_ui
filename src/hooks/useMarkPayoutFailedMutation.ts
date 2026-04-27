import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authenticationService } from "../services";
import type { AdminMarkPayoutFailedResponse } from "../types";

export type MarkPayoutFailedVariables = {
  payoutId: string;
  failureReason: string;
};

function extractMarkPayoutFailedErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Could not mark payout as failed"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Could not mark payout as failed";
}

export function useMarkPayoutFailedMutation() {
  return useMutation({
    mutationFn: async ({
      payoutId,
      failureReason,
    }: MarkPayoutFailedVariables): Promise<AdminMarkPayoutFailedResponse> => {
      return authenticationService.markPayoutFailed(payoutId.trim(), {
        failure_reason: failureReason.trim(),
      });
    },
    onError: (error) => {
      console.error("Mark payout failed mutation error:", error);
    },
  });
}

export function getMarkPayoutFailedErrorMessage(error: unknown): string {
  return extractMarkPayoutFailedErrorMessage(error);
}
