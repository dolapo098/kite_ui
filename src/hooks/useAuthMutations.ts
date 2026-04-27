import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authenticationService } from "../services";
import type { UserCredentials } from "../types";

function extractApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (isAxiosError<{ message?: string }>(error)) {
    const responseMessage = error.response?.data?.message;
    return responseMessage || error.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: UserCredentials) => authenticationService.signup(payload),
    onError: (error) => {
      console.error("Signup mutation failed:", error);
    },
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: UserCredentials) => authenticationService.login(payload),
    onError: (error) => {
      console.error("Login mutation failed:", error);
    },
  });
}

export function getAuthErrorMessage(error: unknown): string {
  return extractApiErrorMessage(error, "Authentication request failed");
}
