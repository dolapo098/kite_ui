import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authenticationService } from "../services";
import type { ConversionExecuteRequest, ConversionQuoteRequest } from "../types";

function extractQuoteErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || "Failed to get quote";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to get quote";
}

function extractExecuteErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || "Conversion failed";
    if (status === 409) {
      return `${message} — This quote was already used.`;
    }
    if (status === 422) {
      return message;
    }
    if (status === 404) {
      return message;
    }
    return message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to execute conversion";
}

export function useConversionQuoteMutation() {
  return useMutation({
    mutationFn: (payload: ConversionQuoteRequest) => authenticationService.createConversionQuote(payload),
    onError: (error) => {
      console.error("Conversion quote mutation failed:", error);
    },
  });
}

export function useConversionExecuteMutation() {
  return useMutation({
    mutationFn: (payload: ConversionExecuteRequest) => authenticationService.executeConversionQuote(payload),
    onError: (error) => {
      console.error("Conversion execute mutation failed:", error);
    },
  });
}

export function getConversionQuoteErrorMessage(error: unknown): string {
  return extractQuoteErrorMessage(error);
}

export function getConversionExecuteErrorMessage(error: unknown): string {
  return extractExecuteErrorMessage(error);
}
